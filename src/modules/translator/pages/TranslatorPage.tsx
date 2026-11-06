import React, { useState, useEffect, useCallback } from 'react';
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
  const [savedTranslations, setSavedTranslations] = useState<
    { from: string; to: string; srcText: string; tgtText: string }[]
  >([]);

  const handleTranslate = useCallback(async (textToTranslate?: string) => {
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
      setOutputText(result.translatedText);
    } catch {
      notify({ type: 'error', message: 'Translation request failed' });
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, sourceLang, targetLang, notify]);

  // Re-translate when language dropdown changes
  useEffect(() => {
    handleTranslate();
  }, [sourceLang, targetLang]);

  const handleSwap = () => {
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    const prevInput = inputText;
    const prevOutput = outputText;

    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    setInputText(prevOutput);
    setOutputText(prevInput);
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
      // Clean romanized annotations for TTS speech
      const textToSpeak = outputText.replace(/\(.*?\)/g, '').trim();
      await SpeechService.speak(textToSpeak || outputText, speechCode);
    } catch {
      notify({
        type: 'warning',
        message: 'Voice pronunciation synthesizer not supported on this browser.',
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

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ModuleHeader
        title="Live AI Multilingual Translator"
        subtitle="100% neural translation for Kannada, Hindi, Tamil, Telugu, and global languages."
        icon={Languages}
        badge="Live AI Engine"
      />

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

        {/* Input Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Enter Text</span>
            <span>{inputText.length}/500</span>
          </div>
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              maxLength={500}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type anything in English, Kannada, Hindi, Tamil, Telugu..."
              className="w-full p-3.5 pr-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none leading-relaxed"
            />
            {inputText && (
              <button
                onClick={() => {
                  setInputText('');
                  setOutputText('');
                }}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title="Clear text"
              >
                ✕
              </button>
            )}
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
                  handleTranslate(phrase);
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
            <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Translation</span>
              <Badge variant="green" size="sm" className="text-[9px] px-1.5 py-0.2">
                100% Neural
              </Badge>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePronounce}
                disabled={!outputText}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Pronounce"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-blue-600 animate-bounce' : ''}`} />
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
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="w-full min-h-[90px] p-4 rounded-2xl border border-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20 text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed break-words">
            {isTranslating ? (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 py-3">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Translating across language models...</span>
              </div>
            ) : outputText ? (
              outputText
            ) : (
              <span className="text-slate-400 font-normal">
                Translation will appear here instantly...
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          className="w-full"
          size="md"
          isLoading={isTranslating}
          onClick={() => handleTranslate()}
        >
          Translate Instantly
        </Button>
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
                  <span>{item.from.toUpperCase()} → {item.to.toUpperCase()}</span>
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