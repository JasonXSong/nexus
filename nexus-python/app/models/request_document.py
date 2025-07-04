from typing import List

from pydantic import BaseModel, Field, field_validator


class RequestDocument(BaseModel):
    query: str = Field(...)
    documents: List[str] = Field(...)

    '''
    @field_validator('documents', each_item=True)
    def check_document_length(cls, v):
        if len(v.strip()) == 0:
            raise ValueError("文档内容不能为空")
        return v
    '''
