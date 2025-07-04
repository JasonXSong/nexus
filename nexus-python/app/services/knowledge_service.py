import os

from fastapi import HTTPException, status
from langchain.embeddings.ollama import OllamaEmbeddings

from app.core.config import settings
from app.repositories.knowledge_repository import KnowledgeRepository
from app.schemas.knowledge import KnowledgeCreate, KnowledgeUpdate
from app.chunk.paragraph_chunking import ParagraphChunking
from app.utils.loader import load_files_from_folder
from app.vector_db.faiss_db import save_vector_db, load_vector_db


class KnowledgeService:
    def __init__(self, knowledge_repository: KnowledgeRepository):
        self.knowledge_repository = knowledge_repository

    def create_knowledge(self, knowledge: KnowledgeCreate):
        db_knowledge = self.knowledge_repository.get_knowledge_by_name(knowledge.name)
        if db_knowledge:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Knowledge '{knowledge.name}' already exists"
            )
        return self.knowledge_repository.create_knowledge(knowledge)

    def get_knowledge(self, knowledge_id: int):
        db_knowledge = self.knowledge_repository.get_knowledge(knowledge_id)
        if db_knowledge is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Knowledge not found"
            )
        return db_knowledge

    def get_knowledge_list(self, page_num: int = 0, page_size: int = 10, **filters):
        db_knowledge_list = self.knowledge_repository.get_knowledge_list(page_num, page_size)
        return db_knowledge_list or []

    def get_knowledge_documents(self, knowledge_id: int):
        db_knowledge = self.knowledge_repository.get_knowledge(knowledge_id)
        if db_knowledge is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Knowledge not found"
            )
        return db_knowledge.documents_

    def update_knowledge(self, knowledge_id: int, knowledge: KnowledgeUpdate):
        db_knowledge = self.knowledge_repository.update_knowledge(knowledge_id, knowledge)
        if db_knowledge is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Knowledge not found"
            )
        return db_knowledge

    def generate_chunks(self, knowledge_id: int):
        input_folder_path = os.path.join(settings.DOCUMENT_UPLOAD_FOLDER_PATH, str(knowledge_id))
        output_folder_path = os.path.join(settings.KNOWLEDGE_FOLDER_PATH, str(knowledge_id))
        docs = load_files_from_folder(input_folder_path)
        splitter = ParagraphChunking(chunk_size=800, chunk_overlap=150)
        chunks = splitter.split_documents(docs)
        embeddings = OllamaEmbeddings(model='bge-m3:latest')
        save_vector_db(chunks, embeddings, output_folder_path)
        return len(docs)


    def get_chunks(self, knowledge_id, query=None, top_n=-1):
        chunks_folder_path = os.path.join(settings.KNOWLEDGE_FOLDER_PATH, str(knowledge_id))
        embeddings = OllamaEmbeddings(model='bge-m3:latest')
        vector_db = load_vector_db(embeddings, chunks_folder_path)
        print(vector_db.distance_strategy)
        if top_n > 0:
            docs_with_scores = vector_db.similarity_search_with_score(query, k=top_n)
        else:
            docs_with_scores = vector_db.similarity_search_with_score(query)
        res = list()
        for doc, score in docs_with_scores:
            print('score: {}'.format(score))
            res.append({
                "title": doc.metadata.get("page"),
                "content": doc.page_content,
                "score": float(score)
            })
        return res

    def delete_knowledge(self, knowledge_id: int):
        return self.knowledge_repository.delete_knowledge(knowledge_id)
