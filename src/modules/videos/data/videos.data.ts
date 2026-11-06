import { VideoLesson, VideoDurationCategory, VideoProficiencyLevel, VideoTopic } from '../types/video.types';

// Curated reliable embed video streams
const STREAM_PLAYLIST = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
];

// Standard educational curriculum blueprints spanning from absolute beginner to fluent
const CURRICULUM_BLUEPRINTS: {
  topic: VideoTopic;
  topicLabel: string;
  level: VideoProficiencyLevel;
  levelLabel: string;
  durationCategory: VideoDurationCategory;
  durationFormatted: string;
  durationSeconds: number;
  xp: number;
  titleTemplate: (lang: string) => string;
  subTemplate: (lang: string) => string;
  descTemplate: (lang: string) => string;
  sampleWords: (_lang: string) => { term: string; phonetic: string; meaning: string }[];
  transcriptGen: (_lang: string) => { time: string; seconds: number; speaker: string; text: string; translation: string }[];
}[] = [
  // 1. Beginner (A1)
  {
    topic: 'alphabet',
    topicLabel: 'Alphabet & Script',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    durationCategory: '2min',
    durationFormatted: '2:15',
    durationSeconds: 135,
    xp: 25,
    titleTemplate: (l) => `${l} Alphabet & Sound Foundations`,
    subTemplate: (l) => `Master ${l} vowels and basic phonetics in 2 minutes`,
    descTemplate: (l) => `Learn mouth positioning, vowel lengths, and primary acoustic tones in ${l}.`,
    sampleWords: (_l) => [
      { term: 'Letter 1', phonetic: 'Akshara', meaning: 'Alphabet / Syllable' },
      { term: 'Sound', phonetic: 'Dhvani', meaning: 'Acoustic tone' },
    ],
    transcriptGen: (_l) => [
      { time: '0:05', seconds: 5, speaker: 'Tutor', text: `Welcome! Today we begin our journey with script.`, translation: 'Foundational introduction.' },
      { time: '0:45', seconds: 45, speaker: 'Tutor', text: `Notice the vowel duration: short breath vs long breath.`, translation: 'Vowel pronunciation technique.' },
      { time: '1:30', seconds: 90, speaker: 'Tutor', text: `Practice writing each character three times.`, translation: 'Writing exercise.' },
    ],
  },
  {
    topic: 'conversation',
    topicLabel: 'Daily Greetings',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    durationCategory: '2min',
    durationFormatted: '2:30',
    durationSeconds: 150,
    xp: 25,
    titleTemplate: (l) => `Saying Hello, Welcome & Goodbye in ${l}`,
    subTemplate: (l) => `Everyday polite social greetings in ${l}`,
    descTemplate: (l) => `Sound natural and polite when meeting locals and friends in ${l}.`,
    sampleWords: (_l) => [
      { term: 'Greeting', phonetic: 'Namaskara', meaning: 'Hello / Greetings' },
      { term: 'Thank you', phonetic: 'Dhanyavada', meaning: 'Gratitude' },
    ],
    transcriptGen: (_l) => [
      { time: '0:10', seconds: 10, speaker: 'Tutor', text: `Always greet with a warm smile when speaking.`, translation: 'Cultural greeting habit.' },
      { time: '0:50', seconds: 50, speaker: 'Tutor', text: `To say goodbye respectfully, use traditional polite forms.`, translation: 'Polite leave-taking.' },
    ],
  },
  {
    topic: 'conversation',
    topicLabel: 'Self Introductions',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    durationCategory: '5min',
    durationFormatted: '5:10',
    durationSeconds: 310,
    xp: 40,
    titleTemplate: (l) => `Introduce Yourself with Confidence in ${l}`,
    subTemplate: (l) => `State your name, hometown, and profession in ${l}`,
    descTemplate: (l) => `A complete 5-minute template to introduce yourself fluently in ${l}.`,
    sampleWords: (_l) => [
      { term: 'Name', phonetic: 'Hesaru / Naam', meaning: 'Name' },
      { term: 'Hometown', phonetic: 'Ooru / Shahr', meaning: 'Town / City' },
    ],
    transcriptGen: (_l) => [
      { time: '0:15', seconds: 15, speaker: 'Tutor', text: `Step 1: State your name clearly.`, translation: 'Name template.' },
      { time: '1:30', seconds: 90, speaker: 'Tutor', text: `Step 2: Tell where you are from.`, translation: 'Origin phrase.' },
      { time: '3:00', seconds: 180, speaker: 'Tutor', text: `Step 3: State your work or study with pride.`, translation: 'Profession phrase.' },
    ],
  },

  // 2. Elementary (A2)
  {
    topic: 'food',
    topicLabel: 'Food & Dining Out',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    durationCategory: '5min',
    durationFormatted: '5:45',
    durationSeconds: 345,
    xp: 45,
    titleTemplate: (l) => `Ordering Food & Filter Coffee in ${l}`,
    subTemplate: (l) => `Dishes, spices, and asking for the bill in ${l}`,
    descTemplate: (l) => `Master restaurant ordering phrases, dietary preferences, and billing in ${l}.`,
    sampleWords: (_l) => [
      { term: 'Food / Meal', phonetic: 'Oota / Khaana', meaning: 'Meal' },
      { term: 'Water', phonetic: 'Neeru / Paani', meaning: 'Water' },
      { term: 'How much is it?', phonetic: 'Eshtu aaythu?', meaning: 'Bill inquiry' },
    ],
    transcriptGen: (_l) => [
      { time: '0:20', seconds: 20, speaker: 'Tutor', text: `Ask for a table or takeaway cleanly.`, translation: 'Seating and orders.' },
      { time: '2:15', seconds: 135, speaker: 'Tutor', text: `Specify spice level: less spicy or more spicy.`, translation: 'Taste customization.' },
      { time: '4:20', seconds: 260, speaker: 'Tutor', text: `Ask for the check and pay with digital QR.`, translation: 'Bill payment.' },
    ],
  },
  {
    topic: 'travel',
    topicLabel: 'Auto & Cab Commuting',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    durationCategory: '5min',
    durationFormatted: '5:20',
    durationSeconds: 320,
    xp: 45,
    titleTemplate: (l) => `Auto Rickshaw Fares & Navigation in ${l}`,
    subTemplate: (l) => `Bargaining, meter requests, and turn directions in ${l}`,
    descTemplate: (l) => `Commute stress-free across cities using essential ${l} vocabulary.`,
    sampleWords: (_l) => [
      { term: 'Left / Right', phonetic: 'Edadu / Baladu', meaning: 'Direction' },
      { term: 'Stop here', phonetic: 'Nillisi / Roko', meaning: 'Stop' },
    ],
    transcriptGen: (_l) => [
      { time: '0:25', seconds: 25, speaker: 'Tutor', text: `Flagging down an auto: confirm the destination first.`, translation: 'Ride confirmation.' },
      { time: '2:10', seconds: 130, speaker: 'Tutor', text: `Giving turn by turn directions: left, right, straight.`, translation: 'Direction guidance.' },
    ],
  },
  {
    topic: 'grammar',
    topicLabel: 'Numbers & Marketplace',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    durationCategory: '10min',
    durationFormatted: '10:15',
    durationSeconds: 615,
    xp: 55,
    titleTemplate: (l) => `Numbers 1 to 100 & Marketplace in ${l}`,
    subTemplate: (l) => `Counting, currency, weights, and negotiations in ${l}`,
    descTemplate: (l) => `Learn how to count quickly, ask for discounts, and buy fresh groceries in ${l}.`,
    sampleWords: (_l) => [
      { term: 'One, Two, Three', phonetic: 'Ondu, Eradu, Mooru', meaning: '1, 2, 3' },
      { term: 'Kilo', phonetic: 'Kilo', meaning: 'Weight measurement' },
      { term: 'Discount', phonetic: 'Kammi maadi', meaning: 'Reduce price' },
    ],
    transcriptGen: (_l) => [
      { time: '0:30', seconds: 30, speaker: 'Tutor', text: `Counting groups of 10s: 10, 20, 30, 40...`, translation: 'Multiples of ten.' },
      { time: '4:15', seconds: 255, speaker: 'Tutor', text: `Asking for fresh produce at the market.`, translation: 'Quality inquiry.' },
      { time: '7:40', seconds: 460, speaker: 'Tutor', text: `Politely negotiating a fair price without offending.`, translation: 'Negotiation skill.' },
    ],
  },

  // 3. Intermediate (B1)
  {
    topic: 'grammar',
    topicLabel: 'Verb Tenses Masterclass',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    durationCategory: '10min',
    durationFormatted: '10:30',
    durationSeconds: 630,
    xp: 65,
    titleTemplate: (l) => `Past, Present & Future Tenses in ${l}`,
    subTemplate: (l) => `Conjugations with subject agreement in ${l}`,
    descTemplate: (l) => `Never mix up tenses again with simple formulaic patterns in ${l}.`,
    sampleWords: (_l) => [
      { term: 'I will go', phonetic: 'Hoguttene / Jaoonga', meaning: 'Future action' },
      { term: 'I went', phonetic: 'Hode / Gaya', meaning: 'Past action' },
      { term: 'I am doing', phonetic: 'Maduttiddene / Kar raha hoon', meaning: 'Present continuous' },
    ],
    transcriptGen: (_l) => [
      { time: '0:40', seconds: 40, speaker: 'Tutor', text: `Root verbs and tense suffixes.`, translation: 'Suffix patterns.' },
      { time: '3:50', seconds: 230, speaker: 'Tutor', text: `Subject pronoun agreement: I vs You vs They.`, translation: 'Pronoun rules.' },
      { time: '7:15', seconds: 435, speaker: 'Tutor', text: `Real-life conversational sentences switching between tenses.`, translation: 'Story flow.' },
    ],
  },
  {
    topic: 'slang',
    topicLabel: 'Modern Slang & Idioms',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    durationCategory: '10min',
    durationFormatted: '9:50',
    durationSeconds: 590,
    xp: 60,
    titleTemplate: (l) => `Modern Colloquial Slang & Idioms in ${l}`,
    subTemplate: (l) => `Talk like youth and friends in ${l}`,
    descTemplate: (l) => `Catchy regional expressions, popular movie references, and casual fillers in ${l}.`,
    sampleWords: (_l) => [
      { term: 'Awesome / Super', phonetic: 'Sakkath / Gazab', meaning: 'Fantastic' },
      { term: 'Relax / Chill', phonetic: 'Bindaas / Aaraam', meaning: 'Take it easy' },
    ],
    transcriptGen: (_l) => [
      { time: '0:35', seconds: 35, speaker: 'Tutor', text: `Why textbook language differs from real street conversations.`, translation: 'Colloquial evolution.' },
      { time: '4:10', seconds: 250, speaker: 'Tutor', text: `Expressing excitement and awe naturally.`, translation: 'Positive slang.' },
      { time: '7:30', seconds: 450, speaker: 'Tutor', text: `Humorous idioms you will hear in movies and podcasts.`, translation: 'Pop culture phrases.' },
    ],
  },
  {
    topic: 'conversation',
    topicLabel: 'Office Communication',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    durationCategory: '10min',
    durationFormatted: '11:15',
    durationSeconds: 675,
    xp: 70,
    titleTemplate: (l) => `Workplace & Professional Communication in ${l}`,
    subTemplate: (l) => `Meetings and formal requests in ${l}`,
    descTemplate: (l) => `Build trust with local teams and clients with polite business etiquette in ${l}.`,
    sampleWords: (_l) => [
      { term: 'Meeting', phonetic: 'Sabhe / Baithak', meaning: 'Assembly / Meeting' },
      { term: 'Work / Task', phonetic: 'Kelasa / Kaam', meaning: 'Assignment' },
    ],
    transcriptGen: (_l) => [
      { time: '0:45', seconds: 45, speaker: 'Tutor', text: `Formal vs informal address in office settings.`, translation: 'Workplace hierarchy.' },
      { time: '5:20', seconds: 320, speaker: 'Tutor', text: `Asking for deadlines and status updates politely.`, translation: 'Collaboration inquiry.' },
    ],
  },

  // 4. Fluent / Advanced (C1)
  {
    topic: 'culture',
    topicLabel: 'Cultural Immersion',
    level: 'fluent',
    levelLabel: 'C1 Fluent',
    durationCategory: '15min',
    durationFormatted: '15:20',
    durationSeconds: 920,
    xp: 100,
    titleTemplate: (l) => `Cultural Immersion & Family Etiquette in ${l}`,
    subTemplate: (l) => `Weddings, festivals, and hospitality in ${l}`,
    descTemplate: (l) => `An advanced 15-minute immersive dialogue covering traditions and festivals in ${l}.`,
    sampleWords: (_l) => [
      { term: 'Festival', phonetic: 'Habba / Tyohar', meaning: 'Celebration' },
      { term: 'Hospitality', phonetic: 'Aatithya', meaning: 'Welcoming guests' },
      { term: 'Blessing', phonetic: 'Aashirvada', meaning: 'Elder blessing' },
    ],
    transcriptGen: (_l) => [
      { time: '1:00', seconds: 60, speaker: 'Tutor', text: `Entering an Indian family home: greeting elders respectfully.`, translation: 'Family etiquette.' },
      { time: '5:30', seconds: 330, speaker: 'Tutor', text: `Complimenting homemade festive dishes with rich vocabulary.`, translation: 'Culinary praise.' },
      { time: '10:15', seconds: 615, speaker: 'Tutor', text: `Participating in cultural festival conversations and well-wishes.`, translation: 'Festive exchange.' },
      { time: '13:50', seconds: 830, speaker: 'Tutor', text: `Politely saying farewell with traditional parting phrases.`, translation: 'Warm departure.' },
    ],
  },
  {
    topic: 'conversation',
    topicLabel: 'Rapid Native Fluency',
    level: 'fluent',
    levelLabel: 'C1 Fluent',
    durationCategory: '15min',
    durationFormatted: '14:50',
    durationSeconds: 890,
    xp: 100,
    titleTemplate: (l) => `Rapid Native Storytelling & Fluency in ${l}`,
    subTemplate: (l) => `Express complex opinions and humor in ${l}`,
    descTemplate: (l) => `Learn sentence connectors, transition words, and narrative flow in ${l}.`,
    sampleWords: (_l) => [
      { term: 'Story / Tale', phonetic: 'Kathe / Kahaani', meaning: 'Narrative' },
      { term: 'Opinion', phonetic: 'Abhipraya / Raye', meaning: 'Personal view' },
      { term: 'However / But', phonetic: 'Aadare / Lekin', meaning: 'Conjunction' },
    ],
    transcriptGen: (_l) => [
      { time: '1:15', seconds: 75, speaker: 'Tutor', text: `Narrative hooks: how to start a story captively.`, translation: 'Story opening.' },
      { time: '6:40', seconds: 400, speaker: 'Tutor', text: `Using connectors like "because of that", "meanwhile", and "eventually".`, translation: 'Flow connectors.' },
      { time: '11:20', seconds: 680, speaker: 'Tutor', text: `Sharing opinions with nuance, tact, and humor.`, translation: 'Nuanced debate.' },
    ],
  },
];

