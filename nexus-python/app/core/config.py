from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Nexus Python API"
    PROJECT_DESCRIPTION: str = "Nexus Python API服务器"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    POSTGRES_SERVER: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    KNOWLEDGE_FOLDER_PATH: str
    DOCUMENT_UPLOAD_FOLDER_PATH: str

    class Config:
        env_file = ".env"


settings = Settings()
