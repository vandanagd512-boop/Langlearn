import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Languages,
  ArrowRightLeft,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Bookmark,
  Share2,
  Mic,
  MicOff,
  SlidersHorizontal,
} from 'lucide-react';
import { translationService } from '@/services/translation/translation.service';
import { SpeechService } from '@/services/speech/speech.service';
import { useNotification } from '@/context/NotificationContext';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

const SPEECH_LANG_MAP: Record<string, string> = {
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
};

interface DialectOption {
  id: string;
  label: string;
  nativeLabel: string;
}

const REGIONAL_DIALECTS: Record<string, DialectOption[]> = {
  te: [
    { id: 'standard', label: 'Standard Telugu', nativeLabel: 'ఆంధ్ర ప్రమాణికం' },
    { id: 'telangana', label: 'Telangana Dialect', nativeLabel: 'తెలంగాణ యాస' },
    { id: 'rayalaseema', label: 'Rayalaseema Dialect', nativeLabel: 'రాయలసీమ యాస' },
  ],
  kn: [
    { id: 'standard', label: 'Standard Kannada', nativeLabel: 'ಬೆಂಗಳೂರು / ಮೈಸೂರು' },
    { id: 'north_karnataka', label: 'North Karnataka', nativeLabel: 'ಉತ್ತರ ಕರ್ನಾಟಕ (ಧಾರವಾಡ)' },
    { id: 'coastal', label: 'Coastal Kannada', nativeLabel: 'ಕರಾವಳಿ / ಮಂಗಳೂರು' },
  ],
  hi: [
    { id: 'standard', label: 'Standard Hindi', nativeLabel: 'मानक खड़ी बोली' },
    { id: 'awadhi', label: 'Colloquial / Awadhi', nativeLabel: 'बोलचाल / अवधी' },
    { id: 'bhojpuri', label: 'Bhojpuri Touch', nativeLabel: 'भोजपुरी अंदाज' },
  ],
  ta: [
    { id: 'standard', label: 'Standard Chennai', nativeLabel: 'சென்னை தமிழ்' },
    { id: 'kongu', label: 'Kongu / Coimbatore', nativeLabel: 'கொங்கு தமிழ்' },
    { id: 'madurai', label: 'Madurai Dialect', nativeLabel: 'மதுரைத் தமிழ்' },
  ],
  en: [
    { id: 'in', label: 'Indian English', nativeLabel: 'English (India)' },
    { id: 'us', label: 'US English', nativeLabel: 'English (US)' },
    { id: 'uk', label: 'British English', nativeLabel: 'English (UK)' },
  ],
};

function applyDialectNuance(text: string, targetLang: string, dialect: string): string {
  if (!text || dialect === 'standard' || !dialect) return text;

  let transformed = text;

  if (targetLang === 'te') {
    if (dialect === 'telangana') {
      transformed = transformed
        .replace(/ఎలా ఉన్నారు\??/g, 'ఎట్లున్నారు?')
        .replace(/ఎలా ఉన్నారు/g, 'ఎట్లున్నారు')
        .replace(/చాలా బాగున్నాను/g, 'మస్తుగున్నాను')
        .replace(/చాలా/g, 'మస్తు')
        .replace(/ఇది/g, 'గిది')
        .replace(/ఏమిటి/g, 'ఏంది')
        .replace(/ఎక్కడ/g, 'ఎక్కడికి')
        .replace(/బాగున్నాను/g, 'మస్తుగున్నా');
    } else if (dialect === 'rayalaseema') {
      transformed = transformed
        .replace(/ఎలా ఉన్నారు\??/g, 'ఎట్లున్నారు బా?')
        .replace(/ఎలా ఉన్నారు/g, 'ఎట్లున్నారు బా')
        .replace(/చాలా బాగుంది/g, 'అబ్బో బలేగుంది')
        .replace(/ఏమిటి/g, 'ఏందే');
    }
  } else if (targetLang === 'kn') {
    if (dialect === 'north_karnataka') {
      transformed = transformed
        .replace(/ಹೇಗಿದ್ದೀರಿ\??/g, 'ಹ್ಯಾಂಗಿದ್ದೀರಿ?')
        .replace(/ಹೇಗಿದ್ದೀರಿ/g, 'ಹ್ಯಾಂಗಿದ್ದೀರಿ')
        .replace(/ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದೇನೆ/g, 'ಭಾರಿ ಆರಾಮ ಇದ್ದೀನಿ')
        .replace(/ತುಂಬಾ/g, 'ಭಾರಿ')
        .replace(/ಚೆನ್ನಾಗಿದ್ದೇನೆ/g, 'ಆರಾಮ ಇದ್ದೀನಿ')
        .replace(/ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ/g, 'ಏನ್ ಮಾಡಾಕತ್ತೀರಿ')
        .replace(/ಊಟವಾಯಿತಾ/g, 'ಊಟ ಆತೇನ್ರಿ');
    } else if (dialect === 'coastal') {
      transformed = transformed
        .replace(/ಹೇಗಿದ್ದೀರಿ/g, 'ಎಂಚುಲ್ಲರ್')
        .replace(/ಚೆನ್ನಾಗಿದ್ದೇನೆ/g, 'ಉಷಾರುಳ್ಳೆ');
    }
  } else if (targetLang === 'hi') {
    if (dialect === 'awadhi' || dialect === 'bhojpuri') {
      transformed = transformed
        .replace(/आप कैसे हैं\?/g, 'का हाल बा?')
        .replace(/आप कैसे हैं/g, 'का हाल बा')
        .replace(/मैं ठीक हूँ/g, 'हम बिल्कुल ठीक बानी')
        .replace(/बहुत अच्छा/g, 'बहुत नीक बा');
    }
  }

  return transformed;
}

