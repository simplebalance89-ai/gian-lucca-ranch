import { motion } from 'framer-motion';
import { Sun, MapPin } from 'lucide-react';

export default function WeatherWidget() {
  return (
    <section className="py-6 px-4 -mt-4 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-sm mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl card-shadow px-6 py-4 flex items-center gap-4 border border-[#f0e6d3]">
          <div className="flex items-center gap-2 text-[#8b7355]">
            <MapPin size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">The Ranch</span>
          </div>
          <span className="text-[#a89080] text-xs">Updated just now</span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl card-shadow mt-2 p-6 text-center border border-[#f0e6d3]"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <Sun size={48} className="text-[#ffb347]" />
          </motion.div>
          <div className="font-['Fredoka'] text-4xl font-bold text-[#5c4033] mt-2">
            70°F
          </div>
          <p className="text-[#8b7355] font-medium mt-1">Sunny and warm!</p>
          <p className="text-[#a89080] text-sm mt-1">
            Perfect day to play outside 🌈
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
