from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from routes.reservas import router as reservas_router
from routes.canchas import router as canchas_router
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


def startup():
    Base.metadata.create_all(bind=engine)

app.add_event_handler("startup", startup)

@app.get("/")
def read_root():
    return {"Binvenidos a la API de Reservas"}

app.include_router(reservas_router)
app.include_router(canchas_router)