export type Quest = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: "pink" | "mint" | "peach" | "sky" | "lemon" | "lilac";
  participants: number;
  submissions: number;
  total: number;
  deadline: string;
  visibility: "public" | "private";
  host: string;
  rules: string[];
  points: number;
};

export const quests: Quest[] = [
  {
    id: "rare-flowers",
    title: "Hunt for Rare Flowers",
    description: "Capture 8 unique flower species growing on or around campus.",
    emoji: "🌸",
    color: "pink",
    participants: 42,
    submissions: 5,
    total: 8,
    deadline: "2d 14h",
    visibility: "public",
    host: "Botany Club",
    rules: ["Photo must show the whole flower", "No duplicate species", "Geo-tagged on campus"],
    points: 320,
  },
  {
    id: "weird-classroom",
    title: "Weirdest Classroom Object",
    description: "Find the strangest object hiding in your lectures this week.",
    emoji: "🪑",
    color: "lemon",
    participants: 128,
    submissions: 2,
    total: 5,
    deadline: "5d 02h",
    visibility: "public",
    host: "Len Park",
    rules: ["One object per submission", "Must be inside a classroom", "No people in the shot"],
    points: 180,
  },
  {
    id: "campus-landmarks",
    title: "12 Iconic Landmarks",
    description: "Cross every iconic spot on campus before the deadline.",
    emoji: "🗺️",
    color: "sky",
    participants: 87,
    submissions: 9,
    total: 12,
    deadline: "1d 08h",
    visibility: "public",
    host: "CampusQuest",
    rules: ["Must be a recognizable angle", "No filters", "First to finish gets +50"],
    points: 540,
  },
  {
    id: "color-rainbow",
    title: "Rainbow Run",
    description: "Snap one object for every color of the rainbow.",
    emoji: "🌈",
    color: "lilac",
    participants: 64,
    submissions: 4,
    total: 7,
    deadline: "3d 21h",
    visibility: "private",
    host: "Dorm B Squad",
    rules: ["One color per photo", "Object must dominate the frame"],
    points: 240,
  },
  {
    id: "midnight-snack",
    title: "Midnight Snack Run",
    description: "Document the best 2AM eats around campus.",
    emoji: "🍜",
    color: "peach",
    participants: 31,
    submissions: 1,
    total: 4,
    deadline: "6d 04h",
    visibility: "public",
    host: "Foodies",
    rules: ["Photo timestamp after 11pm", "Show the storefront"],
    points: 160,
  },
  {
    id: "leaf-collector",
    title: "Leaf Collector",
    description: "Find leaves of 6 different shapes.",
    emoji: "🍃",
    color: "mint",
    participants: 22,
    submissions: 6,
    total: 6,
    deadline: "Done",
    visibility: "public",
    host: "Eco Society",
    rules: ["Hold leaf flat", "Natural light only"],
    points: 200,
  },
];

export const leaderboard = [
  { rank: 1, name: "Mira K.", points: 1840, submissions: 28, avatar: "🦊" },
  { rank: 2, name: "Len Park", points: 1720, submissions: 25, avatar: "🐼" },
  { rank: 3, name: "Aiko T.", points: 1605, submissions: 24, avatar: "🐻" },
  { rank: 4, name: "Diego R.", points: 1480, submissions: 21, avatar: "🦁" },
  { rank: 5, name: "Sam W.", points: 1320, submissions: 19, avatar: "🐰" },
  { rank: 6, name: "You", points: 1180, submissions: 17, avatar: "🐨" },
  { rank: 7, name: "Priya N.", points: 980, submissions: 14, avatar: "🦉" },
  { rank: 8, name: "Marcus J.", points: 870, submissions: 12, avatar: "🐯" },
];

export const me = {
  name: "Len Park",
  handle: "@lenpark",
  level: 12,
  xp: 1180,
  xpToNext: 1500,
  streak: 7,
  totalPoints: 1720,
  wins: 4,
  questsCreated: 3,
  questsJoined: 11,
};

export const colorMap: Record<Quest["color"], { bg: string; fg: string; ring: string }> = {
  pink:  { bg: "bg-pink",  fg: "text-pink-foreground",  ring: "ring-pink/40" },
  mint:  { bg: "bg-mint",  fg: "text-mint-foreground",  ring: "ring-mint/40" },
  peach: { bg: "bg-peach", fg: "text-peach-foreground", ring: "ring-peach/40" },
  sky:   { bg: "bg-sky",   fg: "text-sky-foreground",   ring: "ring-sky/40" },
  lemon: { bg: "bg-lemon", fg: "text-lemon-foreground", ring: "ring-lemon/40" },
  lilac: { bg: "bg-lilac", fg: "text-lilac-foreground", ring: "ring-lilac/40" },
};
