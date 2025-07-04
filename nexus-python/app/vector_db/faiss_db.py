from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy


def save_vector_db(chunks, embeddings, output_folder_path):
    chunks_embeddings = FAISS.from_documents(chunks, embeddings, distance_strategy=DistanceStrategy.COSINE)
    chunks_embeddings.save_local(output_folder_path)


def load_vector_db(embeddings, folder_path) -> FAISS:
    """
    加载本地保存的FAISS向量数据库

    参数:
        embeddings: 嵌入模型（需与保存时使用的相同）
        output_folder_path: 保存向量数据库的文件夹路径

    返回:
        加载后的FAISS向量数据库对象
    """
    loaded_db = FAISS.load_local(
        folder_path=folder_path,
        embeddings=embeddings,
        allow_dangerous_deserialization=True  # 注意安全风险说明
    )
    return loaded_db
