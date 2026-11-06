export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  sampleGreeting: string;
  learnersCount?: string;
  region?: string;
}

export interface GoalOption {
  minutes: number;
  title: string;
  tagline: string;
  intensity: 'casual' | 'regular' | 'focused' | 'serious' | 'intensive';
  xpPerDay: string;
  isRecommended?: boolean;
}

/**
 * 10 Supported Target Languages as specified in requirements
 */
export const TARGET_LANGUAGES: LanguageOption[] = [
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    sampleGreeting: 'ನಮಸ್ಕಾರ (Namaskara)',
    region: 'Karnataka',
    learnersCount: '450k+',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    sampleGreeting: 'नमस्ते (Namaste)',
    region: 'North & Central India',
    learnersCount: '2.4M+',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    sampleGreeting: 'வணக்கம் (Vanakkam)',
    region: 'Tamil Nadu & Sri Lanka',
    learnersCount: '890k+',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    sampleGreeting: 'నమస్కారం (Namaskaram)',
    region: 'Andhra Pradesh & Telangana',
    learnersCount: '780k+',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    sampleGreeting: 'നമസ്കാരം (Namaskaram)',
    region: 'Kerala',
    learnersCount: '520k+',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    sampleGreeting: 'नमस्कार (Namaskar)',
    region: 'Maharashtra',
    learnersCount: '640k+',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    sampleGreeting: 'নমস্কার (Nomoshkar)',
    region: 'West Bengal & Bangladesh',
    learnersCount: '1.1M+',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    sampleGreeting: 'નમસ્તે (Namaste)',
    region: 'Gujarat',
    learnersCount: '410k+',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    sampleGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ (Sat Sri Akal)',
    region: 'Punjab',
    learnersCount: '490k+',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🌐',
    sampleGreeting: 'Hello / Welcome',
    region: 'Global Lingua Franca',
    learnersCount: '5.2M+',
  },
];

/**
 * Native languages selection list
 */
export const NATIVE_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐', sampleGreeting: 'Hello' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', sampleGreeting: 'नमस्ते' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', sampleGreeting: 'ನಮಸ್ಕಾರ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', sampleGreeting: 'வணக்கம்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', sampleGreeting: 'నమస్కారం' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', sampleGreeting: 'നമസ്കാരം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', sampleGreeting: 'नमस्कार' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', sampleGreeting: 'নমস্কার' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', sampleGreeting: 'નમસ્તે' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', sampleGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', sampleGreeting: 'Hola' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', sampleGreeting: 'Bonjour' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', sampleGreeting: 'Guten Tag' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', sampleGreeting: 'こんにちは' },
];

/**
 * Daily Goal options as specified in requirements
 */
export const DAILY_GOAL_OPTIONS: GoalOption[] = [
  {
    minutes: 5,
    title: 'Casual',
    tagline: 'Light commitment to spark daily consistency',
    intensity: 'casual',
    xpPerDay: '+10 XP / day',
  },
  {
    minutes: 10,
    title: 'Regular',
    tagline: 'Balanced pace for steady vocabulary retention',
    intensity: 'regular',
    xpPerDay: '+20 XP / day',
  },
  {
    minutes: 15,
    title: 'Focused',
    tagline: 'The sweet spot for rapid conversational fluency',
    intensity: 'focused',
    xpPerDay: '+35 XP / day',
    isRecommended: true,
  },
  {
    minutes: 20,
    title: 'Serious',
    tagline: 'Deeper practice sessions for accelerated progress',
    intensity: 'serious',
    xpPerDay: '+50 XP / day',
  },
  {
    minutes: 30,
    title: 'Intensive',
    tagline: 'Maximum immersion for near-native language mastery',
    intensity: 'intensive',
    xpPerDay: '+80 XP / day',
  },
];
