from typing import List, Dict, Any
from config import settings
from utils.helper import save_json

class FusionService:
    def fuse(self, transcript: Dict[str, Any], ocr: List[Dict[str, Any]], lecture_id: str) -> Dict[str, Any]:
        segments = transcript.get("segments", [])
        ocr_map = {o.get("timestamp", 0.0): " ".join([i["text"] for i in o.get("extracted_texts", [])]) for o in ocr}
        
        timeline, master = [], []
        for seg in segments:
            start, end, spoken = seg.get("start", 0.0), seg.get("end", 0.0), seg.get("text", "")
            match = next((txt for ot, txt in ocr_map.items() if start <= ot <= end or abs(ot - start) <= 3.0), "")
            timeline.append({"start": start, "end": end, "spoken_text": spoken, "slide_text": match})
            block = f"[{start}s - {end}s] Spoken: {spoken}"
            if match: block += f" | Slide Text: {match}"
            master.append(block)
            
        result = {"lecture_id": lecture_id, "fused_timeline": timeline, "complete_fused_text": "\n".join(master)}
        save_json(result, settings.FUSION_DIR / f"{lecture_id}_fusion.json")
        return result

fusion_service = FusionService()