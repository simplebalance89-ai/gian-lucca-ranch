import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, Volume2, VolumeX, Loader2 } from 'lucide-react';

export interface Story {
  id: string;
  title: string;
  description: string;
  audioSrc?: string;
  image: string;
  color: string;
  icon: string;
  text?: string;
}

interface StoryPlayerProps {
  story: Story;
  isPlaying: boolean;
  isLoading?: boolean;
  onPlay: () => void;
  onPause: () => void;
  progress: number;
  duration: number;
  currentTime: number;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface HeartConfig {
  id: number;
  y: number;
  x: number;
  rotate: number;
  duration: number;
  marginLeft: number;
  size: number;
}

// Deterministic "random-looking" values without Math.random or mutable state
function pseudoRandom(n: number): number {
  return Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
}

function generateHearts(seed: number): HeartConfig[] {
  return Array.from({ length: 6 }, (_, i) => {
    const n = seed + i;
    return {
      id: i,
      y: -120 - pseudoRandom(n) * 80,
      x: (pseudoRandom(n + 100) - 0.5) * 100,
      rotate: pseudoRandom(n + 200) * 60 - 30,
      duration: 1.5 + pseudoRandom(n + 300),
      marginLeft: (pseudoRandom(n + 400) - 0.5) * 120,
      size: 16 + pseudoRandom(n + 500) * 12,
    };
  });
}

export default function StoryPlayer({
  story,
  isPlaying,
  isLoading = false,
  onPlay,
  onPause,
  progress,
  duration,
  currentTime,
}: StoryPlayerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [hearts, setHearts] = useState<HeartConfig[]>([]);

  // Stable waveform bars generated once per component instance
  const bars = useMemo(() => {
    const seed = story.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    return Array.from({ length: 40 }, (_, i) => ({
      height: 20 + Math.sin(i * 0.4) * 30 + pseudoRandom(seed + i) * 20,
      duration: 0.4 + pseudoRandom(seed + i + 1000) * 0.6,
    }));
  }, [story.id]);

  const handleToggle = () => {
    if (isLoading) return;
    if (isPlaying) {
      onPause();
    } else {
      setHearts(generateHearts(Date.now()));
      setShowHearts(true);
      onPlay();
      setTimeout(() => setShowHearts(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-3xl overflow-hidden story-card-shadow bg-white border border-[#f0e6d3]"
    >
      {/* Floating hearts animation when playing */}
      <AnimatePresence>
        {showHearts && (
          <>
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  y: heart.y,
                  x: heart.x,
                  scale: 0.3,
                  rotate: heart.rotate,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: heart.duration, ease: 'easeOut' }}
                className="absolute bottom-20 left-1/2 z-20 pointer-events-none"
                style={{ marginLeft: heart.marginLeft }}
              >
                <Heart
                  size={heart.size}
                  className="text-red-400 fill-red-400"
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Story Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Play overlay button */}
        <motion.button
          onClick={handleToggle}
          whileHover={isLoading ? {} : { scale: 1.1 }}
          whileTap={isLoading ? {} : { scale: 0.95 }}
          disabled={isLoading}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors z-10 ${
            isLoading
              ? 'bg-white/90 text-[#c4956a] cursor-wait'
              : isPlaying
              ? 'bg-white/90 text-[#c4956a]'
              : 'bg-white/80 text-[#8b6914]'
          }`}
        >
          {isLoading ? (
            <Loader2 size={28} className="animate-spin" />
          ) : isPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" className="ml-1" />
          )}
        </motion.button>

        {/* Icon badge */}
        <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-lg shadow-md">
          {story.icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-['Fredoka'] text-xl font-semibold text-[#5c4033] mb-1">
          {story.title}
        </h3>
        <p className="text-sm text-[#8b7355] mb-4">{story.description}</p>

        {/* Waveform Visualization */}
        <div className="relative h-12 mb-3 flex items-end justify-center gap-[3px]">
          {bars.map((bar, i) => {
            const barProgress = i / bars.length;
            const isActive = barProgress <= progress;
            const animDelay = i * 0.05;

            return (
              <motion.div
                key={i}
                className={`w-[3px] rounded-full transition-colors duration-300 ${
                  isActive
                    ? isPlaying
                      ? 'bg-[#c4956a]'
                      : 'bg-[#d4a76a]'
                    : 'bg-[#e8ddd0]'
                }`}
                animate={
                  isPlaying && isActive
                    ? {
                        height: [`${bar.height * 0.3}%`, `${bar.height}%`, `${bar.height * 0.5}%`],
                      }
                    : { height: `${isActive ? bar.height * 0.6 : bar.height * 0.3}%` }
                }
                transition={
                  isPlaying && isActive
                    ? {
                        duration: bar.duration,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: animDelay,
                        ease: 'easeInOut',
                      }
                    : { duration: 0.3 }
                }
                style={{ height: `${isActive ? bar.height * 0.6 : bar.height * 0.3}%` }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-[#f0e6d3] rounded-full overflow-hidden mb-2">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#c4956a] rounded-full"
            style={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Time display */}
        <div className="flex items-center justify-between text-xs text-[#a89080]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f5ede0]">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={isLoading ? {} : { scale: 1.1 }}
              whileTap={isLoading ? {} : { scale: 0.9 }}
              onClick={handleToggle}
              disabled={isLoading}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isLoading
                  ? 'bg-[#f0e6d3] text-[#c4956a] cursor-wait'
                  : isPlaying
                  ? 'bg-[#c4956a] text-white'
                  : 'bg-[#f0e6d3] text-[#8b6914]'
              }`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </motion.button>
            <span className="text-sm font-medium text-[#8b7355]">
              {isLoading
                ? "Daddy's voice is getting ready..."
                : isPlaying
                ? 'Playing...'
                : 'Tap to play'}
            </span>
          </div>

          <motion.button
            whileHover={isLoading ? {} : { scale: 1.1 }}
            whileTap={isLoading ? {} : { scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            disabled={isLoading}
            className="w-8 h-8 rounded-full bg-[#f5ede0] flex items-center justify-center text-[#8b7355] hover:text-[#5c4033] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </motion.button>
        </div>
      </div>

      {/* Playing glow effect */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 60px ${story.color}20, 0 0 30px ${story.color}15`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
