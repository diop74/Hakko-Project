"""Backend tests for HAAKO public endpoints after CORS fix + cover_image migration.

Tests are run against two URLs:
- PUBLIC_URL = the preview URL exposed via Cloudflare/ingress (what end users hit)
- INTERNAL_URL = http://localhost:8001 — the actual FastAPI app, used to assert
  that the backend *code* sends correct headers. The preview URL is rewritten by
  the edge proxy (Cloudflare overrides CORS + Cache-Control), so internal checks
  are the authoritative source for verifying the CORS fix and Cache-Control.
"""
import os
import pytest
import requests

PUBLIC_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://haako-energy.preview.emergentagent.com").rstrip("/")
INTERNAL_URL = "http://localhost:8001"
ORIGIN = "https://haako.online"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Accept": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_health_check_public(self, session):
        r = session.get(f"{PUBLIC_URL}/api/health", timeout=20)
        assert r.status_code == 200
        assert r.json()["status"] == "healthy"


# ---------- Public articles (no auth) ----------
class TestArticlesPublic:
    def test_list_articles_no_auth(self, session):
        r = session.get(f"{PUBLIC_URL}/api/articles", timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_articles_payload_small_and_no_base64(self, session):
        r = session.get(f"{PUBLIC_URL}/api/articles", timeout=30)
        size_kb = len(r.content) / 1024
        assert size_kb < 200, f"payload too large ({size_kb:.1f} KB) — base64 may have leaked"
        for art in r.json():
            cover = art.get("cover_image")
            if cover:
                assert not cover.startswith("data:"), \
                    f"cover_image for slug={art.get('slug')} is base64 data URL"
                assert cover.startswith("/api/files/") or cover.startswith("https://"), \
                    f"unexpected cover_image format: {cover[:60]}"

    def test_at_least_one_article_uses_api_files_cover(self, session):
        """Verify migration produced /api/files/ cover_image for migrated article."""
        r = session.get(f"{PUBLIC_URL}/api/articles", timeout=30)
        covers = [a.get("cover_image", "") for a in r.json()]
        assert any(c.startswith("/api/files/") for c in covers), \
            "no article uses /api/files/ cover — migration may not have run"

    def test_articles_count_no_auth(self, session):
        r = session.get(f"{PUBLIC_URL}/api/articles/count", timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        val = data.get("count", data.get("total"))
        assert isinstance(val, int) and val >= 1, f"unexpected count payload: {data}"

    def test_get_migrated_article_no_auth(self, session):
        """The migrated article slug is 'logiciels-statistique' (per DB)."""
        r = session.get(f"{PUBLIC_URL}/api/articles/logiciels-statistique", timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["slug"] == "logiciels-statistique"
        cover = data.get("cover_image", "")
        assert cover.startswith("/api/files/"), \
            f"migrated article cover_image should be /api/files/..., got: {cover[:60]}"


# ---------- File serving ----------
class TestFileServing:
    UPLOADED_PATH = "haako/uploads/migration/aac53472a9bc4e369b4b3d220c446c92.png"

    def test_serve_existing_file_public_status_and_ct(self, session):
        url = f"{PUBLIC_URL}/api/files/{self.UPLOADED_PATH}"
        r = session.get(url, timeout=30)
        assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
        ct = r.headers.get("Content-Type", "")
        assert ct.startswith("image/"), f"unexpected content-type: {ct}"
        assert "png" in ct.lower()
        assert len(r.content) > 100

    def test_serve_existing_file_cache_control_at_backend(self, session):
        """Backend must set long Cache-Control. Edge proxy may rewrite it on the
        public URL, so we check the backend directly via localhost."""
        url = f"{INTERNAL_URL}/api/files/{self.UPLOADED_PATH}"
        r = session.get(url, timeout=30)
        assert r.status_code == 200, r.text[:200]
        cache = r.headers.get("Cache-Control", "")
        assert "max-age" in cache and "public" in cache, \
            f"backend Cache-Control missing public/max-age, got: {cache}"

    def test_serve_nonexistent_file_returns_404(self, session):
        url = f"{PUBLIC_URL}/api/files/haako/uploads/migration/does-not-exist-{os.urandom(4).hex()}.png"
        r = session.get(url, timeout=20)
        assert r.status_code == 404


# ---------- Auth gating ----------
class TestAuthGating:
    def test_me_without_token_401(self, session):
        r = session.get(f"{PUBLIC_URL}/api/auth/me", timeout=20)
        assert r.status_code in (401, 403), f"expected 401/403, got {r.status_code}"

    def test_upload_without_auth_401(self, session):
        files = {"file": ("test.png", b"\x89PNG\r\n\x1a\n" + b"0" * 32, "image/png")}
        r = session.post(f"{PUBLIC_URL}/api/admin/upload", files=files, timeout=30)
        assert r.status_code in (401, 403), f"expected 401/403 got {r.status_code}"


# ---------- CORS (verified at backend; edge proxy may override) ----------
class TestCORSBackend:
    """The backend CORSMiddleware must echo a specific Origin (not '*') when
    allow_credentials=True. Verified directly against uvicorn at localhost:8001."""

    def test_preflight_articles_specific_origin_backend(self, session):
        r = session.options(
            f"{INTERNAL_URL}/api/articles",
            headers={
                "Origin": ORIGIN,
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "content-type",
            },
            timeout=20,
        )
        assert r.status_code in (200, 204), r.text[:200]
        ao = r.headers.get("access-control-allow-origin")
        assert ao == ORIGIN, f"backend ACAO should be specific origin '{ORIGIN}', got '{ao}'"
        creds = r.headers.get("access-control-allow-credentials", "").lower()
        assert creds == "true"

    def test_simple_get_articles_with_origin_specific_acao_backend(self, session):
        r = session.get(
            f"{INTERNAL_URL}/api/articles",
            headers={"Origin": ORIGIN},
            timeout=20,
        )
        assert r.status_code == 200
        ao = r.headers.get("access-control-allow-origin")
        assert ao == ORIGIN, f"backend ACAO must be '{ORIGIN}' (not *), got '{ao}'"

    def test_preview_origin_via_regex_backend(self, session):
        preview = "https://haako-energy.preview.emergentagent.com"
        r = session.get(
            f"{INTERNAL_URL}/api/articles",
            headers={"Origin": preview},
            timeout=20,
        )
        assert r.status_code == 200
        ao = r.headers.get("access-control-allow-origin")
        assert ao == preview, f"preview origin not echoed by regex match, got: {ao}"

    def test_unknown_origin_not_echoed_backend(self, session):
        r = session.get(
            f"{INTERNAL_URL}/api/articles",
            headers={"Origin": "https://evil.example.com"},
            timeout=20,
        )
        assert r.status_code == 200
        ao = r.headers.get("access-control-allow-origin")
        assert ao != "https://evil.example.com" and ao != "*", \
            f"unknown origin should not be echoed, got: {ao}"
