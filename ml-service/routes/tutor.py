from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.tutor import tutor_chat_service

router = APIRouter(prefix="/tutor", tags=["AI Tutor"])

class TutorQuery(BaseModel):
    query: str

@router.post("/{lecture_id}")
def ask_tutor(lecture_id: str, payload: TutorQuery):
    try:
        answer = tutor_chat_service(lecture_id, payload.query)
        return {"lecture_id": lecture_id, "query": payload.query, "response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))