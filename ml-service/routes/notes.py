from fastapi import APIRouter, HTTPException
from services.notes import generate_notes_service

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.get("/{lecture_id}")
def get_notes(lecture_id: str):
    try:
        return {"lecture_id": lecture_id, "notes": generate_notes_service(lecture_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))