import { VideoLesson, VideoProficiencyLevel, VideoDurationCategory } from '../types/video.types';

export interface CategoryDefinition {
  id: number;
  title: string;
  icon: string;
  level: VideoProficiencyLevel;
  levelLabel: string;
  topics: string[];
}

export const REAL_LIFE_CATEGORIES: CategoryDefinition[] = [
  {
    id: 1,
    title: 'Basics',
    icon: '🔤',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    topics: [
      'Greetings',
      'Introductions',
      'Alphabet & Pronunciation',
      'Numbers',
      'Colors',
      'Days & Months',
      'Time & Date',
    ],
  },
  {
    id: 2,
    title: 'Family & Relationships',
    icon: '👨‍👩‍👧‍👦',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    topics: ['Family', 'Friends', 'Relatives', 'Marriage', 'Children'],
  },
  {
    id: 3,
    title: 'Home',
    icon: '🏡',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    topics: [
      'At Home',
      'Living Room',
      'Kitchen',
      'Bedroom',
      'Bathroom',
      'Household Chores',
    ],
  },
  {
    id: 4,
    title: 'School & College',
    icon: '🎓',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    topics: [
      'School',
      'Classroom',
      'Teacher',
      'Student',
      'Library',
      'Laboratory',
      'College Campus',
      'Group Discussion',
      'Assignment',
      'Examination',
    ],
  },
  {
    id: 5,
    title: 'Office & Workplace',
    icon: '💼',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    topics: [
      'Office',
      'Job Interview',
      'Meeting',
      'Colleagues',
      'Manager',
      'Presentation',
      'Work From Home',
    ],
  },
  {
    id: 6,
    title: 'Food & Dining',
    icon: '🍲',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    topics: [
      'Restaurant',
      'Cafe',
      'Street Food',
      'Ordering Food',
      'Menu',
      'Paying Bill',
    ],
  },
  {
    id: 7,
    title: 'Shopping',
    icon: '🛍️',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    topics: [
      'Supermarket',
      'Grocery Store',
      'Clothing Store',
      'Electronics Shop',
      'Pharmacy',
      'Bookstore',
      'Shopping Mall',
    ],
  },
  {
    id: 8,
    title: 'Travel & Transportation',
    icon: '🚆',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    topics: [
      'Bus',
      'Train',
      'Metro',
      'Taxi',
      'Airport',
      'Hotel',
      'Tourist Places',
      'Asking for Directions',
    ],
  },
  {
    id: 9,
    title: 'Health',
    icon: '🏥',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    topics: [
      'Hospital',
      'Doctor',
      'Dentist',
      'Pharmacy',
      'Emergency',
      'Fitness',
      'Exercise',
    ],
  },
  {
    id: 10,
    title: 'Banking & Finance',
    icon: '💳',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    topics: [
      'Bank',
      'ATM',
      'UPI',
      'Credit Card',
      'Online Banking',
    ],
  },
  {
    id: 11,
    title: 'Technology',
    icon: '📱',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    topics: [
      'Mobile Phone',
      'Computer',
      'Internet',
      'Social Media',
      'Email',
      'Video Call',
    ],
  },
  {
    id: 12,
    title: 'Public Places',
    icon: '🏛️',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    topics: [
      'Police Station',
      'Post Office',
      'Park',
      'Museum',
      'Cinema',
      'Gym',
    ],
  },
  {
    id: 13,
    title: 'Entertainment',
    icon: '🎬',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    topics: [
      'Movies',
      'Music',
      'Sports',
      'Games',
      'Festivals',
      'Birthday Party',
    ],
  },
  {
    id: 14,
    title: 'Daily Life',
    icon: '☀️',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    topics: [
      'Morning Routine',
      'Evening Routine',
      'Weekend Plans',
      'Weather',
      'Hobbies',
    ],
  },
  {
    id: 15,
    title: 'Communication',
    icon: '💬',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    topics: [
      'Phone Call',
      'Video Call',
      'Asking Questions',
      'Giving Directions',
      'Making Requests',
      'Giving Opinions',
      'Invitations',
      'Apologies',
      'Thank You',
    ],
  },
  {
    id: 16,
    title: 'Business',
    icon: '📊',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    topics: [
      'Customer Service',
      'Sales',
      'Negotiation',
      'Business Meeting',
      'Presentation',
    ],
  },
  {
    id: 17,
    title: 'Emergency',
    icon: '🚨',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    topics: [
      'Accident',
      'Fire',
      'Lost Item',
      'Calling for Help',
      'Police Complaint',
    ],
  },
  {
    id: 18,
    title: 'Culture',
    icon: '🪔',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    topics: [
      'Traditions',
      'Festivals',
      'Customs',
      'Local Food',
      'Travel Experiences',
    ],
  },
  {
    id: 19,
    title: 'Advanced Conversations',
    icon: '🧠',
    level: 'fluent',
    levelLabel: 'C1 Fluent',
    topics: [
      'News Discussion',
      'Education',
      'Environment',
      'Technology',
      'Politics',
      'Economy',
      'Healthcare',
      'Artificial Intelligence',
      'Entrepreneurship',
    ],
  },
  {
    id: 20,
    title: 'Social Situations',
    icon: '🤝',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    topics: [
      'Making Friends',
      'Networking',
      'Small Talk',
      'Compliments',
      'Conflict Resolution',
      'Farewell',
    ],
  },
];

