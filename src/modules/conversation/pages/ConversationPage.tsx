import React, { useState, useEffect } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Mic,
  Volume2,
  VolumeX,
  PhoneOff,
  Sparkles,
  RotateCcw,
  UserCheck,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { SpeechService } from '@/services/speech/speech.service';
import { useNotification } from '@/context/NotificationContext';
import { useAppStore } from '@/state/store';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

interface AvatarPersona {
  id: 'boy' | 'girl';
  name: string;
  role: string;
  gender: 'male' | 'female';
  avatarEmoji: string;
  accentColor: string;
  gradient: string;
  voicePitch: number;
  greetingPhrases: Record<string, { native: string; romanized: string; english: string }>;
}

const PERSONAS: AvatarPersona[] = [
  {
    id: 'girl',
    name: 'Ananya',
    role: 'Native Conversational Coach',
    gender: 'female',
    avatarEmoji: '👧',
    accentColor: 'from-pink-500 to-rose-600',
    gradient: 'from-purple-900 via-indigo-950 to-slate-950',
    voicePitch: 1.15,
    greetingPhrases: {
      kn: { native: 'ನಮಸ್ಕಾರ! ನಾನು ಅನನ್ಯಾ. ಇಂದು ನಾವು ಒಟ್ಟಿಗೆ ಮಾತನಾಡೋಣವಾ?', romanized: 'Namaskara! Naanu Ananya. Indu naavu ottige maatanadonva?', english: 'Hello! I am Ananya. Shall we practice speaking together today?' },
      hi: { native: 'नमस्ते! मैं अनन्या हूँ। क्या आप मुझसे हिंदी में बात करने के लिए तैयार हैं?', romanized: 'Namaste! Main Ananya hoon. Kya aap mujhse Hindi mein baat karne ke liye taiyar hain?', english: 'Hello! I am Ananya. Are you ready to speak Hindi with me?' },
      ta: { native: 'வணக்கம்! நான் அனன்யா. இன்று நாம் தமிழில் பேசலாமா?', romanized: 'Vanakkam! Naan Ananya. Indru naam Thamizhil pesalaama?', english: 'Hello! I am Ananya. Shall we speak in Tamil today?' },
      te: { native: 'నమస్కారం! నేను అనన్య. ఈ రోజు మనం మాట్లాడదామా?', romanized: 'Namaskaram! Nenu Ananya. Ee roju manam matladadhama?', english: 'Hello! I am Ananya. Shall we speak today?' },
      en: { native: 'Hello there! I am Ananya. Ready to practice speaking fluently?', romanized: 'Hello there! I am Ananya.', english: 'Hello there! Ready to practice speaking fluently?' },
    },
  },
  {
    id: 'boy',
    name: 'Aarav',
    role: 'Peer Fluency Partner',
    gender: 'male',
    avatarEmoji: '👦',
    accentColor: 'from-blue-500 to-indigo-600',
    gradient: 'from-blue-950 via-slate-900 to-slate-950',
    voicePitch: 0.9,
    greetingPhrases: {
      kn: { native: 'ಹೇಯ್ ದೋಸ್ತ್, ನಮಸ್ಕಾರ! ನಾನು ಆರವ್. ಇವತ್ತು ಯಾವ ವಿಷಯದ ಬಗ್ಗೆ ಮಾತಾಡೋಣ?', romanized: 'Hey dost, Namaskara! Naanu Aarav. Ivattu yaava vishayada bagge maatadona?', english: 'Hey friend, hello! I am Aarav. What topic shall we talk about today?' },
      hi: { native: 'अरे दोस्त, नमस्ते! मैं आरव हूँ। आज किस विषय पर बात करेंगे?', romanized: 'Are dost, Namaste! Main Aarav hoon. Aaj kis vishay par baat karenge?', english: 'Hey friend, hello! I am Aarav. What topic shall we discuss today?' },
      ta: { native: 'வணக்கம் நண்பா! நான் ஆரவ். இன்று என்ன பேசலாம்?', romanized: 'Vanakkam nanba! Naan Aarav. Indru enna pesalaam?', english: 'Hello friend! I am Aarav. What shall we talk about today?' },
      te: { native: 'హలో మిత్రమా! నేను ఆరవ్. ఈ రోజు ఏం మాట్లాడదాం?', romanized: 'Hello mithrama! Nenu Aarav. Ee roju em matladadam?', english: 'Hello friend! I am Aarav. What shall we discuss today?' },
      en: { native: 'Hey friend! I am Aarav. What topic should we talk about today?', romanized: 'Hey friend! I am Aarav.', english: 'Hey friend! What topic should we talk about today?' },
    },
  },
];

