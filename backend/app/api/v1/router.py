from fastapi import APIRouter

from app.api.v1.routes import announcements, auth, movements, reports, sick

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(movements.router, prefix="/movements", tags=["movements"])
api_router.include_router(sick.router, prefix="/sick-reports", tags=["sick reports"])
api_router.include_router(announcements.router, prefix="/announcements", tags=["announcements"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])

