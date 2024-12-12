from pydantic_settings import BaseSettings

class Settings(BaseSettings): 
    DATABASE_URL: str = "postgresql://postgres:12345@localhost:5432/tplabIV"

    class Config:
        env_file = ".env" 

    
settings = Settings()