// Supported Language Instructors & Colors
export const SUPPORTED_LANGUAGES_META = [
  { code: 'kn', name: 'Kannada', instructor: 'Teacher Ananya Sharma', avatar: '👩‍🏫', gradient: 'from-amber-500 to-orange-600' },
  { code: 'te', name: 'Telugu', instructor: 'Teacher Sravani Rao', avatar: '👩‍💼', gradient: 'from-blue-600 to-indigo-700' },
  { code: 'hi', name: 'Hindi', instructor: 'Prof. Kabir Verma', avatar: '🧑‍🏫', gradient: 'from-rose-500 to-red-600' },
  { code: 'ta', name: 'Tamil', instructor: 'Teacher Karthik Raja', avatar: '👨‍🏫', gradient: 'from-emerald-600 to-teal-700' },
  { code: 'en', name: 'English', instructor: 'Teacher Sarah Jenkins', avatar: '👩‍🏫', gradient: 'from-blue-700 to-indigo-800' },
  { code: 'ml', name: 'Malayalam', instructor: 'Prof. Arun Menon', avatar: '👨‍🎨', gradient: 'from-teal-600 to-cyan-700' },
  { code: 'mr', name: 'Marathi', instructor: 'Teacher Pooja Kulkarni', avatar: '👩‍🎓', gradient: 'from-purple-600 to-pink-600' },
  { code: 'bn', name: 'Bengali', instructor: 'Prof. Sourav Ganguly', avatar: '👨‍💼', gradient: 'from-amber-600 to-yellow-600' },
  { code: 'gu', name: 'Gujarati', instructor: 'Teacher Neha Patel', avatar: '👩‍⚕️', gradient: 'from-emerald-500 to-green-600' },
  { code: 'pa', name: 'Punjabi', instructor: 'Prof. Harpreet Singh', avatar: '👳‍♂️', gradient: 'from-orange-500 to-amber-600' },
];

/**
 * Generates situational sentences for any real-life topic across all languages
 */
