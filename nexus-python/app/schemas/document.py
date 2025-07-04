from datetime import datetime
from typing import Optional, TYPE_CHECKING

from pydantic import BaseModel

'''
if TYPE_CHECKING:
    from .knowledge import KnowledgeInDB
'''

class DocumentBase(BaseModel):
    name: str
    words: int
    retrieval_count: int
    is_active: bool
    knowledge_id: Optional[int] = None


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(DocumentBase):
    pass


class DocumentInDB(DocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


from app.schemas.knowledge import KnowledgeInDB
DocumentInDB.model_rebuild()
