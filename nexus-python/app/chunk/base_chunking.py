class BaseChunking:
    def __init__(self):
        self.splitter = None

    def split_documents(self, documents):
        return self.splitter.split_documents(documents)