function generateSituationalSentences(
  topic: string,
  category: string,
  langCode: string,
  langName: string
): { time: string; seconds: number; speaker: string; text: string; translation: string }[] {
  // Telugu contextual dialogues
  if (langCode === 'te') {
    return [
      { time: '0:05', seconds: 5, speaker: 'Teacher', text: `స్వాగతం! ఈ రోజు మనం "${topic}" (${category}) గురించి తెలుగులో మాట్లాడటం నేర్చుకుందాం.`, translation: `Welcome! Today we master the "${topic}" situation in Telugu.` },
      { time: '0:25', seconds: 25, speaker: 'Teacher', text: `ఈ సందర్భంలో ఎదుటివారిని మర్యాదగా పలకరించడం చాలా ముఖ్యం: "నమస్కారం అండి!".`, translation: 'Polite situational opening: "Namaskaram andi!".' },
      { time: '0:45', seconds: 45, speaker: 'Teacher', text: `మీ అవసరాన్ని స్పష్టంగా మరియు సూటిగా అడగండి: "దయచేసి నాకు ఈ విషయం గురించి చెప్పండి".`, translation: 'Stating your request clearly and politely.' },
      { time: '1:05', seconds: 65, speaker: 'Teacher', text: `వివరాలు లేదా సందేహాలు నివృత్తి చేసుకోండి: "దీనికి ఎంత సమయం లేదా ఖర్చు అవుతుంది?".`, translation: 'Asking key clarification questions.' },
      { time: '1:25', seconds: 85, speaker: 'Teacher', text: `అవతలి వ్యక్తి చెప్పే సమాధానాన్ని శ్రద్ధగా విని: "సరేనండి, అర్థమైంది" అని సమాధానం ఇవ్వండి.`, translation: 'Active listening and acknowledging.' },
      { time: '1:45', seconds: 105, speaker: 'Teacher', text: `ముగింపులో హృదయపూర్వక కృతజ్ఞత తెలపండి: "మీ సహాయానికి చాలా ధన్యవాదాలు!".`, translation: 'Expressing warm gratitude.' },
      { time: '2:05', seconds: 125, speaker: 'Teacher', text: `వీడ్కోలు పలుకుతూ: "మళ్ళీ కలుద్దాం, మంచి రోజు అవ్వాలని కోరుకుంటున్నాను!".`, translation: 'Polite leave-taking phrase.' },
      { time: '2:25', seconds: 145, speaker: 'Teacher', text: `అద్భుతం! మీరు తెలుగులో "${topic}" సంభాషణను విజయవంతంగా నేర్చుకున్నారు.`, translation: 'Topic mastery recap and congratulations.' },
    ];
  }

  // Kannada contextual dialogues
  if (langCode === 'kn') {
    return [
      { time: '0:05', seconds: 5, speaker: 'Teacher', text: `ಸ್ವಾಗತ! ಇಂದು ನಾವು "${topic}" (${category}) ಸಂದರ್ಭದ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಕಲಿಯೋಣ.`, translation: `Welcome! Today we master the "${topic}" situation in Kannada.` },
      { time: '0:25', seconds: 25, speaker: 'Teacher', text: `ಈ ಸನ್ನಿವೇಶದಲ್ಲಿ ಜನರನ್ನು ಮರ್ಯಾದೆಯಿಂದ ಸ್ವಾಗತಿಸಿ: "ನಮಸ್ಕಾರ ಸರ್ / ಮೇಡಂ!".`, translation: 'Polite situational opening: "Namaskara sir / madam!".' },
      { time: '0:45', seconds: 45, speaker: 'Teacher', text: `ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ: "ದಯವಿಟ್ಟು ನನಗೆ ಈ ಬಗ್ಗೆ ಸ್ವಲ್ಪ ಮಾಹಿತಿ ನೀಡಿ".`, translation: 'Expressing your situational request clearly.' },
      { time: '1:05', seconds: 65, speaker: 'Teacher', text: `ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ: "ಇದಕ್ಕೆ ಎಷ್ಟು ಸಮಯ ಅಥವಾ ವೆಚ್ಚವಾಗುತ್ತದೆ?".`, translation: 'Inquiring about details, timing, or cost.' },
      { time: '1:25', seconds: 85, speaker: 'Teacher', text: `ಉತ್ತರವನ್ನು ದೃಢೀಕರಿಸಿ: "ಸರಿ, ನನಗೆ ಚೆನ್ನಾಗಿ ಅರ್ಥವಾಯಿತು".`, translation: 'Confirming understanding politely.' },
      { time: '1:45', seconds: 105, speaker: 'Teacher', text: `ಸಹಾಯಕ್ಕಾಗಿ ಕೃತಜ್ಞತೆ ಸಲ್ಲಿಸಿ: "ನಿಮ್ಮ ಉಪಯುಕ್ತ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು!".`, translation: 'Offering sincere gratitude.' },
      { time: '2:05', seconds: 125, speaker: 'Teacher', text: `ವಿದಾಯ ಹೇಳುವಾಗ: "ಮತ್ತೆ ಸಿಗೋಣ, ನಿಮ್ಮ ದಿನ ಶುಭವಾಗಿರಲಿ!".`, translation: 'Polite departure well-wishes.' },
      { time: '2:25', seconds: 145, speaker: 'Teacher', text: `ಅದ್ಭುತ ಸಾಧನೆ! ನೀವು ಕನ್ನಡದಲ್ಲಿ "${topic}" ಮಾಸ್ಟರ್‌ಕ್ಲಾಸ್ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.`, translation: 'Topic mastery complete.' },
    ];
  }

  // Hindi contextual dialogues
  if (langCode === 'hi') {
    return [
      { time: '0:05', seconds: 5, speaker: 'Teacher', text: `नमस्ते! आज हम "${topic}" (${category}) विषय पर हिंदी में बातचीत सीखेंगे।`, translation: `Welcome! Today we master the "${topic}" conversation in Hindi.` },
      { time: '0:25', seconds: 25, speaker: 'Teacher', text: `इस परिस्थिति में बातचीत की शुरुआत आदरपूर्वक करें: "नमस्ते जी, क्या मैं कुछ पूछ सकता हूँ?".`, translation: 'Polite greeting opener in Hindi.' },
      { time: '0:45', seconds: 45, speaker: 'Teacher', text: `अपनी आवश्यकता साफ़ शब्दों में रखें: "कृपया मुझे इस बारे में मार्गदर्शन दें".`, translation: 'State your requirement clearly.' },
      { time: '1:05', seconds: 65, speaker: 'Teacher', text: `ज़रूरी सवाल पूछें: "इसमें कितना समय और क्या प्रक्रिया होगी?".`, translation: 'Asking about duration and process.' },
      { time: '1:25', seconds: 85, speaker: 'Teacher', text: `समझने के बाद कहें: "जी बिल्कुल, मुझे अच्छी तरह समझ आ गया".`, translation: 'Confirming comprehension.' },
      { time: '1:45', seconds: 105, speaker: 'Teacher', text: `आभार प्रकट करें: "आपकी सहायता के लिए बहुत-बहुत धन्यवाद!".`, translation: 'Expressing heartfelt thanks.' },
      { time: '2:05', seconds: 125, speaker: 'Teacher', text: `विदा लेते हुए कहें: "फिर मिलेंगे, आपका दिन शुभ हो!".`, translation: 'Polite departure farewell.' },
      { time: '2:25', seconds: 145, speaker: 'Teacher', text: `शानदार! आपने हिंदी में "${topic}" पर अभ्यास सफलतापूर्वक पूरा कर लिया है।`, translation: 'Mastery congratulations.' },
    ];
  }

  // Default English / General dialogues
  return [
    { time: '0:05', seconds: 5, speaker: 'Teacher', text: `Welcome! Today we master real-life conversation for "${topic}" in ${langName}.`, translation: `Real-life situation: ${topic} in ${category}.` },
    { time: '0:25', seconds: 25, speaker: 'Teacher', text: `Step 1: Greet the other person with appropriate situational etiquette and warmth.`, translation: 'Warm situational opening.' },
    { time: '0:45', seconds: 45, speaker: 'Teacher', text: `Step 2: Clearly state your purpose or question without hesitation.`, translation: 'Stating purpose with clarity.' },
    { time: '1:05', seconds: 65, speaker: 'Teacher', text: `Step 3: Listen attentively to their reply and confirm key details.`, translation: 'Active listening and verification.' },
    { time: '1:25', seconds: 85, speaker: 'Teacher', text: `Step 4: Use polite conversational fillers to keep dialogue fluid and natural.`, translation: 'Natural conversational flow.' },
    { time: '1:45', seconds: 105, speaker: 'Teacher', text: `Step 5: Express heartfelt appreciation for their time and assistance.`, translation: 'Expressing appreciation.' },
    { time: '2:05', seconds: 125, speaker: 'Teacher', text: `Step 6: Conclude with a graceful departure and well wishes.`, translation: 'Polite closing statement.' },
    { time: '2:25', seconds: 145, speaker: 'Teacher', text: `Outstanding! You are fully equipped for "${topic}" conversations in ${langName}.`, translation: 'Lesson completion review.' },
  ];
}

