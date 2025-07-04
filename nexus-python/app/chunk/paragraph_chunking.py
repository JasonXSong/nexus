from langchain.text_splitter import CharacterTextSplitter

from .base_chunking import BaseChunking


class ParagraphChunking(BaseChunking):
    def __init__(self, chunk_size, chunk_overlap, separator="\n"):
        super().__init__()
        self.splitter = CharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separator=separator
        )
