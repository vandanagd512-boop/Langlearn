import { LessonDetail } from '../types/lesson.types';

// Curated comprehensive lesson data per language
export const LESSONS_DATABASE: Record<string, Record<string, LessonDetail>> = {
  kn: {
    'les-1': {
      id: 'les-1',
      courseCode: 'kn',
      sectionId: 'sec-kn-greetings',
      sectionTitle: 'Greetings & Salutations',
      order: 1,
      totalLessons: 48,
      title: 'Polite Greetings & Daily Salutations',
      subtitle: 'Master respectful social openers and friendly inquiries in conversational Kannada',
      category: 'Greetings',
      difficulty: 'Beginner',
      estimatedMinutes: 6,
      xpReward: 30,
      items: [
        {
          id: 'kn-item-1',
          targetText: 'ನಮಸ್ಕಾರ',
          romanizedText: 'Namaskāra',
          pronunciation: '[nʌ.mʌs.kɑː.rʌ]',
          meaning: 'Hello / Greetings / Respectful Salutations',
          explanation:
            'Universal respectful greeting in Kannada, used at any time of day when meeting elders, colleagues, shopkeepers, or new acquaintances with folded hands.',
          exampleSentence: 'ಎಲ್ಲರಿಗೂ ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?',
          exampleRomanized: 'Ellarigū namaskāra, nīvu hēgiddīri?',
          exampleTranslation: 'Hello everyone, how are you all doing?',
          notes:
            'Add the suffix "-re" or "-ri" in informal or North Karnataka dialects (e.g., Namaskara-ri) to convey gentle warmth.',
          categoryTag: 'Social Etiquette',
          illustrationGradient: 'from-amber-500 via-rose-500 to-indigo-600',
          illustrationSymbol: '🙏',
          audioLangCode: 'kn-IN',
        },
        {
          id: 'kn-item-2',
          targetText: 'ಹೇಗಿದ್ದೀರಿ?',
          romanizedText: 'Hēgiddīri?',
          pronunciation: '[heː.ɡid.diː.ri]',
          meaning: 'How are you? (Polite / Plural)',
          explanation:
            'Respectful way of inquiring after someone’s health or well-being. Used with elders, professionals, or multiple people. For close friends, "Hēgidhdhiya?" is used.',
          exampleSentence: 'ಸರ್, ನಮಸ್ಕಾರ! ಇವತ್ತು ನೀವು ಹೇಗಿದ್ದೀರಿ?',
          exampleRomanized: 'Sar, namaskāra! Ivattu nīvu hēgiddīri?',
          exampleTranslation: 'Sir, greetings! How are you doing today?',
          notes:
            'Pair this with "Nānu chennāgiddīni" (I am doing well) to complete the natural greeting pair.',
          categoryTag: 'Inquiries',
          illustrationGradient: 'from-blue-500 via-indigo-500 to-purple-600',
          illustrationSymbol: '💬',
          audioLangCode: 'kn-IN',
        },
        {
          id: 'kn-item-3',
          targetText: 'ಧನ್ಯವಾದಗಳು',
          romanizedText: 'Dhanyavādagaḷu',
          pronunciation: '[dʱʌn.jʌ.ʋɑː.dʌ.ɡʌ.ɭu]',
          meaning: 'Thank you / Deep Gratitude',
          explanation:
            'Formal expression of thanks. In everyday speech in Bengaluru, speakers frequently say "Romba thanks" or simply "Thumbā Dhanyavāda".',
          exampleSentence: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು.',
          exampleRomanized: 'Nimma sahāyakke tumbā dhanyavādagaḷu.',
          exampleTranslation: 'Thank you very much for your kind help.',
          notes:
            '"Thumbā" means "very much". Combining "Thumbā dhanyavāda" shows heartfelt appreciation.',
          categoryTag: 'Courtesy',
          illustrationGradient: 'from-emerald-500 via-teal-500 to-cyan-600',
          illustrationSymbol: '✨',
          audioLangCode: 'kn-IN',
        },
        {
          id: 'kn-item-4',
          targetText: 'ಬನ್ನಿ, ಕುಳಿತುಕೊಳ್ಳಿ',
          romanizedText: 'Banni, kuḷitukoḷḷi',
          pronunciation: '[bʌn.ni ku.ɭi.tu.koɭ.ɭi]',
          meaning: 'Please come in, please sit down',
          explanation:
            'Traditional hospitality expression used whenever a guest arrives at your house, shop, or office.',
          exampleSentence: 'ನಮಸ್ಕಾರ, ಒಳಗೆ ಬನ್ನಿ, ದಯವಿಟ್ಟು ಕುಳಿತುಕೊಳ್ಳಿ.',
          exampleRomanized: 'Namaskāra, oḷage banni, dayaviṭṭu kuḷitukoḷḷi.',
          exampleTranslation: 'Greetings, please come inside and have a seat.',
          notes:
            '"Banni" is the polite imperative for "come" (respectful plural). Singular peer version is "Bā".',
          categoryTag: 'Hospitality',
          illustrationGradient: 'from-purple-500 via-pink-500 to-rose-600',
          illustrationSymbol: '🪑',
          audioLangCode: 'kn-IN',
        },
      ],
    },
  },
  hi: {
    'les-1': {
      id: 'les-1',
      courseCode: 'hi',
      sectionId: 'sec-hi-greetings',
      sectionTitle: 'Greetings & Salutations',
      order: 1,
      totalLessons: 60,
      title: 'Everyday Greetings & Polite Pleasantries',
      subtitle: 'Master Hindi conversational greetings, formal respect, and friendly pleasantries',
      category: 'Greetings',
      difficulty: 'Beginner',
      estimatedMinutes: 5,
      xpReward: 30,
      items: [
        {
          id: 'hi-item-1',
          targetText: 'नमस्ते',
          romanizedText: 'Namaste',
          pronunciation: '[nə.məs.t̪eː]',
          meaning: 'Hello / Greetings / I bow to you',
          explanation:
            'The quintessential Hindi greeting. Derived from Sanskrit "namas" (bow) and "te" (to you), representing mutual honor and cordiality.',
          exampleSentence: 'नमस्ते जी, आप कैसे हैं?',
          exampleRomanized: 'Namaste ji, aap kaise hain?',
          exampleTranslation: 'Hello sir/madam, how are you?',
          notes:
            'Adding "Ji" after greeting phrases or names immediately shows high respect (e.g. "Namaste Ji").',
          categoryTag: 'Social Etiquette',
          illustrationGradient: 'from-orange-500 via-amber-500 to-rose-600',
          illustrationSymbol: '🙏',
          audioLangCode: 'hi-IN',
        },
        {
          id: 'hi-item-2',
          targetText: 'आप कैसे हैं?',
          romanizedText: 'Aap kaise hain?',
          pronunciation: '[aːp kɛː.seː hɛ̃ː]',
          meaning: 'How are you? (Polite masculine / general)',
          explanation:
            'The standard polite inquiry in Hindi. When speaking to a female, the feminine variant "Aap kaisi hain?" is used.',
          exampleSentence: 'अरे राहुल भाई, बहुत दिन बाद मिले, आप कैसे हैं?',
          exampleRomanized: 'Arre Rahul bhai, bahut din baad mile, aap kaise hain?',
          exampleTranslation: 'Hey brother Rahul, we meet after so long, how are you?',
          notes:
            'The polite response is "Main theek hoon, shukriya!" (I am fine, thank you!).',
          categoryTag: 'Inquiries',
          illustrationGradient: 'from-blue-500 via-indigo-500 to-purple-600',
          illustrationSymbol: '💬',
          audioLangCode: 'hi-IN',
        },
        {
          id: 'hi-item-3',
          targetText: 'धन्यवाद / शुक्रिया',
          romanizedText: 'Dhanyavād / Shukriyā',
          pronunciation: '[d̪ʱən.jə.ʋaːd̪] / [ʃʊk.ɾɪ.jaː]',
          meaning: 'Thank you',
          explanation:
            'Both "Dhanyavaad" (Sanskrit origin) and "Shukriya" (Perso-Arabic origin) are universally understood and used throughout northern India.',
          exampleSentence: 'आपकी इस मदद के लिए बहुत-बहुत धन्यवाद!',
          exampleRomanized: 'Aapki is madad ke liye bahut-bahut dhanyavaad!',
          exampleTranslation: 'Thank you very much for this help of yours!',
          notes:
            'Use "Bahut-bahut" to emphasize "many thanks".',
          categoryTag: 'Courtesy',
          illustrationGradient: 'from-emerald-500 via-teal-500 to-cyan-600',
          illustrationSymbol: '✨',
          audioLangCode: 'hi-IN',
        },
      ],
    },
  },
  ta: {
    'les-1': {
      id: 'les-1',
      courseCode: 'ta',
      sectionId: 'sec-ta-greetings',
      sectionTitle: 'Greetings & Etiquette',
      order: 1,
      totalLessons: 52,
      title: 'Tamil Greetings & Social Courtesies',
      subtitle: 'Learn authentic Tamil greetings, polite pronouns, and warm welcomes',
      category: 'Greetings',
      difficulty: 'Beginner',
      estimatedMinutes: 6,
      xpReward: 30,
      items: [
        {
          id: 'ta-item-1',
          targetText: 'வணக்கம்',
          romanizedText: 'Vaṇakkam',
          pronunciation: '[ʋɐ.ɳɐk.kɐm]',
          meaning: 'Hello / Greetings / Welcomes',
          explanation:
            'Classical and polite Tamil greeting spoken with folded hands or a warm smile.',
          exampleSentence: 'அனைவருக்கும் வணக்கம், நலமாக இருக்கிறீர்களா?',
          exampleRomanized: 'Anaivarukkum vaṇakkam, nalamāga irukkiṟīrgaḷā?',
          exampleTranslation: 'Greetings to everyone, are you doing well?',
          notes:
            'Notice the retroflex "ண" (Na) and hard "க்க" (kka) which give Tamil its rhythmic punch.',
          categoryTag: 'Social Etiquette',
          illustrationGradient: 'from-rose-500 via-red-500 to-purple-700',
          illustrationSymbol: '🙏',
          audioLangCode: 'ta-IN',
        },
        {
          id: 'ta-item-2',
          targetText: 'எப்படி இருக்கிறீர்கள்?',
          romanizedText: 'Eppaṭi irukkiṟīrgaḷ?',
          pronunciation: '[ep.pɐ.ɖi i.ruk.ki.riːr.ɡɐɭ]',
          meaning: 'How are you? (Polite / Respectful)',
          explanation:
            'Polite inquiry used when addressing seniors, teachers, or groups. In colloquial spoken Chennai Tamil, speakers often abbreviate to "Eppadi irukkeenga?".',
          exampleSentence: 'வணக்கம் ஐயா, இன்று எப்படி இருக்கிறீர்கள்?',
          exampleRomanized: 'Vaṇakkam aiyā, inṟu eppaṭi irukkiṟīrgaḷ?',
          exampleTranslation: 'Greetings sir, how are you feeling today?',
          notes:
            'Standard response: "Nān nalamāga irukkiṟēn" (I am doing well).',
          categoryTag: 'Inquiries',
          illustrationGradient: 'from-blue-500 via-indigo-500 to-purple-600',
          illustrationSymbol: '💬',
          audioLangCode: 'ta-IN',
        },
      ],
    },
  },
  en: {
    'les-1': {
      id: 'les-1',
      courseCode: 'en',
      sectionId: 'sec-en-greetings',
      sectionTitle: 'Greetings & Small Talk',
      order: 1,
      totalLessons: 60,
      title: 'Polite English Greetings & Conversation Starters',
      subtitle: 'Master natural openers, meeting new people, and small talk etiquette',
      category: 'Greetings',
      difficulty: 'Beginner',
      estimatedMinutes: 5,
      xpReward: 30,
      items: [
        {
          id: 'en-item-1',
          targetText: 'Good morning, how are you?',
          romanizedText: 'Good morning, how are you?',
          pronunciation: '[ɡʊd ˈmɔːnɪŋ haʊ ɑː juː]',
          meaning: 'Polite daytime greeting & inquiry',
          explanation:
            'Standard polite greeting used in professional, academic, and casual settings before noon.',
          exampleSentence: 'Good morning everyone, how are you doing today?',
          exampleTranslation: 'Good morning everyone, how are you doing today?',
          notes:
            'In relaxed settings, people often shorten this to "Morning! How’s it going?".',
          categoryTag: 'Social Etiquette',
          illustrationGradient: 'from-blue-600 via-indigo-600 to-cyan-700',
          illustrationSymbol: '☀️',
          audioLangCode: 'en-US',
        },
        {
          id: 'en-item-2',
          targetText: 'Nice to meet you!',
          romanizedText: 'Nice to meet you!',
          pronunciation: '[naɪs tuː miːt juː]',
          meaning: 'Pleasant acknowledgement upon first introduction',
          explanation:
            'Standard formulaic expression used strictly when meeting someone for the very first time.',
          exampleSentence: 'Hello Sarah, I am Alex. It is very nice to meet you!',
          exampleTranslation: 'Hello Sarah, I am Alex. It is very nice to meet you!',
          notes:
            'On subsequent meetings, say "Good to see you again!" instead of "Nice to meet you".',
          categoryTag: 'Introductions',
          illustrationGradient: 'from-emerald-500 via-teal-500 to-cyan-600',
          illustrationSymbol: '🤝',
          audioLangCode: 'en-US',
        },
      ],
    },
  },
};

