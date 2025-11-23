from fastapi import APIRouter
from app.routes.Users.userProfileRoutes import router as user_profile_router
from app.routes.Users.userRequestRoutes import router as user_request_router
from app.routes.Users.userDashboardRoutes import router as user_dashboard_router
from app.routes.Users.userPostRoutes import router as user_post_router

router = APIRouter(prefix="/users",tags=["Users"])


router.include_router(user_profile_router)
router.include_router(user_request_router)
router.include_router(user_dashboard_router)
router.include_router(user_post_router)
