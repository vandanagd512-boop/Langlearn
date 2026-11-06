import { VideoLesson, VideoDurationCategory, VideoProficiencyLevel, VideoTopic } from '../types/video.types';

// Language metadata configuration
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

interface BlueprintDef {
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
  sampleWords: (langCode: string, langName: string) => { term: string; phonetic: string; meaning: string }[];
  transcriptGen: (langCode: string, langName: string) => { time: string; seconds: number; speaker: string; text: string; translation: string }[];
}

export const CURRICULUM_BLUEPRINTS: BlueprintDef[] = [
  // 1. Beginner (A1) - Alphabet & Sound Foundations
  {
    topic: 'alphabet',
    topicLabel: 'Alphabet & Script',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    durationCategory: '2min',
    durationFormatted: '2:40',
    durationSeconds: 160,
    xp: 25,
    titleTemplate: (l) => `${l} Alphabet & Sound Foundations`,
    subTemplate: (l) => `Master ${l} vowels and basic phonetics in 2 minutes`,
    descTemplate: (l) => `Learn mouth positioning, vowel lengths, and primary acoustic tones in ${l}.`,
    sampleWords: (code, _l) => {
      if (code === 'kn') return [
        { term: 'ಅ, ಆ', phonetic: 'A, Aa', meaning: 'Primary Vowels (Svara)' },
        { term: 'ಕ, ಖ', phonetic: 'Ka, Kha', meaning: 'Base Consonants (Vyanjana)' },
        { term: 'ಅಕ್ಷರ', phonetic: 'Akshara', meaning: 'Character / Syllable' },
      ];
      if (code === 'te') return [
        { term: 'అ, ఆ', phonetic: 'A, Aa', meaning: 'Primary Vowels (Acchulu)' },
        { term: 'క, ఖ', phonetic: 'Ka, Kha', meaning: 'Base Consonants (Hallulu)' },
        { term: 'అక్షరము', phonetic: 'Aksharamu', meaning: 'Character / Syllable' },
      ];
      if (code === 'hi') return [
        { term: 'अ, आ', phonetic: 'A, Aa', meaning: 'Primary Vowels (Swar)' },
        { term: 'क, ख', phonetic: 'Ka, Kha', meaning: 'Base Consonants (Vyanjan)' },
        { term: 'वर्ण', phonetic: 'Varna', meaning: 'Letter / Syllable' },
      ];
      return [
        { term: 'A, E, I, O, U', phonetic: 'Vowels', meaning: 'Primary sound carriers' },
        { term: 'B, C, D, F...', phonetic: 'Consonants', meaning: 'Base consonant sounds' },
        { term: 'Phonics', phonetic: 'Fon-iks', meaning: 'Acoustic sound mapping' },
      ];
    },
    transcriptGen: (code, lang) => {
      if (code === 'kn') {
        return [
          { time: '0:05', seconds: 5, speaker: 'Teacher', text: 'ಸ್ವಾಗತ! ಇಂದು ನಾವು ಕನ್ನಡ ವರ್ಣಮಾಲೆಯ ಮೂಲ ಸ್ವರಗಳು ಮತ್ತು ಉಚ್ಚಾರಣೆಯನ್ನು ಕಲಿಯೋಣ.', translation: 'Welcome! Today we master the Kannada alphabet and acoustic sounds.' },
          { time: '0:25', seconds: 25, speaker: 'Teacher', text: 'ಕನ್ನಡದಲ್ಲಿ ಸ್ವರಗಳನ್ನು "ಸ್ವರಗಳು" ಎಂದು ಕರೆಯುತ್ತಾರೆ, ಪ್ರಾರಂಭಿಕ ಸ್ವರಗಳು "ಅ" ಮತ್ತು "ಆ".', translation: 'Kannada vowels are called Svaragalu, starting with "A" and "Aa".' },
          { time: '0:45', seconds: 45, speaker: 'Teacher', text: 'ಉಚ್ಚಾರಣೆಯ ಅವಧಿಯನ್ನು ಗಮನಿಸಿ: "ಅ" ಹ್ರಸ್ವ ಸ್ವರ, ಆದರೆ "ಆ" ಧ್ವನಿಯನ್ನು ದೀರ್ಘವಾಗಿ ಎಳೆಯಿರಿ.', translation: 'Notice vowel duration: "A" is short breath, while "Aa" is extended.' },
          { time: '1:05', seconds: 65, speaker: 'Teacher', text: 'ಮುಂದೆ ಬರುವ ವ್ಯಂಜನಗಳನ್ನು ನೋಡಿ: "ಕ", "ಖ", "ಗ", "ಘ", "ಙ".', translation: 'Observe base consonants: Ka, Kha, Ga, Gha, Nga.' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'ಸ್ವರ ಮತ್ತು ವ್ಯಂಜನ ಸೇರಿದಾಗ ಗುಣಿತಾಕ್ಷರಗಳು ಅಥವಾ ಕಾಗುಣಿತ ರಚನೆಯಾಗುತ್ತದೆ.', translation: 'Consonants combine with vowel signs to form compound syllables.' },
          { time: '1:45', seconds: 105, speaker: 'Teacher', text: 'ಮೃದು ಶಬ್ದಗಳಿಗಾಗಿ ನಾಲಿಗೆಯನ್ನು ಮೇಲಿನ ಹಲ್ಲುಗಳ ಹಿಂದೆ ಇರಿಸಿ ಸ್ಪಷ್ಟವಾಗಿ ಉಚ್ಚರಿಸಿ.', translation: 'Place tongue behind upper teeth for soft, clear dental tones.' },
          { time: '2:05', seconds: 125, speaker: 'Teacher', text: 'ಪ್ರತಿಯೊಂದು ಅಕ್ಷರವನ್ನು ಬರೆಯುತ್ತಾ ಮೂರು ಬಾರಿ ಗಟ್ಟಿಯಾಗಿ ಉಚ್ಚರಿಸಿ ಅಭ್ಯಾಸ ಮಾಡಿ.', translation: 'Write each character three times while speaking it aloud.' },
          { time: '2:25', seconds: 145, speaker: 'Teacher', text: 'ಅದ್ಭುತ ಸಾಧನೆ! ನೀವು ಕನ್ನಡ ಧ್ವನಿಗಳ ಮೂಲಭೂತ ಪಾಠವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮುಗಿಸಿದ್ದೀರಿ.', translation: 'Fantastic achievement! You have mastered Kannada phonetic fundamentals.' },
        ];
      }
      if (code === 'te') {
        return [
          { time: '0:05', seconds: 5, speaker: 'Teacher', text: 'స్వాగతం! ఈ రోజు మనం తెలుగు వర్ణమాల మరియు ఉచ్చారణ పద్ధతిని నేర్చుకుందాం.', translation: 'Welcome! Today we master the Telugu alphabet and script phonetics.' },
          { time: '0:25', seconds: 25, speaker: 'Teacher', text: 'తెలుగులో ప్రాథమిక స్వరాలను "అచ్చులు" అంటారు: మొదటివి "అ" మరియు "ఆ".', translation: 'In Telugu, primary vowels are Acchulu: starting with "A" and "Aa".' },
          { time: '0:45', seconds: 45, speaker: 'Teacher', text: 'ధ్వని వ్యవధిని గమనించండి: "అ" సూక్ష్మ శబ్దం, "ఆ" సాగదీసి మధురంగా పలకాలి.', translation: 'Notice the acoustic tone: "A" is brief, while "Aa" is melodiously elongated.' },
          { time: '1:05', seconds: 65, speaker: 'Teacher', text: 'తరువాత హల్లులు ప్రారంభమవుతాయి: "క", "ఖ", "గ", "ఘ".', translation: 'Next come the consonants (Hallulu): Ka, Kha, Ga, Gha.' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'అచ్చులు మరియు హల్లులు కలిసి అందమైన గుణింతాలుగా ఏర్పడతాయి.', translation: 'Vowels join consonants to form beautiful Telugu syllables (Guninthalu).' },
          { time: '1:45', seconds: 105, speaker: 'Teacher', text: 'తెలుగు అక్షరాల గుండ్రటి వంపులను పెన్ ఎత్తకుండా ప్రశాంతంగా రాయండి.', translation: 'Draw the circular aesthetic loops smoothly without lifting your pen.' },
          { time: '2:05', seconds: 125, speaker: 'Teacher', text: 'ప్రతి అక్షరాన్ని చూస్తూ గట్టిగా మూడుసార్లు పలకడం ద్వారా జ్ఞాపకశక్తి పెరుగుతుంది.', translation: 'Say each character aloud three times to build natural fluency.' },
          { time: '2:25', seconds: 145, speaker: 'Teacher', text: 'అద్భుతం! మీరు తెలుగు వర్ణమాల ప్రాథమిక పాఠాన్ని విజయవంతంగా పూర్తి చేశారు.', translation: 'Wonderful! You have successfully mastered Telugu alphabet fundamentals.' },
        ];
      }
      if (code === 'hi') {
        return [
          { time: '0:05', seconds: 5, speaker: 'Teacher', text: 'नमस्ते! आज हम हिंदी देवनागरी वर्णमाला और सही उच्चारण सीखेंगे।', translation: 'Welcome! Today we master Devanagari Hindi alphabet and sounds.' },
          { time: '0:25', seconds: 25, speaker: 'Teacher', text: 'हिंदी में स्वरों को "स्वर" कहा जाता है, जैसे "अ" और "आ"।', translation: 'In Hindi, vowels are Swar: starting with "A" and "Aa".' },
          { time: '0:45', seconds: 45, speaker: 'Teacher', text: 'उच्चारण का समय ध्यान दें: "अ" को हल्के से बोलें, और "आ" को खोलकर लम्बा खींचें।', translation: 'Observe vowel timing: short "A" vs elongated open "Aa".' },
          { time: '1:05', seconds: 65, speaker: 'Teacher', text: 'इसके बाद व्यंजन आते हैं: "क", "ख", "ग", "घ"।', translation: 'Next are the consonants (Vyanjan): Ka, Kha, Ga, Gha.' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'व्यंजनों के साथ मात्राएँ जुड़कर पूरे शब्द और वाक्य बनाती हैं।', translation: 'Vowel matras attach to consonants to form complete words.' },
          { time: '1:45', seconds: 105, speaker: 'Teacher', text: 'अक्षरों के ऊपर की क्षैतिज रेखा को "शिरोरेखा" कहते हैं, इसे सीधा खींचें।', translation: 'The top line joining letters is called Shirorekha: draw it evenly.' },
          { time: '2:05', seconds: 125, speaker: 'Teacher', text: 'हर अक्षर को अपनी नोटबुक में लिखें और ज़ोर से उच्चारण करें।', translation: 'Write each letter in your notebook and pronounce aloud.' },
          { time: '2:25', seconds: 145, speaker: 'Teacher', text: 'बहुत बढ़िया! आपने हिंदी वर्णमाला की नींव पूरी कर ली है।', translation: 'Excellent! You have successfully completed Hindi phonetics.' },
        ];
      }
      return [
        { time: '0:05', seconds: 5, speaker: 'Teacher', text: `Welcome to the foundational ${lang} alphabet and phonetic script masterclass.`, translation: `Welcome to the foundational ${lang} alphabet masterclass.` },
        { time: '0:25', seconds: 25, speaker: 'Teacher', text: `First, let us examine the fundamental vowels and their short acoustic duration.`, translation: 'Observe how short vowels are pronounced with a single breath.' },
        { time: '0:45', seconds: 45, speaker: 'Teacher', text: `Now notice the difference in long vowels: stretch the tone gently without straining.`, translation: 'Notice vowel duration: short breath vs long breath.' },
        { time: '1:05', seconds: 65, speaker: 'Teacher', text: `Next, we introduce base consonants and how they combine naturally with vowels.`, translation: 'Consonants attach to vowel signs to create full syllables.' },
        { time: '1:25', seconds: 85, speaker: 'Teacher', text: `Pay close attention to tongue placement behind your upper teeth for soft sounds.`, translation: 'Mouth and tongue positioning for clean acoustic tones.' },
        { time: '1:45', seconds: 105, speaker: 'Teacher', text: `Practice writing each character three times while pronouncing its sound aloud.`, translation: 'Writing and vocalizing solidifies visual memory.' },
        { time: '2:05', seconds: 125, speaker: 'Teacher', text: `Review the compound syllables and pronounce each one with rhythmic confidence.`, translation: 'Rhythmic pronunciation practice.' },
        { time: '2:25', seconds: 145, speaker: 'Teacher', text: `Fantastic job! You have conquered the sound foundation exercises for ${lang}.`, translation: 'Lesson review and congratulations.' },
      ];
    },
  },

  // 2. Beginner (A1) - Daily Polite Greetings
  {
    topic: 'conversation',
    topicLabel: 'Daily Greetings',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    durationCategory: '2min',
    durationFormatted: '2:50',
    durationSeconds: 170,
    xp: 25,
    titleTemplate: (l) => `Saying Hello, Welcome & Goodbye in ${l}`,
    subTemplate: (l) => `Everyday polite social greetings in ${l}`,
    descTemplate: (l) => `Sound natural and polite when meeting locals and friends in ${l}.`,
    sampleWords: (code, _l) => {
      if (code === 'kn') return [
        { term: 'ನಮಸ್ಕಾರ', phonetic: 'Namaskāra', meaning: 'Hello / Salutations' },
        { term: 'ಸುಸ್ವಾಗತ', phonetic: 'Suswāgatha', meaning: 'Hearty Welcome' },
        { term: 'ಧನ್ಯವಾದಗಳು', phonetic: 'Dhanyavādagalu', meaning: 'Thank you' },
      ];
      if (code === 'te') return [
        { term: 'నమస్కారం', phonetic: 'Namaskāram', meaning: 'Hello / Salutations' },
        { term: 'స్వాగతం', phonetic: 'Swāgatham', meaning: 'Warm Welcome' },
        { term: 'ధన్యవాదాలు', phonetic: 'Dhanyavādālu', meaning: 'Thank you' },
      ];
      if (code === 'hi') return [
        { term: 'नमस्ते', phonetic: 'Namaste', meaning: 'Hello / Respectful Greeting' },
        { term: 'स्वागत है', phonetic: 'Swagat hai', meaning: 'Welcome' },
        { term: 'धन्यवाद', phonetic: 'Dhanyavaad', meaning: 'Thank you' },
      ];
      return [
        { term: 'Hello / Good morning', phonetic: 'He-lo', meaning: 'Standard polite greeting' },
        { term: 'Welcome', phonetic: 'Wel-kum', meaning: 'Friendly reception' },
        { term: 'Thank you', phonetic: 'Thank yoo', meaning: 'Expression of gratitude' },
      ];
    },
    transcriptGen: (code, lang) => {
      if (code === 'kn') {
        return [
          { time: '0:05', seconds: 5, speaker: 'Teacher', text: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಜನರನ್ನು ನಗುಮುಖದಿಂದ ಗೌರವಪೂರ್ವಕವಾಗಿ ಸ್ವಾಗತಿಸುವುದು ಸಂಸ್ಕೃತಿಯ ಪ್ರಮುಖ ಅಂಗ.', translation: 'Greeting people with a smile and respect is central to culture.' },
          { time: '0:25', seconds: 25, speaker: 'Teacher', text: 'ನಮ್ಮ ಪವಿತ್ರ ಮತ್ತು ಸಾರ್ವತ್ರಿಕ ಶುಭಾಶಯ: "ನಮಸ್ಕಾರ" (Namaskāra).', translation: 'Our universal greeting is Namaskāra (Hello & Respect).' },
          { time: '0:45', seconds: 45, speaker: 'Teacher', text: 'ಬೆಳಗಿನ ಸಮಯದಲ್ಲಿ ಹಿರಿಯರಿಗೆ "ಶುಭೋದಯ" (Shubhodaya) - ಅಂದರೆ ಶುಭೋದಯ ಎಂದು ಶುಭ ಹಾರೈಸಿ.', translation: 'In the morning, greet people with Shubhodaya (Good morning).' },
          { time: '1:05', seconds: 65, speaker: 'Teacher', text: 'ನಿಮ್ಮ ಮನೆ ಅಥವಾ ಕಚೇರಿಗೆ ಅತಿಥಿಗಳು ಬಂದಾಗ ಪ್ರೀತಿಯಿಂದ "ಸುಸ್ವಾಗತ" (Suswāgatha) ಎನ್ನಿ.', translation: 'When welcoming guests, warmly say Suswāgatha (Welcome).' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'ಅವರ ಕ್ಷೇಮ ಸಮಾಚಾರ ವಿಚಾರಿಸಲು: "ನೀವು ಹೇಗಿದ್ದೀರಿ?" (Neevu hegiddiri?) ಎಂದು ಕೇಳಿ.', translation: 'Inquire politely about their health: Neevu hegiddiri? (How are you?).' },
          { time: '1:45', seconds: 105, speaker: 'Teacher', text: 'ಉತ್ತರಿಸಲು: "ನಾನು ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು!" (Naanu chennagiddene).', translation: 'Reply: Naanu tumba chennagiddene, dhanyavadagalu (I am doing very well!).' },
          { time: '2:05', seconds: 125, speaker: 'Teacher', text: 'ಕೃತಜ್ಞತೆ ಸಲ್ಲಿಸಲು ಸದಾ "ಧನ್ಯವಾದಗಳು" (Dhanyavādagalu) ಎಂದು ಹೇಳಿ.', translation: 'To express sincere gratitude, always say Dhanyavādagalu (Thank you).' },
          { time: '2:25', seconds: 145, speaker: 'Teacher', text: 'ವಿದಾಯ ಹೇಳುವಾಗ "ಮತ್ತೆ ಸಿಗೋಣ" (Matte sigona) - ಮತ್ತೆ ಭೇಟಿಯಾಗೋಣ ಎನ್ನಿ.', translation: 'When taking leave, say Matte sigona (See you again soon!).' },
        ];
      }
      if (code === 'te') {
        return [
          { time: '0:05', seconds: 5, speaker: 'Teacher', text: 'తెలుగు సంస్కృతిలో ఎదుటివారిని ఆప్యాయంగా మరియు మర్యాదగా పలకరించడం చాలా ముఖ్యం.', translation: 'In Telugu culture, greeting people with warmth and respect is essential.' },
          { time: '0:25', seconds: 25, speaker: 'Teacher', text: 'మన సంప్రదాయ పలకరింపు: "నమస్కారం" (Namaskāram). నాతో పాటు పలకండి!', translation: 'Our traditional greeting is Namaskāram. Repeat after me!' },
          { time: '0:45', seconds: 45, speaker: 'Teacher', text: 'ఉదయం వేళల్లో గౌరవంగా "శుభోదయం" (Shubhodhayam) - గుడ్ మార్నింగ్ అని చెప్పండి.', translation: 'In the morning, politely say Shubhodhayam (Good morning).' },
          { time: '1:05', seconds: 65, speaker: 'Teacher', text: 'ఇంటికి వచ్చే అతిథులను మనస్ఫూర్తిగా "స్వాగతం" (Swāgatham) అని ఆహ్వానించండి.', translation: 'Welcome guests into your home warmly with Swāgatham.' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'ఎదుటివారి యోగక్షేమాలు అడగడానికి: "మీరు ఎలా ఉన్నారు?" (Meeru ela unnaru?).', translation: 'To ask how someone is doing: Meeru ela unnaru? (How are you?).' },
          { time: '1:45', seconds: 105, speaker: 'Teacher', text: 'సమాధానం ఇవ్వడానికి: "నేను బాగున్నాను, ధన్యవాదాలు" అని చెప్పండి.', translation: 'To reply: Nenu bagunnanu, dhanyavadalu (I am doing well, thank you).' },
          { time: '2:05', seconds: 125, speaker: 'Teacher', text: 'కృతజ్ఞత తెలపడానికి ఎల్లప్పుడూ "ధన్యవాదాలు" (Dhanyavādālu) ఉపయోగించండి.', translation: 'To express thanks, always say Dhanyavādālu (Thank you).' },
          { time: '2:25', seconds: 145, speaker: 'Teacher', text: 'వెళ్ళివస్తానని చెప్పేటప్పుడు "మళ్ళీ కలుద్దాం" (Mallee kaluddham) అని వీడ్కోలు పలకండి.', translation: 'When leaving, say Mallee kaluddham (Let us meet again!).' },
        ];
      }
      if (code === 'hi') {
        return [
          { time: '0:05', seconds: 5, speaker: 'Teacher', text: 'हिंदी में हाथ जोड़कर मुस्कुराते हुए अभिवादन करना हमारी परंपरा की पहचान है।', translation: 'Greeting with folded hands and a smile is the hallmark of Indian etiquette.' },
          { time: '0:25', seconds: 25, speaker: 'Teacher', text: 'सबसे लोकप्रिय और आदरणीय शब्द है: "नमस्ते" (Namaste) या "नमस्कार"।', translation: 'The most popular respectful word is Namaste or Namaskar.' },
          { time: '0:45', seconds: 45, speaker: 'Teacher', text: 'सुबह के समय आदर से "शुभ प्रभात" (Shubh Prabhat) कहें।', translation: 'In the morning, respectfully say Shubh Prabhat (Good morning).' },
          { time: '1:05', seconds: 65, speaker: 'Teacher', text: 'अतिथियों का स्वागत करने के लिए कहें: "आपका स्वागत है" (Aapka swagat hai)।', translation: 'To welcome guests warmly, say Aapka swagat hai (Welcome).' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'कुशल-मंगल पूछने के लिए कहें: "आप कैसे हैं?" (Aap kaise hain?).', translation: 'To inquire about their health: Aap kaise hain? (How are you?).' },
          { time: '1:45', seconds: 105, speaker: 'Teacher', text: 'उत्तर देने के लिए: "मैं बहुत अच्छा हूँ, धन्यवाद!" (Main achha hoon).', translation: 'To reply: Main bahut achha hoon, dhanyavaad (I am doing very well!).' },
          { time: '2:05', seconds: 125, speaker: 'Teacher', text: 'आभार प्रकट करने के लिए कहें: "धन्यवाद" (Dhanyavaad) या "शुक्रिया"।', translation: 'To express gratitude, say Dhanyavaad or Shukriya (Thank you).' },
          { time: '2:25', seconds: 145, speaker: 'Teacher', text: 'विदा लेते समय कहें: "फिर मिलेंगे" (Phir milenge) - यानी जल्द मिलेंगे।', translation: 'When leaving, say Phir milenge (See you again soon!).' },
        ];
      }
      return [
        { time: '0:05', seconds: 5, speaker: 'Teacher', text: `In ${lang} culture, greeting people with warmth and respect is the key to connection.`, translation: 'Polite cultural introduction.' },
        { time: '0:25', seconds: 25, speaker: 'Teacher', text: `When meeting someone in the morning, offer a polite smile and traditional greeting.`, translation: 'Morning greeting etiquette.' },
        { time: '0:45', seconds: 45, speaker: 'Teacher', text: `Always follow your greeting by asking respectfully how the other person is doing.`, translation: 'Inquiring about well-being politely.' },
        { time: '1:05', seconds: 65, speaker: 'Teacher', text: `When someone asks about you, reply: "I am doing very well, thank you!"`, translation: 'Expressing well-being with gratitude.' },
        { time: '1:25', seconds: 85, speaker: 'Teacher', text: `When welcoming guests to your home or office, use the formal welcome phrase.`, translation: 'Welcoming guests warmly.' },
        { time: '1:45', seconds: 105, speaker: 'Teacher', text: `To say thank you, speak clearly from the heart with sincere appreciation.`, translation: 'Sincere gratitude expression.' },
        { time: '2:05', seconds: 125, speaker: 'Teacher', text: `To say goodbye respectfully, use traditional leave-taking phrases rather than an abrupt exit.`, translation: 'Polite leave-taking custom.' },
        { time: '2:25', seconds: 145, speaker: 'Teacher', text: `Wonderful! You are now prepared to greet native ${lang} speakers confidently.`, translation: 'Greeting mastery achieved.' },
      ];
    },
  },

  // 3. Beginner (A1) - Self Introductions
  {
    topic: 'conversation',
    topicLabel: 'Self Introductions',
    level: 'beginner',
    levelLabel: 'A1 Beginner',
    durationCategory: '5min',
    durationFormatted: '4:30',
    durationSeconds: 270,
    xp: 40,
    titleTemplate: (l) => `Introduce Yourself with Confidence in ${l}`,
    subTemplate: (l) => `State your name, hometown, and profession in ${l}`,
    descTemplate: (l) => `A complete 5-minute template to introduce yourself fluently in ${l}.`,
    sampleWords: (code, _l) => {
      if (code === 'kn') return [
        { term: 'ನನ್ನ ಹೆಸರು...', phonetic: 'Nanna hesaru...', meaning: 'My name is...' },
        { term: 'ನಾನು ಇರುವುದು...', phonetic: 'Naanu iruvudu...', meaning: 'I live in...' },
        { term: 'ಭೇಟಿಯಾಗಿ ಸಂತೋಷವಾಯಿತು', phonetic: 'Bhetiyagi santhoshavayithu', meaning: 'Pleased to meet you' },
      ];
      if (code === 'te') return [
        { term: 'నా పేరు...', phonetic: 'Naa peru...', meaning: 'My name is...' },
        { term: 'నేను ఉండేది...', phonetic: 'Nenu undedi...', meaning: 'I live in...' },
        { term: 'మిమ్మల్ని కలవడం ఆనందం', phonetic: 'Mimmalni kalavadam aanandam', meaning: 'Pleased to meet you' },
      ];
      if (code === 'hi') return [
        { term: 'मेरा नाम...', phonetic: 'Mera naam...', meaning: 'My name is...' },
        { term: 'मैं रहता हूँ...', phonetic: 'Main rehta hoon...', meaning: 'I reside in...' },
        { term: 'आपसे मिलकर खुशी हुई', phonetic: 'Aapse milkar khushi hui', meaning: 'Pleased to meet you' },
      ];
      return [
        { term: 'My name is...', phonetic: 'My naym iz', meaning: 'State your identity' },
        { term: 'I am from...', phonetic: 'Eye am frum', meaning: 'State origin/hometown' },
        { term: 'Pleasure meeting you', phonetic: 'Pleh-zher', meaning: 'Polite rapport building' },
      ];
    },
    transcriptGen: (code, lang) => {
      if (code === 'kn') {
        return [
          { time: '0:10', seconds: 10, speaker: 'Teacher', text: 'ಸ್ವಯಂ ಪರಿಚಯ ಮಾಡಿಕೊಳ್ಳುವುದು ಹೊಸ ಸ್ನೇಹ ಮತ್ತು ವೃತ್ತಿಪರ ಸಂಬಂಧಗಳ ಮೊದಲ ಹೆಜ್ಜೆ.', translation: 'Self-introductions are the first step to friendship and connections.' },
          { time: '0:35', seconds: 35, speaker: 'Teacher', text: 'ಹಂತ 1: ನಿಮ್ಮ ಹೆಸರನ್ನು ಹೇಳಿ: "ನನ್ನ ಹೆಸರು [ನಿಮ್ಮ ಹೆಸರು]" (Nanna hesaru...).', translation: 'Step 1: State your name clearly: Nanna hesaru [Name].' },
          { time: '1:00', seconds: 60, speaker: 'Teacher', text: 'ಹಂತ 2: ನಿಮ್ಮ ಊರಿನ ಬಗ್ಗೆ ಹೇಳಿ: "ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೇನೆ".', translation: 'Step 2: Share your city: Naanu [City] dalli vasisuttiddene.' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'ಹಂತ 3: ನಿಮ್ಮ ಕೆಲಸ ಅಥವಾ ಶಿಕ್ಷಣ ತಿಳಿಸಿ: "ನಾನು ಸಾಫ್ಟ್‌ವೇರ್ ಎಂಜಿನಿಯರ್ ಆಗಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೇನೆ".', translation: 'Step 3: Mention your profession or studies.' },
          { time: '1:50', seconds: 110, speaker: 'Teacher', text: 'ಹಂತ 4: ಭೇಟಿಯಾದ ಸಂತೋಷವನ್ನು ವ್ಯಕ್ತಪಡಿಸಿ: "ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿ ತುಂಬಾ ಸಂತೋಷವಾಯಿತು!"', translation: 'Step 4: Express joy: Nimmannu bhetiyagi tumba santhoshavayithu!' },
          { time: '2:15', seconds: 135, speaker: 'Teacher', text: 'ಹಂತ 5: ಮರ್ಯಾದೆಯಿಂದ ಅವರ ಹೆಸರನ್ನು ಕೇಳಿ: "ತಮ್ಮ ಪರಿಚಯ ತಿಳಿಯಬಹುದೇ?"', translation: 'Step 5: Inquire about their identity reciprocally.' },
          { time: '2:40', seconds: 160, speaker: 'Teacher', text: 'ಅತ್ಯುತ್ತಮ! ಈಗ ನೀವು ಯಾರನ್ನಾದರೂ ಭೇಟಿಯಾದಾಗ ನಿರರ್ಗಳವಾಗಿ ಪರಿಚಯ ಮಾಡಿಕೊಳ್ಳಬಹುದು.', translation: 'Superb! You can now introduce yourself fluently in Kannada.' },
        ];
      }
      if (code === 'te') {
        return [
          { time: '0:10', seconds: 10, speaker: 'Teacher', text: 'మిమ్మల్ని మీరు పరిచయం చేసుకోవడం ద్వారా నూతన స్నేహాలు మరియు గౌరవం సులభంగా లభిస్తాయి.', translation: 'Introducing yourself smoothly unlocks genuine respect and connections.' },
          { time: '0:35', seconds: 35, speaker: 'Teacher', text: 'మొదటి అడుగు: మీ పేరు చెప్పండి: "నా పేరు [మీ పేరు]" (Naa peru...).', translation: 'Step 1: State your name clearly: Naa peru [Name].' },
          { time: '1:00', seconds: 60, speaker: 'Teacher', text: 'రెండవ అడుగు: మీ ఊరు తెలపండి: "నేను హైదరాబాద్‌లో ఉంటున్నాను".', translation: 'Step 2: State your hometown or current location.' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'మూడవ అడుగు: మీ వృత్తి లేదా చదువు గురించి చెప్పండి: "నేను ఉద్యోగం చేస్తున్నాను".', translation: 'Step 3: Mention your career or educational background.' },
          { time: '1:50', seconds: 110, speaker: 'Teacher', text: 'నాల్గవ అడుగు: సంతోషం వ్యక్తం చేయండి: "మిమ్మల్ని కలవడం చాలా ఆనందంగా ఉంది!"', translation: 'Step 4: Express happiness: Mimmalni kalavadam chala aanandanga undi!' },
          { time: '2:15', seconds: 135, speaker: 'Teacher', text: 'ఐదవ అడుగు: ఎదుటివారిని అడగండి: "మీ పేరు తెలుసుకోవచ్చా?"', translation: 'Step 5: Ask their name in return with natural politeness.' },
          { time: '2:40', seconds: 160, speaker: 'Teacher', text: 'అద్భుతమైన ప్రగతి! మీరు తెలుగులో సంపూర్ణ పరిచయం ఇవ్వడానికి సిద్ధంగా ఉన్నారు.', translation: 'Magnificent! You are now fully prepared to introduce yourself in Telugu.' },
        ];
      }
      return [
        { time: '0:10', seconds: 10, speaker: 'Teacher', text: `Welcome to self-introductions in ${lang}. Introducing yourself opens doors to friendships.`, translation: 'Introduction goal.' },
        { time: '0:35', seconds: 35, speaker: 'Teacher', text: `Step 1: State your name clearly: "My name is..." with confidence.`, translation: 'State your name with confidence.' },
        { time: '1:00', seconds: 60, speaker: 'Teacher', text: `Step 2: Tell where you are from and share your hometown or city.`, translation: 'Sharing your origin and hometown.' },
        { time: '1:25', seconds: 85, speaker: 'Teacher', text: `Step 3: Mention your profession, passion, or studies with polite phrasing.`, translation: 'Mentioning your work or study.' },
        { time: '1:50', seconds: 110, speaker: 'Teacher', text: `Step 4: Express happiness in meeting them: "Very glad to meet you!"`, translation: 'Pleased to meet you phrase.' },
        { time: '2:15', seconds: 135, speaker: 'Teacher', text: `Step 5: Ask their name in return politely to keep the dialogue flowing naturally.`, translation: 'Reciprocal questioning.' },
        { time: '2:40', seconds: 160, speaker: 'Teacher', text: `Excellent! You now have a complete conversational introduction ready in ${lang}.`, translation: 'Introduction masterclass complete.' },
      ];
    },
  },

  // 4. Elementary (A2) - Food & Dining Out
  {
    topic: 'food',
    topicLabel: 'Food & Dining Out',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    durationCategory: '5min',
    durationFormatted: '4:50',
    durationSeconds: 290,
    xp: 45,
    titleTemplate: (l) => `Ordering Food & Filter Coffee in ${l}`,
    subTemplate: (l) => `Dishes, spices, and asking for the bill in ${l}`,
    descTemplate: (l) => `Master restaurant ordering phrases, dietary preferences, and billing in ${l}.`,
    sampleWords: (code, _l) => {
      if (code === 'kn') return [
        { term: 'ಊಟ / ತಿಂಡಿ', phonetic: 'Oota / Tindi', meaning: 'Meal / Breakfast Snack' },
        { term: 'ನೀರು ಕೊಡಿ', phonetic: 'Neeru kodi', meaning: 'Please give water' },
        { term: 'ಖಾರ ಕಡಿಮೆ ಮಾಡಿ', phonetic: 'Khara kadime maadi', meaning: 'Make it less spicy' },
      ];
      if (code === 'te') return [
        { term: 'భోజనం / టిఫిన్', phonetic: 'Bhojanam / Tiffin', meaning: 'Meal / Snack' },
        { term: 'మంచినీళ్ళు ఇవ్వండి', phonetic: 'Manchineellu ivvandi', meaning: 'Please give drinking water' },
        { term: 'కారం తక్కువ వేయండి', phonetic: 'Kaaram thakkuva veyandi', meaning: 'Make it less spicy' },
      ];
      return [
        { term: 'Table for two', phonetic: 'Tay-bl', meaning: 'Seating reservation' },
        { term: 'Mineral Water', phonetic: 'Wah-ter', meaning: 'Bottled drinking water' },
        { term: 'The bill please', phonetic: 'Bil pleez', meaning: 'Payment settlement' },
      ];
    },
    transcriptGen: (code, lang) => {
      if (code === 'kn') {
        return [
          { time: '0:10', seconds: 10, speaker: 'Teacher', text: 'ಸ್ಥಳೀಯ ಉಪಹಾರ ಗೃಹ ಅಥವಾ ಹೋಟೆಲ್‌ಗೆ ಹೋದಾಗ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಆರ್ಡರ್ ಮಾಡುವುದನ್ನು ಕಲಿಯೋಣ.', translation: 'Let us learn to order delicious hot food with confidence at a local cafe.' },
          { time: '0:35', seconds: 35, speaker: 'Teacher', text: 'ಮೊದಲಿಗೆ ಕುಡಿಯಲು ನೀರು ಕೇಳಿ: "ದಯವಿಟ್ಟು ಒಂದು ಬಾಟಲ್ ಕುಡಿಯುವ ನೀರು ಕೊಡಿ".', translation: 'First ask for water: Dayavittu neeru kodi (Please give drinking water).' },
          { time: '1:00', seconds: 60, speaker: 'Teacher', text: 'ತಿಂಡಿ ಆರ್ಡರ್ ಮಾಡಲು: "ನಮಗೆ ಒಂದು ಬಿಸಿ ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ".', translation: 'Order food: Please give one hot Masala Dosa and filter coffee.' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'ಖಾರ ಹೊಂದಿಸಲು: "ದಯವಿಟ್ಟು ಖಾರ ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ತಯಾರಿಸಿ".', translation: 'Customize spice: Dayavittu khara kadime maadi (Make it less spicy).' },
          { time: '1:50', seconds: 110, speaker: 'Teacher', text: 'ರುಚಿಯನ್ನು ಹೊಗಳಲು: "ಆಹಾ! ಊಟ ಮತ್ತು ಸಾಂಬಾರ್ ನಿಜವಾಗಿಯೂ ಅದ್ಭುತವಾಗಿದೆ!".', translation: 'Compliment taste: The food and sambar is extraordinarily delicious!' },
          { time: '2:15', seconds: 135, speaker: 'Teacher', text: 'ಬಿಲ್ ಕೇಳಲು: "ಬಿಲ್ ಎಷ್ಟು ಆಯಿತು? ನಾನು ಯುಪಿಐ ಮೂಲಕ ಪಾವತಿಸಬಹುದೇ?".', translation: 'Ask for check: How much is the bill? Can I pay via UPI QR code?' },
          { time: '2:40', seconds: 160, speaker: 'Teacher', text: 'ಆತಿಥ್ಯಕ್ಕಾಗಿ ಧನ್ಯವಾದ ಹೇಳಿ: "ಉತ್ತಮ ಸೇವೆಗಾಗಿ ತುಂಬಾ ಧನ್ಯವಾದಗಳು!".', translation: 'Thank the server warmly: Thank you for the wonderful meal and service.' },
        ];
      }
      if (code === 'te') {
        return [
          { time: '0:10', seconds: 10, speaker: 'Teacher', text: 'రెస్టారెంట్‌లో లేదా హోటల్‌లో రుచికరమైన ఆహారాన్ని ఎలా ఆర్డర్ చేయాలో నేర్చుకుందాం.', translation: 'Let us learn how to order delicious meals at restaurants fluently.' },
          { time: '0:35', seconds: 35, speaker: 'Teacher', text: 'మొదటగా నీళ్ళు అడగండి: "దయచేసి మంచి నీళ్ళు తీసుకురండి" (Manchineellu ivvandi).', translation: 'First ask for water: Please bring drinking water.' },
          { time: '1:00', seconds: 60, speaker: 'Teacher', text: 'టిఫిన్ ఆర్డర్ చేయండి: "మాకు ఒక వేడి మసాలా దోశ మరియు ఫిల్టర్ కాఫీ ఇవ్వండి".', translation: 'Order food: Please bring one hot Masala Dosa and filter coffee.' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'కారం సరిచేయడానికి: "కారం కొంచెం తక్కువగా వేయండి".', translation: 'Adjust spice: Please prepare with less spice and chili.' },
          { time: '1:50', seconds: 110, speaker: 'Teacher', text: 'రుచిని ప్రశంసించండి: "భోజనం చాలా రుచిగా మరియు తాజాగా ఉంది!".', translation: 'Praise food: The meal is exceptionally tasty and fresh!' },
          { time: '2:15', seconds: 135, speaker: 'Teacher', text: 'బిల్లు అడగండి: "బిల్లు ఎంతైంది? క్యూఆర్ కోడ్ ద్వారా చెల్లించవచ్చా?".', translation: 'Ask for bill: How much is the total? Can I scan and pay with QR?' },
          { time: '2:40', seconds: 160, speaker: 'Teacher', text: 'కృతజ్ఞత తెలపండి: "మంచి సేవ అందించినందుకు ధన్యవాదాలు!".', translation: 'Thank the team: Thank you for the courteous service and great food.' },
        ];
      }
      return [
        { time: '0:10', seconds: 10, speaker: 'Teacher', text: `Stepping into a local cafe or restaurant in ${lang}: let us order a hot meal.`, translation: 'Restaurant arrival.' },
        { time: '0:35', seconds: 35, speaker: 'Teacher', text: `First, ask for a table for two: "Do you have a table available?"`, translation: 'Table reservation request.' },
        { time: '1:00', seconds: 60, speaker: 'Teacher', text: `To ask for drinking water immediately: "Please bring a bottle of water."`, translation: 'Water request.' },
        { time: '1:25', seconds: 85, speaker: 'Teacher', text: `Order specialty dishes: "Please give us one hot meal and filter coffee."`, translation: 'Specialty food order.' },
        { time: '1:50', seconds: 110, speaker: 'Teacher', text: `Specify spice preferences: "Please prepare it with less spice and less chili."`, translation: 'Spice customization.' },
        { time: '2:15', seconds: 135, speaker: 'Teacher', text: `When finished, ask for the check: "How much is the bill? Can I pay via QR code?"`, translation: 'Billing and payment.' },
        { time: '2:40', seconds: 160, speaker: 'Teacher', text: `Thank the server warmly: "Thank you for the wonderful meal!"`, translation: 'Staff gratitude.' },
      ];
    },
  },

  // 5. Elementary (A2) - Auto & Cab Commuting
  {
    topic: 'travel',
    topicLabel: 'Auto & Cab Commuting',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    durationCategory: '5min',
    durationFormatted: '4:40',
    durationSeconds: 280,
    xp: 45,
    titleTemplate: (l) => `Auto Rickshaw Fares & Navigation in ${l}`,
    subTemplate: (l) => `Bargaining, meter requests, and turn directions in ${l}`,
    descTemplate: (l) => `Commute stress-free across cities using essential ${l} vocabulary.`,
    sampleWords: (code, _l) => {
      if (code === 'kn') return [
        { term: 'ಮೀಟರ್ ಹಾಕಿ', phonetic: 'Meter haaki', meaning: 'Turn on the meter fare' },
        { term: 'ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ', phonetic: 'Illi nillisi', meaning: 'Please stop here' },
        { term: 'ಮುಂದೆ ಎಡಕ್ಕೆ', phonetic: 'Munde edakke', meaning: 'Take next left' },
      ];
      if (code === 'te') return [
        { term: 'మీటర్ వేయండి', phonetic: 'Meter veyandi', meaning: 'Turn on the meter fare' },
        { term: 'ఇక్కడ ఆపండి', phonetic: 'Ikkada aapandi', meaning: 'Please stop here' },
        { term: 'ఎడమ వైపు తిరగండి', phonetic: 'Edama vaipu thiragandi', meaning: 'Turn left ahead' },
      ];
      return [
        { term: 'Turn left / right', phonetic: 'Turn left', meaning: 'Directional navigation' },
        { term: 'Stop right here', phonetic: 'Stop heer', meaning: 'Arrival indication' },
        { term: 'How much is fare?', phonetic: 'How much fayr', meaning: 'Fare quotation' },
      ];
    },
    transcriptGen: (code, lang) => {
      if (code === 'kn') {
        return [
          { time: '0:10', seconds: 10, speaker: 'Teacher', text: 'ನಗರದಲ್ಲಿ ಆಟೋ ಅಥವಾ ಟ್ಯಾಕ್ಸಿ ಹತ್ತಿದಾಗ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಮಾತನಾಡುವುದು ಬಹಳ ಸುಲಭ.', translation: 'Commuting by auto or cab in city traffic is easy with key phrases.' },
          { time: '0:35', seconds: 35, speaker: 'Teacher', text: 'ಗಮ್ಯಸ್ಥಾನ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ: "ಮೆಟ್ರೋ ಸ್ಟೇಷನ್‌ಗೆ ಬರುತ್ತೀರಾ ಸಾರ್?".', translation: 'Confirm destination: Will you come to the Metro Station, sir?' },
          { time: '1:00', seconds: 60, speaker: 'Teacher', text: 'ಮೀಟರ್ ಹಾಕಲು ವಿನಂತಿಸಿ: "ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ ಬನ್ನಿ".', translation: 'Request meter: Dayavittu meter haaki banni (Please use meter).' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'ದಾರಿ ಹೇಳಲು: "ಮುಂದಿನ ಸರ್ಕಲ್‌ನಲ್ಲಿ ಎಡಕ್ಕೆ ತಿರುಗಿ, ಆಮೇಲೆ ನೇರವಾಗಿ ಹೋಗಿ".', translation: 'Give directions: Turn left at the upcoming circle, then go straight.' },
          { time: '1:50', seconds: 110, speaker: 'Teacher', text: 'ವಾಹನ ನಿಧಾನಗೊಳಿಸಲು: "ಸ್ವಲ್ಪ ನಿಧಾನವಾಗಿ ಚಲಾಯಿಸಿ".', translation: 'Request safe speed: Please drive a little slower.' },
          { time: '2:15', seconds: 135, speaker: 'Teacher', text: 'ಇಳಿಯುವ ಸ್ಥಳ ಬಂದಾಗ: "ಆ ಕಟ್ಟಡದ ಮುಂದೆ ಬಲಗಡೆಗೆ ಗಾಡಿ ನಿಲ್ಲಿಸಿ".', translation: 'Signal stop: Please stop the auto in front of that building on the right.' },
          { time: '2:40', seconds: 160, speaker: 'Teacher', text: 'ಹಣ ನೀಡಿ ಧನ್ಯವಾದ ತಿಳಿಸಿ: "ಧನ್ಯವಾದಗಳು, ಸುರಕ್ಷಿತವಾಗಿ ತಲುಪಿಸಿದ್ದೀರಿ!".', translation: 'Pay and thank driver: Thank you for a safe and prompt ride.' },
        ];
      }
      if (code === 'te') {
        return [
          { time: '0:10', seconds: 10, speaker: 'Teacher', text: 'నగరంలో ఆటో లేదా క్యాబ్ ప్రయాణం సులభంగా సాగడానికి అవసరమైన వాక్యాలు నేర్చుకుందాం.', translation: 'Mastering everyday commuting phrases in Telugu makes travel stress-free.' },
          { time: '0:35', seconds: 35, speaker: 'Teacher', text: 'గమ్యాన్ని నిర్ధారించుకోండి: "రైల్వే స్టేషన్‌కు వస్తారా అండీ?".', translation: 'Confirm destination: Will you come to Railway Station, sir?' },
          { time: '1:00', seconds: 60, speaker: 'Teacher', text: 'మీటర్ వేయమని అడగండి: "దయచేసి మీటర్ వేసి రండి".', translation: 'Request meter: Please turn on the meter fare.' },
          { time: '1:25', seconds: 85, speaker: 'Teacher', text: 'దిశానిర్దేశం చేయండి: "ముందు వచ్చే సర్కిల్ వద్ద ఎడమవైపు తిరగండి, తరువాత తిన్నగా వెళ్ళండి".', translation: 'Directions: Turn left at the circle ahead, then continue straight.' },
          { time: '1:50', seconds: 110, speaker: 'Teacher', text: 'వేగం నియంత్రించడానికి: "కాస్త నెమ్మదిగా నడపండి".', translation: 'Speed control: Please drive a bit slowly and safely.' },
          { time: '2:15', seconds: 135, speaker: 'Teacher', text: 'ఆపమని చెప్పడానికి: "ఆ నీలి రంగు గేటు ముందు ఆపండి".', translation: 'Signal stop: Please stop right in front of that blue gate.' },
          { time: '2:40', seconds: 160, speaker: 'Teacher', text: 'చార్జీ చెల్లించి కృతజ్ఞత తెలపండి: "సరిగ్గా చేర్చినందుకు ధన్యవాదాలు!".', translation: 'Pay and thank: Thank you for the smooth journey.' },
        ];
      }
      return [
        { time: '0:10', seconds: 10, speaker: 'Teacher', text: `Navigating public city transport: flagging down an auto or taxi in ${lang}.`, translation: 'Commute initiation.' },
        { time: '0:35', seconds: 35, speaker: 'Teacher', text: `Confirm your destination first: "Will you go to the metro station?"`, translation: 'Destination confirmation.' },
        { time: '1:00', seconds: 60, speaker: 'Teacher', text: `Politely insist on using the meter: "Please turn on the meter fare."`, translation: 'Meter request.' },
        { time: '1:25', seconds: 85, speaker: 'Teacher', text: `Give turn by turn guidance: "Turn left at the upcoming circle, then continue straight."`, translation: 'Direction instructions.' },
        { time: '1:50', seconds: 110, speaker: 'Teacher', text: `If the driver is going too fast, ask politely: "Please drive a little slower."`, translation: 'Speed caution.' },
        { time: '2:15', seconds: 135, speaker: 'Teacher', text: `Signal arrival clearly: "Please stop the vehicle right in front of that building."`, translation: 'Arrival stop notice.' },
        { time: '2:40', seconds: 160, speaker: 'Teacher', text: `Pay the fare and thank the driver for a safe and smooth ride.`, translation: 'Payment and departure.' },
      ];
    },
  },

  // 6. Elementary (A2) - Numbers & Marketplace
  {
    topic: 'grammar',
    topicLabel: 'Numbers & Marketplace',
    level: 'elementary',
    levelLabel: 'A2 Elementary',
    durationCategory: '10min',
    durationFormatted: '5:20',
    durationSeconds: 320,
    xp: 55,
    titleTemplate: (l) => `Numbers 1 to 100 & Marketplace in ${l}`,
    subTemplate: (l) => `Counting, currency, weights, and negotiations in ${l}`,
    descTemplate: (l) => `Learn how to count quickly, ask for discounts, and buy fresh groceries in ${l}.`,
    sampleWords: (code, _l) => {
      if (code === 'kn') return [
        { term: 'ಎಷ್ಟು ಬೆಲೆ?', phonetic: 'Eshtu bele?', meaning: 'What is the price?' },
        { term: 'ಒಂದು ಕೆಜಿ ಕೊಡಿ', phonetic: 'Ondu kg kodi', meaning: 'Give one kilogram' },
        { term: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ', phonetic: 'Svalpa kadime maadi', meaning: 'Please reduce price' },
      ];
      if (code === 'te') return [
        { term: 'ధర ఎంత?', phonetic: 'Dhara entha?', meaning: 'What is the price?' },
        { term: 'ఒక కిలో ఇవ్వండి', phonetic: 'Oka kilo ivvandi', meaning: 'Give one kilogram' },
        { term: 'కొంచెం తగ్గించండి', phonetic: 'Konchem thagginchandi', meaning: 'Please give discount' },
      ];
      return [
        { term: 'How much is it?', phonetic: 'How much', meaning: 'Price interrogation' },
        { term: 'Fresh produce', phonetic: 'Prah-doos', meaning: 'Daily farm vegetables' },
        { term: 'Total amount', phonetic: 'Toh-tal', meaning: 'Net bill payment' },
      ];
    },
    transcriptGen: (_code, lang) => [
      { time: '0:10', seconds: 10, speaker: 'Teacher', text: `Counting units and groups of tens in ${lang}: 10, 20, 50, 100.`, translation: 'Counting foundations.' },
      { time: '0:35', seconds: 35, speaker: 'Teacher', text: `Entering the lively local bazaar: greeting vendors with warmth.`, translation: 'Bazaar entry.' },
      { time: '1:00', seconds: 60, speaker: 'Teacher', text: `Asking price per kilogram: "How much for one kilo of fresh ripe tomatoes?".`, translation: 'Price inquiry per weight.' },
      { time: '1:25', seconds: 85, speaker: 'Teacher', text: `Inspecting quality: "Are these leafy greens plucked fresh this morning?".`, translation: 'Produce quality inspection.' },
      { time: '1:50', seconds: 110, speaker: 'Teacher', text: `Politely negotiating a discount: "If I purchase two kilos, can you offer a discount?".`, translation: 'Courteous bargaining.' },
      { time: '2:15', seconds: 135, speaker: 'Teacher', text: `Asking for a cloth carry bag and checking the final balance.`, translation: 'Checkout and bagging.' },
      { time: '2:40', seconds: 160, speaker: 'Teacher', text: `Paying digitally via QR code and wishing the merchant great prosperity!`, translation: 'Digital payment & well-wishes.' },
    ],
  },

  // 7. Intermediate (B1) - Verb Tenses
  {
    topic: 'grammar',
    topicLabel: 'Verb Tenses Masterclass',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    durationCategory: '10min',
    durationFormatted: '5:40',
    durationSeconds: 340,
    xp: 65,
    titleTemplate: (l) => `Past, Present & Future Tenses in ${l}`,
    subTemplate: (l) => `Conjugations with subject agreement in ${l}`,
    descTemplate: (l) => `Never mix up tenses again with simple formulaic patterns in ${l}.`,
    sampleWords: (_c, _l) => [
      { term: 'I will go', phonetic: 'Future tense', meaning: 'Upcoming scheduled action' },
      { term: 'I went', phonetic: 'Past tense', meaning: 'Action completed earlier' },
      { term: 'I am doing', phonetic: 'Continuous', meaning: 'Action in active progress' },
    ],
    transcriptGen: (_c, lang) => [
      { time: '0:10', seconds: 10, speaker: 'Teacher', text: `In ${lang}, verbs change endings based on time and who is performing the deed.`, translation: 'Tense fundamentals overview.' },
      { time: '0:35', seconds: 35, speaker: 'Teacher', text: `Present Continuous: describing actions taking place right this minute.`, translation: 'Present continuous form.' },
      { time: '1:00', seconds: 60, speaker: 'Teacher', text: `Past Tense: modifying root stems with completed action markers.`, translation: 'Past tense mastery.' },
      { time: '1:25', seconds: 85, speaker: 'Teacher', text: `Future Tense: structuring upcoming hopes, intentions, and schedules.`, translation: 'Future tense structure.' },
      { time: '1:50', seconds: 110, speaker: 'Teacher', text: `Subject Agreement: aligning verb endings for singular versus plural pronouns.`, translation: 'Pronoun concordance.' },
      { time: '2:15', seconds: 135, speaker: 'Teacher', text: `Connecting all three tenses into a flowing personal story from yesterday to tomorrow.`, translation: 'Timeline narrative exercise.' },
      { time: '2:40', seconds: 160, speaker: 'Teacher', text: `Superb! You can now communicate across past, present, and future in ${lang}.`, translation: 'Tenses completion review.' },
    ],
  },

  // 8. Intermediate (B1) - Conversational Slang & Street Fluency
  {
    topic: 'slang',
    topicLabel: 'Street Talk & Slang',
    level: 'intermediate',
    levelLabel: 'B1 Intermediate',
    durationCategory: '10min',
    durationFormatted: '5:15',
    durationSeconds: 315,
    xp: 65,
    titleTemplate: (l) => `Everyday Street Slang & Idioms in ${l}`,
    subTemplate: (l) => `Colloquial phrases spoken by young locals in ${l}`,
    descTemplate: (l) => `Bridge the gap between formal grammar and real-life conversations in ${l}.`,
    sampleWords: (_c, _l) => [
      { term: 'Awesome / Great', phonetic: 'Informal superlative', meaning: 'Terrific / Amazing' },
      { term: 'Chill / Relax', phonetic: 'Casual comfort', meaning: 'Take it easy without stress' },
      { term: 'No problem', phonetic: 'Assurance', meaning: 'Do not worry about it' },
    ],
    transcriptGen: (_c, lang) => [
      { time: '0:10', seconds: 10, speaker: 'Teacher', text: `Textbooks teach grammar, but real street talk adds flavor, humor, and emotion in ${lang}.`, translation: 'Colloquial evolution.' },
      { time: '0:35', seconds: 35, speaker: 'Teacher', text: `Words used by friends to describe something truly awesome and remarkable.`, translation: 'Excitement slang.' },
      { time: '1:00', seconds: 60, speaker: 'Teacher', text: `Everyday conversation fillers that make your pacing sound 100% natural.`, translation: 'Natural speech fillers.' },
      { time: '1:25', seconds: 85, speaker: 'Teacher', text: `Popular idioms heard constantly in movies, tea stalls, and college cafes.`, translation: 'Everyday idioms.' },
      { time: '1:50', seconds: 110, speaker: 'Teacher', text: `When to speak casually with friends versus when to maintain formal respect.`, translation: 'Social register rules.' },
      { time: '2:15', seconds: 135, speaker: 'Teacher', text: `Practice speaking these vibrant colloquial expressions with confident native cadence!`, translation: 'Fluency cadence practice.' },
    ],
  },

  // 9. Fluent (C1) - Cultural Immersion & Family Bonds
  {
    topic: 'culture',
    topicLabel: 'Cultural Immersion',
    level: 'fluent',
    levelLabel: 'C1 Fluent',
    durationCategory: '15min',
    durationFormatted: '6:10',
    durationSeconds: 370,
    xp: 100,
    titleTemplate: (l) => `Cultural Immersion & Family Etiquette in ${l}`,
    subTemplate: (l) => `Weddings, festivals, and hospitality in ${l}`,
    descTemplate: (l) => `An advanced masterclass covering traditional family ethics and celebrations in ${l}.`,
    sampleWords: (_c, _l) => [
      { term: 'Festival / Celebration', phonetic: 'Celebration', meaning: 'Sacred holiday' },
      { term: 'Hospitality', phonetic: 'Reception', meaning: 'Welcoming guests warmly' },
      { term: 'Blessings', phonetic: 'Elders grace', meaning: 'Traditional blessing of elders' },
    ],
    transcriptGen: (_c, lang) => [
      { time: '0:10', seconds: 10, speaker: 'Teacher', text: `Entering an Indian family home: touching elders feet and seeking their heartfelt blessings.`, translation: 'Family hospitality etiquette.' },
      { time: '0:35', seconds: 35, speaker: 'Teacher', text: `Inquiring about every family member: "Is everyone at home doing well and healthy?".`, translation: 'Respectful inquiry.' },
      { time: '1:00', seconds: 60, speaker: 'Teacher', text: `Savoring authentic home-cooked festive recipes and expressing genuine admiration.`, translation: 'Culinary praise.' },
      { time: '1:25', seconds: 85, speaker: 'Teacher', text: `Participating in traditional festival discussions, decorative rangoli, and lighting lamps.`, translation: 'Festive exchange.' },
      { time: '1:50', seconds: 110, speaker: 'Teacher', text: `Graceful etiquette for accepting generous hospitality while declining excess servings politely.`, translation: 'Polite guest etiquette.' },
      { time: '2:15', seconds: 135, speaker: 'Teacher', text: `Parting farewells with traditional blessings: "May peace, health, and joy abide with you".`, translation: 'Sacred leave-taking.' },
      { time: '2:40', seconds: 160, speaker: 'Teacher', text: `Congratulations! You have completed the C1 cultural fluency masterclass in ${lang}.`, translation: 'C1 mastery accomplished.' },
    ],
  },
];

// Generate the complete video curriculum
export const ALL_VIDEO_LESSONS: VideoLesson[] = [];

let globalIndex = 0;
for (const lang of SUPPORTED_LANGUAGES_META) {
  for (const bp of CURRICULUM_BLUEPRINTS) {
    globalIndex++;

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
      embedType: 'native',
      transcript: bp.transcriptGen(lang.code, lang.name),
      keyVocabulary: bp.sampleWords(lang.code, lang.name),
    });
  }
}
