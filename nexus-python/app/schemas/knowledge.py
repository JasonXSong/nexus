from datetime import datetime
from typing import List, TYPE_CHECKING
from pydantic import BaseModel

'''
if TYPE_CHECKING:
    from .document import DocumentInDB
'''

class KnowledgeBase(BaseModel):
    name: str
    chunking_mode: str


class KnowledgeCreate(KnowledgeBase):
    pass


class KnowledgeUpdate(KnowledgeBase):
    pass


class KnowledgeInDB(KnowledgeBase):
    id: int
    chunking_path: str
    created_at: datetime
    updated_at: datetime
    documents_: List["DocumentInDB"] = []

    class Config:
        orm_mode = True


from app.schemas.document import DocumentInDB
KnowledgeInDB.model_rebuild()
