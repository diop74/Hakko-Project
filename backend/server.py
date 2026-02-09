from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Query, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="HAAKO API", description="Strategic Intelligence Platform for Sustainable Africa")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    article_id: str = Field(default_factory=lambda: f"art_{uuid.uuid4().hex[:12]}")
    title: str
    slug: str
    excerpt: str
    content: str  # HTML content from WYSIWYG
    cover_image: Optional[str] = None
    category: str  # articles, analyses, insights
    tags: List[str] = []
    theme: str  # mauritanie, afrique, energie, transition, developpement
    author_id: str
    author_name: str
    status: str = "draft"  # draft, published
    views: int = 0
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ArticleCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    cover_image: Optional[str] = None
    category: str
    tags: List[str] = []
    theme: str
    status: str = "draft"

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    theme: Optional[str] = None
    status: Optional[str] = None

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    message_id: str = Field(default_factory=lambda: f"msg_{uuid.uuid4().hex[:12]}")
    name: str
    email: str
    organization: Optional[str] = None
    subject: str
    message: str
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    organization: Optional[str] = None
    subject: str
    message: str

# ==================== AUTH HELPERS ====================

async def get_current_user(request: Request) -> User:
    """Get current user from session token (cookie or Authorization header)"""
    session_token = request.cookies.get("session_token")
    
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header[7:]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry with timezone awareness
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_doc)

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id for session_token"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth to get session data
    async with httpx.AsyncClient() as http_client:
        auth_response = await http_client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session_id")
        
        auth_data = auth_response.json()
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    email = auth_data.get("email")
    name = auth_data.get("name")
    picture = auth_data.get("picture")
    session_token = auth_data.get("session_token")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        # Update user info
        await db.users.update_one(
            {"email": email},
            {"$set": {"name": name, "picture": picture}}
        )
    else:
        # Create new user
        new_user = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(new_user)
    
    # Store session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    session_doc = {
        "session_id": str(uuid.uuid4()),
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    # Set httpOnly cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    # Get user data to return
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {"user": user_doc}