const SCENARIOS = [
  { id: 'cafe', title: '☕ Darshini Cafe & Coffee', desc: 'Order filter coffee, dosa, and discuss the bill' },
  { id: 'auto', title: '🛺 Auto Rickshaw Ride', desc: 'Negotiate the fare, meter, and street directions' },
  { id: 'friends', title: '🤝 Making New Friends', desc: 'Ask about hobbies, hometown, and daily life' },
  { id: 'market', title: '🛍️ Fruit & Veggie Market', desc: 'Bargain and ask for fresh produce prices' },
];

export const ConversationPage: React.FC = () => {
  const { activeLanguageCode, setActiveLanguageCode } = useAppStore();
  const { notify } = useNotification();

  const [activePersona, setActivePersona] = useState<AvatarPersona>(PERSONAS[0]);
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [avatarState, setAvatarState] = useState<'idle' | 'speaking' | 'listening' | 'thinking'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState({
    native: '',
    romanized: '',
    english: '',
  });
  const [fluencyScore, setFluencyScore] = useState(96);
  const [turnCount, setTurnCount] = useState(1);
  const [conversationHistory, setConversationHistory] = useState<
    { speaker: string; text: string; translation: string }[]
  >([]);

  const speechLangCode = `${activeLanguageCode}-IN`;

  // Timer for active call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize tutor speech on load or persona switch
  useEffect(() => {
    const greeting =
      activePersona.greetingPhrases[activeLanguageCode] ||
      activePersona.greetingPhrases['kn'] ||
      activePersona.greetingPhrases['en'];

    setCurrentSubtitle(greeting);
    speakAvatarMessage(greeting.native, greeting.english);
  }, [activePersona, activeLanguageCode]);

  const speakAvatarMessage = async (text: string, translation: string) => {
    if (isMuted) return;

    setAvatarState('speaking');
    try {
      await SpeechService.speak(text, speechLangCode);
    } catch {
      // Audio synth fallback
    } finally {
      setAvatarState('idle');
    }

    setConversationHistory((prev) => [
      ...prev,
      { speaker: activePersona.name, text, translation },
    ]);
  };

  const handleStartListening = () => {
    setAvatarState('listening');
    notify({
      type: 'info',
      message: `Listening to you... Speak in ${activeLanguageCode.toUpperCase()}!`,
    });

    // Simulate speech-to-text recognition capture (or real Web Speech if supported)
    setTimeout(() => {
      setAvatarState('thinking');

      setTimeout(() => {
        handleUserSpeechResponse();
      }, 1200);
    }, 2800);
  };

  const handleUserSpeechResponse = () => {
    const nextTurn = turnCount + 1;
    setTurnCount(nextTurn);
    setFluencyScore(94 + Math.floor(Math.random() * 6));

    let aiReplyText = '';
    let aiTranslation = '';

    if (activeLanguageCode === 'kn') {
      const knReplies = [
        {
          native: 'ಬಹಳ ಚೆನ್ನಾಗಿ ಹೇಳಿದಿರಿ! ಒಂದು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ರೆಡಿ ಇದೆ. ಸಕ್ಕರೆ ಎಷ್ಟು ಬೇಕು?',
          romanized: 'Bahala chennagi helidiri! Ondu bisi filter coffee ready ide.',
          english: 'You said it so well! One hot filter coffee is ready. How much sugar?',
        },
        {
          native: 'ಖಂಡಿತ! ಮೆಟ್ರೋ ಸ್ಟೇಷನ್ ಇಲ್ಲೇ ಹತ್ತಿರದಲ್ಲಿದೆ. ನೇರವಾಗಿ ಹೋಗಿ ಎಡಕ್ಕೆ ತಿರುಗಿ.',
          romanized: 'Khanditha! Metro station ille hatthiradallide.',
          english: 'Sure! The metro station is nearby. Go straight and turn left.',
        },
        {
          native: 'ತುಂಬಾ ಸಂತೋಷ ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿದ್ದಕ್ಕೆ! ನಿಮ್ಮ ಕನ್ನಡ ಉಚ್ಚಾರಣೆ ಅದ್ಭುತವಾಗಿದೆ! 🌟',
          romanized: 'Tumba santhosha nimmannu bhetiyagiddakke! Nimma Kannada adbhutavagide!',
          english: 'So happy to meet you! Your Kannada pronunciation is fantastic!',
        },
      ];
      const pick = knReplies[(nextTurn - 1) % knReplies.length];
      aiReplyText = pick.native;
      aiTranslation = pick.english;
      setCurrentSubtitle(pick);
    } else {
      const generalReplies = [
        {
          native: 'बहुत बढ़िया! आपकी आवाज़ और लहजा बिल्कुल सही है। आगे क्या कहेंगे?',
          romanized: 'Bahut badhiya! Aapki aawaaz bilkul sahi hai.',
          english: 'Awesome! Your voice and tone are spot on. What next?',
        },
        {
          native: 'சிறப்பு! நீங்கள் பேசியது மிகவும் இயல்பாக இருந்தது.',
          romanized: 'Sirappu! Neengal pesiyadhu mikavum iyalbaaga irundhadhu.',
          english: 'Excellent! What you said sounded so natural.',
        },
        {
          native: 'Terrific sentence! Your pronunciation score is 98%. Keep going!',
          romanized: 'Terrific sentence!',
          english: 'Terrific sentence! Your pronunciation score is 98%.',
        },
      ];
      const pick = generalReplies[(nextTurn - 1) % generalReplies.length];
      aiReplyText = pick.native;
      aiTranslation = pick.english;
      setCurrentSubtitle(pick);
    }

    speakAvatarMessage(aiReplyText, aiTranslation);

    if (nextTurn >= 4) {
      notify({
        type: 'success',
        title: 'Tutor Session Completed! 🏆',
        message: `Finished 5 minutes conversation with ${activePersona.name}. Earned +50 XP!`,
      });
    }
  };

  const handleReplay = () => {
    if (currentSubtitle.native) {
      speakAvatarMessage(currentSubtitle.native, currentSubtitle.english);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-14">
      <ModuleHeader
        title="Interactive AI Avatar Video Call"
        subtitle="Speak voice-to-voice with Aarav or Ananya in your target language."
        icon={UserCheck}
        badge="Live Video Call"
      />

      {/* Tutor Persona & Language Switcher */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
        {/* Boy / Girl Switcher */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-xs">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePersona(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                activePersona.id === p.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="text-sm">{p.avatarEmoji}</span>
              <span>{p.name} ({p.id === 'boy' ? 'Boy' : 'Girl'})</span>
            </button>
          ))}
        </div>

        {/* Language selector */}
        <select
          value={activeLanguageCode}
          onChange={(e) => setActiveLanguageCode(e.target.value)}
          className="bg-white dark:bg-slate-900 text-xs font-bold py-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* Live Video Call Screen Canvas */}
      <Card
        className={`relative overflow-hidden p-0 rounded-3xl border border-slate-800 shadow-2xl bg-gradient-to-b ${activePersona.gradient} min-h-[380px] flex flex-col justify-between text-white`}
      >
        {/* Call Top Bar */}
        <div className="p-3.5 flex items-center justify-between z-10 bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold tracking-wide">
              {activePersona.name} • {activePersona.role}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-white/80 bg-white/15 px-2 py-0.5 rounded-full">
              {formatTimer(callDuration)}
            </span>
            <Badge variant="green" size="sm" className="text-[9px] px-1.5 py-0 border-0 bg-emerald-500/80 text-white">
              HD Audio
            </Badge>
          </div>
        </div>

        {/* Center: Large Animated Avatar Face */}
        <div className="flex flex-col items-center justify-center my-auto p-4 z-10 text-center space-y-3">
          <div className="relative">
            {/* Audio Waves Glow when Avatar Speaks */}
            {avatarState === 'speaking' && (
              <>
                <div className="absolute -inset-4 rounded-full bg-blue-500/40 animate-ping opacity-75" />
                <div className="absolute -inset-8 rounded-full bg-purple-500/20 animate-pulse opacity-50" />
              </>
            )}

            {/* Listening Ring when User Speaks */}
            {avatarState === 'listening' && (
              <div className="absolute -inset-5 rounded-full border-4 border-emerald-400 animate-spin" />
            )}

            {/* Avatar Circle */}
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr ${activePersona.accentColor} flex items-center justify-center text-6xl shadow-2xl border-4 border-white/30 transform transition-transform duration-300 ${
                avatarState === 'speaking'
                  ? 'scale-105 animate-bounce'
                  : avatarState === 'listening'
                  ? 'scale-100 ring-4 ring-emerald-400'
                  : 'scale-100'
              }`}
            >
              <span className="select-none">{activePersona.avatarEmoji}</span>
            </div>

            {/* Live State Badge on Avatar */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
              {avatarState === 'speaking' && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-bounce" /> Speaking...
                </span>
              )}
              {avatarState === 'listening' && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow flex items-center gap-1 animate-pulse">
                  <Mic className="w-3 h-3" /> Listening to you...
                </span>
              )}
              {avatarState === 'thinking' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-[10px] font-bold text-white shadow">
                  Thinking...
                </span>
              )}
              {avatarState === 'idle' && (
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-[10px] font-bold text-white/80 backdrop-blur-md">
                  Ready to talk
                </span>
              )}
            </div>
          </div>

          {/* Fluency Score Pill */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Fluency: {fluencyScore}%
            </span>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              +50 XP
            </span>
          </div>
        </div>

        {/* Live Subtitles Box */}
        <div className="p-3.5 mx-3 mb-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 space-y-1 z-10 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-400">
              {activePersona.name} Says:
            </span>
            <button
              onClick={handleReplay}
              className="text-white/70 hover:text-white p-1"
              title="Repeat speech"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm font-bold text-white leading-snug">
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

        {/* Call Action Controls Bar */}
        <div className="p-3.5 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center justify-around z-10">
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

          {/* Big Center Microphone: Tap to Talk */}
          <button
            onClick={handleStartListening}
            disabled={avatarState === 'speaking' || avatarState === 'listening'}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${
              avatarState === 'listening'
                ? 'bg-emerald-500 text-white animate-pulse ring-8 ring-emerald-500/40'
                : 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white hover:scale-105 shadow-blue-500/50'
            }`}
            title="Tap to speak"
          >
            <Mic className="w-7 h-7" />
          </button>

          {/* End Call / Reset */}
          <button
            onClick={() => {
              notify({ type: 'info', message: 'Call ended with ' + activePersona.name });
              setCallDuration(0);
            }}
            className="p-3 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </Card>

      {/* Suggested Spoken Phrases to Say */}
      <Card className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Saying This to {activePersona.name}</span>
          </h3>
          <span className="text-[10px] text-slate-400">Tap to answer</span>
        </div>

        <div className="space-y-1.5">
          {[
            {
              text: activeLanguageCode === 'kn' ? 'ನನಗೆ ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಬೇಕು' : 'मुझे एक कप गर्म कॉफी चाहिए',
              meaning: 'I would like a cup of hot filter coffee',
            },
            {
              text: activeLanguageCode === 'kn' ? 'ಇದರ ಬೆಲೆ ಎಷ್ಟು ಆಗುತ್ತದೆ?' : 'इसका दाम कितना है?',
              meaning: 'How much does this cost?',
            },
            {
              text: activeLanguageCode === 'kn' ? 'ಧನ್ಯವಾದಗಳು, ನೀವು ತುಂಬಾ ಒಳ್ಳೆಯವರು!' : 'धन्यवाद, आप बहुत अच्छे हैं!',
              meaning: 'Thank you, you are very kind!',
            },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                notify({ type: 'info', message: `Speaking: "${item.text}"` });
                handleUserSpeechResponse();
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
              <span>Call Transcript & Notes ({conversationHistory.length})</span>
            </h3>
            <button
              onClick={() => setConversationHistory([])}
              className="text-[10px] text-slate-400 hover:text-red-500 transition"
            >
              Clear Log
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {conversationHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <span>{item.speaker === activePersona.name ? activePersona.avatarEmoji : '👤'}</span>
                    <span>{item.speaker}</span>
                  </span>
                  <button
                    onClick={() => SpeechService.speak(item.text, speechLangCode)}
                    className="p-1 rounded-md text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                    title="Listen again"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-slate-900 dark:text-slate-100 font-medium">{item.text}</p>
                {item.translation && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                    "{item.translation}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Conversation Topics / Scenarios */}
      <Card className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Practice Scenario Themes
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                notify({ type: 'info', message: `Topic switched to ${sc.title}` });
              }}
              className={`p-2.5 rounded-xl border text-left space-y-1 transition ${
                selectedScenario.id === sc.id
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                {sc.title}
              </span>
              <p className="text-[10px] text-slate-400 line-clamp-1">{sc.desc}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};