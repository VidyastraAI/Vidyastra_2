from fastapi import APIRouter, UploadFile, File, HTTPException
from config import settings
from utils.ffmpeg import extract_audio_from_video
from utils.helper import generate_lecture_id
from services.audio import audio_service
from services.frames import frame_service
from services.ocr import ocr_service
from services.fusion import fusion_service
from services.vectordb import vectordb_service

router = APIRouter(prefix="/video", tags=["Video Processing"])

@router.post("/process")
async def process_video(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".mp4", ".avi", ".mov", ".mkv", ".webm")):
        raise HTTPException(status_code=400, detail="Invalid video format.")
    
    lid = generate_lecture_id()
    v_path = settings.VIDEO_DIR / f"{lid}_{file.filename}"
    a_path = settings.AUDIO_DIR / f"{lid}.wav"

    try:
        with open(v_path, "wb") as f:
            f.write(await file.read())
        
        extract_audio_from_video(v_path, a_path)
        transcript = audio_service.transcribe(a_path, lid)
        frames = frame_service.extract_keyframes(v_path, lid)
        ocr = ocr_service.process_frames(frames, lid)
        fusion = fusion_service.fuse(transcript, ocr, lid)
        chunks_count = vectordb_service.index_lecture(fusion["complete_fused_text"], lid)

        return {"status": "success", "lecture_id": lid, "indexed_chunks": chunks_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))