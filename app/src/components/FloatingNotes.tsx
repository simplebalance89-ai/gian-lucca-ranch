import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';

interface Note {
  id: number;
  x: number;
  drift: number;
  delay: number;
  duration: number;
  size: number;
}

interface FloatingNotesProps {
  active?: boolean;
  count?: number;
}

export default function FloatingNotes({ active = false, count = 8 }: FloatingNotesProps) {
  const notes = useMemo<Note[]>(() => {
    if (!active) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: pseudoRandom(i) * 100,
      drift: (pseudoRandom(i + 1000) - 0.5) * 20,
      delay: pseudoRandom(i + 2000) * 2,
      duration: 2 + pseudoRandom(i + 3000) * 2,
      size: 12 + pseudoRandom(i + 4000) * 16,
    }));
  }, [active, count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: '100%', x: `${note.x}%`, scale: 0.5 }}
            animate={{
              opacity: [0, 0.7, 0.5, 0],
              y: '-20%',
              x: `${note.x + note.drift}%`,
              scale: [0.5, 1, 0.8],
              rotate: [0, 15, -10, 5],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: note.duration,
              delay: note.delay,
              ease: 'easeOut',
            }}
            className="absolute bottom-0"
          >
            <Music
              size={note.size}
              className="text-[#c4956a]/40"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function pseudoRandom(n: number): number {
  return Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
}
