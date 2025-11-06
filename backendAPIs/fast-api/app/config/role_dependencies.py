from fastapi import Request
from fastapi.exceptions import HTTPException


class RoleAccess:
    @staticmethod
    async def admin_access(request: Request):
        """Authenticate admin requests."""
        if request.state.scopes != "Admin":
            raise HTTPException(status_code=403, detail="Unauthorized Access")
            

    @staticmethod
    async def creator_access(request: Request):
        """Authenticate creator requests."""
        if request.state.scopes != "Creator":
            raise HTTPException(status_code=403, detail="Unauthorized Access")
           

    @staticmethod
    async def user_access(request: Request):
        """Authenticate user requests."""
        if request.state.scopes != "Creator" and request.state.scopes != "User":
            raise HTTPException(status_code=403, detail="Unauthorized user access")
            

