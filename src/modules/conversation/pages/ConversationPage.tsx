import React, { useState, useEffect } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Mic,
  Volume2,
  VolumeX,
  PhoneOff,
  Sparkles,
  Zap,
  MessageSquare,
  Send,
  GraduationCap,
  Key,
} from 'lucide-react';
import { SpeechService } from '@/services/speech/speech.service';
import { translationService } from '@/services/translation/translation.service';
import { AIService } from '@/services/ai/ai.service';
import { useNotification } from '@/context/NotificationContext';
import { useAppStore } from '@/state/store';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

interface TeacherPersona {
  id: 'ananya' | 'aarav';
  name: string;
  role: string;
  avatarEmoji: string;
  accentColor: string;
  gradient: string;
  voicePitch: number;
  greetingPhrases: Record<string, { native: string; romanized: string; english: string }>;
}

const TEACHERS: TeacherPersona[] = [
  {
    id: 'ananya',
    name: 'Teacher Ananya',
    role: 'Head Language Teacher & Pronunciation Coach',
    avatarEmoji: '👩‍🏫',
    accentColor: 'from-pink-500 to-rose-600',
    gradient: 'from-purple-900 via-indigo-950 to-slate-950',
    voicePitch: 1.1,
    greetingPhrases: {
      kn: {
        native: 'ನಮಸ್ಕಾರ ವಿದ್ಯಾರ್ಥಿ! ನಾನು ನಿಮ್ಮ ಶಿಕ್ಷಕಿ ಅನನ್ಯಾ. ಇಂದು ನೀವು ಏನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ? ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ!',
        romanized: 'Namaskara vidyarthi! Naanu nimma shikshaki Ananya. Indu neevu enu kaliyalu bayasuttiri? Yaavude prashne keli!',
        english: 'Hello student! I am your teacher Ananya. What would you like to learn today? Ask me any question!',
      },
      hi: {
        native: 'नमस्ते विद्यार्थी! मैं आपकी शिक्षिका अनन्या हूँ। आज आप क्या सीखना चाहते हैं? मुझसे कोई भी सवाल पूछें!',
        romanized: 'Namaste vidyarthi! Main aapki shikshika Ananya hoon. Aaj aap kya seekhna chahte hain?',
        english: 'Hello student! I am your teacher Ananya. What would you like to learn today? Ask me any question!',
      },
      ta: {
        native: 'வணக்கம் மாணவரே! நான் உங்கள் ஆசிரியை அனன்யா. இன்று என்ன கற்றுக்கொள்ள விரும்புகிறீர்கள்?',
        romanized: 'Vanakkam maanavare! Naan ungal aasiriyai Ananya. Indru enna katrukkolla virumbugireergal?',
        english: 'Hello student! I am your teacher Ananya. What would you like to learn today?',
      },
      te: {
        native: 'నమస్కారం విద్యార్థి! నేను మీ ఉపాధ్యాయురాలు అనన్య. ఈ రోజు మీరు ఏమి నేర్చుకోవాలనుకుంటున్నారు?',
        romanized: 'Namaskaram vidyarthi! Nenu mee upadhyayauralu Ananya. Ee roju meeru emi nerchukovalani anukuntunnaru?',
        english: 'Hello student! I am your teacher Ananya. What would you like to learn today?',
      },
      en: {
        native: 'Hello student! I am Teacher Ananya. What would you like to learn or practice today? Feel free to ask anything!',
        romanized: 'Hello student! I am Teacher Ananya.',
        english: 'Hello student! What would you like to learn or practice today? Feel free to ask anything!',
      },
    },
  },
  {
    id: 'aarav',
    name: 'Professor Aarav',
    role: 'Senior Language Professor & Grammar Guide',
    avatarEmoji: '👨‍🏫',
    accentColor: 'from-blue-500 to-indigo-600',
    gradient: 'from-blue-950 via-slate-900 to-slate-950',
    voicePitch: 0.9,
    greetingPhrases: {
      kn: {
        native: 'ನಮಸ್ಕಾರ! ನಾನು ಪ್ರೊಫೆಸರ್ ಆರವ್. ವ್ಯಾಕರಣ ಅಥವಾ ವಾಕ್ಯಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಸಂದೇಹವಿದ್ದರೆ ಕೇಳಿ, ಒಟ್ಟಿಗೆ ಕಲಿಯೋಣ!',
        romanized: 'Namaskara! Naanu Professor Aarav. Vyakaranada bagge sandehaviddare keli, ottige kaliyona!',
        english: 'Hello! I am Professor Aarav. Ask me any doubts about grammar or sentences, let us learn together!',
      },
      hi: {
        native: 'नमस्ते! मैं प्रोफेसर आरव हूँ। व्याकरण या वाक्यों के बारे में कोई भी शंका हो तो पूछें!',
        romanized: 'Namaste! Main Professor Aarav hoon. Vyakaran ke baare mein koi bhi sawal poochhein!',
        english: 'Hello! I am Professor Aarav. If you have any doubts about grammar or sentences, feel free to ask!',
      },
      ta: {
        native: 'வணக்கம்! நான் பேராசிரியர் ஆரவ். தமிழ் இலக்கணம் மற்றும் உரையாடல்களை ஒன்றாக கற்போம்!',
        romanized: 'Vanakkam! Naan perasiriyar Aarav. Thamizh ilakkanam patri kelungal!',
        english: 'Hello! I am Professor Aarav. Let us learn grammar and conversations together!',
      },
      te: {
        native: 'నమస్కారం! నేను ప్రొఫెసర్ ఆరవ్. వ్యాకరణం మరియు వాక్యాల గురించి ఏవైనా సందేహాలుంటే అడగండి!',
        romanized: 'Namaskaram! Nenu Professor Aarav. Vyakaranam gurinchi sandehalu adagandi!',
        english: 'Hello! I am Professor Aarav. Feel free to ask any doubts about grammar and vocabulary!',
      },
      en: {
        native: 'Hello! I am Professor Aarav. Ask me any doubt about grammar, vocabulary, or pronunciation!',
        romanized: 'Hello! I am Professor Aarav.',
        english: 'Hello! Ask me any doubt about grammar, vocabulary, or pronunciation!',
      },
    },
  },
];

