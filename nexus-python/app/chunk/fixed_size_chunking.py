from langchain.text_splitter import CharacterTextSplitter

from .base_chunking import BaseChunking


class FixedSizeChunking(BaseChunking):
    def __init__(self, chunk_size, chunk_overlap):
        super().__init__()
        self.splitter = CharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
