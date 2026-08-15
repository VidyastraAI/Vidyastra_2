import subprocess
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def extract_audio_from_video(video_path: Path, output_audio_path: Path) -> Path:
    logger.info(f"Extracting audio from {video_path}")
    cmd = [
        "C:\\Users\\patel\\Downloads\\ffmpeg-8.1.1-essentials_build\\ffmpeg-8.1.1-essentials_build\\bin\\ffmpeg.exe", "-y", "-i", str(video_path),
        "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1",
        str(output_audio_path)
    ]
    try:
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return output_audio_path
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg failed: {e.stderr}")
        raise RuntimeError(f"FFmpeg failed: {e.stderr}")