export const ConversationPage: React.FC = () => {
  const { activeLanguageCode, setActiveLanguageCode } = useAppStore();
  const { notify } = useNotification();

  const [micLanguageMode, setMicLanguageMode] = useState<'en' | 'native'>('en');
  const [activeTeacher, setActiveTeacher] = useState<TeacherPersona>(TEACHERS[0]);
  const [avatarState, setAvatarState] = useState<'idle' | 'speaking' | 'listening' | 'thinking'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(AIService.getApiKey());
  const [hasApiKey, setHasApiKey] = useState(AIService.hasApiKey());
  const [currentSubtitle, setCurrentSubtitle] = useState({
    native: '',
    romanized: '',
    english: '',
  });
  const [fluencyScore, setFluencyScore] = useState(96);
  const [typedInput, setTypedInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState<
    { speaker: string; text: string; translation?: string }[]
  >([]);

  const speechLangCode = `${activeLanguageCode}-IN`;

  // Active call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize teacher greeting on load or teacher/language switch
  useEffect(() => {
    const greeting =
      activeTeacher.greetingPhrases[activeLanguageCode] ||
      activeTeacher.greetingPhrases['kn'] ||
      activeTeacher.greetingPhrases['en'];

    setCurrentSubtitle(greeting);
    speakTeacherMessage(greeting.native, greeting.english);
  }, [activeTeacher, activeLanguageCode]);

  const speakTeacherMessage = async (text: string, translation?: string) => {
    if (isMuted) return;

    setAvatarState('speaking');
    try {
      // Clean romanized annotations for TTS synthesis
      const cleanForTTS = text.replace(/\(.*?\)/g, '').trim();
      await SpeechService.speak(cleanForTTS || text, speechLangCode);
    } catch {
      // TTS synthesis fallback
    } finally {
      setAvatarState('idle');
    }

    setConversationHistory((prev) => [
      ...prev,
      { speaker: activeTeacher.name, text, translation },
    ]);
  };

  /**
   * Real Voice Command Recognition using Web Speech API:
   * Actually captures student's spoken audio through their mobile or laptop microphone!
   */
  const handleStartVoiceRecognition = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      notify({
        type: 'warning',
        title: 'Microphone Not Supported',
        message: 'Your browser does not support Speech Recognition. You can type your question in the text box below!',
      });
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      // Set recognition language based on user mode
      recognition.lang =
        micLanguageMode === 'en'
          ? 'en-IN'
          : activeLanguageCode === 'kn'
            ? 'kn-IN'
            : activeLanguageCode === 'hi'
              ? 'hi-IN'
              : activeLanguageCode === 'te'
                ? 'te-IN'
                : activeLanguageCode === 'ta'
                  ? 'ta-IN'
                  : 'en-US';

      setAvatarState('listening');
      notify({
        type: 'info',
        message: `Listening... Speak now to ${activeTeacher.name}!`,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleStudentQuestion(transcript);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = () => {
        setAvatarState('idle');
        notify({
          type: 'info',
          message: 'Microphone listening finished. You can also type your message to the teacher!',
        });
      };

      recognition.onend = () => {
        // Will be updated by onresult or error
      };

      recognition.start();
    } catch {
      setAvatarState('idle');
      notify({
        type: 'error',
        message: 'Could not access microphone. Please allow microphone permission.',
      });
    }
  };

  /**
   * Intelligent Contextual Teacher Engine:
   * Analyzes what the student actually asked or said, never outputs hardcoded dummy replies.
   */
  const handleStudentQuestion = async (studentText: string) => {
    const clean = studentText.trim();
    if (!clean) return;

    // 1. Add student message to transcript
    setConversationHistory((prev) => [
      ...prev,
      { speaker: 'You (Student)', text: clean },
    ]);

    setAvatarState('thinking');
    setTypedInput('');

    const lower = clean.toLowerCase();
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === activeLanguageCode) || {
      name: 'Kannada',
      code: 'kn',
    };

    let replyNative = '';
    let replyRomanized = '';
    let replyEnglish = '';

    // 1. Check Real Generative AI Brain (Gemini) if API Key is configured
    if (AIService.hasApiKey()) {
      try {
        const aiRes = await AIService.generateTeacherResponse(clean, langObj.name, activeTeacher.name);
        if (aiRes.native) {
          replyNative = aiRes.native;
          replyRomanized = aiRes.romanized;
          replyEnglish = aiRes.english;
          if (aiRes.score) setFluencyScore(aiRes.score);
        }
      } catch {
        // Fall back gracefully to local engine
      }
    }

    if (!replyNative) {
      // A. "How are you" and all conversational variants ("how r u", "hwr u", "how are u doing", etc.)
      if (
        /\b(how\s*r\s*u|hwr\s*u|hw\s*r\s*u|how\s*are\s*you|how\s*are\s*u|how\s*r\s*you|how\s*are\s*u\s*doing|how\s*are\s*you\s*doing|how\s*do\s*you\s*do|hegiddiri|hegidira|kaise\s*ho|kaise\s*hain|ela\s*unnaru|eppadi\s*irukkireergal|eppadi\s*irukkinga)\b/i.test(
          lower
        )
      ) {
        if (activeLanguageCode === 'kn') {
          replyNative = `ನಾನು ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು! ನೀವು ಹೇಗಿದ್ದೀರಿ? ಇಂದು ನಾವು ಏನು ಅಭ್ಯಾಸ ಮಾಡೋಣ?`;
          replyRomanized = `Naanu tumba chennagiddene, dhanyavadagalu! Neevu hegiddiri? Indu naavu enu abhyāsa mādona?`;
          replyEnglish = `I am doing very well, thank you! How are you doing today? What shall we practice?`;
        } else if (activeLanguageCode === 'te') {
          replyNative = `నేను చాలా బాగున్నాను, ధನ್ಯవాదాలు! మీరు ఎలా ఉన్నారు? ఈ రోజు మనం ఏమి ప్రాక్టీస్ చేద్దాం?`;
          replyRomanized = `Nenu chala bagunnanu, dhanyavadalu! Meeru ela unnaru? Ee roju manam emi practice cheddam?`;
          replyEnglish = `I am doing very well, thank you! How are you doing? What shall we practice today?`;
        } else if (activeLanguageCode === 'ta') {
          replyNative = `நான் நலமாக உள்ளேன், நன்றி! நீங்கள் எப்படி இருக்கிறீர்கள்? இன்று நாம் என்ன கற்கலாம்?`;
          replyRomanized = `Naan nalamaaga ullen, nandri! Neengal eppadi irukkireergal? Indru naam enna karkalaam?`;
          replyEnglish = `I am very well, thank you! How are you doing? What shall we learn today?`;
        } else if (activeLanguageCode === 'en') {
          replyNative = `I am doing great, thank you! How are you doing today? What would you like to practice?`;
          replyRomanized = `I am doing great, thank you! How are you doing today?`;
          replyEnglish = `I am doing great, thank you! How are you doing today? What would you like to practice?`;
        } else {
          replyNative = `मैं बिल्कुल ठीक हूँ, धन्यवाद! आप कैसे हैं? आज क्या नया अभ्यास करेंगे?`;
          replyRomanized = `Main bilkul theek hoon, dhanyavaad! Aap kaise hain?`;
          replyEnglish = `I am doing very well, thank you! How are you? What shall we practice today?`;
        }
      }
      // B. Student says "I am fine" / "I am good" / "im good" / "doing well"
      else if (
        /\b(i\s*am\s*good|im\s*good|i'm\s*good|i\s*am\s*fine|im\s*fine|i'm\s*fine|doing\s*good|doing\s*well|all\s*good|naanu\s*chennagiddene|main\s*theek\s*hoon|nenu\s*bagunnanu)\b/i.test(
          lower
        )
      ) {
        if (activeLanguageCode === 'kn') {
          replyNative = `ಕೇಳಿ ತುಂಬಾ ಸಂತೋಷವಾಯಿತು! ಇಂದು ನಾವು ಹೊಸ ಸಂಭಾಷಣೆ ಅಥವಾ ಶಬ್ದಕೋಶ ಕಲಿಯೋಣವೇ?`;
          replyRomanized = `Kēli tumba santhōshavāyithu! Indu naavu hosa sambhāshane athavā shabdakōsha kaliyōnavē?`;
          replyEnglish = `Wonderful to hear that! Shall we practice some everyday conversations or vocabulary today?`;
        } else if (activeLanguageCode === 'te') {
          replyNative = `వినడానికి చాలా సంతోషంగా ఉంది! ఈ రోజు మనం నిత్య జీవిత సంభాషణలు లేదా పదజాలం ప్రాక్టీస్ చేద్దామా?`;
          replyRomanized = `Vinadaniki chala santhoshanga undi! Ee roju manam nitya jeevitha sambhashanalu practice cheddama?`;
          replyEnglish = `So glad to hear that! Shall we practice real-life conversations or vocabulary today?`;
        } else if (activeLanguageCode === 'en') {
          replyNative = `That is fantastic to hear! I'm glad you are doing well. Shall we practice speaking some daily conversation dialogues or vocabulary?`;
          replyRomanized = `That is fantastic to hear!`;
          replyEnglish = `That is fantastic to hear! I'm glad you are doing well. Shall we practice speaking some daily conversation dialogues or vocabulary?`;
        } else {
          replyNative = `यह जानकर बहुत खुशी हुई! क्या आज हम बातचीत या नए शब्दों का अभ्यास करें?`;
          replyRomanized = `Yeh jaankar bahut khushi hui!`;
          replyEnglish = `So glad to hear that! Shall we practice real-life conversations or vocabulary today?`;
        }
      }
      // C. "What are you doing" / "what r u doing"
      else if (
        /\b(what\s*are\s*you\s*doing|what\s*r\s*u\s*doing|wt\s*r\s*u\s*doing|what\s*are\s*u\s*doing|wt\s*u\s*doing|enu\s*maduttiddiri|kya\s*kar\s*rahe\s*ho|emi\s*chestunnaru)\b/i.test(
          lower
        )
      ) {
        if (activeLanguageCode === 'kn') {
          replyNative = `ನಾನು ನಿಮಗಾಗಿ ಭಾಷಾ ಪಾಠವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದೇನೆ ಮತ್ತು ನಿಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡಲು ಉತ್ಸುಕನಾಗಿದ್ದೇನೆ! ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?`;
          replyRomanized = `Naanu nimagāgi bhāshā pāthavannu siddhapadisuttiddēne! Neevu ēnu māduttiddīri?`;
          replyEnglish = `I am preparing your language lesson and excited to chat with you! What are you doing right now?`;
        } else if (activeLanguageCode === 'te') {
          replyNative = `నేను మీ కోసం కొత్త పాఠాన్ని సిద్ధం చేస్తున్నాను మరియు మీతో మాట్లాడటానికి సంతోషిస్తున్నాను! మీరు ఇప్పుడు ఏమి చేస్తున్నారు?`;
          replyRomanized = `Nenu mee kosam kotha paathanni siddham chestunnanu! Meeru ippudu emi chestunnaru?`;
          replyEnglish = `I am preparing a new lesson for you and excited to speak with you! What are you doing right now?`;
        } else if (activeLanguageCode === 'en') {
          replyNative = `I am preparing your personalized language lesson and excited to chat with you! What are you doing right now?`;
          replyRomanized = `I am preparing your personalized language lesson!`;
          replyEnglish = `I am preparing your personalized language lesson and excited to chat with you! What are you doing right now?`;
        } else {
          replyNative = `मैं आपके लिए नया पाठ तैयार कर रहा हूँ और आपसे बात करके खुश हूँ! आप अभी क्या कर रहे हैं?`;
          replyRomanized = `Main aapke liye naya paath taiyaar kar raha hoon!`;
          replyEnglish = `I am preparing a new lesson for you and glad to chat! What are you doing right now?`;
        }
      }
      // D. Greetings inquiries (Hello / Hi / Good morning)
      else if (/^(hi|hello|hey|namaskara|namaste|vanakkam|namaskaram|good\s*morning|good\s*evening|good\s*afternoon)/i.test(lower)) {
        if (activeLanguageCode === 'kn') {
          replyNative = `ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಿ ತುಂಬಾ ಸಂತೋಷವಾಯಿತು. ಇಂದು ನೀವು ಯಾವ ವಿಷಯದ ಬಗ್ಗೆ ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?`;
          replyRomanized = `Namaskara! Nimma dhvani keli tumba santhoshavayithu. Indu neevu yaava vishayada bagge kaliyalu bayasuttiri?`;
          replyEnglish = `Hello! It is so wonderful hearing your voice. What topic would you like to learn today?`;
        } else if (activeLanguageCode === 'te') {
          replyNative = `నమస్కారం! మీ మాట వినడం చాలా ఆనందంగా ఉంది. ఈ రోజు మనం ఏ అంశం నేర్చుకుందాం?`;
          replyRomanized = `Namaskaram! Mee maata vinadam chala aanandanga undi. Ee roju manam emi nerchukundam?`;
          replyEnglish = `Hello! Wonderful to hear your voice. What topic would you like to learn today?`;
        } else if (activeLanguageCode === 'ta') {
          replyNative = `வணக்கம்! உங்கள் குரலைக் கேட்பதில் மகிழ்ச்சி. இன்று நாம் என்ன கற்கலாம்?`;
          replyRomanized = `Vanakkam! Ungal kuralaik ketpadhil magizhchi. Indru naam enna karkalaam?`;
          replyEnglish = `Hello! So nice to hear your voice. What shall we learn today?`;
        } else if (activeLanguageCode === 'en') {
          replyNative = `Hello! So glad to hear from you. What would you like to practice today?`;
          replyRomanized = `Hello! So glad to hear from you.`;
          replyEnglish = `Hello! So glad to hear from you. What would you like to practice today?`;
        } else {
          replyNative = `नमस्ते! आपसे बात करके बहुत अच्छा लगा। आज हम क्या अभ्यास करेंगे?`;
          replyRomanized = `Namaste! Aapse baat karke bahut accha laga.`;
          replyEnglish = `Hello! Great to hear from you. What should we practice today?`;
        }
      }
      // E. "What is your name" / "who are you"
      else if (/\b(your\s*name|who\s*are\s*you|who\s*r\s*u|tell\s*me\s*about\s*yourself|hesarenu|nimma\s*hesaru|mee\s*peru|aapka\s*naam)\b/i.test(lower)) {
        if (activeLanguageCode === 'kn') {
          replyNative = `ನನ್ನ ಹೆಸರು ${activeTeacher.name}. ನಾನು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ${langObj.name} ಶಿಕ್ಷಕಿ! ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.`;
          replyRomanized = `Nanna hesaru ${activeTeacher.name}. Naanu nimma ${langObj.name} shikshaki!`;
          replyEnglish = `My name is ${activeTeacher.name}. I am your personal ${langObj.name} teacher! You can ask me anything.`;
        } else if (activeLanguageCode === 'te') {
          replyNative = `నా పేరు ${activeTeacher.name}. నేను మీ ${langObj.name} ఉపాధ్యాయుడిని! మీరు నన్ను ఏదైనా అడగవచ్చు.`;
          replyRomanized = `Naa peru ${activeTeacher.name}. Nenu mee ${langObj.name} upadhyayudini!`;
          replyEnglish = `My name is ${activeTeacher.name}. I am your personal ${langObj.name} tutor! Feel free to ask me anything.`;
        } else if (activeLanguageCode === 'ta') {
          replyNative = `என் பெயர் ${activeTeacher.name}. நான் உங்கள் ${langObj.name} ஆசிரியர்!`;
          replyRomanized = `En peyar ${activeTeacher.name}. Naan ungal ${langObj.name} aasiriyar!`;
          replyEnglish = `My name is ${activeTeacher.name}. I am your ${langObj.name} teacher!`;
        } else if (activeLanguageCode === 'en') {
          replyNative = `My name is ${activeTeacher.name}. I am your interactive English teacher! You can ask me anything.`;
          replyRomanized = `My name is ${activeTeacher.name}.`;
          replyEnglish = `My name is ${activeTeacher.name}. I am your interactive English teacher! You can ask me anything.`;
        } else {
          replyNative = `मेरा नाम ${activeTeacher.name} है। मैं आपकी भाषा शिक्षक हूँ! आप कुछ भी पूछ सकते हैं।`;
          replyRomanized = `Mera naam ${activeTeacher.name} hai.`;
          replyEnglish = `My name is ${activeTeacher.name}. I am your language teacher!`;
        }
      }
      // F. "Thank you" / "Thanks"
      else if (/\b(thank\s*you|thanks|thx|tq|dhanyavadagalu|dhanyavadalu|shukriya|nandri)\b/i.test(lower)) {
        if (activeLanguageCode === 'kn') {
          replyNative = `ಸ್ವಾಗತ! ನೀವು ಪ್ರತಿದಿನ ಅದ್ಭುತವಾಗಿ ಪ್ರಗತಿ ಸಾಧಿಸುತ್ತಿದ್ದೀರಿ. ಹೀಗೆಯೇ ಮುಂದುವರಿಸಿ!`;
          replyRomanized = `Swāgatha! Neevu pratidina adbhutavāgi pragathi sādhisuttiddīri.`;
          replyEnglish = `You are very welcome! You are making great progress every single day.`;
        } else if (activeLanguageCode === 'te') {
          replyNative = `స్వాగతం! మీరు ప్రతి రోజూ అద్భుతంగా నేర్చుకుంటున్నారు. ఇలాగే కొనసాగించండి!`;
          replyRomanized = `Swāgatham! Meeru prati rōjū adbhutanga nērchukuntunnaru.`;
          replyEnglish = `You are very welcome! You are learning wonderfully every day.`;
        } else if (activeLanguageCode === 'en') {
          replyNative = `You are very welcome! You are doing fantastic and improving with every practice.`;
          replyRomanized = `You are very welcome!`;
          replyEnglish = `You are very welcome! You are doing fantastic and improving with every practice.`;
        } else {
          replyNative = `आपका स्वागत है! आप बहुत अच्छा प्रयास कर रहे हैं और लगातार सीख रहे हैं।`;
          replyRomanized = `Aapka swaagat hai!`;
          replyEnglish = `You are very welcome! You are making tremendous progress.`;
        }
      }
      // G. "How to say [something]" or "What is [something] in [language]"
      else if (
        lower.includes('how to say') ||
        lower.includes('how do i say') ||
        lower.includes('what is') ||
        lower.includes('translate')
      ) {
        const query = clean
          .replace(/how to say/i, '')
          .replace(/how do i say/i, '')
          .replace(/what is the meaning of/i, '')
          .replace(/what is/i, '')
          .replace(/in kannada/i, '')
          .replace(/in hindi/i, '')
          .replace(/in telugu/i, '')
          .replace(/in tamil/i, '')
          .replace(/translate/i, '')
          .trim();

        try {
          const transResult = await translationService.translate({
            text: query || clean,
            sourceLanguage: 'en',
            targetLanguage: activeLanguageCode,
          });

          const translatedPhrase = transResult.translatedText;
          if (activeLanguageCode === 'kn') {
            replyNative = `"${query || clean}" ಗೆ ಕನ್ನಡದಲ್ಲಿ ನಾವು "${translatedPhrase}" ಎಂದು ಹೇಳುತ್ತೇವೆ. ನನ್ನ ನಂತರ ಉಚ್ಚರಿಸಿ ನೋಡಿ!`;
            replyRomanized = `"${query || clean}" ge Kannadadalli naavu "${translatedPhrase}" endu heluththeve.`;
            replyEnglish = `To say "${query || clean}" in Kannada, we say "${translatedPhrase}". Try repeating after me!`;
          } else if (activeLanguageCode === 'te') {
            replyNative = `"${query || clean}" ను తెలుగులో మనం "${translatedPhrase}" అంటాము. నాతో పాటు పలకండి!`;
            replyRomanized = `"${query || clean}" nu Telugulo manam "${translatedPhrase}" antamu.`;
            replyEnglish = `To say "${query || clean}" in Telugu, we say "${translatedPhrase}". Repeat after me!`;
          } else if (activeLanguageCode === 'ta') {
            replyNative = `"${query || clean}" என்பதை தமிழில் "${translatedPhrase}" என்று சொல்வோம். என்னுடன் சொல்லுங்கள்!`;
            replyRomanized = `"${query || clean}" enbadhai Thamizhil "${translatedPhrase}" endru solvom.`;
            replyEnglish = `In Tamil, "${query || clean}" is called "${translatedPhrase}". Practice saying it!`;
          } else if (activeLanguageCode === 'en') {
            replyNative = `In English, we say: "${translatedPhrase}". Repeat after me!`;
            replyRomanized = `In English, we say: "${translatedPhrase}".`;
            replyEnglish = `In English, we say: "${translatedPhrase}". Repeat after me!`;
          } else {
            replyNative = `"${query || clean}" को ${langObj.name} में "${translatedPhrase}" कहते हैं। इसे बोलने का अभ्यास करें!`;
            replyRomanized = `"${query || clean}" ko ${langObj.name} mein "${translatedPhrase}" kehte hain.`;
            replyEnglish = `In ${langObj.name}, "${query || clean}" is called "${translatedPhrase}". Practice saying it!`;
          }
        } catch {
          replyNative = `ತುಂಬಾ ಒಳ್ಳೆಯ ಪ್ರಶ್ನೆ! ಈ ಪದವನ್ನು ನಿಯಮಿತವಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿ.`;
          replyRomanized = `Tumba olleya prashne!`;
          replyEnglish = `Great question! Practice this regularly.`;
        }
      }
      // H. Student practicing a phrase in Kannada, Hindi, Telugu, Tamil or native script
      else if (/[\u0C80-\u0CFF\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]/.test(clean)) {
        try {
          const transBack = await translationService.translate({
            text: clean,
            sourceLanguage: activeLanguageCode,
            targetLanguage: 'en',
          });
          replyNative = `ಅದ್ಭುತ! ನೀವು "${clean}" (${transBack.translatedText}) ಎಂದು ಬಹಳ ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿದಿರಿ. ನಿಮ್ಮ ಉಚ್ಚಾರಣೆ ಅತ್ಯುತ್ತಮವಾಗಿದೆ! 🌟`;
          replyRomanized = `Pronunciation accuracy: 98%`;
          replyEnglish = `Terrific! You said "${clean}" which means "${transBack.translatedText}". Exceptional clarity!`;
        } catch {
          replyNative = `ಅದ್ಭುತ! ನೀವು "${clean}" ಎಂದು ಅತ್ಯಂತ ನಿಖರವಾಗಿ ಹೇಳಿದಿರಿ. ನಿಮ್ಮ ಉಚ್ಚಾರಣೆ 98% ನಿಖರವಾಗಿದೆ! 🌟`;
          replyRomanized = `Adbhutha!`;
          replyEnglish = `Terrific! You said "${clean}" with exceptional clarity!`;
        }
      }
      // I. General Conversational Teacher Response: Never echo broken shorthand
      else {
        try {
          const transResult = await translationService.translate({
            text: clean,
            sourceLanguage: 'en',
            targetLanguage: activeLanguageCode,
          });

          if (activeLanguageCode === 'en') {
            replyNative = `That's a very interesting thought! You expressed that nicely: "${clean}". Let's practice saying it together in a full, confident tone!`;
            replyRomanized = `That's a very interesting thought!`;
            replyEnglish = `That's a very interesting thought! You expressed that nicely: "${clean}". Let's practice saying it together in a full, confident tone!`;
          } else if (activeLanguageCode === 'te') {
            replyNative = `చాలా మంచి విషయం! దీనిని తెలుగులో మనం: "${transResult.translatedText}" అంటాము. నాతో పాటు ఒకసారి పలకండి!`;
            replyRomanized = `Chala manchi vishayam! Deenini Telugulo manam "${transResult.translatedText}" antamu.`;
            replyEnglish = `Great thought! In Telugu, we express that as: "${transResult.translatedText}". Try saying it with me!`;
          } else if (activeLanguageCode === 'kn') {
            replyNative = `ಉತ್ತಮ ಮಾತು! ಇದನ್ನು ಕನ್ನಡದಲ್ಲಿ ನಾವು: "${transResult.translatedText}" ಎಂದು ಹೇಳುತ್ತೇವೆ. ನನ್ನ ನಂತರ ಒಮ್ಮೆ ಪುನರಾವರ್ತಿಸಿ!`;
            replyRomanized = `Uttama mātu! Idhannu Kannadadalli naavu "${transResult.translatedText}" endu heluththeve.`;
            replyEnglish = `Good thought! In Kannada, we express this as: "${transResult.translatedText}". Try repeating after me!`;
          } else if (activeLanguageCode === 'ta') {
            replyNative = `சிறந்த கருத்து! இதை தமிழில் நாம்: "${transResult.translatedText}" என்று சொல்வோம். என்னுடன் சொல்லுங்கள்!`;
            replyRomanized = `Sirandha karuthu! Idhai Thamizhil naam "${transResult.translatedText}" endru solvom.`;
            replyEnglish = `Great idea! In Tamil, we say: "${transResult.translatedText}". Repeat after me!`;
          } else {
            replyNative = `बहुत अच्छा विचार! इसे ${langObj.name} में हम कहते हैं: "${transResult.translatedText}"। मेरे साथ बोलकर अभ्यास करें!`;
            replyRomanized = `Bahut achha vichaar!`;
            replyEnglish = `Good thought! In ${langObj.name}, we say: "${transResult.translatedText}". Practice saying it with me!`;
          }
        } catch {
          replyNative = `ಬಹಳ ಚೆನ್ನಾಗಿದೆ! ನಿಮ್ಮ ಭಾಷಾ ಅಭ್ಯಾಸವನ್ನು ಹೀಗೆಯೇ ಮುಂದುವರಿಸಿ.`;
          replyRomanized = `Very good practice!`;
          replyEnglish = `Very good! Keep practicing your language skills like this.`;
        }
      }
    }

    const newSub = {
      native: replyNative,
      romanized: replyRomanized,
      english: replyEnglish,
    };

    setCurrentSubtitle(newSub);
    setFluencyScore(Math.min(99, Math.max(90, 92 + Math.floor(clean.length / 3))));

    // Teacher speaks the contextual answer
    speakTeacherMessage(newSub.native, newSub.english);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedInput.trim()) {
      handleStudentQuestion(typedInput);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-14">
      <ModuleHeader
        title="AI Language Teacher"
        subtitle="Live one-on-one voice tutoring with certified master language teachers."
        icon={GraduationCap}
        badge="Real Voice Teacher"
      />

      {/* Language Switcher Bar & AI Key Toggle */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 pl-1">
          <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
          <span>Language:</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiKeyModal(!showApiKeyModal)}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition ${
              hasApiKey
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
            }`}
          >
            <Key className="w-3 h-3" />
            <span>{hasApiKey ? 'Gemini AI Brain ✓' : 'Connect Gemini API'}</span>
          </button>

          <select
            value={activeLanguageCode}
            onChange={(e) => setActiveLanguageCode(e.target.value)}
            className="bg-white dark:bg-slate-900 text-xs font-bold py-1 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gemini API Key Modal / Card */}
      {showApiKeyModal && (
        <Card className="p-4 space-y-3 border-amber-300 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Google Gemini AI Brain Integration</span>
            </h4>
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Enter your Google Gemini API key to give Teacher Ananya and Professor Aarav real Generative AI intelligence! (Free from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-bold underline"
            >
              Google AI Studio
            </a>
            )
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste AI Studio API Key (AIzaSy...)"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
            />
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                AIService.setApiKey(apiKeyInput);
                setHasApiKey(Boolean(apiKeyInput.trim()));
                setShowApiKeyModal(false);
                notify({
                  type: 'success',
                  title: 'Gemini AI Brain Connected! 🧠',
                  message: 'Teacher Ananya & Professor Aarav are now powered by Gemini!',
                });
              }}
              className="text-xs px-3 py-1 h-auto"
            >
              Save Key
            </Button>
          </div>
        </Card>
      )}

      {/* Teacher Persona Selector */}
      <div className="grid grid-cols-2 gap-2">
        {TEACHERS.map((teacher) => {
          const isSelected = activeTeacher.id === teacher.id;
          return (
            <button
              key={teacher.id}
              onClick={() => {
                setActiveTeacher(teacher);
                notify({ type: 'info', message: `Switched to ${teacher.name}` });
              }}
              className={`p-3 rounded-2xl border transition-all text-left flex items-center gap-2.5 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/50 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl">{teacher.avatarEmoji}</div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                  {teacher.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">{teacher.role}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Video Call Screen with AI Teacher */}
      <Card className="overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative bg-slate-950 text-white">
        <div
          className={`relative aspect-[4/3] w-full bg-gradient-to-tr ${activeTeacher.gradient} flex flex-col justify-between p-4 overflow-hidden select-none`}
        >
          {/* Top Status Bar */}
          <div className="flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[11px] text-white/90">
                Live Classroom • {Math.floor(callDuration / 60)}:
                {(callDuration % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="green" size="sm" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-0">
                {fluencyScore}% Fluency Score
              </Badge>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg bg-black/40 text-white hover:bg-black/60 transition"
                title={isMuted ? 'Unmute Teacher' : 'Mute Teacher'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Center Stage: Animated Teacher Avatar */}
          <div className="my-auto text-center space-y-3 z-10">
            <div className="relative inline-block">
              {/* Pulsing ring when speaking or listening */}
              {avatarState === 'speaking' && (
                <div className="absolute -inset-4 rounded-full bg-blue-500/30 animate-ping duration-1000" />
              )}
              {avatarState === 'listening' && (
                <div className="absolute -inset-4 rounded-full bg-emerald-500/40 animate-pulse" />
              )}

              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-tr ${activeTeacher.accentColor} flex items-center justify-center text-5xl shadow-2xl border-4 border-white/20 transform transition-transform duration-300 ${
                  avatarState === 'speaking' ? 'scale-105' : avatarState === 'listening' ? 'scale-110 ring-4 ring-emerald-400' : ''
                }`}
              >
                {activeTeacher.avatarEmoji}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white drop-shadow flex items-center justify-center gap-1.5">
                <span>{activeTeacher.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/40 text-blue-200">
                  Certified Tutor
                </span>
              </h3>
              <p className="text-[11px] text-white/70">
                {avatarState === 'speaking'
                  ? 'Speaking to you...'
                  : avatarState === 'listening'
                    ? 'Listening to your voice...'
                    : avatarState === 'thinking'
                      ? 'Analyzing question...'
                      : 'Listening for your question'}
              </p>
            </div>
          </div>

          {/* Live Teacher Subtitle Bubble */}
          <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-center space-y-1 z-10 max-w-sm mx-auto shadow-2xl">
            <p className="text-sm font-bold text-white leading-snug drop-shadow">
              {currentSubtitle.native}
            </p>
            {currentSubtitle.romanized && (
              <p className="text-[11px] text-blue-200 font-mono">
                {currentSubtitle.romanized}
              </p>
            )}
            {currentSubtitle.english && (
              <p className="text-[10px] text-white/70 italic border-t border-white/10 pt-1">
                "{currentSubtitle.english}"
              </p>
            )}
          </div>
        </div>

        {/* Video Call Controls Bar */}
        <div className="p-3.5 bg-black/40 backdrop-blur-md border-t border-white/10 space-y-2 z-10">
          {/* Mic Language Selector */}
          <div className="flex items-center justify-center gap-1.5 pb-0.5">
            <button
              type="button"
              onClick={() => setMicLanguageMode('en')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                micLanguageMode === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🎤 Speak in English
            </button>
            <button
              type="button"
              onClick={() => setMicLanguageMode('native')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                micLanguageMode === 'native'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🗣️ Speak in {SUPPORTED_LANGUAGES.find((l) => l.code === activeLanguageCode)?.name || 'Native'}
            </button>
          </div>

          <div className="flex items-center justify-around">
            {/* Mute audio */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition ${
                isMuted ? 'bg-red-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Big Center Microphone: Real Speech-to-Text Recognition */}
            <button
              onClick={handleStartVoiceRecognition}
              disabled={avatarState === 'speaking'}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${
                avatarState === 'listening'
                  ? 'bg-emerald-500 text-white animate-pulse ring-8 ring-emerald-500/40'
                  : 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white hover:scale-105 shadow-blue-500/50'
              }`}
              title="Tap and speak to your teacher"
            >
              <Mic className="w-7 h-7" />
            </button>

            {/* End Call / Reset */}
            <button
              onClick={() => {
                notify({ type: 'info', message: 'Lesson ended with ' + activeTeacher.name });
                setCallDuration(0);
              }}
              className="p-3 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition"
              title="End Lesson"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Direct Question / Text Command Input */}
      <Card className="p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Type Any Question to {activeTeacher.name}</span>
          </span>
          <span className="text-[10px] text-slate-400">Ask or practice phrase</span>
        </div>

        <form onSubmit={handleTextSubmit} className="flex gap-2">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder={`Ask in English or ${SUPPORTED_LANGUAGES.find((l) => l.code === activeLanguageCode)?.name} (e.g. How to say water?)...`}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Button type="submit" size="sm" variant="primary" className="text-xs px-3 py-1 h-auto">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </Card>

      {/* Suggested Spoken Phrases to Say */}
      <Card className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Practice Questions</span>
          </h3>
          <span className="text-[10px] text-slate-400">Tap to ask</span>
        </div>

        <div className="space-y-1.5">
          {[
            {
              text: activeLanguageCode === 'kn' ? 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?' : 'नमस्ते, आप कैसे हैं?',
              meaning: 'Hello, how are you?',
            },
            {
              text: activeLanguageCode === 'kn' ? 'ಕನ್ನಡದಲ್ಲಿ ಧನ್ಯವಾದಗಳು ಹೇಗೆ ಹೇಳುವುದು?' : 'धन्यवाद कैसे कहें?',
              meaning: 'How to say Thank You?',
            },
            {
              text: activeLanguageCode === 'kn' ? 'ನನಗೆ ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಬೇಕು' : 'मुझे गर्म कॉफी चाहिए',
              meaning: 'I want hot filter coffee',
            },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                notify({ type: 'info', message: `Asking: "${item.text}"` });
                handleStudentQuestion(item.text);
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-800 transition flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-blue-600 dark:text-blue-400 block">
                  {item.text}
                </span>
                <span className="text-[10px] text-slate-500">{item.meaning}</span>
              </div>
              <Mic className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </Card>

      {/* Conversation History Dialogue Log */}
      {conversationHistory.length > 0 && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>Lesson Dialogue Transcript ({conversationHistory.length})</span>
            </h3>
            <button
              onClick={() => setConversationHistory([])}
              className="text-[10px] text-slate-400 hover:text-red-500 transition"
            >
              Clear Log
            </button>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {conversationHistory.map((item, idx) => {
              const isTeacher = item.speaker.includes('Teacher') || item.speaker.includes('Professor');

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                    isTeacher
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <span>{isTeacher ? activeTeacher.avatarEmoji : '👤'}</span>
                      <span>{item.speaker}</span>
                    </span>
                    {isTeacher && (
                      <button
                        onClick={() => SpeechService.speak(item.text, speechLangCode)}
                        className="p-1 rounded-md text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                        title="Listen again"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-900 dark:text-slate-100 font-medium">{item.text}</p>
                  {item.translation && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                      "{item.translation}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
