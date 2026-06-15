import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';
import { assetUrl } from '../lib/supabaseAssets';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#c5d9e8] via-[#d4e5f0] to-[#faf6f0]">
      {/* Floating clouds */}
      <motion.div
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[10%] left-[5%] text-white/60"
      >
        <Cloud size={48} fill="white" />
      </motion.div>
      <motion.div
        animate={{ x: [20, -20, 20] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[15%] right-[10%] text-white/40"
      >
        <Cloud size={36} fill="white" />
      </motion.div>
      <motion.div
        animate={{ x: [-15, 15, -15] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[25%] left-[15%] text-white/30"
      >
        <Cloud size={28} fill="white" />
      </motion.div>

      {/* Sun */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[8%] right-[12%] w-20 h-20"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ffe066] to-[#ffb347] shadow-[0_0_60px_rgba(255,200,80,0.5)]" />
      </motion.div>

      {/* Floating emojis */}
      <motion.span
        animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-[20%] left-[8%] text-3xl"
      >
        🐻
      </motion.span>
      <motion.span
        animate={{ y: [0, -12, 0], rotate: [0, -8, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        className="absolute top-[30%] right-[8%] text-3xl"
      >
        🐔
      </motion.span>
      <motion.span
        animate={{ y: [0, -18, 0], rotate: [0, 15, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[35%] left-[5%] text-3xl"
      >
        🦃
      </motion.span>
      <motion.span
        animate={{ y: [0, -10, 0], rotate: [0, -5, 12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-[30%] right-[6%] text-3xl"
      >
        🏠
      </motion.span>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-xl px-4 mb-6"
      >
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
          <img
            src={assetUrl('hero-ranch-scene.png')}
            alt="Gian Lucca's Ranch"
            className="w-full h-auto object-cover"
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center z-10 px-4"
      >
        <h1 className="font-['Fredoka'] text-4xl md:text-5xl lg:text-6xl font-bold text-[#5c4033] text-shadow-warm mb-3">
          Welcome to Your Ranch, Gian Lucca!
        </h1>
        <p className="text-lg md:text-xl text-[#8b7355] font-medium">
          A magical world made just for you
        </p>
        <motion.p
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#c4956a] font-semibold mt-2"
        >
          From Daddy with Love ❤️
        </motion.p>
      </motion.div>
    </section>
  );
}
