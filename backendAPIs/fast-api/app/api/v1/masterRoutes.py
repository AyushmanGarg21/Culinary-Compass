from fastapi import APIRouter, Depends
from app.routes.masterRoutes import router as master_router


router = APIRouter(tags=["Master Data"])

router.include_router(master_router)
