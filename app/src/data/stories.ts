export interface Story {
  id: string;
  title: string;
  description: string;
  text: string;
  fallbackAudio?: string;
  image: string;
  color: string;
  icon: string;
}

export const stories: Story[] = [
  {
    id: 'sleepy-little-bear',
    title: 'The Sleepy Little Bear',
    description: 'A heartwarming bedtime story about a little bear who just cannot fall asleep.',
    text: `Once upon a time, on a cozy corner of Gian Lucca's Ranch, there lived a little bear named Benny. Benny had soft brown fur, round button eyes, and the biggest yawn you have ever seen. But tonight, even though the moon was high and the crickets were singing their sleepy song, Benny just could not fall asleep.

Benny fluffed his pillow. He counted sheep. He even tried balancing on one paw, but his eyes stayed wide open.

So Benny tiptoed out of his little den and into the moonlit meadow. The grass felt cool beneath his paws. The fireflies blinked like tiny lanterns, and the wind whispered through the tall oak trees.

Benny saw Old Owl perched on a branch. "Owl," Benny whispered, "how do you fall asleep?"

Old Owl blinked his golden eyes. "I close my eyes and listen," he hooted softly. "Listen to the ranch settling down for the night."

Benny sat very still. He heard the brook bubbling gently. He heard the horses breathing in the barn. He heard the leaves rustling like a lullaby. And far away, he heard the familiar sound of Daddy's voice humming a slow, sweet tune.

Benny's eyelids grew heavy. His paws felt warm and fuzzy. He curled up right there in the soft grass, and before the next firefly blinked, Benny the little bear was fast asleep, dreaming of honey, hugs, and another beautiful day on Gian Lucca's Ranch.

The end. Sweet dreams, little one.`,
    image: '/benny-bear.jpg',
    color: '#a67c52',
    icon: '🐻',
  },
  {
    id: 'benny-bears-adventure',
    title: "Benny Bear's Adventure",
    description: 'Join Benny Bear on an exciting journey through the ranch!',
    text: `Benny the Bear woke up with a sparkle in his eyes. Today was the day for an adventure! The sun was peeking over the meadow, and the whole ranch was waiting to be explored.

Benny packed a tiny backpack with three things: a shiny red apple, his favorite blue bandana, and a map he had drawn himself. The map had a big X right in the middle of the meadow. "Treasure!" Benny said, and off he went.

First, Benny passed the chicken coop. The Chicken Crew was clucking and pecking at breakfast. "Where are you going, Benny?" they clucked.

"On a treasure hunt!" Benny replied.

"Good luck!" they cheered, flapping their wings.

Next, Benny trotted past the turkey run. Tommy Turkey was practicing his proud strut. "Need a marching buddy?" Tommy gobbled.

"Sure!" said Benny, and the two friends marched side by side, humming a brave little tune.

At the meadow, Benny dug right where the X was. His paws hit something hard. With one big pull, he uncovered an old wooden box. Inside was not gold or jewels, but something even better: a stack of handwritten notes from Daddy, each one saying, "I love you, Benny. I love you, Gianluca. I love our ranch."

Benny's heart felt full. He looked at Tommy and smiled. "This is the best treasure ever," he said.

And together, they sat in the warm sunshine, sharing the apple and knowing that love is the greatest adventure of all.

The end.`,
    image: '/the-meadow.jpg',
    color: '#8b9a6d',
    icon: '🐻',
  },
  {
    id: 'chicken-dance-party',
    title: 'Chicken Dance Party',
    description: 'Get ready to dance with the chickens in this fun-filled story!',
    text: `Have you ever seen a chicken dance? Well, on Gian Lucca's Ranch, the chickens know ALL the best moves!

One sunny afternoon, the Chicken Crew decided it was time for the biggest dance party the barn had ever seen. Cluck Norris, the rooster with the shiniest comb, turned up the music. Bawkstreet, the smallest chick, blew up the balloons. And Feathers McGee tied tiny bells around her ankles so every step went jingle-jangle.

The barn doors swung open. The sun poured in like a golden spotlight. "Ladies and chickens!" Cluck Norris crowed. "Let the dance party begin!"

First came the Funky Flap. Wings went up, wings went down, and everyone spun in circles until they were dizzy.

Next was the Peck and Shuffle. Heads bobbed, feet shuffled, and the bells went jingle-jangle-jingle.

Then Benny Bear wandered in. "Can I dance too?" he asked.

"Of course!" clucked Feathers McGee. "Everyone can dance on Gian Lucca's Ranch!"

Benny tried the Funky Flap, but his paws got tangled. He tried the Peck and Shuffle, but he almost tripped on his own ears. The chickens giggled kindly. Then Benny did his own move: the Big Bear Bounce. Boing, boing, boing! The whole barn shook with laughter.

Soon Tommy Turkey joined in, then the goats, then even the cows mooed along to the beat. The dance party lasted until the sun turned pink and Daddy called everyone in for supper.

As the chickens settled into their coop, Feathers McGee whispered, "Best. Party. Ever."

And Benny, still bouncing a little, whispered back, "Same time tomorrow?"

The end. Keep dancing, little one.`,
    image: '/chicken-crew.jpg',
    color: '#e6a23c',
    icon: '🐔',
  },
  {
    id: 'tommy-turkeys-day',
    title: "Tommy Turkey's Day",
    description: 'Spend a day with Tommy Turkey and learn about gratitude.',
    text: `Tommy Turkey woke up early on Gian Lucca's Ranch. He puffed out his feathers, stretched his wings, and took a deep breath of the fresh morning air. Today, Tommy wanted to do something very special. Today, he wanted to say thank you.

Tommy waddled to the chicken coop first. "Thank you for sharing your corn with me yesterday," he gobbled.

The chickens clucked happily. "You are welcome, Tommy!"

Then Tommy found Benny Bear by the big oak tree. "Thank you for helping me reach the shiny apples," Tommy said.

Benny smiled. "Friends help friends," he replied.

At the barn, Tommy saw the ranch cat, Whiskers, curled up on a hay bale. "Thank you for keeping the mice away so we can sleep snug and safe," Tommy said.

Whiskers purred and tipped her tail.

By afternoon, Tommy had thanked almost everyone on the ranch. His heart felt warm and full, like a little cup of hot cocoa. But there was still one more thank-you he needed to give.

Tommy waddled up the gentle hill where Daddy was fixing a fence. "Daddy," Tommy said, "thank you for taking care of all of us. Thank you for the food, the hugs, and the bedtime stories."

Daddy knelt down and gently patted Tommy's feathers. "Thank you for being you, Tommy," Daddy said. "You make this ranch a kinder place."

That night, as the stars came out, Tommy Turkey fell asleep feeling grateful, loved, and very, very proud to be part of Gian Lucca's Ranch.

The end. What are you thankful for today?`,
    image: '/tommy-turkey.jpg',
    color: '#c25e3d',
    icon: '🦃',
  },
  {
    id: 'ranch-morning-routine',
    title: 'Ranch Morning Routine',
    description: 'See what mornings are like on Gian Lucca\'s Ranch!',
    text: `Good morning, sunshine! On Gian Lucca's Ranch, every morning starts with a happy song.

The very first sound is Roo the Rooster. "Cock-a-doodle-doo!" he calls from the fence post. "Time to wake up, sleepy ranch!"

Benny Bear stretches in his den and yawns a great big bear yawn. Tommy Turkey puffs out his feathers and does three proud laps around the turkey run. The Chicken Crew hops off their roost, ready for breakfast and, of course, a little morning dance.

Daddy is already up. He fills the water buckets, scoops fresh grain into little bowls, and hums a tune that makes every animal feel safe. The smell of warm hay floats through the air, and the sun paints the meadow gold.

"Good morning, Benny!" Daddy calls.

"Good morning, Tommy!"

"Good morning, Chicken Crew!"

Each animal answers in its own way: a grunt, a gobble, a cluck, and a happy little bounce.

After breakfast, Benny helps Daddy check the fences. Tommy follows along, pecking at shiny stones. The chickens scratch in the garden, looking for wiggly bugs to thank them for keeping the plants healthy.

By mid-morning, the ranch is bright and busy and full of love. Daddy sits on the porch with a cup of something warm, and Benny curls up at his feet.

"This is the best ranch in the whole wide world," Benny whispers.

Daddy smiles. "Yes, it is," he says. "Because we are all here together."

The end. Good morning, little rancher.`,
    image: '/the-ranch.jpg',
    color: '#d4a76a',
    icon: '🌅',
  },
  {
    id: 'starlight-lullaby',
    title: 'Starlight Lullaby',
    description: 'A soothing journey among the stars before bedtime.',
    text: `Close your eyes and imagine the biggest, bluest sky you have ever seen. Now picture it slowly turning pink, then purple, then deep velvet blue. The stars begin to twinkle one by one, like tiny night-lights switched on just for you.

On Gian Lucca's Ranch, the stars have names. The brightest one above the barn is called Hugs. The little cluster near the meadow is called Giggles. And the slow, sleepy star that always blinks last is called Sweet Dreams.

Benny Bear is already tucked into his den, wrapped in a blanket of soft moss. Tommy Turkey rests his head beneath one warm wing. The Chicken Crew cuddles close, feather to feather, whispering quiet clucks.

A gentle wind blows through the oak trees, and it sounds like the ranch is humming a lullaby. Shhhhhh, shhhhhh, shhhhhh.

Daddy walks from window to window, turning off the lights and pulling the curtains. "Goodnight, ranch," he whispers. "Goodnight, Benny. Goodnight, Tommy. Goodnight, Chicken Crew. Goodnight, Gianluca. I love you all the way to the stars and back."

High above, the stars twinkle a little brighter, as if they are answering back: "We love you too."

So close your eyes, little one. Let the starlight wrap around you like a soft, silver blanket. Let your breath slow down. Let your dreams be sweet.

Tomorrow the sun will rise, the rooster will crow, and another beautiful day on Gian Lucca's Ranch will begin. But for now, it is time to rest.

Goodnight. I love you. Sweet dreams.

The end.`,
    image: '/story-love.jpg',
    color: '#6b7ba3',
    icon: '🌙',
  },
];
