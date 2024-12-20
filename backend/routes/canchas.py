from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from crud.canchas import create_cancha, verificar_cancha, get_cancha, get_cancha_id, delete_cancha
from schemas.canchas import CanchaCreate, Cancha

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
    
    
@router.delete("/canchas/{cancha_id}", response_model=Cancha, tags=["canchas"])
def delete_cancha_route(cancha_id: int, db: Session = Depends(get_db)):
    try:
        # Verifica que el registro existe
        cancha = get_cancha_id(db, cancha_id)
        if not cancha:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cancha no encontrada"
            )

        # Log para saber si pasa a la función de eliminación
        print(f"Intentando eliminar la cancha con ID: {cancha_id}")

        deleted_cancha = delete_cancha(db, cancha_id)

        # Log si la eliminación fue exitosa
        print(f"Cancha con ID: {cancha_id} eliminada exitosamente")

        return deleted_cancha

    except Exception as e:
        print(f"Error al intentar eliminar la cancha: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al intentar borrar la cancha: {str(e)}"
        )



