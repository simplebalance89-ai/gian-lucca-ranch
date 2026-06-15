import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, ArrowLeft, Play, Pause } from 'lucide-react';
import { Link } from 'react-router';
import FloatingNotes from '../components/FloatingNotes';
import { assetUrl } from '../lib/supabaseAssets';

const songs = [
  { id: 'baa-baa', title: 'Ba Ba Ab', desc: 'A classic favorite! 🐑', color: '#c4956a' },
  { id: 'twinkle', title: 'Twinkle Twinkle', desc: 'Little star! ⭐', color: '#7db9a8' },
  { id: 'old-mcdonald', title: 'Old McDonald', desc: 'E-I-E-I-O! 🚜', color: '#a3b18a' },
];

export default function MusicPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (songId: string) => {
    if (playingId === songId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingId(songId);
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#faf6f0] to-[#f8f0e8] pt-10 pb-16 px-4 overflow-hidden">
      <FloatingNotes active={playingId !== null} count={10} />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#8b7355] hover:text-[#5c4033] transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Ranch
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <Music size={48} className="text-[#7db9a8]" />
          </motion.div>
          <h1 className="font-['Fredoka'] text-4xl font-bold text-[#5c4033] mb-2">
            Music
          </h1>
          <p className="text-[#8b7355]">Listen to fun ranch songs!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl overflow-hidden border-4 border-white card-shadow mb-8 max-w-2xl mx-auto"
        >
          <img
            src={assetUrl('music-banner.png')}
            alt="Ranch music time"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        <div className="space-y-4 max-w-lg mx-auto">
          {songs.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 card-shadow border border-[#f0e6d3] cursor-pointer"
              onClick={() => handlePlay(song.id)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  playingId === song.id ? 'animate-pulse-glow' : ''
                }`}
                style={{ backgroundColor: song.color + '20' }}
              >
                {playingId === song.id ? (
                  <Pause size={22} style={{ color: song.color }} fill={song.color} />
                ) : (
                  <Play size={22} style={{ color: song.color }} fill={song.color} className="ml-0.5" />
                )}
              </motion.div>
              <div className="flex-1">
                <h3 className="font-['Fredoka'] text-lg font-semibold text-[#5c4033]">
                  {song.title}
                </h3>
                <p className="text-sm text-[#8b7355]">{song.desc}</p>
              </div>
              {playingId === song.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-end gap-[2px] h-6"
                >
                  {[1, 2, 3, 4].map((bar) => (
                    <motion.div
                      key={bar}
                      animate={{ height: ['30%', '100%', '40%', '80%'] }}
                      transition={{
                        duration: 0.6 + bar * 0.1,
                        repeat: Infinity,
                        delay: bar * 0.1,
                        ease: 'easeInOut',
                      }}
                      className="w-[3px] rounded-full"
                      style={{ backgroundColor: song.color }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