/**
 * Generates sample key vocabulary for any topic
 */
function generateKeyVocabulary(topic: string, langName: string) {
  return [
    { term: `${topic} Opening`, phonetic: 'Polite greeting', meaning: `How to start a conversation in ${topic}` },
    { term: 'Key Request Phrase', phonetic: 'Core question', meaning: `Essential question asked during ${topic}` },
    { term: 'Polite Conclusion', phonetic: 'Thank you & bye', meaning: `Respectful leave-taking in ${langName}` },
  ];
}

// Complete 130 Real-Life Conversation Topic Database
export const ALL_VIDEO_LESSONS: VideoLesson[] = [];

let videoIdCounter = 0;

for (const lang of SUPPORTED_LANGUAGES_META) {
  for (const cat of REAL_LIFE_CATEGORIES) {
    for (const topic of cat.topics) {
      videoIdCounter++;

      const durationCat: VideoDurationCategory =
        cat.level === 'beginner'
          ? '2min'
          : cat.level === 'elementary'
            ? '5min'
            : cat.level === 'intermediate'
              ? '10min'
              : '15min';

      const durationFormatted =
        durationCat === '2min' ? '2:40' : durationCat === '5min' ? '5:10' : durationCat === '10min' ? '10:20' : '15:30';

      const durationSec =
        durationCat === '2min' ? 160 : durationCat === '5min' ? 310 : durationCat === '10min' ? 620 : 930;

      const xp =
        cat.level === 'beginner' ? 25 : cat.level === 'elementary' ? 45 : cat.level === 'intermediate' ? 65 : 100;

      ALL_VIDEO_LESSONS.push({
        id: `vid-${lang.code}-cat${cat.id}-${videoIdCounter}`,
        title: `${topic} Conversation in ${lang.name}`,
        subtitle: `Real-life ${cat.title} speaking situation in ${lang.name}`,
        description: `Master everyday ${topic.toLowerCase()} vocabulary, common sentences, and natural dialogues in ${lang.name}.`,
        durationCategory: durationCat,
        durationFormatted: durationFormatted,
        durationSeconds: durationSec,
        level: cat.level,
        levelLabel: cat.levelLabel,
        languageCode: lang.code,
        languageName: lang.name,
        categoryId: cat.id,
        categoryTitle: cat.title,
        categoryIcon: cat.icon,
        topic: topic.toLowerCase().replace(/\s+/g, '-'),
        topicLabel: topic,
        instructor: lang.instructor,
        instructorAvatar: lang.avatar,
        xpReward: xp,
        gradient: lang.gradient,
        embedType: 'native',
        transcript: generateSituationalSentences(topic, cat.title, lang.code, lang.name),
        keyVocabulary: generateKeyVocabulary(topic, lang.name),
      });
    }
  }
}
