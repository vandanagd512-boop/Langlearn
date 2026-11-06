import { CourseData, CourseSection, LessonSummary } from '../types/course-structure.types';

interface SectionTemplate {
  slug: string;
  title: string;
  iconName: string;
  isQuiz?: boolean;
  descByLang: Record<string, { desc: string; nativeTitle: string }>;
  defaultLessons: Array<{ title: string; duration: number; type: 'theory' | 'interactive' | 'speaking' | 'quiz' }>;
}

const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    slug: 'introduction',
    title: 'Introduction',
    iconName: 'Compass',
    descByLang: {
      kn: { desc: 'Overview of the Kannada language, heritage, and pronunciation structure.', nativeTitle: 'ಪರಿಚಯ (Parichaya)' },
      hi: { desc: 'Introduction to Hindi language roots, Devanagari script, and formal registers.', nativeTitle: 'परिचय (Parichay)' },
      ta: { desc: 'Classical origins of Tamil, spoken dialects, and linguistic structure.', nativeTitle: 'அறிமுகம் (Arimugam)' },
      te: { desc: 'Phonetic beauty of Telugu, Italian of the East, and vowels foundations.', nativeTitle: 'పరిచయం (Parichayam)' },
      ml: { desc: 'Malayalam script origins, soft palatals, and everyday spoken patterns.', nativeTitle: 'ആമുഖം (Aamukham)' },
      mr: { desc: 'Introduction to Marathi spoken etiquette, history, and Devanagari style.', nativeTitle: 'ओळख (Olakh)' },
      bn: { desc: 'Musicality of Bengali vowels, Rabindranath prose, and modern syntax.', nativeTitle: 'ভূমিকা (Bhumika)' },
      gu: { desc: 'Gujarati commercial dialect, vowel diacritics, and conversational tones.', nativeTitle: 'ઓળખાણ (Olkhaan)' },
      pa: { desc: 'Gurmukhi tones, energetic rhythm, and basic cadence of Punjabi speech.', nativeTitle: 'ਜਾਣ-ਪਛਾਣ (Jaan-Pachhaan)' },
      en: { desc: 'Global English phonetics, intonation patterns, and CEFR curriculum roadmap.', nativeTitle: 'Welcome & Overview' },
    },
    defaultLessons: [
      { title: 'Welcome to the Language & Culture', duration: 8, type: 'theory' },
      { title: 'Linguistic Roots & Registers', duration: 10, type: 'interactive' },
      { title: 'How to Study Efficiently with LangLearn', duration: 7, type: 'interactive' },
    ],
  },
  {
    slug: 'alphabet',
    title: 'Alphabet',
    iconName: 'SpellCheck',
    descByLang: {
      kn: { desc: 'Learn Swaras (vowels), Vyanjanas (consonants), and Yogavaahakas.', nativeTitle: 'ವರ್ಣಮಾಲೆ (Varnamale)' },
      hi: { desc: 'Vowels (Swar), consonants (Vyanjan), and matra diacritics in Devanagari.', nativeTitle: 'वर्णमाला (Varnamala)' },
      ta: { desc: 'Uyir eḻuttu (vowels), Mei eḻuttu (consonants), and Ayutha eḻuttu.', nativeTitle: 'நெடுங்கணக்கு (Nedunkanakku)' },
      te: { desc: 'Achulu (vowels), Hallulu (consonants), and Guninthalu combination marks.', nativeTitle: 'వర్ణమాల (Varnamala)' },
      ml: { desc: 'Swarangal, Vyanjanangal, and the unique chillaksharam glyphs.', nativeTitle: 'അക്ഷരമാല (Aksharamala)' },
      mr: { desc: 'Mastering the Marathi alphabet, conjuncts, and nasal anusvara marks.', nativeTitle: 'मुळाक्षरे (Mulakshare)' },
      bn: { desc: 'Borna identity: Shorborno vowels and Byonjonborno consonants.', nativeTitle: 'বর্ণমালা (Bornomala)' },
      gu: { desc: 'Gujarati script without top bar: Svara, Vyanjana, and jodakshar.', nativeTitle: 'કક્કો (Kakko)' },
      pa: { desc: 'Painti Akhari: The 35 primary letters of the Gurmukhi alphabet.', nativeTitle: 'ਪੈਂਤੀ ਅੱਖਰੀ (Painti Akhari)' },
      en: { desc: 'Latin alphabet, consonant blends, silent letters, and diphthongs.', nativeTitle: 'Alphabet & Phonics' },
    },
    defaultLessons: [
      { title: 'Primary Vowels & Diacritics', duration: 15, type: 'interactive' },
      { title: 'Consonants (Velar to Labial)', duration: 18, type: 'interactive' },
      { title: 'Conjuncts & Syllable Combinations', duration: 12, type: 'interactive' },
      { title: 'Writing & Recognizing Glyph Strokes', duration: 14, type: 'speaking' },
    ],
  },
  {
    slug: 'pronunciation',
    title: 'Pronunciation',
    iconName: 'Volume2',
    descByLang: {
      kn: { desc: 'Master aspirated vs unaspirated consonants, retroflex ಳ (La) and ಱ (Ra).', nativeTitle: 'ಉಚ್ಚಾರಣೆ (Uccharane)' },
      hi: { desc: 'Aspirated sounds (ख, घ, छ), retroflex (ट, ठ, ड), and nasalization (Chandrabindu).', nativeTitle: 'उच्चारण (Uchcharan)' },
      ta: { desc: 'The distinctive retroflex ழ (zha), hard Vallinam, and soft Mellinam.', nativeTitle: 'உச்சரிப்பு (Ucharippu)' },
      te: { desc: 'Vocalic lilt, pure retroflex sounds, and musical syllable endings.', nativeTitle: 'ఉచ్ఛారణ (Uccharana)' },
      ml: { desc: 'Phonetic nuances, alveolar nasals, and the rolling retroflex ഴ (Zha).', nativeTitle: 'ഉച്ചാരണം (Uccharanam)' },
      mr: { desc: 'Differentiating च/छ and ज/झ dento-alveolar sounds from palatals.', nativeTitle: 'उच्चार (Uchchar)' },
      bn: { desc: 'Inherent vowel rounding [ɔ], soft sh-sounds, and silent halant nuance.', nativeTitle: 'উচ্চারণ (Uchcharon)' },
      gu: { desc: 'Clear dental pronunciation, retroflex flap, and breathy voiced plosives.', nativeTitle: 'ઉચ્ચારણ (Uccharan)' },
      pa: { desc: 'Tonal contours: High falling, mid level, and low rising tones in action.', nativeTitle: 'ਉਚਾਰਨ (Uchaaran)' },
      en: { desc: 'Schwa vowel, stress timing, linked speech, and intonation shifts.', nativeTitle: 'Pronunciation & Stress' },
    },
    defaultLessons: [
      { title: 'Aspiration & Breath Control', duration: 12, type: 'speaking' },
      { title: 'Retroflex vs Dental Consonants', duration: 15, type: 'speaking' },
      { title: 'Vowel Length & Tone Modulation', duration: 14, type: 'interactive' },
    ],
  },
  {
    slug: 'basic-words',
    title: 'Basic Words',
    iconName: 'Sparkles',
    descByLang: {
      kn: { desc: 'Essential 100 root vocabulary words for objects, pronouns, and actions.', nativeTitle: 'ಮೂಲ ಪದಗಳು (Mula Padagalu)' },
      hi: { desc: 'High-frequency nouns, pronouns, interrogative words, and adjectives.', nativeTitle: 'मूल शब्द (Mool Shabd)' },
      ta: { desc: 'Everyday vocabulary for common household objects and demonstratives.', nativeTitle: 'அடிப்படை சொற்கள் (Adippadai Sorkal)' },
      te: { desc: 'Essential building block words for everyday visual recognition.', nativeTitle: 'ప్రాథమిక పదాలు (Prathamika Padalu)' },
      ml: { desc: 'Core vocabulary for everyday interactions, home, and city life.', nativeTitle: 'അടിസ്ഥാന വാക്കുകൾ (Adisthana Vakkukal)' },
      mr: { desc: 'Important functional words, pronouns, and descriptive adjectives.', nativeTitle: 'मूलभूत शब्द (Moolbhooth Shabd)' },
      bn: { desc: 'Foundational word list for objects, sensory feelings, and inquiries.', nativeTitle: 'মৌলিক শব্দ (Moulik Shobdo)' },
      gu: { desc: 'Everyday vocabulary items for rapid spoken recognition.', nativeTitle: 'મૂળભૂત શબ્દો (Moolbhoot Shabdo)' },
      pa: { desc: 'Core daily words, interrogatives (Kithe, Kadon, Kyun), and objects.', nativeTitle: 'ਬੁਨਿਆਦੀ ਸ਼ਬਦ (Buniadi Shabad)' },
      en: { desc: 'The Oxford 3000 foundation vocabulary and high-frequency roots.', nativeTitle: 'High-Frequency Core Words' },
    },
    defaultLessons: [
      { title: 'Pronouns (I, You, We, They)', duration: 10, type: 'interactive' },
      { title: 'Common Objects & Surroundings', duration: 12, type: 'interactive' },
      { title: 'Question Words (Who, What, Where, Why)', duration: 14, type: 'interactive' },
      { title: 'Descriptive Adjectives & Colors', duration: 12, type: 'interactive' },
    ],
  },
  {
    slug: 'greetings',
    title: 'Greetings',
    iconName: 'MessageCircle',
    descByLang: {
      kn: { desc: 'Formal and casual greetings, respectful honorifics (Re / Ri).', nativeTitle: 'ಶುಭಾಶಯಗಳು ಮತ್ತು ವಂದನೆ (Vandane)' },
      hi: { desc: 'Namaste, Pranam, polite greetings, and respectful Aap/Tum address.', nativeTitle: 'नमस्ते और अभिवादन (Abhivadan)' },
      ta: { desc: 'Vanakkam, polite social courtesy, and pleasantries with elders.', nativeTitle: 'வணக்கம் மற்றும் வாழ்த்துக்கள் (Vanakkam)' },
      te: { desc: 'Namaskaram, welcome phrases, and polite inquiries after health.', nativeTitle: 'నమస్కారాలు & శుభాకాంక్షలు (Namaskaralu)' },
      ml: { desc: 'Namaskaram, warm conversational openers, and respectful farewells.', nativeTitle: 'നമസ്കാരം (Namaskaram)' },
      mr: { desc: 'Namaskar, respectful social greetings, and friendly welcome expressions.', nativeTitle: 'नमस्कार व संभाषण (Namaskar)' },
      bn: { desc: 'Nomoshkar, Salam, warm hospitality phrases, and courtesy farewells.', nativeTitle: 'নমস্কার ও সম্ভাষণ (Nomoshkar)' },
      gu: { desc: 'Kem Cho, Jai Shri Krishna, polite morning and evening pleasantries.', nativeTitle: 'કેમ છો અને નમસ્કાર (Kem Cho)' },
      pa: { desc: 'Sat Sri Akal, warm Punjabi greetings, respectful Ji add-ons.', nativeTitle: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ (Sat Sri Akal)' },
      en: { desc: 'Formal and casual greetings, small talk openers, and email etiquette.', nativeTitle: 'Greetings & Pleasantries' },
    },
    defaultLessons: [
      { title: 'Formal vs Informal Greetings', duration: 10, type: 'speaking' },
      { title: 'Polite Inquiries ("How are you?", "All good?")', duration: 12, type: 'interactive' },
      { title: 'Saying Goodbye, Thank You & Please', duration: 11, type: 'speaking' },
      { title: 'Respectful Honorific Suffixes', duration: 14, type: 'theory' },
    ],
  },
  {
    slug: 'numbers',
    title: 'Numbers',
    iconName: 'Hash',
    descByLang: {
      kn: { desc: 'Counting from 1 to 100, native Kannada numerals (೧, ೨, ೩), and prices.', nativeTitle: 'ಸಂಖ್ಯೆಗಳು (Sankhyegalu)' },
      hi: { desc: 'Counting 1 to 100 in Hindi (१, २, ३), ordinals, and bargaining numbers.', nativeTitle: 'संख्याएँ और गिनती (Ginti)' },
      ta: { desc: 'Tamil numerals (௧, ௨, ௩), numbers 1 to 100, and market transactions.', nativeTitle: 'எண்கள் (Enkal)' },
      te: { desc: 'Telugu numerals (౧, ౨, ౩), counting, time reading, and phone numbers.', nativeTitle: 'సంఖ్యలు (Sankhyalu)' },
      ml: { desc: 'Numbers 1 to 100, Malayalam numerals (൧, ൨, ൩), and calculating bills.', nativeTitle: 'സംഖ്യകൾ (Samkhyakal)' },
      mr: { desc: 'Marathi counting, prices, time of day, and native fractions (pav, ardha).', nativeTitle: 'अंक आणि संख्या (Ank)' },
      bn: { desc: 'Bengali digits (১, ২, ৩), counting, currencies (Taka), and shop totals.', nativeTitle: 'সংখ্যা ও গণনা (Shongkha)' },
      gu: { desc: 'Gujarati counting (૧, ૨, ૩), business calculation words, and dates.', nativeTitle: 'સંખ્યાઓ (Sankhyao)' },
      pa: { desc: 'Punjabi counting (੧, ੨, ੩), market prices, and time expressions.', nativeTitle: 'ਗਿਣਤੀ (Ginti)' },
      en: { desc: 'Cardinals, ordinals, fractions, currency formats, and telephone numbers.', nativeTitle: 'Numbers, Time & Money' },
    },
    defaultLessons: [
      { title: 'Counting 1 to 20', duration: 10, type: 'interactive' },
      { title: 'Tens & Counting to 100', duration: 12, type: 'interactive' },
      { title: 'Asking Prices & Market Math', duration: 14, type: 'speaking' },
      { title: 'Telling Time & Dates', duration: 12, type: 'interactive' },
    ],
  },
  {
    slug: 'family',
    title: 'Family',
    iconName: 'Users',
    descByLang: {
      kn: { desc: 'Specific kinships: Appa, Amma, Anna, Tangi, Maava, and Atthe.', nativeTitle: 'ಕುಟುಂಬದ ಸಂಬಂಧಗಳು (Kutumba)' },
      hi: { desc: 'Distinct paternal and maternal family names (Chacha, Mama, Didi, Bhaiya).', nativeTitle: 'परिवार और रिश्ते (Parivar)' },
      ta: { desc: 'Appa, Amma, Anna, Akka, Chitappa, and rich Tamil kinship terms.', nativeTitle: 'குடும்பம் (Kudumbam)' },
      te: { desc: 'Nanna, Amma, Annayya, Chelli, Mavayya, and extended familial terms.', nativeTitle: 'కుటుంబం & బంధువులు (Kutumbam)' },
      ml: { desc: 'Achan, Amma, Chettan, Chechi, and extended family relationships.', nativeTitle: 'കുടുംബം (Kudumbam)' },
      mr: { desc: 'Aai, Baba, Bhau, Bahin, Kaka, and affectionate Marathi relation terms.', nativeTitle: 'कुटुंब आणि नातेसंबंध (Kutumb)' },
      bn: { desc: 'Baba, Ma, Dada, Didi, Kaka, Mashi, and traditional family bonds.', nativeTitle: 'পরিবার ও আত্মীয় (Poribar)' },
      gu: { desc: 'Mata, Pita, Bhai, Ben, Kaka, Masi, and familial respect forms.', nativeTitle: 'પરિવાર અને સંબંધો (Parivar)' },
      pa: { desc: 'Bapu, Bebe, Veer, Bhain, Chacha, Mama, and warm Punjabi relations.', nativeTitle: 'ਪਰਿਵਾਰ ਅਤੇ ਰਿਸ਼ਤੇ (Parivaar)' },
      en: { desc: 'Nuclear and extended family, in-laws, and relationship descriptions.', nativeTitle: 'Family & Relationships' },
    },
    defaultLessons: [
      { title: 'Immediate Family (Parents & Siblings)', duration: 11, type: 'interactive' },
      { title: 'Paternal vs Maternal Kinship Titles', duration: 15, type: 'theory' },
      { title: 'Describing Your Family Members', duration: 12, type: 'speaking' },
    ],
  },
  {
    slug: 'food',
    title: 'Food',
    iconName: 'UtensilsCrossed',
    descByLang: {
      kn: { desc: 'Ordering Oota, Dosay, Filter Kaapi, spices, and dietary preferences.', nativeTitle: 'ಊಟ ಮತ್ತು ತಿಂಡಿ (Oota)' },
      hi: { desc: 'Street food delicacies, ordering chai, spices, sweets, and restaurant talk.', nativeTitle: 'खाना और व्यंजन (Khaana)' },
      ta: { desc: 'South Indian meals (Saapaadu), tiffin, filter coffee, and taste adjectives.', nativeTitle: 'உணவு மற்றும் சுவை (Unavu)' },
      te: { desc: 'Bhojanam, Andhra spicy curries, pickles (Avakaya), and restaurant orders.', nativeTitle: 'ఆహారం & రుచులు (Aaharam)' },
      ml: { desc: 'Kerala Sadya, Appam, seafood, coconut flavors, and bakery visits.', nativeTitle: 'ഭക്ഷണം (Bhakshanam)' },
      mr: { desc: 'Poha, Misal Pav, Poli, Puran Poli, and ordering at local eateries.', nativeTitle: 'खाद्यपदार्थ आणि चव (Khadya)' },
      bn: { desc: 'Fish delicacies (Maach), Rosogolla, Cha, Kosha Mangsho, and sweets.', nativeTitle: 'খাবার ও স্বাদ (Khabar)' },
      gu: { desc: 'Dhokla, Thepla, Farsan, Kathiyawadi thali, and sweet taste profiles.', nativeTitle: 'ખોરાક અને ભોજન (Khorak)' },
      pa: { desc: 'Makki di Roti, Sarson da Saag, Lassi, Paneer, and dhaba orders.', nativeTitle: 'ਖਾਣ-ਪੀਣ (Khaan-Peen)' },
      en: { desc: 'Dining out, dietary restrictions, cooking verbs, and taste descriptions.', nativeTitle: 'Food, Dining & Drinks' },
    },
    defaultLessons: [
      { title: 'Common Dishes, Staples & Spices', duration: 12, type: 'interactive' },
      { title: 'Ordering at a Restaurant or Cafe', duration: 15, type: 'speaking' },
      { title: 'Expressing Likes, Dislikes & Flavors', duration: 12, type: 'interactive' },
      { title: 'Paying the Bill & Dietary Inquiries', duration: 10, type: 'interactive' },
    ],
  },
  {
    slug: 'daily-conversation',
    title: 'Daily Conversation',
    iconName: 'MessageSquareText',
    descByLang: {
      kn: { desc: 'Taking an auto/metro, asking directions, bargaining, and office chatter.', nativeTitle: 'ದೈನಂದಿನ ಸಂಭಾಷಣೆ (Sambhashane)' },
      hi: { desc: 'Auto-rickshaw haggling, directions, shopping, and everyday small talk.', nativeTitle: 'दैनिक बोलचाल (Bolchaal)' },
      ta: { desc: 'Everyday transit, street inquiries, market shopping, and neighbor talk.', nativeTitle: 'தினசரி உரையாடல் (Uraiyadal)' },
      te: { desc: 'Auto transit, shopping in bazaars, navigation, and workplace talk.', nativeTitle: 'రోజువారీ సంభాషణ (Sambhashana)' },
      ml: { desc: 'Bus transit, asking for directions, grocery shops, and neighbor chats.', nativeTitle: 'ദൈനംദിന സംഭാഷണം (Sambhashanam)' },
      mr: { desc: 'Local train talk, auto meters, grocery shopping, and office banter.', nativeTitle: 'दैनंदिन संवाद (Samvaad)' },
      bn: { desc: 'Metro commute, Kolkata yellow taxi talks, adda conversations, and bazaars.', nativeTitle: 'দৈনন্দিন কথপোকথন (Kothopokothon)' },
      gu: { desc: 'Business networking, local transit, market deals, and social events.', nativeTitle: 'રોજિંદી વાતચીત (Vaatchit)' },
      pa: { desc: 'Travel by bus/auto, shopping, neighborhood events, and hearty chats.', nativeTitle: 'ਰੋਜ਼ਾਨਾ ਗੱਲਬਾਤ (Gallbaat)' },
      en: { desc: 'Public transit, airport customs, shopping transactions, and small talk.', nativeTitle: 'Everyday Practical Conversations' },
    },
    defaultLessons: [
      { title: 'Taking Public Transit & Giving Directions', duration: 14, type: 'speaking' },
      { title: 'Shopping, Bargaining & Sizing', duration: 15, type: 'interactive' },
      { title: 'Making Plans & Meeting Friends', duration: 13, type: 'interactive' },
      { title: 'Handling Emergencies & Inquiries', duration: 12, type: 'speaking' },
    ],
  },
  {
    slug: 'grammar-basics',
    title: 'Grammar Basics',
    iconName: 'BookCheck',
    descByLang: {
      kn: { desc: 'Subject-Object-Verb (SOV) order, verb conjugations, and vibhakti cases.', nativeTitle: 'ವ್ಯಾಕರಣದ ಮೂಲಗಳು (Vyaakarana)' },
      hi: { desc: 'Gender of nouns, postpositions (ne, ko, se), and past/future tenses.', nativeTitle: 'व्याकरण के नियम (Vyakaran)' },
      ta: { desc: 'Agglutinative suffixes, case endings, and verb past/present/future forms.', nativeTitle: 'இலக்கண அடிப்படைகள் (Ilakkanam)' },
      te: { desc: 'Telugu noun cases (Vibhakthulu), verbal stems, and person conjugations.', nativeTitle: 'వ్యాకరణం (Vyakaranam)' },
      ml: { desc: 'Postpositions, non-gendered verbs, and agglutinative sentence patterns.', nativeTitle: 'വ്യാകരണം (Vyakaranam)' },
      mr: { desc: 'Three grammatical genders, vibhakti pratyay, and regular tense conjugations.', nativeTitle: 'व्याकरण मूलभूत (Vyakaran)' },
      bn: { desc: 'Genderless verbs, case suffixes, and simple past/present/future structure.', nativeTitle: 'ব্যাকরণ প্রাথমিক (Byakoron)' },
      gu: { desc: 'Neuter gender nouns, postpositions, and polite imperative verb forms.', nativeTitle: 'વ્યાકરણ પરિચય (Vyakaran)' },
      pa: { desc: 'Gender inflection, auxiliary verbs (hai/si), and past participial rules.', nativeTitle: 'ਵਿਆਕਰਣ ਦੇ ਨਿਯਮ (Vyakaran)' },
      en: { desc: 'Present/Past/Future tenses, modal verbs, prepositions, and articles.', nativeTitle: 'Core Grammar Architecture' },
    },
    defaultLessons: [
      { title: 'Sentence Order: SOV Word Construction', duration: 16, type: 'theory' },
      { title: 'Present, Past & Future Verb Endings', duration: 18, type: 'interactive' },
      { title: 'Postpositions & Case Markers', duration: 15, type: 'interactive' },
      { title: 'Negation & Conditional Statements', duration: 14, type: 'interactive' },
    ],
  },
  {
    slug: 'quiz',
    title: 'Quiz',
    iconName: 'HelpCircle',
    isQuiz: true,
    descByLang: {
      kn: { desc: 'Comprehensive exam testing reading, listening, vocabulary, and grammar.', nativeTitle: 'ಅಂತಿಮ ಪರೀಕ್ಷೆ (Parikshe)' },
      hi: { desc: 'Comprehensive milestone test across all modules to earn your certificate.', nativeTitle: 'अंतिम मूल्यांकन परीक्षा (Pariksha)' },
      ta: { desc: 'Comprehensive evaluation of pronunciation, grammar, and speaking fluency.', nativeTitle: 'இறுதி வினாடி வினா (Vinaadi Vina)' },
      te: { desc: 'Milestone assessment covering dialogue comprehension, vocabulary, and case rules.', nativeTitle: 'తుది పరీక్ష & క్విజ్ (Pariksha)' },
      ml: { desc: 'Comprehensive final exam with interactive audio questions and sentence building.', nativeTitle: 'അന്തിമ ക്വിസ് (Quiz)' },
      mr: { desc: 'Complete review quiz testing reading, listening comprehension, and grammar.', nativeTitle: 'अंतिम सराव परीक्षा (Pariksha)' },
      bn: { desc: 'Full certification assessment test with listening and translation exercises.', nativeTitle: 'চূড়ান্ত কুইজ ও পরীক্ষা (Quiz)' },
      gu: { desc: 'Milestone quiz covering business terms, grammar conjugations, and dialogs.', nativeTitle: 'અંતિમ ક્વિઝ (Quiz)' },
      pa: { desc: 'Final comprehensive exam to earn your Punjabi Elementary Certificate.', nativeTitle: 'ਅੰਤਿਮ ਪ੍ਰੀਖਿਆ (Prikhiya)' },
      en: { desc: 'CEFR A1-A2 comprehensive proficiency quiz with speaking verification.', nativeTitle: 'Comprehensive Certification Exam' },
    },
    defaultLessons: [
      { title: 'Vocabulary & Translation Checkpoint', duration: 15, type: 'quiz' },
      { title: 'Listening & Audio Comprehension Exam', duration: 18, type: 'quiz' },
      { title: 'Grammar & Dialogue Construction Test', duration: 20, type: 'quiz' },
      { title: 'Final Certification Oral Challenge', duration: 20, type: 'quiz' },
    ],
  },
];

