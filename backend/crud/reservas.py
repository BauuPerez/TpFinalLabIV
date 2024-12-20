# reservas.py
from datetime import date
from sqlalchemy import and_, extract, or_
from sqlalchemy.orm import Session
from models.reservas import Reserva
from schemas.reservas import ReservaCreate
from fastapi import HTTPException

def get_reserva(db: Session):
    return db.query(Reserva).all()
    

def get_reserva_id(db: Session, reserva_id: int):
    reserva = db.query(Reserva).filter(Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return reserva

def create_reserva(db: Session, reserva: ReservaCreate):

    if verificar_reserva(db, reserva):
        raise ValueError("Ya existe una reserva en esa cancha para ese horario.", detail="Reserva ya existe")
    
    if(reserva.duracion <= 0 or reserva.duracion > 3):
        raise ValueError("La duración tiene que ser mayor a 0 y maximo de 3 horas.")
    
    db_reserva = Reserva(
        cancha_id=reserva.cancha_id,
        fecha=reserva.fecha,
        hora=reserva.hora,
        duracion=reserva.duracion,
        telefono=reserva.telefono,
        nombre_contacto=reserva.nombre_contacto
    )
    db.add(db_reserva)
    db.commit()
    db.refresh(db_reserva)

    formatted_reserva = {
        "id": db_reserva.id,
        "cancha_id": db_reserva.cancha_id,
        "fecha": db_reserva.fecha.strftime("%Y-%m-%d"),
        "hora": db_reserva.hora.strftime("%H:%M"),
        "duracion": db_reserva.duracion,
        "telefono": db_reserva.telefono,
        "nombre_contacto": db_reserva.nombre_contacto
    }
    return formatted_reserva 


def delete_reserva(db: Session, reserva_id: int):
    reserva = db.query(Reserva).filter(Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    db.delete(reserva)
    db.commit()
    return reserva


def modify_reserva(db: Session, reserva_id: int, reserva_data: ReservaCreate):
    
    if verificar_reserva(db, reserva_data):
        raise ValueError("Ya existe una reserva en esa cancha para ese horario.")
    
    reserva = db.query(Reserva).filter(Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404)

    reserva.cancha_id = reserva_data.cancha_id
    reserva.fecha = reserva_data.fecha
    reserva.hora = reserva_data.hora
    reserva.duracion = reserva_data.duracion
    reserva.telefono = reserva_data.telefono
    reserva.nombre_contacto = reserva_data.nombre_contacto
   
    db.commit()
    db.refresh(reserva) 
    return reserva


def verificar_reserva(db: Session, reserva: ReservaCreate, reserva_id: int = None):
    
    inicio_minutos = reserva.hora.hour * 60 + reserva.hora.minute
    fin_minutos = inicio_minutos + reserva.duracion * 60
    

    existing_reserva = db.query(Reserva).filter(
        Reserva.cancha_id == reserva.cancha_id,
        Reserva.fecha == reserva.fecha,
        or_(
            and_(
                (extract('hour', Reserva.hora) * 60 + extract('minute', Reserva.hora)) < fin_minutos,
                (extract('hour', Reserva.hora) * 60 + extract('minute', Reserva.hora) + Reserva.duracion * 60) > inicio_minutos
            )
        )
    )
    

    if existing_reserva:
        existing_reserva = existing_reserva.filter(Reserva.id != reserva_id)
        return existing_reserva.first()

    return None

def filtrar_reserva(db:Session, cancha_id:int,fecha:date):
    db_reservas=db.query(Reserva).filter(Reserva.cancha_id==cancha_id,Reserva.fecha==fecha).all()
    return db_reservas