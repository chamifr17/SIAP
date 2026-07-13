from fastapi import APIRouter

router = APIRouter()


@router.get("/daily")
def daily_report() -> dict[str, int]:
    return {
        "total_requests": 0,
        "approved": 0,
        "rejected": 0,
        "returned": 0,
        "still_outside": 0,
        "late_returns": 0,
        "sick_reports": 0,
    }

