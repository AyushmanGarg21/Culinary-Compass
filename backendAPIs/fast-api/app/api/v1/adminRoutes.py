from fastapi import APIRouter, Depends
from app.config.role_dependencies import RoleAccess


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(RoleAccess.admin_access)],
)