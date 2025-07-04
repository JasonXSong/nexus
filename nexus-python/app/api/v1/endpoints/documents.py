import os.path

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.document import DocumentCreate, DocumentInDB, DocumentUpdate
from app.services.document_service import DocumentService
from app.repositories.document_repository import DocumentRepository
from app.core.database import get_db


router = APIRouter()

@router.post("/", response_model=DocumentInDB)
def create_document(document: DocumentCreate, db: Session = Depends(get_db)):
    document_repository = DocumentRepository(db)
    document_service = DocumentService(document_repository)
    return document_service.create_document(document)


@router.get("/{document_id}", response_model=DocumentInDB)
def read_document(document_id: int, db: Session = Depends(get_db)):
    document_repository = DocumentRepository(db)
    document_service = DocumentService(document_repository)
    return document_service.get_document(document_id)


@router.patch("/{document_id}", response_model=DocumentInDB)
def update_document(document_id: int, document: DocumentUpdate, db: Session = Depends(get_db)):
    document_repository = DocumentRepository(db)
    document_service = DocumentService(document_repository)
    return document_service.update_document(document_id, document)


@router.delete("/{document_id}", status_code=204)
def delete_document(document_id: int, db: Session = Depends(get_db)):
    document_repository = DocumentRepository(db)
    document_service = DocumentService(document_repository)
    return document_service.delete_document(document_id)
