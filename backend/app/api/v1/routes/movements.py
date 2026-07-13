from datetime import datetime
from uuid import UUID, uuid4

from fastapi import APIRouter

from app.core.database import get_supabase
from app.schemas import MovementCreate, MovementOut, MovementStatus

router = APIRouter()

_movements: list[MovementOut] = []


@router.get("", response_model=list[MovementOut])
def list_movements() -> list[MovementOut]:
    supabase = get_supabase()
    if supabase:
        response = supabase.table("movement_requests").select("*").order("created_at", desc=True).execute()
        return [MovementOut(**item) for item in response.data]
    return _movements


@router.post("", response_model=MovementOut, status_code=201)
def create_movement(payload: MovementCreate) -> MovementOut:
    movement = MovementOut(id=uuid4(), user_id=uuid4(), **payload.model_dump())
    supabase = get_supabase()
    if supabase:
        response = supabase.table("movement_requests").insert(movement.model_dump(mode="json")).execute()
        return MovementOut(**response.data[0])
    _movements.insert(0, movement)
    return movement


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
