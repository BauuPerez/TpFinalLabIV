# Cancha.py
from sqlalchemy.orm import Session
from models.canchas import Cancha  
from schemas.canchas import CanchaCreate  
from fastapi import HTTPException


def get_cancha(db:Session):
    return db.query(Cancha).all()

def get_cancha_id(db:Session, cancha_id:int):
    cancha = db.query(Cancha).filter(Cancha.id == cancha_id).first()
    if not cancha:
        raise HTTPException(status_code=404, detail="Cancha no encontrada")
    return cancha

def create_cancha(db: Session, cancha: CanchaCreate):

    if(verificar_cancha(db, cancha)):
        raise ValueError("Ya existe una cancha con ese nombre.", detail="Ya existe una cancha con ese nombre")

    db_cancha = Cancha(
        id=cancha.id,
        nombre=cancha.nombre,
        techada=cancha.techada
    )

    if(db_cancha.nombre == "" or db_cancha.techada == None):
        raise ValueError("Todos los campos son obligatorios.", detail="Nombre o Techada no pueden ser vacíos")
    
    db.add(db_cancha)
    db.commit()
    db.refresh(db_cancha)
    
    return db_cancha



def delete_cancha(db: Session, cancha_id: int):
    cancha = db.query(Cancha).filter(Cancha.id == cancha_id).first()
    if not cancha:
        raise HTTPException(status_code=404, detail="Cancha no encontrada")
    db.delete(cancha)
    db.commit()
    return cancha


def verificar_cancha(db: Session, cancha: CanchaCreate):

    existing_cancha = db.query(Cancha).filter(
        Cancha.id == cancha.id,
        Cancha.nombre == cancha.nombre,

    ).first()
    return existing_cancha