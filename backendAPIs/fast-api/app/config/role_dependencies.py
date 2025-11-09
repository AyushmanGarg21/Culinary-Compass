from fastapi import Request
from fastapi.exceptions import HTTPException


class RoleAccess:
    @staticmethod
    async def admin_access(request: Request):
        """Authenticate admin requests."""
        if not request.state.is_admin:
            raise HTTPException(status_code=403, detail="Unauthorized Access")
            

    @staticmethod
    async def creator_access(request: Request):
        """Authenticate creator requests."""
        if not request.state.is_creator:
            raise HTTPException(status_code=403, detail="Unauthorized Access")
           

    @staticmethod
    async def user_access(request: Request):
        """Authenticate user requests."""
        if request.state.is_admin:
            raise HTTPException(status_code=403, detail="Unauthorized Access")
            

