import os

from sqlalchemy.orm import Session
from app.models.knowledge import Knowledge
from app.schemas.knowledge import KnowledgeCreate, KnowledgeUpdate
from app.core.config import settings


class KnowledgeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_knowledge_list(self, page_num: int = 0, page_size: int = 10, **filters):
        query = self.db.query(Knowledge)

        for k, v in filters.items():
            if hasattr(Knowledge, k):
                query = query.filter(getattr(Knowledge, k) == v)

        return query.offset(page_num).limit(page_size).all()

    def get_knowledge(self, knowledge_id: int):
        return self.db.query(Knowledge).filter(Knowledge.id == knowledge_id).first()

    def get_knowledge_by_name(self, name: str):
        return self.db.query(Knowledge).filter(Knowledge.name == name).first()

    def create_knowledge(self, knowledge: KnowledgeCreate):
        knowledge_folder_path = settings.KNOWLEDGE_FOLDER_PATH
        chunking_path = os.path.join(knowledge_folder_path, knowledge.name)
        db_knowledge = Knowledge(
            name=knowledge.name,
            chunking_mode=knowledge.chunking_mode,
            chunking_path=chunking_path
        )
        self.db.add(db_knowledge)
        self.db.commit()
        self.db.refresh(db_knowledge)
        return db_knowledge

    def get_knowledge_documents(self, knowledge_id: int):
        db_knowledge = self.get_knowledge(knowledge_id)
        return db_knowledge.documents_

    def update_knowledge(self, knowledge_id: int, knowledge: KnowledgeUpdate):
        db_knowledge = self.get_knowledge(knowledge_id)
        if not db_knowledge:
            return None
        update_data = knowledge.model_dump(exclude_unset=True)
        for k, v in update_data.items():
            setattr(db_knowledge, k, v)
        self.db.commit()
        self.db.refresh(db_knowledge)
        return db_knowledge

    def delete_knowledge(self, knowledge_id: int):
        db_knowledge = self.get_knowledge(knowledge_id)
        if db_knowledge:
            self.db.delete(db_knowledge)
            self.db.commit()
            return True
        return False
