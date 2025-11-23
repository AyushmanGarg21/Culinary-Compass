from fastapi import APIRouter, Depends
from app.config.role_dependencies import RoleAccess
from app.routes.Admin.adminCreatorRequestRoutes import router as admin_creator_request_router
from app.routes.Admin.adminPostRequestRoutes import router as admin_post_request_router
from app.routes.Admin.adminManageRoutes import router as admin_manage_router


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(RoleAccess.admin_access)],
)

router.include_router(admin_creator_request_router)
router.include_router(admin_post_request_router)
router.include_router(admin_manage_router)