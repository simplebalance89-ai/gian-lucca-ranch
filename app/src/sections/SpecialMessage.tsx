import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function SpecialMessage() {
  return (
    <section className="py-16 px-4 bg-[#faf6f0]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl card-shadow p-8 md:p-10 border border-[#f0e6d3] relative overflow-hidden"
        >
          {/* Decorative hearts */}
          <motion.div
            animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-4 right-4 text-[#e8919c]"
          >
            <Heart size={20} fill="#e8919c" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -6, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute bottom-6 left-6 text-[#e8919c]"
          >
            <Heart size={16} fill="#e8919c" />
          </motion.div>

          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-[#e8919c] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <Heart size={14} />
              A Special Message
            </p>
            <h2 className="font-['Fredoka'] text-2xl md:text-3xl font-bold text-[#5c4033]">
              A Note From Daddy ❤️
            </h2>
          </div>

          <div className="space-y-4 text-[#6b5344] leading-relaxed">
            <p>
              Dear Gian Lucca,
            </p>
            <p>
              I built this little ranch world for you because you are the most amazing
              person in my life. Every bear hug, every chicken cluck, every turkey
              gobble — it's all here because I love you more than words can say.
            </p>
            <p>
              I hope this place makes you smile, helps you learn, and fills your
              dreams with wonderful adventures.
            </p>
            <p>
              Remember: you are brave like the bear, cheerful like the chickens, and
              proud like the turkey. And no matter what, Daddy will always be right
              here, loving you with all my heart.
            </p>
            <motion.p
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-['Fredoka'] text-lg text-[#c4956a] font-semibold mt-6"
            >
              Love, Daddy ❤️
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
