import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-[#8b9a6d] py-10 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-['Fredoka'] text-2xl text-white/90 mb-4"
        >
          Made with love for Gian Lucca
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 text-3xl mb-4"
        >
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          >
            🐻
          </motion.span>
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            🐔
          </motion.span>
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            🦃
          </motion.span>
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
          >
            🏠
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-white/70 text-sm"
        >
          From Daddy with Love ❤️
        </motion.p>
      </div>
    </footer>
  );
}
