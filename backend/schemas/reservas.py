from pydantic import BaseModel
from datetime import date,time

class ReservaBase(BaseModel):
    fecha:date
    hora:time
    duracion: int
    telefono: str
    nombre_contacto: str
    cancha_id: int
class ReservaCreate(ReservaBase):
    pass

class Reserva(ReservaBase):
    id: int

    class Config:
        from_attributes = True