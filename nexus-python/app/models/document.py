from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=False, index=False, nullable=True)      # 文件名
    words = Column(Integer, nullable=True)                                  # 字数
    retrieval_count = Column(Integer, nullable=True)                        # 检索此树
    is_active = Column(Boolean)                                             # 是否激活
    created_at = Column(DateTime(timezone=True),
                        server_default=func.now(),
                        default=datetime.now(timezone.utc),
                        nullable=False)
    updated_at = Column(DateTime(timezone=True),
                        server_default=func.now(),
                        default=datetime.now(timezone.utc),
                        server_onupdate=func.now(),
                        onupdate=datetime.now(timezone.utc),
                        nullable=False)

    knowledge_id = Column(Integer, ForeignKey('knowledge.id'))
    knowledge_ = relationship('Knowledge', back_populates='documents_')