@api_router.get("/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return user.model_dump()

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user and clear session"""
    session_token = request.cookies.get("session_token")
    
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(
        key="session_token",
        path="/",
        secure=True,
        samesite="none"
    )
    
    return {"message": "Logged out successfully"}

# ==================== ARTICLES ROUTES ====================

@api_router.get("/articles", response_model=List[dict])
async def get_articles(
    status: Optional[str] = None,
    category: Optional[str] = None,
    theme: Optional[str] = None,
    tag: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    """Get all articles (public endpoint - only published for public)"""
    query = {}
    
    if status:
        query["status"] = status
    else:
        query["status"] = "published"
    
    if category:
        query["category"] = category
    if theme:
        query["theme"] = theme
    if tag:
        query["tags"] = tag
    
    skip = (page - 1) * limit
    
    articles = await db.articles.find(query, {"_id": 0}).sort("published_at", -1).skip(skip).limit(limit).to_list(limit)
    
    # Convert datetime strings
    for article in articles:
        for field in ["created_at", "updated_at", "published_at"]:
            if field in article and isinstance(article[field], str):
                article[field] = datetime.fromisoformat(article[field])
    
    return articles

@api_router.get("/articles/count")
async def get_articles_count(
    status: Optional[str] = None,
    category: Optional[str] = None,
    theme: Optional[str] = None,
    tag: Optional[str] = None
):
    """Get total count of articles"""
    query = {}
    
    if status:
        query["status"] = status
    else:
        query["status"] = "published"
    
    if category:
        query["category"] = category
    if theme:
        query["theme"] = theme
    if tag:
        query["tags"] = tag
    
    count = await db.articles.count_documents(query)
    return {"count": count}

@api_router.get("/articles/{slug}")
async def get_article_by_slug(slug: str, increment_views: bool = True):
    """Get article by slug"""
    article = await db.articles.find_one({"slug": slug}, {"_id": 0})
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment views for published articles
    if increment_views and article.get("status") == "published":
        await db.articles.update_one({"slug": slug}, {"$inc": {"views": 1}})
        article["views"] = article.get("views", 0) + 1
    
    return article

@api_router.get("/admin/articles", response_model=List[dict])
async def get_admin_articles(
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user)
):
    """Get all articles for admin (including drafts)"""
    query = {}
    if status:
        query["status"] = status
    
    skip = (page - 1) * limit
    
    articles = await db.articles.find(query, {"_id": 0}).sort("updated_at", -1).skip(skip).limit(limit).to_list(limit)
    
    return articles

@api_router.post("/admin/articles", response_model=dict)
async def create_article(article_data: ArticleCreate, user: User = Depends(get_current_user)):
    """Create a new article"""
    article = Article(
        **article_data.model_dump(),
        author_id=user.user_id,
        author_name=user.name
    )
    
    # Check slug uniqueness
    existing = await db.articles.find_one({"slug": article.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    article_dict = article.model_dump()
    
    # Set published_at if publishing
    if article.status == "published":
        article_dict["published_at"] = datetime.now(timezone.utc).isoformat()
    
    # Convert datetimes to ISO strings
    for field in ["created_at", "updated_at"]:
        if isinstance(article_dict[field], datetime):
            article_dict[field] = article_dict[field].isoformat()
    
    await db.articles.insert_one(article_dict)
    
    # Return without _id
    result = await db.articles.find_one({"article_id": article.article_id}, {"_id": 0})
    return result

@api_router.put("/admin/articles/{article_id}", response_model=dict)
async def update_article(article_id: str, article_data: ArticleUpdate, user: User = Depends(get_current_user)):
    """Update an article"""
    existing = await db.articles.find_one({"article_id": article_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_data = {k: v for k, v in article_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Set published_at when publishing for first time
    if update_data.get("status") == "published" and not existing.get("published_at"):
        update_data["published_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.articles.update_one({"article_id": article_id}, {"$set": update_data})
    
    result = await db.articles.find_one({"article_id": article_id}, {"_id": 0})
    return result

@api_router.delete("/admin/articles/{article_id}")
async def delete_article(article_id: str, user: User = Depends(get_current_user)):
    """Delete an article"""
    result = await db.articles.delete_one({"article_id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}

# ==================== CONTACT ROUTES ====================

@api_router.post("/contact", response_model=dict)
async def create_contact_message(message_data: ContactMessageCreate):
    """Submit a contact message (public)"""
    message = ContactMessage(**message_data.model_dump())
    message_dict = message.model_dump()
    message_dict["created_at"] = message_dict["created_at"].isoformat()
    
    await db.contact_messages.insert_one(message_dict)
    
    return {"message": "Message envoyé avec succès", "message_id": message.message_id}

@api_router.get("/admin/messages", response_model=List[dict])
async def get_contact_messages(
    read: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user)
):
    """Get all contact messages (admin only)"""
    query = {}
    if read is not None:
        query["read"] = read
    
    skip = (page - 1) * limit
    
    messages = await db.contact_messages.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    return messages

@api_router.put("/admin/messages/{message_id}/read")
async def mark_message_read(message_id: str, user: User = Depends(get_current_user)):
    """Mark message as read"""
    result = await db.contact_messages.update_one(
        {"message_id": message_id},
        {"$set": {"read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message marked as read"}

@api_router.delete("/admin/messages/{message_id}")
async def delete_message(message_id: str, user: User = Depends(get_current_user)):
    """Delete a contact message"""
    result = await db.contact_messages.delete_one({"message_id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted successfully"}

# ==================== STATS ROUTES ====================

@api_router.get("/admin/stats")
async def get_admin_stats(user: User = Depends(get_current_user)):
    """Get dashboard statistics"""
    total_articles = await db.articles.count_documents({})
    published_articles = await db.articles.count_documents({"status": "published"})
    draft_articles = await db.articles.count_documents({"status": "draft"})
    total_messages = await db.contact_messages.count_documents({})
    unread_messages = await db.contact_messages.count_documents({"read": False})
    
    # Get total views
    pipeline = [
        {"$group": {"_id": None, "total_views": {"$sum": "$views"}}}
    ]
    views_result = await db.articles.aggregate(pipeline).to_list(1)
    total_views = views_result[0]["total_views"] if views_result else 0
    
    # Get recent articles
    recent_articles = await db.articles.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "total_articles": total_articles,
        "published_articles": published_articles,
        "draft_articles": draft_articles,
        "total_messages": total_messages,
        "unread_messages": unread_messages,
        "total_views": total_views,
        "recent_articles": recent_articles
    }

# ==================== UPLOAD ROUTE ====================

@api_router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), user: User = Depends(get_current_user)):
    """Upload image and return base64 data URL"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    # Read file content
    content = await file.read()
    
    # Convert to base64
    base64_encoded = base64.b64encode(content).decode("utf-8")
    data_url = f"data:{file.content_type};base64,{base64_encoded}"
    
    return {"url": data_url}

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "HAAKO API - Strategic Intelligence Platform", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
