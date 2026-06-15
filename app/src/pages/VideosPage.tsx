import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, ArrowLeft, Play, Clock, Star, Sparkles, X, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router';
import { videoStories } from '../data/videos';
import type { VideoStory } from '../data/videos';

function VideoCard({
  story,
  index,
  onPlay,
}: {
  story: VideoStory;
  index: number;
  onPlay: (story: VideoStory) => void;
}) {
  const isAvailable = story.status === 'available';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={isAvailable ? { y: -6 } : {}}
      className="group"
    >
      <div
        className={`relative rounded-2xl overflow-hidden card-shadow ${
          isAvailable ? 'cursor-pointer' : 'cursor-default'
        } bg-white border border-[#f0e6d3]`}
        onClick={() => isAvailable && onPlay(story)}
      >
        {/* Image */}
        <div className="relative h-44 sm:h-48 overflow-hidden">
          <motion.img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
            whileHover={isAvailable ? { scale: 1.06 } : {}}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isAvailable
                  ? 'bg-white/90 text-[#5c4033]'
                  : 'bg-[#f0e6d3]/90 text-[#8b7355]'
              }`}
            >
              {isAvailable ? (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {story.category}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {story.category}
                </span>
              )}
            </span>
          </div>

          {/* Emoji badge */}
          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-lg shadow-sm">
            {story.emoji}
          </div>

          {/* Play button or Coming Soon overlay */}
          {isAvailable ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center"
            >
              <Play size={24} className="text-[#c4956a] ml-1" fill="#c4956a" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/90 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
              >
                <Sparkles size={14} className="text-[#c4956a]" />
                <span className="text-sm font-semibold text-[#5c4033]">
                  Coming Soon!
                </span>
              </motion.div>
            </div>
          )}

          {/* Duration badge */}
          {story.duration && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md">
              {story.duration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-['Fredoka'] text-lg font-semibold text-[#5c4033] mb-1">
            {story.title}
          </h3>
          <p className="text-sm text-[#8b7355] leading-relaxed">
            {story.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function VideoModal({
  story,
  onClose,
}: {
  story: VideoStory;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay may be blocked or interrupted; ignore the error.
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Video player */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={story.videoSrc}
            poster={story.image}
            controls
            playsInline
            muted={isMuted}
            className="w-full h-full"
          />
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{story.emoji}</span>
              <span className="text-xs font-semibold text-[#c4956a] uppercase tracking-wider">
                {story.category}
              </span>
            </div>
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                }
              }}
              className="w-9 h-9 rounded-full bg-[#f5ede0] flex items-center justify-center text-[#8b7355] hover:text-[#5c4033] transition-colors"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
          <h2 className="font-['Fredoka'] text-2xl font-bold text-[#5c4033] mb-2">
            {story.title}
          </h2>
          <p className="text-[#8b7355]">{story.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => videoRef.current?.play()}
              className="flex-1 bg-[#c4956a] hover:bg-[#b8895c] text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Play size={18} fill="white" />
              Play Story
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-3 border border-[#e8ddd0] text-[#8b7355] font-medium rounded-xl hover:bg-[#f5ede0] transition-colors"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VideosPage() {
  const [selectedStory, setSelectedStory] = useState<VideoStory | null>(null);
  const featuredStory = videoStories.find((s) => s.status === 'available');
  const comingSoonCount = videoStories.filter((s) => s.status === 'coming-soon').length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-[#f5ede0] pt-10 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#8b7355] hover:text-[#5c4033] transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Ranch
        </Link>

        {/* Header */}
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
            <Film size={48} className="text-[#c4956a]" />
          </motion.div>
          <h1 className="font-['Fredoka'] text-4xl md:text-5xl font-bold text-[#5c4033] mb-2">
            Story Time Collection
          </h1>
          <p className="text-[#8b7355] text-lg">
            Watch, listen, and dream along with the ranch friends
          </p>
        </motion.div>

        {/* Featured Story */}
        {featuredStory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <p className="text-xs font-semibold text-[#c4956a] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles size={14} />
              Now Playing
            </p>
            <motion.div
              whileHover={{ y: -4 }}
              className="relative rounded-3xl overflow-hidden story-card-shadow bg-white border border-[#f0e6d3] cursor-pointer"
              onClick={() => setSelectedStory(featuredStory)}
            >
              <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden">
                <motion.img
                  src={featuredStory.image}
                  alt={featuredStory.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Play button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white/95 shadow-xl flex items-center justify-center"
                >
                  <Play
                    size={32}
                    className="text-[#c4956a] ml-1"
                    fill="#c4956a"
                  />
                </motion.div>

                {/* Duration */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Clock size={14} />
                  {featuredStory.duration}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{featuredStory.emoji}</span>
                    <span className="text-xs font-semibold text-white/80 uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                      {featuredStory.category}
                    </span>
                  </div>
                  <h2 className="font-['Fredoka'] text-2xl sm:text-3xl font-bold text-white">
                    {featuredStory.title}
                  </h2>
                  <p className="text-white/80 text-sm mt-1 max-w-md">
                    {featuredStory.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="font-['Fredoka'] text-2xl font-bold text-[#5c4033]">
              All Stories
            </h2>
            <p className="text-sm text-[#8b7355]">
              {videoStories.length} stories · {comingSoonCount} coming soon
            </p>
          </div>
        </motion.div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videoStories.map((story, i) => (
            <VideoCard
              key={story.id}
              story={story}
              index={i}
              onPlay={setSelectedStory}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedStory && (
          <VideoModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
