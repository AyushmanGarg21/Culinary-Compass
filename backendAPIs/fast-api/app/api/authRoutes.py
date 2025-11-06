from fastapi import APIRouter


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/")
async def get_auth_welcome():
    return {"message": "Welcome to the Authentication Service"}