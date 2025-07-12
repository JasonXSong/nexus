# Project Name

🔍 **Brief Description**: A RAG project.

![Version](https://img.shields.io/badge/version-0.0.1-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

TODO

---

## 🚀 Quick Start

### Prerequisites
- Node.js
- Python 3.11
- PostgreSQL
- Ollama

### Installation

#### Clone the repository
```bash
git clone https://github.com/JasonXSong/nexus.git
```

#### Install dependencies
##### nexus-react
```bash
npm install
```

##### nexus-python

```bash
# Install uv
pip install uv

# Create virtual environment
uv venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install Dependencies
uv pip install .
```

### Preparation
1. Create database 'nexus' in PostgreSQL
2. Copy `nexus-python/.env_example` to `nexus-python/.env`
3. Modify variables of `nexus-python/.env` and mkdir of `KNOWLEDGE_FOLDER_PATH` and `DOCUMENT_UPLOAD_FOLDER_PATH`
4. Modify `sqlalchemy.url` in `nexus-python/alembic.ini`
5. Migrate database
```bash
alembic upgrade head
```
If command not found, run `.venv\bin\activate` or `source .venv/bin/activate` first
6. Ollama models
```bash
ollama run deepseek-r1:1.5b
```
```bash
llama run bge-m3:latest
```


### Run

#### react
```bash
cd nexus-react
npm start
```

#### python
run `.venv\bin\activate` or `source .venv/bin/activate` first
```
cd nexus-python
uvicorn app.main:app --reload
```

Open http://localhost:3000/knowledge
