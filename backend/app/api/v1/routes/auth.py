from uuid import uuid4

from fastapi import APIRouter

from app.schemas import LoginRequest, LoginResponse, Role, UserOut

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    user = UserOut(
        id=uuid4(),
        body_number=payload.identifier if payload.role == Role.cadet else None,
        username=payload.identifier if payload.role == Role.duty_officer else None,
        rank="CDT" if payload.role == Role.cadet else "Lt",
        name="Demo User",
        company="Alpha Company" if payload.role == Role.cadet else "Duty Office",
        phone="+60 12-345 6789",
        role=payload.role,
    )
    return LoginResponse(access_token="replace-with-supabase-jwt", user=user)

