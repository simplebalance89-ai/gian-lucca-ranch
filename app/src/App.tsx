import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StoriesPage from './pages/StoriesPage';
import VideosPage from './pages/VideosPage';
import LearningPage from './pages/LearningPage';
import MusicPage from './pages/MusicPage';

export default function App() {
  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/music" element={<MusicPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
