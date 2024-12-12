from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from crud.canchas import create_cancha, verificar_cancha
from schemas.canchas import CanchaCreate, Cancha
from crud.canchas import get_cancha,get_cancha_id,delete_cancha

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/canchas/", response_model=list[Cancha], tags=["canchas"])
def read_canchas_route(db: Session = Depends(get_db)):
    return get_cancha(db)

@router.get("/canchas/{cancha_id}", response_model=Cancha, tags=["canchas"])
def read_cancha_route(cancha_id: int, db: Session = Depends(get_db)):
    return get_cancha_id(db, cancha_id)

@router.post("/canchas/", tags=["canchas"])
def create_cancha_route(canchas: CanchaCreate, db: Session = Depends(get_db)):
    try:
        existing_cancha = verificar_cancha(db, canchas)
        
        if existing_cancha:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe una cancha con ese nombre."
            )
        
        new_cancha = create_cancha(db, canchas)
        return {"message": "Cancha creada exitosamente", "cancha": new_cancha}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    except Exception as e:    
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Hubo un error al agregar la cancha."
        )


router.delete("/canchas/{cancha_id}", response_model=Cancha, tags=["canchas"])
def delete_cancha_route(cancha_id: int, db: Session = Depends(get_db)):
    return delete_cancha(db, cancha_id)