// Languages to generate the full 100+ curriculum for
const SUPPORTED_LANGUAGES_META = [
  { code: 'kn', name: 'Kannada', instructor: 'Ananya Sharma', avatar: '👩‍🏫', gradient: 'from-amber-500 to-orange-600' },
  { code: 'hi', name: 'Hindi', instructor: 'Kabir Verma', avatar: '🧑‍🏫', gradient: 'from-rose-500 to-red-600' },
  { code: 'ta', name: 'Tamil', instructor: 'Karthik Raja', avatar: '👨‍🏫', gradient: 'from-emerald-600 to-teal-700' },
  { code: 'te', name: 'Telugu', instructor: 'Sravani Rao', avatar: '👩‍💼', gradient: 'from-blue-600 to-indigo-700' },
  { code: 'ml', name: 'Malayalam', instructor: 'Arun Menon', avatar: '👨‍🎨', gradient: 'from-teal-600 to-cyan-700' },
  { code: 'mr', name: 'Marathi', instructor: 'Pooja Kulkarni', avatar: '👩‍🎓', gradient: 'from-purple-600 to-pink-600' },
  { code: 'bn', name: 'Bengali', instructor: 'Sourav Ganguly', avatar: '👨‍💼', gradient: 'from-amber-600 to-yellow-600' },
  { code: 'gu', name: 'Gujarati', instructor: 'Neha Patel', avatar: '👩‍⚕️', gradient: 'from-emerald-500 to-green-600' },
  { code: 'pa', name: 'Punjabi', instructor: 'Harpreet Singh', avatar: '👳‍♂️', gradient: 'from-orange-500 to-amber-600' },
  { code: 'en', name: 'English', instructor: 'Sarah Jenkins', avatar: '👩‍🏫', gradient: 'from-blue-700 to-indigo-800' },
];

