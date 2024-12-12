from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from app.db.base import Base
from sqlalchemy.orm import relationship

class Reserva(Base):
    __tablename__ = "reservas"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False) 
    duracion = Column(Integer, nullable=False)  # Ahora 'duracion' se maneja en minutos
    telefono = Column(String, nullable=False)
    nombre_contacto = Column(String, nullable=False)
    cancha_id = Column(Integer, ForeignKey('canchas.id'), nullable=False)
 
    cancha = relationship("Cancha", back_populates="reservas")