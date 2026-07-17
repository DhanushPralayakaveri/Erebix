from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import market

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Algorithmic Data Pipeline & ML Engine for Erebix",
    version="1.0.0"
)

# CORS setup so the upcoming React frontend and Spring Boot microservice can fetch data cleanly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the market routing system
app.include_router(market.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "online", "service": settings.PROJECT_NAME}