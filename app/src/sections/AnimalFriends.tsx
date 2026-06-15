import { motion } from 'framer-motion';

const friends = [
  {
    name: 'Benny the Bear',
    description: 'Your best friend! Loves honey and warm hugs 🍯',
    image: '/bear-friend.png',
    emoji: '🐻',
    color: '#c4956a',
  },
  {
    name: 'The Chicken Crew',
    description: 'Cluck cluck! They lay eggs and love to play 🥚',
    image: '/chickens-friends.png',
    emoji: '🐔',
    color: '#d4a76a',
  },
  {
    name: 'Tommy the Turkey',
    description: 'Gobble gobble! His feathers are so colorful 🌈',
    image: '/turkey-friends.png',
    emoji: '🦃',
    color: '#b8895c',
  },
  {
    name: 'The Ranch',
    description: 'Home sweet home — where all the magic happens 🏡',
    image: '/ranch-house.png',
    emoji: '🏠',
    color: '#a3b18a',
  },
];

export default function AnimalFriends() {
  return (
    <section className="py-16 px-4 bg-[#faf6f0]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold text-[#a3b18a] uppercase tracking-widest mb-2">
            🌟 Your Ranch Friends
          </p>
          <h2 className="font-['Fredoka'] text-3xl md:text-4xl font-bold text-[#5c4033]">
            Meet Your Animal Friends
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {friends.map((friend, i) => (
            <motion.div
              key={friend.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl overflow-hidden card-shadow group-hover:card-shadow-hover transition-all duration-300 border border-[#f0e6d3]">
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={friend.image}
                    alt={friend.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-lg shadow-sm">
                    {friend.emoji}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-['Fredoka'] text-lg font-semibold text-[#5c4033] mb-1">
                    {friend.name}
                  </h3>
                  <p className="text-sm text-[#8b7355] leading-relaxed">
                    {friend.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
