from fastapi import APIRouter


router = APIRouter(
    prefix="/users",
    tags=["Users"]
    )


@router.get("/")
async def get_user_welcome():
    return {"message": "Welcome to the User"}