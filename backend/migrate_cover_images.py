"""Migrate existing base64 cover_image data URLs to Emergent Object Storage.

Usage:  python migrate_cover_images.py
"""
import asyncio
import base64
import os
import re
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")
sys.path.insert(0, str(ROOT))

from storage import put_object, APP_NAME  # noqa: E402

DATA_URL_RE = re.compile(r"^data:(?P<mime>[\w/+.-]+);base64,(?P<data>.+)$", re.DOTALL)


async def main():
    client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    db = client[os.environ["DB_NAME"]]

    cursor = db.articles.find({"cover_image": {"$regex": "^data:"}}, {"_id": 0, "article_id": 1, "cover_image": 1, "title": 1})
    migrated = 0
    skipped = 0
    async for art in cursor:
        cover = art.get("cover_image") or ""
        m = DATA_URL_RE.match(cover)
        if not m:
            skipped += 1
            continue
        mime = m.group("mime")
        try:
            raw = base64.b64decode(m.group("data"))
        except Exception as e:
            print(f"[skip] {art['article_id']}: invalid base64 ({e})")
            skipped += 1
            continue

        ext = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}.get(mime, "bin")
        path = f"{APP_NAME}/uploads/migration/{uuid.uuid4().hex}.{ext}"
        try:
            result = put_object(path, raw, mime)
        except Exception as e:
            print(f"[error] {art['article_id']}: upload failed: {e}")
            continue

        stored = result["path"]
        await db.files.insert_one({
            "file_id": str(uuid.uuid4()),
            "storage_path": stored,
            "original_filename": f"migrated_{art['article_id']}.{ext}",
            "content_type": mime,
            "size": result.get("size", len(raw)),
            "uploaded_by": "migration",
            "is_deleted": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        new_url = f"/api/files/{stored}"
        await db.articles.update_one({"article_id": art["article_id"]}, {"$set": {"cover_image": new_url}})
        migrated += 1
        print(f"[ok] {art['article_id']} ({art.get('title', '?')[:40]}) -> {new_url}  ({len(raw)} bytes)")

    print(f"\nDone. Migrated: {migrated}, Skipped: {skipped}")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
