from fastapi import APIRouter, HTTPException
from services.assignment import generate_assignment_service

router = APIRouter(prefix="/assignment", tags=["Assignment"])

@router.get("/{lecture_id}")
def get_assignment(lecture_id: str):
    try:
        return {"lecture_id": lecture_id, "assignment": generate_assignment_service(lecture_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))