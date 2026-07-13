from datetime import datetime
from uuid import UUID, uuid4

from fastapi import APIRouter

from app.schemas import MovementCreate, MovementOut, MovementStatus

router = APIRouter()


@router.get("", response_model=list[MovementOut])
def list_movements() -> list[MovementOut]:
    return []


@router.post("", response_model=MovementOut, status_code=201)
def create_movement(payload: MovementCreate) -> MovementOut:
    return MovementOut(id=uuid4(), user_id=uuid4(), **payload.model_dump())


@router.post("/{movement_id}/approve", response_model=MovementOut)
def approve_movement(movement_id: UUID) -> MovementOut:
    now = datetime.utcnow()
    return MovementOut(
        id=movement_id,
        user_id=uuid4(),
        destination="Demo destination",
        purpose="Demo purpose",
        expected_return=now,
        checkout_time=now,
        approval_time=now,
        approved_by=uuid4(),
        status=MovementStatus.approved,
    )

