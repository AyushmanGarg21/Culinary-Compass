from fastapi import APIRouter
from app.routes.Users.userProfileRoutes import router as user_profile_router

router = APIRouter(prefix="/users",tags=["Users"])


router.include_router(user_profile_router)