import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Film, Palette, BookOpen, Music, Menu, X } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/videos', label: 'Videos', icon: Film },
  { path: '/learning', label: 'Learning', icon: Palette },
  { path: '/stories', label: 'Stories', icon: BookOpen },
  { path: '/music', label: 'Music', icon: Music },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 bg-[#faf6f0]/90 backdrop-blur-md border-b border-[#e8ddd0]"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            className="text-2xl"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            🐻🐔
          </motion.span>
          <span className="font-['Fredoka'] text-lg font-semibold text-[#5c4033] hidden sm:inline">
            Gian Lucca's Ranch
          </span>
          <span className="font-['Fredoka'] text-lg font-semibold text-[#5c4033] sm:hidden">
            Ranch
          </span>
          <motion.span
            className="text-2xl"
            whileHover={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            🦃🏠
          </motion.span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'text-[#8b6914] bg-[#f0e6d3]'
                    : 'text-[#8b7355] hover:text-[#5c4033] hover:bg-[#f5ede0]'
                }`}
              >
                <Icon size={16} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#c4956a] rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl text-[#5c4033] hover:bg-[#f0e6d3] transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[#faf6f0] border-t border-[#e8ddd0]"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                      isActive
                        ? 'text-[#8b6914] bg-[#f0e6d3]'
                        : 'text-[#8b7355] hover:text-[#5c4033] hover:bg-[#f5ede0]'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
