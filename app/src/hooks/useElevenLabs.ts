import { useState, useRef, useCallback } from 'react';
import type { Story } from '../data/stories';

interface UseElevenLabsReturn {
  activeStoryId: string | null;
  isLoading: string | null;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  useFallback: boolean;
  error: string | null;
  playStory: (story: Story) => void;
  pause: () => void;
}

const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID as string | undefined;
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;

const hasApiKey = Boolean(API_KEY && !API_KEY.includes('your_elevenlabs_api_key'));

async function fetchAudio(text: string, voiceId: string): Promise<Blob> {
  // In production, route through the Vercel serverless proxy so the API key
  // never ships to the browser. In local dev, call ElevenLabs directly.
  if (import.meta.env.PROD) {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voiceId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      throw new Error(`TTS proxy error (${response.status}): ${errorBody}`);
    }

    return response.blob();
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY || '',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`ElevenLabs API error (${response.status}): ${errorBody}`);
  }

  return response.blob();
}

export function useElevenLabs(): UseElevenLabsReturn {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cacheRef = useRef<Record<string, string>>({});

  const stopProgress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetProgress = useCallback(() => {
    stopProgress();
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, [stopProgress]);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    stopProgress();
  }, [stopProgress]);

  const startProgress = useCallback(() => {
    stopProgress();
    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const ct = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 1;
        setCurrentTime(ct);
        setProgress(ct / dur);
      }
    }, 100);
  }, [stopProgress]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    stopProgress();
  }, [stopProgress]);

  const playAudio = useCallback((src: string, storyId: string) => {
    cleanupAudio();
    setActiveStoryId(storyId);
    setError(null);

    const audio = new Audio(src);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setActiveStoryId(null);
      resetProgress();
    });

    audio.addEventListener('error', () => {
      setIsPlaying(false);
      setError('Could not play audio. Please try again.');
    });

    audio.play().then(() => {
      setIsPlaying(true);
      startProgress();
    }).catch(() => {
      setIsPlaying(false);
      setError('Could not play audio. Please try again.');
    });
  }, [cleanupAudio, resetProgress, startProgress]);

  const playFallback = useCallback((story: Story) => {
    if (!story.fallbackAudio) {
      setError('No fallback audio available for this story.');
      return;
    }
    setUseFallback(true);
    playAudio(story.fallbackAudio, story.id);
  }, [playAudio]);

  const generateAndPlay = useCallback(async (story: Story) => {
    setError(null);

    if (!VOICE_ID) {
      setError('Voice ID is missing. Please add VITE_ELEVENLABS_VOICE_ID to your environment variables.');
      return;
    }

    // If no API key is configured, fall back to uploaded audio if available
    if (!hasApiKey) {
      if (story.fallbackAudio) {
        playFallback(story);
      } else {
        setError('ADD_API_KEY');
      }
      return;
    }

    cleanupAudio();
    setActiveStoryId(story.id);
    setIsLoading(story.id);

    try {
      let audioUrl = cacheRef.current[story.id];

      if (!audioUrl) {
        const blob = await fetchAudio(story.text, VOICE_ID);
        audioUrl = URL.createObjectURL(blob);
        cacheRef.current[story.id] = audioUrl;
      }

      setIsLoading(null);
      playAudio(audioUrl, story.id);
    } catch (err) {
      setIsLoading(null);
      const message = err instanceof Error ? err.message : 'Failed to generate audio';
      setError(message);

      // Fall back to uploaded audio if ElevenLabs fails
      if (story.fallbackAudio) {
        playFallback(story);
      }
    }
  }, [cleanupAudio, playAudio, playFallback]);

  const playStory = useCallback((story: Story) => {
    // Same story: toggle play/pause
    if (activeStoryId === story.id) {
      if (isPlaying) {
        pause();
      } else if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          startProgress();
        }).catch(() => {
          setError('Could not resume audio.');
        });
      }
      return;
    }

    // New story
    if (useFallback || !hasApiKey) {
      playFallback(story);
    } else {
      generateAndPlay(story);
    }
  }, [activeStoryId, isPlaying, useFallback, generateAndPlay, playFallback, pause, startProgress]);

  return {
    activeStoryId,
    isLoading,
    isPlaying,
    progress,
    currentTime,
    duration,
    useFallback,
    error,
    playStory,
    pause,
  };
}
