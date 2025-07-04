from langchain_community.document_loaders import (
    DirectoryLoader,
    PyPDFLoader,
    TextLoader,
    UnstructuredWordDocumentLoader
)


def load_files_from_folder(folder_path):
    """
    读取文件夹内的文件
    :param folder_path: 文件夹路径
    :return: list
    """
    loaders = [
        DirectoryLoader(folder_path, glob="**/*.txt", loader_cls=TextLoader),
        DirectoryLoader(folder_path, glob="**/*.pdf", loader_cls=PyPDFLoader),
        DirectoryLoader(folder_path, glob="**/*.docx", loader_cls=UnstructuredWordDocumentLoader)
    ]

    docs = []
    for loader in loaders:
        docs.extend(loader.load())
    return docs


if __name__ == '__main__':
    path = r'E:\workspace\python\nexus\nexus-python\data\upload\66'
    print(len(load_files_from_folder(path)))