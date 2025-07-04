from sqlalchemy.orm import Session
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate


class DocumentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_document(self, document_id: int):
        return self.db.query(Document).filter(Document.id == document_id).first()

    def create_document(self, document: DocumentCreate):
        db_document = Document(
            name=document.name,
            words=document.words,
            retrieval_count=document.retrieval_count,
            is_active=document.is_active,
            knowledge_id=document.knowledge_id
        )
        self.db.add(db_document)
        self.db.commit()
        self.db.refresh(db_document)
        return db_document

    def update_document(self, document_id: int, document: DocumentUpdate):
        db_document = self.get_document(document_id)
        if not db_document:
            return None
        update_data = document.model_dump(exclude_unset=True)
        for k, v in update_data.items():
            setattr(db_document, k, v)
        self.db.commit()
        self.db.refresh(db_document)
        return db_document

    def delete_document(self, document_id: int):
        db_document = self.get_document(document_id)
        if db_document:
            self.db.delete(db_document)
            self.db.commit()
            return True
        return False