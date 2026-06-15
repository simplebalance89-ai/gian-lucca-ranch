import os
import re
import requests
from pathlib import Path

# Configuration
MODEL_ID = "eleven_multilingual_v2"

BASE_DIR = Path(__file__).parent.parent
SCRIPTS_FILE = BASE_DIR / "scripts" / "video-scripts.md"
OUTPUT_DIR = BASE_DIR / "app" / "public" / "videos"
ENV_FILE = BASE_DIR / "app" / ".env"
ENV_LOCAL_FILE = BASE_DIR / ".env.local"


def load_env_file(path: Path) -> dict:
    """Manually load a simple KEY=VALUE .env file (no quoting support)."""
    env = {}
    if not path.exists():
        return env
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip()
    return env


_ENV = load_env_file(ENV_FILE)
_ENV_LOCAL = load_env_file(ENV_LOCAL_FILE)

def _get_env(name: str) -> str:
    return os.environ.get(name) or _ENV.get(name) or _ENV_LOCAL.get(name) or ""

API_KEY = _get_env("ELEVENLABS_API_KEY") or _get_env("VITE_ELEVENLABS_API_KEY")
VOICE_ID = _get_env("ELEVENLABS_VOICE_ID") or _get_env("VITE_ELEVENLABS_VOICE_ID")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def parse_scripts(md_path: Path) -> dict:
    """Parse the markdown file into story_id -> full text mapping."""
    content = md_path.read_text(encoding="utf-8")

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
        pattern = rf"## \d+\.\s*{re.escape(title)}\n\n(.*?)(?=\n## \d+\.|\Z)"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            scripts[story_id] = match.group(1).strip()
        else:
            print(f"Warning: Could not find section for {title}")

    return scripts


def split_paragraphs(text: str) -> list[str]:
    """Split story text into paragraphs by blank lines."""
    paragraphs = []
    for block in text.split("\n\n"):
        block = block.strip()
        if block:
            paragraphs.append(block)
    return paragraphs


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

    print(f"  Generating audio for {output_path.name}...")
    response = requests.post(url, headers=headers, json=payload, stream=True)
    response.raise_for_status()

    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)

    print(f"  Saved: {output_path} ({output_path.stat().st_size} bytes)")


def main():
    if not API_KEY or not VOICE_ID:
        print("Error: ELEVENLABS_API_KEY and VOICE_ID are required.")
        print(f"Add them to {ENV_FILE} or set them as environment variables.")
        return

    scripts = parse_scripts(SCRIPTS_FILE)
    print(f"Found {len(scripts)} scripts to narrate.\n")

    for story_id, text in scripts.items():
        paragraphs = split_paragraphs(text)
        story_audio_dir = OUTPUT_DIR / story_id
        story_audio_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n--- {story_id} ({len(paragraphs)} paragraphs) ---")
        for i, paragraph in enumerate(paragraphs, start=1):
            output_path = story_audio_dir / f"para-{i:03d}.mp3"
            if output_path.exists():
                print(f"  Skipping existing {output_path.name}")
                continue
            try:
                generate_audio(paragraph, output_path)
            except Exception as e:
                print(f"  Error generating paragraph {i}: {e}")

    print("\nDone!")


if __name__ == "__main__":
    main()
