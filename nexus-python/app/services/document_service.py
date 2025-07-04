from fastapi import HTTPException, status
from app.repositories.document_repository import DocumentRepository
from app.schemas.document import DocumentCreate, DocumentUpdate


class DocumentService:
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    def create_document(self, document: DocumentCreate):
        if document.knowledge_id:
            from app.repositories.knowledge_repository import KnowledgeRepository
            knowledge_repo = KnowledgeRepository(self.document_repository.db)
            if not knowledge_repo.get_knowledge(document.knowledge_id):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Knowledge not found"
                )
        return self.document_repository.create_document(document)

    def get_document(self, document_id: int):
        db_document = self.document_repository.get_document(document_id)
        if db_document is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )
        return db_document

    def update_document(self, document_id: int, document: DocumentUpdate):
        db_document = self.document_repository.update_document(document_id, document)
        if db_document is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )
        return db_document

    def delete_document(self, document_id: int):
        return self.document_repository.delete_document(document_id)
