from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Knowledge(Base):
    __tablename__ = 'knowledge'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)              # 名字
    chunking_mode = Column(String(50), unique=False, index=False, nullable=True)    # 切片模式
    chunking_path = Column(String(100), unique=False, index=False, nullable=True)   # 切片保存路径
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

    documents_ = relationship('Document', back_populates="knowledge_")
