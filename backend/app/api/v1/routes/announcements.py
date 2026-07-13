from uuid import uuid4

from fastapi import APIRouter

from app.schemas import AnnouncementCreate, AnnouncementOut

router = APIRouter()


@router.get("", response_model=list[AnnouncementOut])
def list_announcements() -> list[AnnouncementOut]:
    return []


@router.post("", response_model=AnnouncementOut, status_code=201)
def create_announcement(payload: AnnouncementCreate) -> AnnouncementOut:
    return AnnouncementOut(id=uuid4(), created_by=uuid4(), **payload.model_dump())