const QUICK_PHRASES = [
  'Hello! How are you?',
  'What is your name?',
  'Where is the station?',
  'Thank you very much',
  'How much is this food?',
  'I need water, please',
];

export const TranslatorPage: React.FC = () => {
  const { notify } = useNotification();
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('kn');
  const [inputText, setInputText] = useState('Hello! How are you?');
  const [outputText, setOutputText] = useState('ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ? (Namaskara, neevu hegiddiri?)');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeakReply, setAutoSpeakReply] = useState(true);
  const [selectedDialect, setSelectedDialect] = useState('standard');
  const [savedTranslations, setSavedTranslations] = useState<
    { from: string; to: string; srcText: string; tgtText: string }[]
  >([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Reset dialect when target language changes
  useEffect(() => {
    setSelectedDialect('standard');
  }, [targetLang]);

  // Clean text helper (removes bracketed pronunciations)
  const getCleanSpeechText = (text: string) => text.replace(/\(.*?\)/g, '').trim();

  const handleTranslate = useCallback(
    async (textToTranslate?: string, shouldAutoSpeak = false) => {
      const text = (textToTranslate ?? inputText).trim();
      if (!text) {
        setOutputText('');
        return;
      }
      setIsTranslating(true);
      try {
        const result = await translationService.translate({
          text,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });

        // Apply regional dialect nuance if selected
        const finalizedOutput = applyDialectNuance(result.translatedText, targetLang, selectedDialect);
        setOutputText(finalizedOutput);

        // Auto-speak reply if enabled or explicitly requested via voice command
        if (shouldAutoSpeak || autoSpeakReply) {
          const speechCode = SPEECH_LANG_MAP[targetLang] || 'en-US';
          const cleanToSpeak = getCleanSpeechText(finalizedOutput);
          if (cleanToSpeak) {
            setIsSpeaking(true);
            SpeechService.speak(cleanToSpeak, speechCode)
              .catch(() => {})
              .finally(() => setIsSpeaking(false));
          }
        }
      } catch {
        notify({ type: 'error', message: 'Translation request failed' });
      } finally {
        setIsTranslating(false);
      }
    },
    [inputText, sourceLang, targetLang, selectedDialect, autoSpeakReply, notify]
  );

  // Auto-translate live when user types (debounced 400ms)
  useEffect(() => {
    if (isListening) return; // Don't trigger debounce while user is actively speaking
    const handler = setTimeout(() => {
      if (inputText.trim()) {
        handleTranslate(inputText, false);
      } else {
        setOutputText('');
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [inputText, sourceLang, targetLang, selectedDialect, handleTranslate, isListening]);

  // Speech-to-Speech Voice Command recognition
  const handleVoiceCommand = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notify({
        type: 'warning',
        title: 'Microphone Not Supported',
        message: 'Speech recognition is not supported on this browser. Try Google Chrome on Android or Desktop.',
      });
      return;
    }

    // Toggle off if currently listening
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    try {
      SpeechService.stop(); // Stop any pending TTS voice output
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = SPEECH_LANG_MAP[sourceLang] || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        notify({
          type: 'info',
          title: '🎙️ Listening...',
          message: `Speak in ${SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang)?.name || 'your language'} now.`,
        });
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript && transcript.trim()) {
          const spoken = transcript.trim();
          setInputText(spoken);
          notify({
            type: 'success',
            title: '🎙️ Voice Captured',
            message: `"${spoken}" -> Translating & Speaking Reply...`,
          });
          // Immediately translate and automatically speak the reply aloud!
          handleTranslate(spoken, true);
        }
        setIsListening(false);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (e: any) => {
        setIsListening(false);
        if (e.error === 'not-allowed') {
          notify({
            type: 'error',
            title: 'Microphone Permission Blocked',
            message: 'Please allow microphone access in your browser settings to use voice commands.',
          });
        } else if (e.error !== 'no-speech') {
          notify({
            type: 'warning',
            message: `Voice recognition: ${e.error || 'No speech detected, please try again.'}`,
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      notify({
        type: 'error',
        message: 'Could not access microphone. Please check permissions.',
      });
    }
  };

  const handleSwap = () => {
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    const cleanOutput = getCleanSpeechText(outputText);

    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    setInputText(cleanOutput || outputText);
    setOutputText(inputText);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    notify({ type: 'success', message: 'Translation copied to clipboard' });
  };

  const handlePronounce = async () => {
    if (!outputText || isSpeaking) return;
    try {
      setIsSpeaking(true);
      const speechCode = SPEECH_LANG_MAP[targetLang] || 'en-US';
      const textToSpeak = getCleanSpeechText(outputText);
      await SpeechService.speak(textToSpeak || outputText, speechCode);
    } catch {
      notify({
        type: 'warning',
        message: 'Voice pronunciation synthesizer not supported on this device.',
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleSaveTranslation = () => {
    if (!outputText) return;
    const item = {
      from: sourceLang,
      to: targetLang,
      srcText: inputText,
      tgtText: outputText,
    };
    setSavedTranslations((prev) => [item, ...prev.slice(0, 5)]);
    notify({
      type: 'success',
      title: 'Translation Saved',
      message: 'Saved to your quick reference notes.',
    });
  };

  const handleShare = () => {
    if (!outputText) return;
    if (navigator.share) {
      navigator.share({
        title: 'LangLearn Translation',
        text: `${inputText} -> ${outputText}`,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const currentDialectOptions = REGIONAL_DIALECTS[targetLang] || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ModuleHeader
        title="Live Multilingual Voice Translator"
        subtitle="Voice speech-to-speech AI translation with automatic voice replies and regional dialect options."
        icon={Languages}
        badge="Voice Command Enabled"
      />

      {/* Voice Command Hero Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <button
            onClick={handleVoiceCommand}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all ${
              isListening
                ? 'bg-rose-500 animate-pulse ring-4 ring-rose-300'
                : 'bg-white text-blue-600 hover:scale-105 active:scale-95'
            }`}
            title={isListening ? 'Tap to Stop Listening' : 'Tap to Speak Voice Command'}
          >
            {isListening ? (
              <MicOff className="w-7 h-7 text-white animate-bounce" />
            ) : (
              <Mic className="w-7 h-7 text-blue-600" />
            )}
          </button>
          <div>
            <div className="text-sm font-bold flex items-center justify-center sm:justify-start gap-1.5">
              <span>{isListening ? '🎙️ Listening to your voice...' : '🎙️ Tap Mic to Speak'}</span>
              {isListening && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping inline-block" />
              )}
            </div>
            <p className="text-xs text-blue-100">
              {isListening
                ? `Speak now in ${SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang)?.name}...`
                : 'Speak in any language — it automatically translates and speaks reply aloud!'}
            </p>
          </div>
        </div>

        {/* Auto-Speak Reply Toggle */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shrink-0">
          <span className="text-xs font-semibold text-white">Auto-Speak Reply:</span>
          <button
            onClick={() => {
              const next = !autoSpeakReply;
              setAutoSpeakReply(next);
              notify({
                type: 'info',
                message: `Auto-Speak Reply turned ${next ? 'ON 🔊' : 'OFF 🔇'}`,
              });
            }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              autoSpeakReply ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white/20 text-blue-100'
            }`}
          >
            {autoSpeakReply ? '🔊 ON' : '🔇 OFF'}
          </button>
        </div>
      </div>

      {/* Main Translation Card */}
      <Card className="p-5 space-y-4">
        {/* Language Selection Bar */}
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="flex-1 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 py-1.5 px-2 focus:outline-none cursor-pointer truncate"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="dark:bg-slate-900">
                {l.flag} {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSwap}
            className="p-2 rounded-xl text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-sm hover:scale-105 active:scale-95 transition"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 py-1.5 px-2 focus:outline-none cursor-pointer truncate"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="dark:bg-slate-900">
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Regional Dialect Selection (Option 3) */}
        {currentDialectOptions.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-blue-500" />
                <span>Regional Dialect Nuance:</span>
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400">
                {currentDialectOptions.find((d) => d.id === selectedDialect)?.nativeLabel}
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {currentDialectOptions.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDialect(d.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition whitespace-nowrap ${
                    selectedDialect === d.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <span>Enter Text or Speak</span>
              {isListening && (
                <span className="text-rose-500 font-bold animate-pulse">● Recording Voice...</span>
              )}
            </span>
            <span>{inputText.length}/500</span>
          </div>
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              maxLength={500}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type anything or tap microphone above to speak..."
              className={`w-full p-3.5 pr-20 rounded-2xl border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none leading-relaxed ${
                isListening
                  ? 'border-rose-400 ring-2 ring-rose-300/40'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            <div className="absolute top-3 right-3 flex items-center gap-1">
              <button
                onClick={handleVoiceCommand}
                className={`p-1.5 rounded-xl shadow-sm transition ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
                title={isListening ? 'Stop Mic' : 'Voice Input'}
              >
                {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
              </button>
              {inputText && (
                <button
                  onClick={() => {
                    setInputText('');
                    setOutputText('');
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5"
                  title="Clear text"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick Samples
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PHRASES.map((phrase) => (
              <button
                key={phrase}
                onClick={() => {
                  setInputText(phrase);
                  handleTranslate(phrase, autoSpeakReply);
                }}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl whitespace-nowrap transition"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Translated Output Card */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <span>Translation</span>
              <Badge variant="green" size="sm" className="text-[9px] px-1.5 py-0.2">
                100% Neural
              </Badge>
              {selectedDialect !== 'standard' && (
                <Badge variant="blue" size="sm" className="text-[9px] px-1.5 py-0.2">
                  Dialect Active
                </Badge>
              )}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePronounce}
                disabled={!outputText}
                className={`p-1.5 rounded-lg transition ${
                  isSpeaking
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Speak / Pronounce Out Loud"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
              </button>
              <button
                onClick={handleSaveTranslation}
                disabled={!outputText}
                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Save Translation"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                disabled={!outputText}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Copy"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="w-full min-h-[90px] p-4 rounded-2xl border border-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20 text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed break-words relative">
            {isTranslating ? (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 py-3">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Translating across language models...</span>
              </div>
            ) : outputText ? (
              <div>
                <p>{outputText}</p>
                {isSpeaking && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping inline-block" />
                    <span>Speaking translated response out loud...</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-slate-400 font-normal">
                Translation will appear here instantly...
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            size="md"
            onClick={handleVoiceCommand}
            leftIcon={isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          >
            {isListening ? 'Stop Listening' : 'Speak to Translate'}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            size="md"
            isLoading={isTranslating}
            onClick={() => handleTranslate(inputText, autoSpeakReply)}
            leftIcon={<Volume2 className="w-4 h-4" />}
          >
            Translate & Speak
          </Button>
        </div>
      </Card>

      {/* Saved Translations History */}
      {savedTranslations.length > 0 && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Saved Translations</span>
            </h3>
            <button
              onClick={() => setSavedTranslations([])}
              className="text-[10px] text-slate-400 hover:text-red-500"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {savedTranslations.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                  <span>
                    {item.from.toUpperCase()} → {item.to.toUpperCase()}
                  </span>
                </div>
                <div className="text-slate-500">{item.srcText}</div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{item.tgtText}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
