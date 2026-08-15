from fastapi import APIRouter, HTTPException
from services.flashcard import generate_flashcard_service

router = APIRouter(prefix="/flashcard", tags=["Flashcards"])

@router.get("/{lecture_id}")
def get_flashcards(lecture_id: str):
    try:
        return {"lecture_id": lecture_id, "flashcards": generate_flashcard_service(lecture_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))