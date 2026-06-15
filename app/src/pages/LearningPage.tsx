import { motion } from 'framer-motion';
import { Palette, ArrowLeft, BookOpen, Hash, Shapes } from 'lucide-react';
import { Link } from 'react-router';

const lessons = [
  { title: 'ABCs', icon: BookOpen, desc: 'Learn your letters!', color: '#c4956a' },
  { title: 'Numbers', icon: Hash, desc: 'Count with friends!', color: '#a3b18a' },
  { title: 'Shapes', icon: Shapes, desc: 'Spot the shapes!', color: '#7db9a8' },
];

export default function LearningPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-[#f0f4e8] pt-10 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
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
          <Palette size={48} className="text-[#a3b18a] mx-auto mb-3" />
          <h1 className="font-['Fredoka'] text-4xl font-bold text-[#5c4033] mb-2">
            Learning
          </h1>
          <p className="text-[#8b7355]">Learn ABCs, numbers & more!</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {lessons.map((lesson, i) => {
            const Icon = lesson.icon;
            return (
              <motion.div
                key={lesson.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 text-center card-shadow border border-[#f0e6d3] cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: lesson.color + '15' }}
                >
                  <Icon size={28} style={{ color: lesson.color }} />
                </div>
                <h3 className="font-['Fredoka'] text-lg font-semibold text-[#5c4033] mb-1">
                  {lesson.title}
                </h3>
                <p className="text-sm text-[#8b7355]">{lesson.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
