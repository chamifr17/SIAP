from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class Role(str, Enum):
    cadet = "cadet"
    duty_officer = "duty_officer"


class UserOut(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    body_number: str | None = None
    username: str | None = None
    rank: str
    name: str
    company: str
    phone: str
    role: Role


class LoginRequest(BaseModel):
    identifier: str
    password: str
    role: Role


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class MovementStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    returned = "returned"
    overdue = "overdue"


class MovementCreate(BaseModel):
    body_number: str
    rank: str
    name: str
    peringkat: str
    phone: str
    vehicle: str
    destination: str = Field(min_length=2)
    purpose: str = Field(min_length=2)
    expected_return: datetime
    remarks: str | None = None
    qr_token: str | None = None


class MovementOut(MovementCreate):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID | None = None
    checkout_time: datetime | None = Field(default_factory=datetime.utcnow)
    return_time: datetime | None = None
    status: MovementStatus = MovementStatus.approved
    approved_by: UUID | None = None
    approval_time: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SickLocationType(str, Enum):
    do_room = "Duty Officer Room"
    own_room = "Own Room"


class SickStatus(str, Enum):
    active = "active"
    recovered = "recovered"
    clinic = "clinic"


class SickReportCreate(BaseModel):
    body_number: str
    rank: str
    name: str
    peringkat: str
    phone: str
    symptoms: str
    description: str = Field(min_length=5)
    location_type: SickLocationType
    building: str | None = None
    room: str | None = None
    qr_token: str | None = None


class SickReportOut(SickReportCreate):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID | None = None
    status: SickStatus = SickStatus.active
    officer_remarks: str | None = None
    check_in_time: datetime = Field(default_factory=datetime.utcnow)
    check_out_time: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AnnouncementCreate(BaseModel):
    title: str = Field(min_length=2)
    content: str = Field(min_length=2)


class AnnouncementOut(AnnouncementCreate):
    id: UUID = Field(default_factory=uuid4)
    created_by: UUID
    created_at: datetime = Field(default_factory=datetime.utcnow)
