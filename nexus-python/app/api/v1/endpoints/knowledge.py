import os
import shutil
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status, Path
from fastapi.responses import JSONResponse
from langchain.chains.question_answering import load_qa_chain
from langchain_community.llms.ollama import Ollama
from langchain_core.documents import Document
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.document import DocumentInDB
from app.schemas.knowledge import KnowledgeCreate, KnowledgeInDB, KnowledgeUpdate
from app.services.knowledge_service import KnowledgeService
from app.repositories.knowledge_repository import KnowledgeRepository
from app.core.database import get_db
from app.models.request_document import RequestDocument


router = APIRouter()


@router.get("/", response_model=List[KnowledgeInDB])
async def list_knowledge(
    page_num: int = Query(0, description='页码', ge=0),
    page_size: int = Query(10, description='每页数量', le=1000),
    #is_active: Optional[bool] = Query(True, description=''),
    db: Session = Depends(get_db)
):
    knowledge_repository = KnowledgeRepository(db)
    knowledge_service = KnowledgeService(knowledge_repository)

    filters = {}
    """
    if is_active is not None:
        filters['is_active'] = is_active
    """
    return knowledge_service.get_knowledge_list(page_num=page_num, page_size=page_size, **filters)



@router.post("/", response_model=KnowledgeInDB)
def create_knowledge(knowledge: KnowledgeCreate, db: Session = Depends(get_db)):
    knowledge_repository = KnowledgeRepository(db)
    knowledge_service = KnowledgeService(knowledge_repository)
    return knowledge_service.create_knowledge(knowledge)


@router.get("/{knowledge_id}", response_model=KnowledgeInDB)
def read_knowledge(knowledge_id: int, db: Session = Depends(get_db)):
    knowledge_repository = KnowledgeRepository(db)
    knowledge_service = KnowledgeService(knowledge_repository)
    return knowledge_service.get_knowledge(knowledge_id)


@router.post("/{knowledge_id}/files")
async def upload_knowledge_files(knowledge_id: int, files: List[UploadFile] = File(...)):
    upload_folder = os.path.join(settings.DOCUMENT_UPLOAD_FOLDER_PATH, str(knowledge_id))
    if not os.path.isdir(upload_folder):
        os.mkdir(upload_folder)

    for file in files:
        target_file_path = os.path.join(upload_folder, file.filename)
        with open(target_file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={}
    )


@router.get("/{knowledge_id}/documents", response_model=List[DocumentInDB])
def read_knowledge_documents(knowledge_id: int, db: Session = Depends(get_db)):
    knowledge_repository = KnowledgeRepository(db)
    knowledge_service = KnowledgeService(knowledge_repository)
    return knowledge_service.get_knowledge_documents(knowledge_id)


@router.patch("/{knowledge_id}", response_model=KnowledgeInDB)
def update_knowledge(knowledge_id: int, knowledge: KnowledgeUpdate, db: Session = Depends(get_db)):
    knowledge_repository = KnowledgeRepository(db)
    knowledge_service = KnowledgeService(knowledge_repository)
    return knowledge_service.update_knowledge(knowledge_id, knowledge)


@router.post("/{knowledge_id}/chunks")
async def generate_chunks(knowledge_id: int, db: Session = Depends(get_db)):
    knowledge_repository = KnowledgeRepository(db)
    knowledge_service = KnowledgeService(knowledge_repository)
    document_count = knowledge_service.generate_chunks(knowledge_id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "document_count": document_count
        }
    )


@router.get("/{knowledge_id}/chunks")
async def get_chunks(
    knowledge_id: int,
    query: str = Query(None, description='用户问题'),
    top_n: int = Query(-1, description='返回的chunks最大数量'),
    db: Session = Depends(get_db)
):
    knowledge_repository = KnowledgeRepository(db)
    knowledge_service = KnowledgeService(knowledge_repository)
    chunks = knowledge_service.get_chunks(knowledge_id, query, top_n)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            'chunks': chunks
        }
    )


@router.post("/{knowledge_id}/test_chat")
async def test_chat(knowledge_id: int, req_doc: RequestDocument):
    query = req_doc.query
    print(req_doc.documents)
    docs = [Document(page_content=d) for d in req_doc.documents]
    chain = load_qa_chain(Ollama(model="deepseek-r1:1.5b"), chain_type='stuff')
    result = chain.invoke({"input_documents": docs, "question": query})
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "answer": result["output_text"]
        }
    )


@router.delete("/{knowledge_id}", status_code=204)
def delete_knowledge(knowledge_id: int, db: Session = Depends(get_db)):
    knowledge_repository = KnowledgeRepository(db)
    knowledge_service = KnowledgeService(knowledge_repository)
    return knowledge_service.delete_knowledge(knowledge_id)
