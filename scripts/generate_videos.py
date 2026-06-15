import os
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = Path(__file__).parent.parent
PUBLIC_DIR = BASE_DIR / "app" / "public"
VIDEOS_DIR = PUBLIC_DIR / "videos"
OUTPUT_DIR = VIDEOS_DIR

# Story configuration
STORIES = [
    {
        "id": "sleepy-bear",
        "title": "The Sleepy Little Bear",
        "emoji": "🐻",
        "image": "video-sleepy-bear.jpg",
        "target_duration": 120,
    },
    {
        "id": "benny-adventure",
        "title": "Benny Bear's Adventure",
        "emoji": "🐻",
        "image": "video-benny-adventure.jpg",
        "target_duration": 120,
    },
    {
        "id": "chicken-dance",
        "title": "Chicken Dance Party",
        "emoji": "🐔",
        "image": "video-chicken-dance.jpg",
        "target_duration": 120,
    },
    {
        "id": "tommy-turkey",
        "title": "Tommy Turkey's Day",
        "emoji": "🦃",
        "image": "video-tommy-turkey.jpg",
        "target_duration": 120,
    },
    {
        "id": "ranch-morning",
        "title": "Ranch Morning Routine",
        "emoji": "🌅",
        "image": "video-ranch-morning.jpg",
        "target_duration": 120,
    },
    {
        "id": "starlight-lullaby",
        "title": "Starlight Lullaby",
        "emoji": "🌙",
        "image": "video-starlight.jpg",
        "target_duration": 120,
    },
]

CARD_DURATION = 5  # seconds for title and end cards
OUTPUT_WIDTH = 1920
OUTPUT_HEIGHT = 1080


def get_font(size: int) -> ImageFont.FreeTypeFont:
    """Try to load a nice font, fall back to default."""
    font_paths = [
        "/c/Windows/Fonts/Fredoka-Bold.ttf",
        "/c/Windows/Fonts/Nunito-Bold.ttf",
        "/c/Windows/Fonts/segoeui.ttf",
        "/c/Windows/Fonts/arial.ttf",
    ]
    for path in font_paths:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()


def create_card(text: str, emoji: str, subtitle: str, output_path: Path, bg_color: tuple) -> None:
    """Create a title or end card image."""
    img = Image.new("RGB", (OUTPUT_WIDTH, OUTPUT_HEIGHT), bg_color)
    draw = ImageDraw.Draw(img)

    # Try to draw emoji using a color font or fallback
    emoji_font = get_font(120)
    title_font = get_font(72)
    subtitle_font = get_font(36)

    # Draw emoji
    bbox = draw.textbbox((0, 0), emoji, font=emoji_font)
    emoji_w = bbox[2] - bbox[0]
    draw.text(((OUTPUT_WIDTH - emoji_w) // 2, 280), emoji, font=emoji_font, fill="white")

    # Draw title
    bbox = draw.textbbox((0, 0), text, font=title_font)
    title_w = bbox[2] - bbox[0]
    draw.text(((OUTPUT_WIDTH - title_w) // 2, 450), text, font=title_font, fill="white")

    # Draw subtitle
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    sub_w = bbox[2] - bbox[0]
    draw.text(((OUTPUT_WIDTH - sub_w) // 2, 560), subtitle, font=subtitle_font, fill=(255, 255, 255))

    img.save(output_path, quality=95)


def get_audio_duration(audio_path: Path) -> float:
    """Get audio duration using ffprobe."""
    result = subprocess.run(
        [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(audio_path),
        ],
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def create_video(story: dict) -> None:
    """Create an MP4 video for a story."""
    story_id = story["id"]
    title = story["title"]
    emoji = story["emoji"]
    image_file = PUBLIC_DIR / story["image"]
    audio_file = VIDEOS_DIR / f"{story_id}.mp3"
    output_file = OUTPUT_DIR / f"{story_id}.mp4"

    if not audio_file.exists():
        print(f"Audio not found: {audio_file}, skipping {story_id}")
        return

    audio_duration = get_audio_duration(audio_file)
    target_duration = story["target_duration"]

    # Stretch audio to fill most of the target duration, leaving room for cards
    main_duration = target_duration - (CARD_DURATION * 2)
    stretch_ratio = audio_duration / main_duration

    # Limit stretch to keep voice natural (don't stretch more than ~15% slower)
    if stretch_ratio > 0.88:
        stretch_ratio = 0.88
        main_duration = audio_duration / stretch_ratio
    elif stretch_ratio < 0.65:
        stretch_ratio = 0.65
        main_duration = audio_duration / stretch_ratio

    print(f"\n--- {story_id} ---")
    print(f"Audio: {audio_duration:.1f}s, target video: {target_duration}s, main segment: {main_duration:.1f}s")

    # Create temporary card images
    temp_dir = OUTPUT_DIR / "_temp"
    temp_dir.mkdir(exist_ok=True)

    title_card = temp_dir / f"{story_id}-title.jpg"
    end_card = temp_dir / f"{story_id}-end.jpg"

    # Choose warm background colors based on story theme
    bg_colors = {
        "sleepy-bear": (139, 122, 101),
        "benny-adventure": (139, 154, 109),
        "chicken-dance": (212, 162, 90),
        "tommy-turkey": (172, 97, 61),
        "ranch-morning": (212, 167, 106),
        "starlight-lullaby": (107, 123, 163),
    }
    bg = bg_colors.get(story_id, (196, 149, 106))

    create_card(title, emoji, "A Gian Lucca's Ranch Story", title_card, bg)
    create_card("The End", "❤️", "Goodnight, little one", end_card, bg)

    # Build ffmpeg command
    # We use the zoompan filter for Ken Burns effect on the main image
    # and concat demuxer for title/main/end segments.
    concat_list = temp_dir / f"{story_id}-concat.txt"
    concat_list.write_text(
        f"file '{title_card.resolve().as_posix()}'\n"
        f"duration {CARD_DURATION}\n"
        f"file '{image_file.resolve().as_posix()}'\n"
        f"duration {main_duration}\n"
        f"file '{end_card.resolve().as_posix()}'\n"
        f"duration {CARD_DURATION}\n"
    )

    # Calculate zoompan parameters
    # Slow zoom from 1.0 to 1.15 over main_duration * 30 fps frames
    total_frames = int(main_duration * 30)
    zoom_expr = f"zoom+0.0005"
    z_expr = "min(zoom+0.0005,1.15)"
    x_expr = "iw/2-(iw/zoom/2)"
    y_expr = "ih/2-(ih/zoom/2)"

    cmd = [
        "ffmpeg",
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_list),
        "-i", str(audio_file),
        "-vf",
        f"scale={OUTPUT_WIDTH}:{OUTPUT_HEIGHT}:force_original_aspect_ratio=decrease,pad={OUTPUT_WIDTH}:{OUTPUT_HEIGHT}:(ow-iw)/2:(oh-ih)/2,setsar=1,zoompan=z='{z_expr}':x='{x_expr}':y='{y_expr}':d={total_frames}:s={OUTPUT_WIDTH}x{OUTPUT_HEIGHT}",
        "-af", f"rubberband=tempo={stretch_ratio:.3f}",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(output_file),
    ]

    print(f"Running ffmpeg for {story_id}...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error creating {story_id}:")
        print(result.stderr)
    else:
        print(f"Created: {output_file}")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for story in STORIES:
        create_video(story)

    print("\nAll videos processed!")


if __name__ == "__main__":
    main()
