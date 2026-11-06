import React, { useState } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Languages, ArrowRightLeft, Volume2, Copy, Check } from 'lucide-react';
import { translationService } from '@/services/translation/translation.service';
import { SpeechService } from '@/services/speech/speech.service';
import { useNotification } from '@/context/NotificationContext';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

export const TranslatorPage: React.FC = () => {
  const { notify } = useNotification();
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [inputText, setInputText] = useState('Hello, welcome to LangLearn!');
  const [outputText, setOutputText] = useState('¡Hola, bienvenido a LangLearn!');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const result = await translationService.translate({
        text: inputText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
      setOutputText(result.translatedText);
    } catch {
      notify({ type: 'error', message: 'Translation request failed' });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    notify({ type: 'success', message: 'Translation copied to clipboard' });
  };

  const handlePronounce = () => {
    SpeechService.speak(outputText, `${targetLang}-${targetLang.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <ModuleHeader
        title="AI Multilingual Translator"
        subtitle="Context-aware neural translation engine with dialect nuances and phonetic assistance."
        icon={Languages}
        badge="Live Neural Translation Ready"
      />

      <Card className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Language Selection Bar */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold py-2 px-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSwap}
            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold py-2 px-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Translation Workspaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source Input */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">Input Text</span>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste text to translate..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Translated Result */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Translation</span>
              <div className="flex gap-1">
                <button
                  onClick={handlePronounce}
                  className="p-1 text-slate-400 hover:text-blue-600 rounded"
                  title="Pronounce"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-blue-600 rounded"
                  title="Copy"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="w-full h-[132px] p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-sm font-medium text-slate-900 dark:text-slate-100 overflow-y-auto">
              {outputText || <span className="text-slate-400">Translation will appear here...</span>}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" isLoading={isTranslating} onClick={handleTranslate}>
            Translate Now
          </Button>
        </div>
      </Card>
    </div>
  );
};
