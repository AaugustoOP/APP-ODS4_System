from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from app.api import auth, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduFocus API")

app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "EduFocus API rodando com SQLite 🚀"}