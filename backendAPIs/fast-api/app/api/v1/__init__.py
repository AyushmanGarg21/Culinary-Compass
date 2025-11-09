
from fastapi import APIRouter

from .adminRoutes import router as admin_router
from .userRoutes import router as user_router
from .masterRoutes import router as master_router


router = APIRouter(
    prefix="/api/v1",
)
router.include_router(user_router)
router.include_router(admin_router)
router.include_router(master_router)

