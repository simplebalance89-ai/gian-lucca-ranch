import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Film, Palette, BookOpen, Music, ArrowRight } from 'lucide-react';

const navCards = [
  {
    path: '/videos',
    title: 'Videos',
    description: 'Watch The Sleepy Little Bear',
    icon: Film,
    color: '#c4956a',
    bgColor: '#faf3e8',
  },
  {
    path: '/learning',
    title: 'Learning',
    description: 'Learn ABCs, numbers & more!',
    icon: Palette,
    color: '#a3b18a',
    bgColor: '#f0f4e8',
  },
  {
    path: '/stories',
    title: 'Stories',
    description: 'Read along with Daddy',
    icon: BookOpen,
    color: '#d4a76a',
    bgColor: '#faf3e8',
  },
  {
    path: '/music',
    title: 'Music',
    description: 'Listen to Ba Ba Ab',
    icon: Music,
    color: '#7db9a8',
    bgColor: '#e8f4f0',
  },
];

export default function ExploreNav() {
  return (
    <section className="py-16 px-4 bg-[#8b9a6d]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
            🚀 Where to Next?
          </p>
          <h2 className="font-['Fredoka'] text-3xl md:text-4xl font-bold text-white">
            Let's Go Explore!
          </h2>
          <div className="w-16 h-1 bg-[#d4e5a3] rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {navCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link to={card.path}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center cursor-pointer transition-shadow hover:shadow-xl border border-white/20"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: card.bgColor }}
                    >
                      <Icon size={28} style={{ color: card.color }} />
                    </div>
                    <h3 className="font-['Fredoka'] text-lg font-semibold text-[#5c4033] mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#8b7355] mb-3">
                      {card.description}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-[#c4956a]">
                      <ArrowRight size={16} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
