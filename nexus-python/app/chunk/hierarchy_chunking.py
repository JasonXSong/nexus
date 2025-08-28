from langchain.text_splitter import MarkdownHeaderTextSplitter

from .base_chunking import BaseChunking


HEADERS = [
    ("#", "Heading 1"),
    ("##", "Heading 2"),
    ("###", "Heading 3"),
    ("####", "Heading 4"),
    ("#####", "Heading 5"),
    ("######", "Heading 6")    
]


class MarkdownHierarchyChunking(BaseChunking):
    def __init__(self):
        super().__init__()
        self.splitter = MarkdownHeaderTextSplitter(HEADERS)
    
    def split_documents(self, documents):
        arr = []
        for doc in documents:
            arr += self.splitter.split_text(doc.page_content)
        return arr