// Helper to assemble full CourseData for any language
export function getCourseDataForLanguage(langCode: string): CourseData {
  const code = (langCode || 'kn').toLowerCase();

  // Language metadata mapping
  const metadataMap: Record<
    string,
    {
      name: string;
      nativeName: string;
      flag: string;
      bannerGradient: string;
      accentColor: string;
      difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
      description: string;
      completedSectionsCount: number;
      certificateTitle: string;
    }
  > = {
    kn: {
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      flag: '🇮🇳',
      bannerGradient: 'from-amber-600 via-rose-600 to-indigo-700',
      accentColor: 'text-amber-600',
      difficulty: 'Beginner',
      description:
        'Master conversational Kannada, phonetic script, polite honorifics, and daily local life in Karnataka through structured CEFR-aligned modules.',
      completedSectionsCount: 4,
      certificateTitle: 'LangLearn Certified Elementary Kannada Speaker (A1-A2)',
    },
    hi: {
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      bannerGradient: 'from-orange-600 via-amber-600 to-indigo-700',
      accentColor: 'text-orange-600',
      difficulty: 'Beginner',
      description:
        'Comprehensive Devanagari reading, Bollywood dialogue comprehension, polite registers, and practical street fluency.',
      completedSectionsCount: 5,
      certificateTitle: 'LangLearn Certified Elementary Hindi Speaker (A1-A2)',
    },
    ta: {
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳',
      bannerGradient: 'from-rose-600 via-red-600 to-purple-800',
      accentColor: 'text-rose-600',
      difficulty: 'Intermediate',
      description:
        'Explore one of the world’s oldest classical languages, poetic syntax, spoken dialect differences, and cultural etiquette.',
      completedSectionsCount: 3,
      certificateTitle: 'LangLearn Certified Tamil Communicator (A1)',
    },
    te: {
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳',
      bannerGradient: 'from-blue-600 via-cyan-600 to-indigo-800',
      accentColor: 'text-blue-600',
      difficulty: 'Beginner',
      description:
        'Learn the musical language of Andhra and Telangana with rounded script mastery, tonal nuances, and daily conversation.',
      completedSectionsCount: 2,
      certificateTitle: 'LangLearn Certified Elementary Telugu Speaker (A1)',
    },
    ml: {
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      flag: '🇮🇳',
      bannerGradient: 'from-emerald-600 via-teal-600 to-blue-800',
      accentColor: 'text-emerald-600',
      difficulty: 'Intermediate',
      description:
        'Dive into God’s Own Country’s language: script recognition, rolling retroflexes, cuisine vocabulary, and practical dialogues.',
      completedSectionsCount: 1,
      certificateTitle: 'LangLearn Certified Malayalam Novice (A1)',
    },
    mr: {
      name: 'Marathi',
      nativeName: 'मराठी',
      flag: '🇮🇳',
      bannerGradient: 'from-orange-600 via-red-600 to-pink-700',
      accentColor: 'text-orange-600',
      difficulty: 'Beginner',
      description:
        'Speak Marathi with confidence across Mumbai and Maharashtra: train commute terms, respectful address, and Devanagari reading.',
      completedSectionsCount: 2,
      certificateTitle: 'LangLearn Certified Elementary Marathi Speaker (A1)',
    },
    bn: {
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇮🇳',
      bannerGradient: 'from-purple-600 via-pink-600 to-rose-700',
      accentColor: 'text-purple-600',
      difficulty: 'Beginner',
      description:
        'Experience the sweetness of Bengali: vowel rounding, melodic cadence, festive words, and cultural conversation.',
      completedSectionsCount: 3,
      certificateTitle: 'LangLearn Certified Bengali Communicator (A1)',
    },
    gu: {
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      flag: '🇮🇳',
      bannerGradient: 'from-amber-600 via-yellow-600 to-emerald-700',
      accentColor: 'text-amber-600',
      difficulty: 'Beginner',
      description:
        'Master the commercial and cultural language of Gujarat: script fluency without header bars, business etiquette, and friendly chats.',
      completedSectionsCount: 2,
      certificateTitle: 'LangLearn Certified Elementary Gujarati Speaker (A1)',
    },
    pa: {
      name: 'Punjabi',
      nativeName: 'ਪੰਜਾਬੀ',
      flag: '🇮🇳',
      bannerGradient: 'from-yellow-600 via-amber-600 to-red-700',
      accentColor: 'text-amber-600',
      difficulty: 'Beginner',
      description:
        'Vibrant Punjabi with Gurmukhi script, energetic conversational cadences, warm greetings, and food culture.',
      completedSectionsCount: 2,
      certificateTitle: 'LangLearn Certified Punjabi Communicator (A1)',
    },
    en: {
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      bannerGradient: 'from-indigo-600 via-blue-600 to-cyan-700',
      accentColor: 'text-indigo-600',
      difficulty: 'Beginner',
      description:
        'CEFR-aligned international English program: pronunciation, idioms, global business conversations, and grammar essentials.',
      completedSectionsCount: 6,
      certificateTitle: 'LangLearn Certified International English Speaker (B1)',
    },
  };

  const meta = metadataMap[code] || {
    name: 'Selected Language',
    nativeName: code.toUpperCase(),
    flag: '🌐',
    bannerGradient: 'from-slate-700 via-blue-800 to-indigo-900',
    accentColor: 'text-blue-500',
    difficulty: 'Beginner',
    description: 'Learn step-by-step with structured lessons, interactive quizzes, and pronunciation models.',
    completedSectionsCount: 2,
    certificateTitle: 'LangLearn Certificate of Completion',
  };

  let cumulativeLessonOrder = 1;
  const sections: CourseSection[] = SECTION_TEMPLATES.map((tmpl, sIndex) => {
    const isCompleted = sIndex < meta.completedSectionsCount;
    const isInProgress = sIndex === meta.completedSectionsCount;
    const isLocked = sIndex > meta.completedSectionsCount;

    const langDescObj = tmpl.descByLang[code] || tmpl.descByLang['en'] || {
      desc: `Curriculum and interactive practice for ${tmpl.title}.`,
      nativeTitle: tmpl.title,
    };

    const lessons: LessonSummary[] = tmpl.defaultLessons.map((les, lIndex) => {
      let lStatus: 'completed' | 'current' | 'locked' = 'locked';
      if (isCompleted) {
        lStatus = 'completed';
      } else if (isInProgress) {
        lStatus = lIndex === 0 ? 'current' : lIndex === 1 ? 'current' : 'locked';
      }

      return {
        id: `les-${code}-${tmpl.slug}-${lIndex + 1}`,
        sectionId: `sec-${code}-${tmpl.slug}`,
        order: cumulativeLessonOrder++,
        title: les.title,
        nativeTitle: lIndex === 0 ? langDescObj.nativeTitle : undefined,
        durationMinutes: les.duration,
        xpReward: tmpl.isQuiz ? 50 : 25,
        status: lStatus,
        type: les.type,
      };
    });

    const totalLessons = lessons.length;
    const completedLessons = isCompleted
      ? totalLessons
      : isInProgress
      ? Math.max(1, Math.floor(totalLessons / 2))
      : 0;

    const estimatedMinutes = lessons.reduce((acc, l) => acc + l.durationMinutes, 0);

    return {
      id: `sec-${code}-${tmpl.slug}`,
      sectionNumber: sIndex + 1,
      slug: tmpl.slug,
      title: tmpl.title,
      nativeTitle: langDescObj.nativeTitle,
      shortDescription: langDescObj.desc,
      iconName: tmpl.iconName,
      totalLessons,
      completedLessons,
      estimatedMinutes,
      status: isCompleted ? 'completed' : isInProgress ? 'in_progress' : 'locked',
      isLocked,
      isQuiz: Boolean(tmpl.isQuiz),
      lessons,
    };
  });

  const totalLessons = sections.reduce((sum, s) => sum + s.totalLessons, 0);
  const completedLessons = sections.reduce((sum, s) => sum + s.completedLessons, 0);
  const totalQuizzes = sections.filter((s) => s.isQuiz).reduce((sum, s) => sum + s.totalLessons, 0);
  const completedQuizzes = sections
    .filter((s) => s.isQuiz)
    .reduce((sum, s) => sum + s.completedLessons, 0);

  const estimatedHours = Math.round(
    sections.reduce((sum, s) => sum + s.estimatedMinutes, 0) / 60
  );

  const earnedXp = completedLessons * 25 + completedQuizzes * 25;
  const totalXp = totalLessons * 25 + totalQuizzes * 25;

  return {
    languageCode: code,
    languageName: meta.name,
    nativeName: meta.nativeName,
    flag: meta.flag,
    bannerGradient: meta.bannerGradient,
    accentColor: meta.accentColor,
    difficulty: meta.difficulty,
    description: meta.description,
    totalLessons,
    completedLessons,
    totalQuizzes,
    completedQuizzes,
    estimatedHours,
    earnedXp,
    totalXp,
    certificateAvailable: true,
    certificateTitle: meta.certificateTitle,
    sections,
  };
}