// Fallback generator for any language and lesson id
export function getLessonDetail(courseCode: string, lessonId?: string): LessonDetail {
  const code = (courseCode || 'kn').toLowerCase();
  const id = lessonId || 'les-1';

  // Return specific curated lesson if available
  if (LESSONS_DATABASE[code] && LESSONS_DATABASE[code][id]) {
    return LESSONS_DATABASE[code][id];
  }
  if (LESSONS_DATABASE[code] && LESSONS_DATABASE[code]['les-1']) {
    return LESSONS_DATABASE[code]['les-1'];
  }

  // Otherwise, construct dynamic rich lesson based on language metadata
  const languageNames: Record<string, { name: string; scriptExample: string; romanized: string }> = {
    te: { name: 'Telugu', scriptExample: 'నమస్కారం', romanized: 'Namaskāram' },
    ml: { name: 'Malayalam', scriptExample: 'നമസ്കാരം', romanized: 'Namaskāram' },
    mr: { name: 'Marathi', scriptExample: 'नमस्कार', romanized: 'Namaskār' },
    bn: { name: 'Bengali', scriptExample: 'নমস্কার', romanized: 'Nomoshkār' },
    gu: { name: 'Gujarati', scriptExample: 'નમસ્તે', romanized: 'Namaste' },
    pa: { name: 'Punjabi', scriptExample: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', romanized: 'Sat Srī Akāl' },
    es: { name: 'Spanish', scriptExample: '¡Hola! ¿Cómo estás?', romanized: 'Hola' },
    fr: { name: 'French', scriptExample: 'Bonjour, comment allez-vous?', romanized: 'Bonjour' },
    de: { name: 'German', scriptExample: 'Guten Tag, wie geht es Ihnen?', romanized: 'Guten Tag' },
    ja: { name: 'Japanese', scriptExample: 'こんにちは', romanized: 'Konnichiwa' },
  };

  const meta = languageNames[code] || {
    name: code.toUpperCase(),
    scriptExample: 'Greetings',
    romanized: 'Greetings',
  };

  return {
    id: id || 'les-1',
    courseCode: code,
    sectionId: `sec-${code}-foundations`,
    sectionTitle: 'Foundations & Conversational Fluency',
    order: 1,
    totalLessons: 48,
    title: `Essential Greetings & Phrasing in ${meta.name}`,
    subtitle: `Learn standard native greetings, polite inquiries, and conversational pronunciation`,
    category: 'Core Curriculum',
    difficulty: 'Beginner',
    estimatedMinutes: 6,
    xpReward: 30,
    items: [
      {
        id: `${code}-item-1`,
        targetText: meta.scriptExample,
        romanizedText: meta.romanized,
        pronunciation: `[${meta.romanized.toLowerCase()}]`,
        meaning: `Hello / Greetings in ${meta.name}`,
        explanation: `The foundational respectful greeting used across daily encounters, meeting elders, and starting polite conversations.`,
        exampleSentence: `${meta.scriptExample}! Welcome to LangLearn.`,
        exampleRomanized: `${meta.romanized}! Welcome to LangLearn.`,
        exampleTranslation: `Hello! Welcome to LangLearn interactive practice.`,
        notes: `Listen carefully to audio inflections and practice with slow playback mode.`,
        categoryTag: 'Social Etiquette',
        illustrationGradient: 'from-blue-600 via-indigo-600 to-purple-700',
        illustrationSymbol: '🙏',
        audioLangCode: `${code}-IN`,
      },
    ],
  };
}
