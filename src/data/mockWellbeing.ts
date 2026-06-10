// Mock wellbeing data for the Scrollin' dashboard
// All data is fictional and used for demonstration only.

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface DayEntry {
  date: string;           // YYYY-MM-DD
  dayLabel: string;       // e.g. "Mon"
  screenMinutes: number;  // total daily screen time in minutes
  socialMinutes: number;  // social media specifically
  gamingMinutes: number;  // gaming specifically
  mood: MoodLevel;        // 1 = very low, 5 = very good
  energy: EnergyLevel;
  sleepHours: number;
  note?: string;          // optional free-text from user
}

// Last 7 days of mock data
export const weekData: DayEntry[] = [
  { date: '2025-06-03', dayLabel: 'Tue', screenMinutes: 310, socialMinutes: 140, gamingMinutes: 80,  mood: 3, energy: 3, sleepHours: 7.0 },
  { date: '2025-06-04', dayLabel: 'Wed', screenMinutes: 220, socialMinutes: 90,  gamingMinutes: 40,  mood: 4, energy: 4, sleepHours: 8.0, note: 'Went for a walk after school — felt better.' },
  { date: '2025-06-05', dayLabel: 'Thu', screenMinutes: 395, socialMinutes: 200, gamingMinutes: 90,  mood: 2, energy: 2, sleepHours: 6.0 },
  { date: '2025-06-06', dayLabel: 'Fri', screenMinutes: 480, socialMinutes: 210, gamingMinutes: 150, mood: 2, energy: 2, sleepHours: 5.5, note: 'Stayed up too late gaming. Tired all day.' },
  { date: '2025-06-07', dayLabel: 'Sat', screenMinutes: 290, socialMinutes: 120, gamingMinutes: 60,  mood: 4, energy: 4, sleepHours: 9.0, note: 'Spent time with family. Screens felt less urgent.' },
  { date: '2025-06-08', dayLabel: 'Sun', screenMinutes: 180, socialMinutes: 70,  gamingMinutes: 20,  mood: 5, energy: 5, sleepHours: 8.5 },
  { date: '2025-06-09', dayLabel: 'Mon', screenMinutes: 255, socialMinutes: 95,  gamingMinutes: 55,  mood: 4, energy: 3, sleepHours: 7.5 },
];

export const today = weekData[weekData.length - 1];

export const weeklyAverages = {
  screenMinutes: Math.round(weekData.reduce((s, d) => s + d.screenMinutes, 0) / weekData.length),
  socialMinutes: Math.round(weekData.reduce((s, d) => s + d.socialMinutes, 0) / weekData.length),
  gamingMinutes: Math.round(weekData.reduce((s, d) => s + d.gamingMinutes, 0) / weekData.length),
  mood:          +(weekData.reduce((s, d) => s + d.mood,          0) / weekData.length).toFixed(1),
  energy:        +(weekData.reduce((s, d) => s + d.energy,        0) / weekData.length).toFixed(1),
  sleepHours:    +(weekData.reduce((s, d) => s + d.sleepHours,    0) / weekData.length).toFixed(1),
};

export interface HabitEntry {
  id: string;
  label: string;
  category: 'offline' | 'boundary' | 'mindful';
  streak: number;         // days in a row
  completedToday: boolean;
}

export const habits: HabitEntry[] = [
  { id: 'h1', label: 'No phone in bed',             category: 'boundary', streak: 5, completedToday: true  },
  { id: 'h2', label: '20-min screen break after school', category: 'offline',  streak: 3, completedToday: true  },
  { id: 'h3', label: 'Check social media only twice', category: 'boundary', streak: 1, completedToday: false },
  { id: 'h4', label: 'Spend 30 min outside',        category: 'offline',  streak: 2, completedToday: false },
  { id: 'h5', label: 'Morning without screens',     category: 'mindful',  streak: 0, completedToday: false },
];

export const moodLabels: Record<MoodLevel, string> = {
  1: 'Really low',
  2: 'Not great',
  3: 'Okay',
  4: 'Pretty good',
  5: 'Great',
};

export const energyLabels: Record<EnergyLevel, string> = {
  1: 'Exhausted',
  2: 'Tired',
  3: 'Okay',
  4: 'Energised',
  5: 'Full of energy',
};

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  body: string;
  mood: MoodLevel;
  tags: string[];
}

export const journalEntries: JournalEntry[] = [
  {
    id: 'j1',
    date: '2025-06-08',
    prompt: 'What did you do today that didn\'t involve a screen?',
    body: 'I went for a long walk with my dog after dinner. It was quiet and I didn\'t feel the urge to check my phone as much as usual. I think being outside helps me reset.',
    mood: 5,
    tags: ['offline', 'nature', 'reset'],
  },
  {
    id: 'j2',
    date: '2025-06-06',
    prompt: 'When did you last feel the urge to scroll without a reason?',
    body: 'During lunch. I wasn\'t even bored, I just reached for my phone automatically. I put it face-down and tried to just eat and look out the window. It felt uncomfortable for a minute but then okay.',
    mood: 3,
    tags: ['awareness', 'habit', 'autopilot'],
  },
  {
    id: 'j3',
    date: '2025-06-04',
    prompt: 'Is there something you\'ve been avoiding by going online?',
    body: 'Honestly, yeah. There\'s a conversation I need to have with a friend and I keep finding reasons to be busy online instead. Writing this out actually makes me realize I should just do it.',
    mood: 3,
    tags: ['avoidance', 'friendship', 'honesty'],
  },
];

export const reflectionPrompts = [
  'What did you do today that didn\'t involve a screen?',
  'When did you last feel the urge to scroll without a reason?',
  'Is there something you\'ve been avoiding by going online?',
  'How did your screen time affect your mood today?',
  'What would you do with an extra hour if you weren\'t on your phone?',
  'Who did you connect with today — online and offline?',
  'What\'s one thing you want to do differently tomorrow?',
  'When were you most present today?',
  'Did you compare yourself to anyone online today? How did that feel?',
  'What made you reach for your phone the most today?',
];
