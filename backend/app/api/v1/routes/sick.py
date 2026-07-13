from uuid import UUID, uuid4

from fastapi import APIRouter

from app.core.database import get_supabase
from app.schemas import SickReportCreate, SickReportOut, SickStatus

router = APIRouter()

_sick_reports: list[SickReportOut] = []


@router.get("", response_model=list[SickReportOut])
def list_sick_reports() -> list[SickReportOut]:
    supabase = get_supabase()
    if supabase:
        response = supabase.table("sick_reports").select("*").order("created_at", desc=True).execute()
        return [SickReportOut(**item) for item in response.data]
    return _sick_reports


@router.post("", response_model=SickReportOut, status_code=201)
def create_sick_report(payload: SickReportCreate) -> SickReportOut:
    report = SickReportOut(id=uuid4(), user_id=uuid4(), **payload.model_dump())
    supabase = get_supabase()
    if supabase:
        response = supabase.table("sick_reports").insert(report.model_dump(mode="json")).execute()
        return SickReportOut(**response.data[0])
    _sick_reports.insert(0, report)
    return report


@router.post("/{report_id}/recover", response_model=SickReportOut)
def mark_recovered(report_id: UUID) -> SickReportOut:
    supabase = get_supabase()
    if supabase:
        response = (
            supabase.table("sick_reports")
            .update({"status": SickStatus.recovered.value})
            .eq("id", str(report_id))
            .execute()
        )
        if response.data:
            return SickReportOut(**response.data[0])

    for index, report in enumerate(_sick_reports):
        if report.id == report_id:
            updated = report.model_copy(update={"status": SickStatus.recovered})
            _sick_reports[index] = updated
            return updated
    return SickReportOut(
        id=report_id,
        user_id=uuid4(),
        body_number="UNKNOWN",
        rank="CDT",
        name="Unknown Cadet",
        phone="-",
        symptoms="Unknown",
        description="Record was not found.",
        location_type="Duty Officer Room",
        status=SickStatus.recovered,
    )
