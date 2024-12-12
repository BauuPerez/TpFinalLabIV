from datetime import date
from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from schemas.reservas import ReservaCreate, Reserva
from crud.reservas import delete_reserva,modify_reserva,get_reserva_id,get_reserva,create_reserva, verificar_reserva,filtrar_reserva


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/reservas/", response_model=list[Reserva], tags=["reservas"])
def read_reservas_route(db: Session = Depends(get_db)):
    return get_reserva(db)


@router.get("/reservas/{reserva_id}", response_model=Reserva, tags=["reservas"])
def read_reserva_route(reserva_id: int, db: Session = Depends(get_db)):
    return get_reserva_id(db, reserva_id)

@router.get("/reservas/{cancha_id}/{fecha}", tags=["reservas"]  )
def filtrar_reserva_route(cancha_id: int, fecha: date, db: Session = Depends(get_db)):
    return filtrar_reserva(db,cancha_id,fecha)



@router.post("/reservas/", tags=["reservas"])
def create_reserva_route(reserva: ReservaCreate, db: Session = Depends(get_db)):
    try:
        existing_reserva = verificar_reserva(db, reserva)
        
        if existing_reserva:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe una reserva en esa cancha para ese horario."
            )
        
        new_reserva = create_reserva(db, reserva)
        return {"message": "Reserva creada exitosamente", "reserva": new_reserva}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    except Exception as e:
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ya existe una reserva en esa cancha para ese horario."
        )

@router.delete("/reservas/{reserva_id}", response_model=Reserva, tags=["reservas"])
def delete_reserva_route(reserva_id: int, db: Session = Depends(get_db)):
    borrar_reserva = delete_reserva(db, reserva_id)
    
    if borrar_reserva:
        raise HTTPException(
            status_code=status.HTTP_200_OK,
            detail="La reserva borrada con exito."
        )
    
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La reserva no existe."
        )

@router.put("/reservas/{reserva_id}", tags=["reservas"])
def modifiy_reserva_route(reserva_id: int, reserva: ReservaCreate, db: Session = Depends(get_db)):
    try:
        existing_reserva = verificar_reserva(db, reserva)
        
        if existing_reserva:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe una reserva en esa cancha para ese horario."
            )
        
        new_reserva = modify_reserva(db, reserva_id, reserva)
        return {"message": "Reserva modificada exitosamente", "reserva": new_reserva}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="La reserva no pudo ser modificada."
        )
