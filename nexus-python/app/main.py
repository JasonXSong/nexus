from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.api import api_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# 设置允许的源列表
origins = [
    "http://localhost:3000"  # 常见的 React 开发服务器端口
]

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 允许的源列表
    allow_credentials=True,  # 允许携带凭证（如 cookies）
    allow_methods=["*"],  # 允许所有方法（GET, POST 等）
    allow_headers=["*"],  # 允许所有头
)

@app.get("/")
async def root():
    return {"message": "Nexus Python API"}
