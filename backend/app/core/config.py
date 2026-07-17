from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Erebix Data Engine"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "127.0.0.1"

    class Config:
        env_file = ".env"

settings = Settings()