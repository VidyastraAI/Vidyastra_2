import logging
from pathlib import Path
from typing import List, Dict, Any
from paddleocr import PaddleOCR
from config import settings
from utils.helper import save_json

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self):
        self.engine = PaddleOCR(use_angle_cls=False, lang='en')
        self.conf = settings.OCR_CONFIDENCE_THRESHOLD

    def process_frames(self, frames: List[Dict[str, Any]], lecture_id: str) -> List[Dict[str, Any]]:
        results = []
        for f in frames:
            path = f.get("file_path")
            if not path or not Path(path).exists(): continue
            try:
                res = self.engine.ocr(path, cls=False)
                texts = [{"text": line[1][0].strip(), "confidence": round(float(line[1][1]), 4)}
                         for line in res[0] if res and res[0] and line[1][1] >= self.conf and line[1][0].strip()]
                results.append({"timestamp": f.get("timestamp"), "frame_path": path, "extracted_texts": texts})
            except Exception as e:
                logger.error(f"OCR error on {path}: {e}")
        save_json({"lecture_id": lecture_id, "ocr_results": results}, settings.OCR_DIR / f"{lecture_id}_ocr.json")
        return results

ocr_service = OCRService()