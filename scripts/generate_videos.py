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
        "images": ["sleepy-bear-story.png", "bear-friend.png", "hero-ranch-scene.png", "ranch-house.png", "story-love.jpg", "bear-friend.png", "sleepy-bear-story.png", "ranch-house.png"],
    },
    {
        "id": "benny-adventure",
        "title": "Benny Bear's Adventure",
        "emoji": "🐻",
        "images": ["bear-friend.png", "the-meadow.jpg", "chicken-crew.jpg", "the-barn.jpg", "the-meadow.jpg", "turkey-friends.png", "bear-friend.png", "the-meadow.jpg", "benny-bear.jpg", "the-meadow.jpg", "bear-friend.png"],
    },
    {
        "id": "chicken-dance",
        "title": "Chicken Dance Party",
        "emoji": "🐔",
        "images": ["chickens-friends.png", "the-coop.jpg", "the-barn.jpg", "chickens-friends.png", "the-barn.jpg", "bear-friend.png", "chickens-friends.png", "the-barn.jpg", "turkey-friends.png", "the-coop.jpg", "chickens-friends.png", "the-barn.jpg"],
    },
    {
        "id": "tommy-turkey",
        "title": "Tommy Turkey's Day",
        "emoji": "🦃",
        "images": ["turkey-friends.png", "the-coop.jpg", "the-meadow.jpg", "the-barn.jpg", "the-meadow.jpg", "the-barn.jpg", "the-meadow.jpg", "the-barn.jpg", "ranch-house.png", "hero-ranch-scene.png", "story-love.jpg", "turkey-friends.png"],
    },
    {
        "id": "ranch-morning",
        "title": "Ranch Morning Routine",
        "emoji": "🌅",
        "images": ["ranch-house.png", "hero-ranch-scene.png", "bear-friend.png", "turkey-friends.png", "chickens-friends.png", "the-coop.jpg", "the-barn.jpg", "the-meadow.jpg", "ranch-house.png", "hero-ranch-scene.png", "bear-friend.png", "the-ranch.jpg", "ranch-house.png"],
    },
    {
        "id": "starlight-lullaby",
        "title": "Starlight Lullaby",
        "emoji": "🌙",
        "images": ["hero-ranch-scene.png", "ranch-house.png", "sleepy-bear-story.png", "bear-friend.png", "chickens-friends.png", "turkey-friends.png", "story-love.jpg", "hero-ranch-scene.png", "story-love.jpg"],
    },
]

