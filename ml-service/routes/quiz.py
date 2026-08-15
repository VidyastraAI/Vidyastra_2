from fastapi import APIRouter, HTTPException
from services.quiz import generate_quiz_service

router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.get("/{lecture_id}")
def get_quiz(lecture_id: str):
    try:
        return {"lecture_id": lecture_id, "quiz": generate_quiz_service(lecture_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))