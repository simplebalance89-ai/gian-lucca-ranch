import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowLeft, Sparkles, Volume2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { stories } from '../data/stories';
import { useElevenLabs } from '../hooks/useElevenLabs';
import StoryPlayer from '../components/StoryPlayer';
import FloatingNotes from '../components/FloatingNotes';

export default function StoriesPage() {
  const {
    activeStoryId,
    isLoading,
    isPlaying,
    progress,
    currentTime,
    duration,
    useFallback,
    error,
    playStory,
    pause,
  } = useElevenLabs();

  // Pause audio when the user leaves the page
  useEffect(() => {
    return () => pause();
  }, [pause]);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#faf6f0] via-[#f8f0e8] to-[#faf6f0] overflow-hidden">
      <FloatingNotes active={isPlaying} count={12} />

      {/* Header */}
      <section className="relative pt-10 pb-6 px-4">
        <div className="max-w-5xl mx-auto relative z-10">
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
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-3"
            >
              <BookOpen size={48} className="text-[#c4956a]" />
            </motion.div>
            <h1 className="font-['Fredoka'] text-4xl md:text-5xl font-bold text-[#5c4033] mb-3">
              Story Time Collection
            </h1>
            <p className="text-lg text-[#8b7355] max-w-lg mx-auto">
              {useFallback
                ? "Listening to Daddy's recorded voice ❤️"
                : 'Tap a story to hear Daddy read it to you'}
            </p>

            {useFallback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 inline-flex items-center gap-2 bg-[#f0e6d3] text-[#8b6914] px-4 py-2 rounded-full text-sm"
              >
                <Volume2 size={14} />
                Playing uploaded audio files
              </motion.div>
            )}

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-10 right-10 text-[#c4956a]/20 hidden lg:block"
            >
              <Sparkles size={40} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Error / Setup banner */}
      <section className="relative px-4">
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatePresence>
            {error && error !== 'ADD_API_KEY' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700 text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              </motion.div>
            )}

            {error === 'ADD_API_KEY' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-8"
              >
                <div className="bg-white/80 rounded-2xl p-6 border border-[#f0e6d3]">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-[#c4956a] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-['Fredoka'] font-semibold text-[#5c4033] mb-1">
                        Want to hear AI-generated stories in Daddy's voice?
                      </h4>
                      <p className="text-sm text-[#8b7355] mb-3">
                        Add your ElevenLabs API key to generate stories on-demand with your voice clone!
                      </p>
                      <ol className="text-sm text-[#8b7355] space-y-1 list-decimal list-inside">
                        <li>
                          Go to{' '}
                          <a
                            href="https://elevenlabs.io/app/settings/api-keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#c4956a] underline"
                          >
                            elevenlabs.io
                          </a>{' '}
                          and copy your API key
                        </li>
                        <li>
                          For local dev, add{' '}
                          <code className="bg-[#f5ede0] px-1.5 py-0.5 rounded text-xs">VITE_ELEVENLABS_API_KEY</code>{' '}
                          to <code className="bg-[#f5ede0] px-1.5 py-0.5 rounded text-xs">app/.env</code>
                        </li>
                        <li>
                          For Vercel, add{' '}
                          <code className="bg-[#f5ede0] px-1.5 py-0.5 rounded text-xs">ELEVENLABS_API_KEY</code>{' '}
                          and{' '}
                          <code className="bg-[#f5ede0] px-1.5 py-0.5 rounded text-xs">VITE_ELEVENLABS_VOICE_ID</code>{' '}
                          in Settings → Environment Variables
                        </li>
                        <li>Redeploy or restart the dev server!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Story cards */}
      <section className="relative py-6 px-4 pb-16">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <StoryPlayer
                  story={story}
                  isPlaying={activeStoryId === story.id && isPlaying}
                  isLoading={isLoading === story.id}
                  onPlay={() => playStory(story)}
                  onPause={pause}
                  progress={activeStoryId === story.id ? progress : 0}
                  duration={activeStoryId === story.id ? duration : 0}
                  currentTime={activeStoryId === story.id ? currentTime : 0}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
