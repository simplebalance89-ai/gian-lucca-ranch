import Hero from '../sections/Hero';
import WeatherWidget from '../sections/WeatherWidget';
import AnimalFriends from '../sections/AnimalFriends';
import ExploreRanch from '../sections/ExploreRanch';
import DaddyStories from '../sections/DaddyStories';
import SpecialMessage from '../sections/SpecialMessage';
import ExploreNav from '../sections/ExploreNav';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WeatherWidget />
      <AnimalFriends />
      <ExploreRanch />
      <DaddyStories />
      <SpecialMessage />
      <ExploreNav />
    </main>
  );
}
