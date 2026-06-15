import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TreePine } from 'lucide-react';

const locations = [
  { name: 'The Barn', icon: '🌾', image: '/the-barn.jpg' },
  { name: 'The Meadow', icon: '🌸', image: '/the-meadow.jpg' },
  { name: 'The Chicken Coop', icon: '🐔', image: '/the-coop.jpg' },
  { name: 'The Turkey Run', icon: '🦃', image: '/the-turkey-run.jpg' },
];

export default function ExploreRanch() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#f5ede0] to-[#faf6f0]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold text-[#a3b18a] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
            <TreePine size={14} />
            Discover
          </p>
          <h2 className="font-['Fredoka'] text-3xl md:text-4xl font-bold text-[#5c4033]">
            Explore the Ranch
          </h2>
          <div className="w-16 h-1 bg-[#c4956a] rounded-full mx-auto mt-4" />
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-1"
          >
            {locations.map((location, i) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-shrink-0 w-64 snap-start"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden card-shadow cursor-pointer group"
                >
                  <div className="h-80 overflow-hidden">
                    <motion.img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="text-xl">{location.icon}</span>
                    <span className="font-['Fredoka'] text-lg font-semibold text-white">
                      {location.name}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#5c4033] hover:bg-white transition-colors z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#5c4033] hover:bg-white transition-colors z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <p className="text-center text-[#a89080] text-sm mt-4">
          ← Slide to explore →
        </p>
      </div>
    </section>
  );
}
