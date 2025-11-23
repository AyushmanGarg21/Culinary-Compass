from fastapi import APIRouter, Depends
from app.routes.authRoutes import router as auth_router


router = APIRouter()

router.include_router(auth_router)