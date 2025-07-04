from fastapi import APIRouter
from app.api.v1.endpoints import documents, knowledge


api_router = APIRouter()
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])
