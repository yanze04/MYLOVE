export interface MemoryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  date?: string;
  tag: string;
  location?: string;
}

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    title: 'Sweet first moments',
    caption: 'Wala pa masyado maayos na dami kaya ayan muna sakto winter din para di tayo lamigin hahaha, tas holding hands ayieeeee. 🥰',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
    date: 'Winter Memories',
    tag: 'First Moments',
    location: 'Winter Wonderland'
  },
  {
    id: 'mem-2',
    title: 'Our story',
    caption: 'Cote mo ditoo baby meowmeooow, nun na discover natin emote sa hato tas hanap tayo ng place ng picture, mali pa yun ginamit ko dyan that time yun scanner yun ginamit ko sa ibon imbes na camera HAHAHAHAHAHA. 🕊️✨',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    date: 'Cute Game Adventures',
    tag: 'Game Date',
    location: 'Hato Park'
  },
  {
    id: 'mem-3',
    title: 'More than just pictures',
    caption: 'Ganda ng kuha natin dito my meowmeoow huehehe tas emo era tayo. Every moment with you feels like home. 🖤🤍',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
    date: 'Golden Hour Memory',
    tag: 'Emo Era',
    location: 'Sunset View'
  }
];

export const ROMANTIC_MUSIC_LIST = [
  {
    title: 'Apocalypse',
    artist: 'Cigarettes After Sex',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-ambient-guitar-11447.mp3', // Gentle dreamy ambient romantic soundtrack fallback
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/19Hg1UCZaCdpHB37L7x63X?utm_source=generator&theme=0&si=29453ba70ed24dbb'
  }
];

// Romantic love notes for Message tab
export const LOVE_LETTERS = [
  {
    id: 'letter-1',
    date: 'Special Love Letter',
    title: 'To My Dearest Meowmeow 🤍',
    text: `From the very first day we talked until right now, you have been my favorite person in the entire universe. No matter how crazy the world gets, hearing your voice and seeing your cute smile brings me peace. 

Thank you for every laugh, every cute emote, every late night talk, and every sweet moment we share together. I love you more than words could ever describe, always and forever.`
  },
  {
    id: 'letter-2',
    date: 'Sweet Reminder',
    title: 'Why You Make Me Smile Every Day',
    text: `Even when we are doing silly things like scanning a bird instead of taking a picture with the camera, you make every simple thing feel magical. Thank you for being you, my baby meowmeow.`
  }
];

// Scratch coupons for Games tab
export const COUPONS = [
  { id: 'c1', title: 'Unlimited Warm Hugs & Cuddles', code: 'CUDDLE-FOREVER', icon: '🫂' },
  { id: 'c2', title: 'Late Night Food / Milk Tea Date of Your Choice', code: 'FOOD-TREAT', icon: '🧋' },
  { id: 'c3', title: 'Movie Marathon with Your Favorite Snacks', code: 'MOVIE-NIGHT', icon: '🎬' },
  { id: 'c4', title: '1 Wholesome Free Wish (No Expiration)', code: 'MEOW-WISH', icon: '✨' },
];
