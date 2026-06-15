export interface VideoStory {
  id: string;
  title: string;
  description: string;
  image: string;
  videoSrc: string;
  duration: string;
  status: 'available' | 'coming-soon';
  category: string;
  emoji: string;
  color: string;
}

export const videoStories: VideoStory[] = [
  {
    id: 'sleepy-bear',
    title: 'The Sleepy Little Bear',
    description: "A heartwarming bedtime story about a little bear who can't fall asleep.",
    image: '/sleepy-bear-story.png',
    videoSrc: '/videos/sleepy-bear.mp4',
    duration: '2:02',
    status: 'available',
    category: 'Bedtime',
    emoji: '🐻',
    color: '#8b9ec8',
  },
  {
    id: 'benny-adventure',
    title: "Benny Bear's Adventure",
    description: 'Join Benny Bear on an exciting journey through the ranch!',
    image: '/bear-friend.png',
    videoSrc: '/videos/benny-adventure.mp4',
    duration: '1:52',
    status: 'available',
    category: 'Adventure',
    emoji: '🐻',
    color: '#c4956a',
  },
  {
    id: 'chicken-dance',
    title: 'Chicken Dance Party',
    description: 'Get ready to dance with the chickens in this fun-filled video!',
    image: '/chickens-friends.png',
    videoSrc: '/videos/chicken-dance.mp4',
    duration: '1:52',
    status: 'available',
    category: 'Fun',
    emoji: '🐔',
    color: '#d4a76a',
  },
  {
    id: 'tommy-turkey',
    title: "Tommy Turkey's Day",
    description: 'Spend a day with Tommy Turkey and learn about gratitude.',
    image: '/turkey-friends.png',
    videoSrc: '/videos/tommy-turkey.mp4',
    duration: '1:52',
    status: 'available',
    category: 'Gratitude',
    emoji: '🦃',
    color: '#b8895c',
  },
  {
    id: 'ranch-morning',
    title: 'Ranch Morning Routine',
    description: 'See what mornings are like on Gian Lucca\'s Ranch!',
    image: '/ranch-house.png',
    videoSrc: '/videos/ranch-morning.mp4',
    duration: '1:52',
    status: 'available',
    category: 'Routine',
    emoji: '🌅',
    color: '#a3b18a',
  },
  {
    id: 'starlight-lullaby',
    title: 'Starlight Lullaby',
    description: 'A soothing visual journey among the stars.',
    image: '/video-starlight.jpg',
    videoSrc: '/videos/starlight-lullaby.mp4',
    duration: '1:52',
    status: 'available',
    category: 'Bedtime',
    emoji: '🌙',
    color: '#7db9a8',
  },
];