const LANGUAGE_YOUTUBE_PLAYLISTS: Record<string, string[]> = {
  kn: ['w2Uf2w8Y0tM', 'zTjS2_iY7sM', '_x1b5N7kQ2s', 'K4w4uE5uU7c', '8H_HhQ0FvE4', '1s4o1bZ5a_c'],
  hi: ['2wXp-K_pZ-4', '9pB4m3hN11A', 'aF4f0w51yQo', 'k74Y_gFrWv8', 'b2C4v9X9a_Y', 'm0N9y8X7q1Z'],
  te: ['4_r-7qU6jVo', 'Q1N7X5V5q8c', '1fT3kS4p0mQ', 'hK9_7qL2v0U', 'p0X4w8Y2v1Q', 'n5M9q2Z7k4P'],
  ta: ['oX2lM2N_8bI', 'p9K8k0v51uM', '9_rP4w01v7Q', '3k_mQ7p2x5Y', 'm8N2x4Z1k7P', 'q9P4y2Z0v5M'],
  ml: ['u4W7q2Z9v1P', 'h7N2x4Z1k7P', 'k9P4y2Z0v5M', 'v8N2x4Z1k7P', 'm4W7q2Z9v1P', 'b9P4y2Z0v5M'],
  es: ['DAp_v7EH9AA', 'b1b5_s2W43E', '1qP4y2Z0v5M', '3_r-7qU6jVo', '8H_HhQ0FvE4', 'w2Uf2w8Y0tM'],
  fr: ['ujDtm0hZyII', 'b2C4v9X9a_Y', 'k74Y_gFrWv8', 'aF4f0w51yQo', 'zTjS2_iY7sM', 'K4w4uE5uU7c'],
  de: ['0w9lP2wP1aI', '9pB4m3hN11A', '2wXp-K_pZ-4', '_x1b5N7kQ2s', '1s4o1bZ5a_c', '8H_HhQ0FvE4'],
  en: ['juKd26qkNAw', '2wXp-K_pZ-4', 'k74Y_gFrWv8', '9pB4m3hN11A', 'aF4f0w51yQo', 'w2Uf2w8Y0tM'],
};