CARD_DURATION = 5  # seconds for title and end cards
OUTPUT_WIDTH = 1920
OUTPUT_HEIGHT = 1080
TEMPO = 0.85       # slow the voice down (1.0 = normal)
PAUSE_DURATION = 1.5  # seconds of silence after each paragraph
FPS = 30


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

    emoji_font = get_font(120)
    title_font = get_font(72)
    subtitle_font = get_font(36)

    bbox = draw.textbbox((0, 0), emoji, font=emoji_font)
    emoji_w = bbox[2] - bbox[0]
    draw.text(((OUTPUT_WIDTH - emoji_w) // 2, 280), emoji, font=emoji_font, fill="white")

    bbox = draw.textbbox((0, 0), text, font=title_font)
    title_w = bbox[2] - bbox[0]
    draw.text(((OUTPUT_WIDTH - title_w) // 2, 450), text, font=title_font, fill="white")

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


def run_ffmpeg(args: list, description: str = "ffmpeg") -> None:
    """Run ffmpeg and print errors if it fails."""
    result = subprocess.run(["ffmpeg", "-y", *args], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error during {description}:")
        print(result.stderr)
        raise RuntimeError(f"{description} failed")


def slow_down_audio(input_path: Path, output_path: Path) -> None:
    """Slow audio using rubberband while keeping pitch natural."""
    run_ffmpeg(
        ["-i", str(input_path), "-af", f"rubberband=tempo={TEMPO}", "-c:a", "libmp3lame", "-q:a", "2", str(output_path)],
        f"slow_down_audio {input_path.name}",
    )


def create_silence(duration: float, output_path: Path) -> None:
    """Create a silent mp3 of the given duration."""
    run_ffmpeg(
        ["-f", "lavfi", "-i", f"anullsrc=r=24000:cl=mono", "-t", str(duration), "-c:a", "libmp3lame", "-q:a", "2", str(output_path)],
        f"create_silence {output_path.name}",
    )


def concat_audio_files(parts: list[tuple[Path, float]], output_path: Path) -> None:
    """Concatenate audio files using the concat demuxer."""
    concat_list = output_path.parent / f"{output_path.stem}-concat.txt"
    lines = []
    for file_path, duration in parts:
        lines.append(f"file '{file_path.resolve().as_posix()}'")
        lines.append(f"duration {duration:.3f}")
    concat_list.write_text("\n".join(lines) + "\n", encoding="utf-8")

    run_ffmpeg(
        ["-f", "concat", "-safe", "0", "-i", str(concat_list), "-c", "copy", str(output_path)],
        f"concat_audio {output_path.name}",
    )


def create_image_clip(image_path: Path, duration: float, output_path: Path, zoom: bool = True) -> None:
    """Create a short MP4 from a still image with optional slow Ken Burns zoom."""
    total_frames = max(1, int(duration * FPS))
    filters = [
        f"scale={OUTPUT_WIDTH}:{OUTPUT_HEIGHT}:force_original_aspect_ratio=decrease",
        f"pad={OUTPUT_WIDTH}:{OUTPUT_HEIGHT}:(ow-iw)/2:(oh-ih)/2",
        "setsar=1",
    ]
    if zoom:
        z_expr = "min(zoom+0.0005,1.15)"
        x_expr = "iw/2-(iw/zoom/2)"
        y_expr = "ih/2-(ih/zoom/2)"
        filters.append(f"zoompan=z='{z_expr}':x='{x_expr}':y='{y_expr}':d={total_frames}:s={OUTPUT_WIDTH}x{OUTPUT_HEIGHT}")

    run_ffmpeg(
        [
            "-loop", "1",
            "-i", str(image_path),
            "-vf", ",".join(filters),
            "-r", str(FPS),
            "-t", str(duration),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-an",
            str(output_path),
        ],
        f"create_image_clip {output_path.name}",
    )


def concat_video_files(clips: list[tuple[Path, float]], output_path: Path) -> None:
    """Concatenate video clips using the concat demuxer."""
    concat_list = output_path.parent / f"{output_path.stem}-concat.txt"
    lines = []
    for file_path, duration in clips:
        lines.append(f"file '{file_path.resolve().as_posix()}'")
        lines.append(f"duration {duration:.3f}")
    concat_list.write_text("\n".join(lines) + "\n", encoding="utf-8")

    run_ffmpeg(
        ["-f", "concat", "-safe", "0", "-i", str(concat_list), "-c", "copy", str(output_path)],
        f"concat_video {output_path.name}",
    )


def create_video(story: dict) -> None:
    """Create an MP4 video for a story using per-paragraph audio and images."""
    story_id = story["id"]
    title = story["title"]
    emoji = story["emoji"]
    image_names = story["images"]
    output_file = OUTPUT_DIR / f"{story_id}.mp4"

    audio_dir = VIDEOS_DIR / story_id
    if not audio_dir.exists():
        print(f"Audio directory not found: {audio_dir}, skipping {story_id}")
        return

    paragraph_files = sorted(audio_dir.glob("para-*.mp3"))
    if not paragraph_files:
        print(f"No paragraph audio found for {story_id}, skipping")
        return

    # Temporary working directory
    temp_dir = OUTPUT_DIR / "_temp" / story_id
    temp_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n--- {story_id} ---")

    # Prepare title and end cards
    bg_colors = {
        "sleepy-bear": (139, 122, 101),
        "benny-adventure": (139, 154, 109),
        "chicken-dance": (212, 162, 90),
        "tommy-turkey": (172, 97, 61),
        "ranch-morning": (212, 167, 106),
        "starlight-lullaby": (107, 123, 163),
    }
    bg = bg_colors.get(story_id, (196, 149, 106))
    title_card_img = temp_dir / "title.jpg"
    end_card_img = temp_dir / "end.jpg"
    create_card(title, emoji, "A Gian Lucca's Ranch Story", title_card_img, bg)
    create_card("The End", "❤️", "Goodnight, little one", end_card_img, bg)

    # Silence clip reused for pauses and card silence
    pause_silence = temp_dir / "pause.mp3"
    title_silence = temp_dir / "title_silence.mp3"
    end_silence = temp_dir / "end_silence.mp3"
    create_silence(PAUSE_DURATION, pause_silence)
    create_silence(CARD_DURATION, title_silence)
    create_silence(CARD_DURATION, end_silence)

    # Process each paragraph: slow audio and build image clip
    audio_parts = [(title_silence, CARD_DURATION)]  # silence for title card
    video_clips = []

    title_clip = temp_dir / "title.mp4"
    create_image_clip(title_card_img, CARD_DURATION, title_clip, zoom=False)
    video_clips.append((title_clip, CARD_DURATION))

    total_narration = 0.0
    for i, para_audio in enumerate(paragraph_files, start=1):
        original_duration = get_audio_duration(para_audio)
        slowed_duration = original_duration / TEMPO
        total_narration += slowed_duration

        slowed_audio = temp_dir / f"para-{i:03d}-slowed.mp3"
        slow_down_audio(para_audio, slowed_audio)

        # Add slowed narration + pause to audio
        audio_parts.append((slowed_audio, slowed_duration))
        audio_parts.append((pause_silence, PAUSE_DURATION))

        # Pick image for this paragraph (cycle if more paragraphs than images)
        image_name = image_names[(i - 1) % len(image_names)]
        image_path = PUBLIC_DIR / image_name
        if not image_path.exists():
            print(f"  Warning: image not found {image_name}, using fallback")
            image_path = PUBLIC_DIR / "hero-ranch.jpg"

        clip_duration = slowed_duration + PAUSE_DURATION
        clip_path = temp_dir / f"para-{i:03d}.mp4"
        create_image_clip(image_path, clip_duration, clip_path, zoom=True)
        video_clips.append((clip_path, clip_duration))

    # End card
    audio_parts.append((end_silence, CARD_DURATION))
    end_clip = temp_dir / "end.mp4"
    create_image_clip(end_card_img, CARD_DURATION, end_clip, zoom=False)
    video_clips.append((end_clip, CARD_DURATION))

    print(f"  Paragraphs: {len(paragraph_files)}, narration audio: {total_narration:.1f}s")

    # Concatenate audio and video
    final_audio = temp_dir / "audio_final.mp3"
    concat_audio_files(audio_parts, final_audio)

    final_video = temp_dir / "video_final.mp4"
    concat_video_files(video_clips, final_video)

    # Mux audio and video
    run_ffmpeg(
        ["-i", str(final_video), "-i", str(final_audio), "-c", "copy", "-movflags", "+faststart", str(output_file)],
        f"mux {output_file.name}",
    )

    print(f"Created: {output_file}")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for story in STORIES:
        try:
            create_video(story)
        except Exception as e:
            print(f"Failed to create {story['id']}: {e}")

    print("\nAll videos processed!")


if __name__ == "__main__":
    main()
