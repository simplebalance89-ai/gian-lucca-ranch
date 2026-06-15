import os
import re
import requests
from pathlib import Path

# Configuration
# Set these in your environment or in app/.env before running:
#   ELEVENLABS_API_KEY=sk_...
#   ELEVENLABS_VOICE_ID=...
API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "")
MODEL_ID = "eleven_multilingual_v2"

BASE_DIR = Path(__file__).parent.parent
SCRIPTS_FILE = BASE_DIR / "scripts" / "video-scripts.md"
OUTPUT_DIR = BASE_DIR / "app" / "public" / "videos"

# Ensure output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def parse_scripts(md_path: Path) -> dict:
    """Parse the markdown file into story_id -> text mapping."""
    content = md_path.read_text(encoding="utf-8")

    # Define the sections we expect
    section_map = {
        "The Sleepy Little Bear": "sleepy-bear",
        "Benny Bear's Adventure": "benny-adventure",
        "Chicken Dance Party": "chicken-dance",
        "Tommy Turkey's Day": "tommy-turkey",
        "Ranch Morning Routine": "ranch-morning",
        "Starlight Lullaby": "starlight-lullaby",
    }

    scripts = {}
    for title, story_id in section_map.items():
        # Match the section header and capture text until the next ## or end
        pattern = rf"## \d+\.\s*{re.escape(title)}\n\n(.*?)(?=\n## \d+\.|\Z)"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            text = match.group(1).strip()
            scripts[story_id] = text
        else:
            print(f"Warning: Could not find section for {title}")

    return scripts


def generate_audio(text: str, output_path: Path) -> None:
    """Call ElevenLabs API to generate audio and save to file."""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/stream"
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
        },
    }

    print(f"Generating audio for {output_path.name}...")
    response = requests.post(url, headers=headers, json=payload, stream=True)
    response.raise_for_status()

    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)

    print(f"Saved: {output_path} ({output_path.stat().st_size} bytes)")


def main():
    if not API_KEY or not VOICE_ID:
        print("Error: Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID environment variables.")
        return

    scripts = parse_scripts(SCRIPTS_FILE)
    print(f"Found {len(scripts)} scripts to narrate.\n")

    for story_id, text in scripts.items():
        output_path = OUTPUT_DIR / f"{story_id}.mp3"
        print(f"\n--- {story_id} ---")
        print(f"Text length: {len(text)} characters")
        try:
            generate_audio(text, output_path)
        except Exception as e:
            print(f"Error generating {story_id}: {e}")

    print("\nDone!")


if __name__ == "__main__":
    main()
