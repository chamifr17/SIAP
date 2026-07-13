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
    movement = MovementOut(id=uuid4(), user_id=None, **payload.model_dump())
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
        user_id=None,
        destination="Demo destination",
        purpose="Demo purpose",
        expected_return=now,
        checkout_time=now,
        approval_time=now,
        approved_by=uuid4(),
        status=MovementStatus.approved,
    )


@router.post("/{movement_id}/return", response_model=MovementOut)
def mark_returned(movement_id: UUID) -> MovementOut:
    now = datetime.utcnow()
    supabase = get_supabase()
    if supabase:
        response = (
            supabase.table("movement_requests")
            .update({"status": MovementStatus.returned.value, "return_time": now.isoformat()})
            .eq("id", str(movement_id))
            .execute()
        )
        if response.data:
            return MovementOut(**response.data[0])

    for index, movement in enumerate(_movements):
        if movement.id == movement_id:
            updated = movement.model_copy(update={"status": MovementStatus.returned, "return_time": now})
            _movements[index] = updated
            return updated

    return MovementOut(
        id=movement_id,
        user_id=None,
        body_number="UNKNOWN",
        rank="CDT",
        name="Unknown Cadet",
        phone="-",
        vehicle="-",
        destination="Unknown",
        purpose="Record was not found.",
        expected_return=now,
        checkout_time=now,
        return_time=now,
        status=MovementStatus.returned,
    )
