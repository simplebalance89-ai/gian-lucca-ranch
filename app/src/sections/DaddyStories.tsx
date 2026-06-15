import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Headphones } from 'lucide-react';
import StoryPlayer from '../components/StoryPlayer';
import FloatingNotes from '../components/FloatingNotes';

interface Story {
  id: string;
  title: string;
  description: string;
  audioSrc: string;
  image: string;
  color: string;
  icon: string;
}

const stories: Story[] = [
  {
    id: 'gianluca-love',
    title: 'Gianluca Love',
    description: 'A special message from Daddy just for you ❤️',
    audioSrc: '/audio/Gianluca_Love.m4a',
    image: '/story-love.jpg',
    color: '#e8919c',
    icon: '❤️',
  },
  {
    id: 'se-fifth-ave',
    title: 'SE Fifth Ave',
    description: 'A story about a very special street 🌴',
    audioSrc: '/audio/SE_Fifth_Ave.m4a',
    image: '/story-street.jpg',
    color: '#7db9a8',
    icon: '🌴',
  },
];

export default function DaddyStories() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [duration, setDuration] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playingId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 1;
        setCurrentTime((prev) => ({ ...prev, [playingId]: current }));
        setProgress((prev) => ({ ...prev, [playingId]: current / dur }));
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playingId]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = (story: Story) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // If clicking the same story, just play
    if (playingId === story.id && audioRef.current) {
      audioRef.current.play();
      return;
    }

    // Create new audio element
    const audio = new Audio(story.audioSrc);
    audioRef.current = audio;
    setPlayingId(story.id);

    audio.addEventListener('loadedmetadata', () => {
      setDuration((prev) => ({ ...prev, [story.id]: audio.duration }));
    });

    audio.addEventListener('ended', () => {
      setPlayingId(null);
      setProgress((prev) => ({ ...prev, [story.id]: 0 }));
      setCurrentTime((prev) => ({ ...prev, [story.id]: 0 }));
    });

    audio.play().catch(() => {
      // Handle autoplay restrictions gracefully
    });
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
  };

  return (
    <section className="relative py-16 px-4 bg-gradient-to-b from-[#faf6f0] via-[#f8f0e8] to-[#faf6f0] overflow-hidden">
      {/* Floating notes background */}
      <FloatingNotes active={playingId !== null} count={10} />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <Headphones size={40} className="text-[#c4956a]" />
          </motion.div>
          <p className="text-xs font-semibold text-[#c4956a] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
            <BookOpen size={14} />
            Daddy's Voice
          </p>
          <h2 className="font-['Fredoka'] text-3xl md:text-4xl font-bold text-[#5c4033] mb-2">
            Stories from Daddy
          </h2>
          <p className="text-[#8b7355] text-lg">
            Listen to Daddy read you stories — just for you!
          </p>
        </motion.div>

        {/* Story cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <StoryPlayer
              key={story.id}
              story={story}
              isPlaying={playingId === story.id}
              onPlay={() => handlePlay(story)}
              onPause={handlePause}
              progress={progress[story.id] || 0}
              duration={duration[story.id] || 0}
              currentTime={currentTime[story.id] || 0}
            />
          ))}
        </div>

        {/* Fun listening tip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-[#a89080] bg-white/60 inline-block px-6 py-3 rounded-full border border-[#f0e6d3]">
            🎧 Tap a story card to hear Daddy's voice! 🎵
          </p>
        </motion.div>
      </div>
    </section>
  );
}
