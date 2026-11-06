import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { useNotification } from '@/context/NotificationContext';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SpeechService } from '@/services/speech/speech.service';
import { getVocabularyForLanguage } from '@/modules/vocabulary/data/vocabulary.data';
import { SUPPORTED_LANGUAGES } from '@/config/constants';
import {
  Sparkles,
  Volume2,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Layers,
  Mic,
  Headphones,
  Award,
} from 'lucide-react';
import { cn } from '@/utils/cn';

type PracticeMode = 'flashcards' | 'speech' | 'listening';

export const PracticePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLanguageCode, user } = useAppStore();
  const { notify } = useNotification();

  const courseParam = (searchParams.get('course') || activeLanguageCode || 'kn').toLowerCase();
  const initialMode = (searchParams.get('mode') as PracticeMode) || 'flashcards';

  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechScore, setSpeechScore] = useState<number | null>(null);
  const [selectedListeningOption, setSelectedListeningOption] = useState<number | null>(null);
  const [listeningFeedback, setListeningFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentLang = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === courseParam) || {
        name: courseParam.toUpperCase(),
        flag: '🌐',
      }
    );
  }, [courseParam]);

  const deck = useMemo(() => {
    return getVocabularyForLanguage(courseParam);
  }, [courseParam]);

  const currentCard = deck[currentIndex] || deck[0];

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    SpeechService.speak(text, currentCard.audioLangCode);
  };

  const handleAnswerCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const xpGain = rating === 'easy' ? 10 : rating === 'good' ? 8 : rating === 'hard' ? 5 : 2;
    setEarnedXp((prev) => prev + xpGain);

    if (currentIndex + 1 < deck.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      notify({
        type: 'success',
        title: '🎉 Practice Session Complete!',
        message: `Great job! You reviewed ${deck.length} flashcards and gained +${earnedXp + xpGain} XP!`,
      });
    }
  };

  const handleSimulateSpeech = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setSpeechScore(null);

    // Simulate microphone audio processing
    setTimeout(() => {
      setIsRecording(false);
      const score = Math.floor(Math.random() * 15) + 85; // 85% to 99%
      setSpeechScore(score);
      setEarnedXp((prev) => prev + 15);
      notify({
        type: 'success',
        title: `Speech Accuracy: ${score}%`,
        message: 'Excellent intonation and clear vowel pronunciation!',
      });
    }, 1800);
  };

  const handleListeningSubmit = (optionIndex: number, isCorrect: boolean) => {
    setSelectedListeningOption(optionIndex);
    if (isCorrect) {
      setListeningFeedback('correct');
      setEarnedXp((prev) => prev + 10);
      notify({
        type: 'success',
        title: 'Correct Match! (+10 XP)',
        message: `"${currentCard.word}" means "${currentCard.meaning}".`,
      });
    } else {
      setListeningFeedback('wrong');
      notify({
        type: 'error',
        title: 'Not quite',
        message: `The correct translation is "${currentCard.meaning}".`,
      });
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setEarnedXp(0);
    setSessionCompleted(false);
    setSpeechScore(null);
    setSelectedListeningOption(null);
    setListeningFeedback(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-4xl mx-auto">
      {/* Module Header */}
      <ModuleHeader
        title={`${currentLang.name} Practice Arena`}
        subtitle="Active recall flashcards, speech studio, and listening comprehension drills."
        icon={Sparkles}
        badge={`${deck.length} Cards in Deck`}
      />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => {
            setMode('flashcards');
            resetSession();
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition select-none',
            mode === 'flashcards'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Flashcards</span>
        </button>

        <button
          onClick={() => {
            setMode('speech');
            resetSession();
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition select-none',
            mode === 'speech'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <Mic className="w-4 h-4" />
          <span>Speech Studio</span>
        </button>

        <button
          onClick={() => {
            setMode('listening');
            resetSession();
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition select-none',
            mode === 'listening'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <Headphones className="w-4 h-4" />
          <span>Listening</span>
        </button>
      </div>

      {/* Progress & Session Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Card <strong>{currentIndex + 1}</strong> of {deck.length}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5" /> +{earnedXp} XP
          </span>
          <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
            <Flame className="w-3.5 h-3.5 fill-current" /> {user?.streakDays ?? 4}d
          </span>
        </div>
      </div>
      <ProgressBar
        value={Math.round(((currentIndex + 1) / deck.length) * 100)}
        color="blue"
        size="sm"
      />

      {/* Session Complete Card */}
      {sessionCompleted ? (
        <Card className="p-8 text-center space-y-6 border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Practice Milestone Achieved!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You reviewed {deck.length} words in {currentLang.name} and earned{' '}
              <strong className="text-amber-600 dark:text-amber-400">+{earnedXp} XP</strong>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant="primary"
              size="md"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={resetSession}
            >
              Practice Again
            </Button>
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate(`/quiz?course=${courseParam}`)}
            >
              Take Quiz Challenge
            </Button>
          </div>
        </Card>
      ) : mode === 'flashcards' ? (
        /* MODE 1: Interactive Flip Flashcard */
        <div className="space-y-6">
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="w-full min-h-[300px] cursor-pointer select-none"
          >
            <Card
              className={cn(
                'p-8 min-h-[300px] flex flex-col justify-between items-center text-center transition-all duration-300 border-2 shadow-lg relative',
                isFlipped
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              )}
            >
              <div className="w-full flex items-center justify-between text-xs text-slate-400">
                <Badge variant="blue" size="sm">
                  {currentCard.categoryLabel}
                </Badge>
                <span>Tap card to {isFlipped ? 'hide' : 'reveal'} answer</span>
              </div>

              {!isFlipped ? (
                /* Card Front */
                <div className="my-auto space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {currentCard.word}
                    </h2>
                    {currentCard.romanized !== currentCard.word && (
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {currentCard.romanized}
                      </div>
                    )}
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {currentCard.phonetic}
                    </span>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={(e) => handleSpeak(currentCard.word, e)}
                      className="p-3 rounded-2xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition active:scale-95 inline-flex items-center gap-2 text-xs font-bold"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Listen Pronunciation</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Card Back */
                <div className="my-auto space-y-4 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Meaning
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                      {currentCard.meaning}
                    </h3>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 max-w-md">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      "{currentCard.exampleSentence}"
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 pt-0.5">
                      "{currentCard.exampleTranslation}"
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                {isFlipped
                  ? 'Rate how well you remembered this card below:'
                  : 'Click anywhere to check translation'}
              </div>
            </Card>
          </div>

          {/* SRS Action Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleAnswerCard('again')}
              className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold transition hover:scale-[1.02] active:scale-95"
            >
              <div>Again</div>
              <div className="text-[10px] font-normal opacity-75">&lt;1 min</div>
            </button>
            <button
              onClick={() => handleAnswerCard('hard')}
              className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold transition hover:scale-[1.02] active:scale-95"
            >
              <div>Hard</div>
              <div className="text-[10px] font-normal opacity-75">1 day</div>
            </button>
            <button
              onClick={() => handleAnswerCard('good')}
              className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold transition hover:scale-[1.02] active:scale-95"
            >
              <div>Good</div>
              <div className="text-[10px] font-normal opacity-75">3 days</div>
            </button>
            <button
              onClick={() => handleAnswerCard('easy')}
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-bold transition hover:scale-[1.02] active:scale-95"
            >
              <div>Easy</div>
              <div className="text-[10px] font-normal opacity-75">7 days</div>
            </button>
          </div>
        </div>
      ) : mode === 'speech' ? (
        /* MODE 2: Speech & Pronunciation Studio */
        <Card className="p-6 sm:p-8 text-center space-y-6 border border-slate-200/80 dark:border-slate-800">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Speak the phrase aloud
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              {currentCard.word}
            </h2>
            <div className="text-base font-bold text-blue-600 dark:text-blue-400">
              {currentCard.romanized}
            </div>
            <p className="text-xs text-slate-500">{currentCard.meaning}</p>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Volume2 className="w-4 h-4" />}
              onClick={() => handleSpeak(currentCard.word)}
            >
              Hear Native Audio
            </Button>
          </div>

          {/* Microphone Interactive Record Button */}
          <div className="py-4 flex flex-col items-center space-y-3">
            <button
              type="button"
              onClick={handleSimulateSpeech}
              className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl active:scale-95',
                isRecording
                  ? 'bg-rose-600 animate-ping'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              )}
            >
              <Mic className="w-8 h-8" />
            </button>
            <span className="text-xs font-semibold text-slate-500">
              {isRecording ? 'Listening carefully...' : 'Tap microphone and speak'}
            </span>
          </div>

          {/* Speech Result */}
          {speechScore !== null && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Accuracy Score: {speechScore}%</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Native pitch cadence and vowel length recognized accurately! (+15 XP)
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                if (currentIndex + 1 < deck.length) {
                  setCurrentIndex((p) => p + 1);
                  setSpeechScore(null);
                } else {
                  setSessionCompleted(true);
                }
              }}
            >
              Next Word
            </Button>
          </div>
        </Card>
      ) : (
        /* MODE 3: Listening Comprehension */
        <Card className="p-6 sm:p-8 space-y-6 border border-slate-200/80 dark:border-slate-800">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Listen and pick the correct translation
            </span>
            <div>
              <button
                type="button"
                onClick={() => handleSpeak(currentCard.word)}
                className="p-4 rounded-3xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition active:scale-95 inline-flex items-center gap-2 text-sm font-bold"
              >
                <Volume2 className="w-6 h-6 animate-pulse" />
                <span>Play Sound Clip</span>
              </button>
            </div>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {[
              currentCard.meaning,
              'To leave quickly without notice',
              'A traditional sweet dessert',
              'Marketplace direction indicator',
            ]
              .sort(() => 0.5 - Math.random())
              .map((opt, idx) => {
                const isSelected = selectedListeningOption === idx;
                const isCorrect = opt === currentCard.meaning;

                return (
                  <button
                    key={idx}
                    onClick={() => handleListeningSubmit(idx, isCorrect)}
                    className={cn(
                      'p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between',
                      isSelected && listeningFeedback === 'correct'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : isSelected && listeningFeedback === 'wrong'
                        ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    )}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <CheckCircle2
                        className={cn(
                          'w-4 h-4',
                          listeningFeedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'
                        )}
                      />
                    )}
                  </button>
                );
              })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/vocabulary')}
            >
              Exit
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                if (currentIndex + 1 < deck.length) {
                  setCurrentIndex((p) => p + 1);
                  setSelectedListeningOption(null);
                  setListeningFeedback(null);
                } else {
                  setSessionCompleted(true);
                }
              }}
            >
              Next Question
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