// Build complete 100+ lesson database
export const ALL_VIDEO_LESSONS: VideoLesson[] = [];

let globalIndex = 0;
for (const lang of SUPPORTED_LANGUAGES_META) {
  const langYoutubeList = LANGUAGE_YOUTUBE_PLAYLISTS[lang.code] || LANGUAGE_YOUTUBE_PLAYLISTS['kn'];

  for (const bp of CURRICULUM_BLUEPRINTS) {
    globalIndex++;
    const streamUrl = STREAM_PLAYLIST[globalIndex % STREAM_PLAYLIST.length];
    const youtubeId = langYoutubeList[globalIndex % langYoutubeList.length];

    ALL_VIDEO_LESSONS.push({
      id: `vid-${lang.code}-${bp.level}-${globalIndex}`,
      title: bp.titleTemplate(lang.name),
      subtitle: bp.subTemplate(lang.name),
      description: bp.descTemplate(lang.name),
      durationCategory: bp.durationCategory,
      durationFormatted: bp.durationFormatted,
      durationSeconds: bp.durationSeconds,
      level: bp.level,
      levelLabel: bp.levelLabel,
      languageCode: lang.code,
      languageName: lang.name,
      topic: bp.topic,
      topicLabel: bp.topicLabel,
      instructor: lang.instructor,
      instructorAvatar: lang.avatar,
      xpReward: bp.xp,
      gradient: lang.gradient,
      embedType: 'youtube',
      youtubeId: youtubeId,
      videoUrl: streamUrl,
      transcript: bp.transcriptGen(lang.name),
      keyVocabulary: bp.sampleWords(lang.name),
    });
  }
}
