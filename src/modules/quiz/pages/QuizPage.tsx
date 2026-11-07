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
import { SUPPORTED_LANGUAGES } from '@/config/constants';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuizQuestion {
  id: number;
  type: 'translation' | 'fill_blank' | 'audio' | 'culture';
  prompt: string;
  sentence?: string;
  audioText?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLanguageCode } = useAppStore();
  const { notify } = useNotification();

  const courseParam = (searchParams.get('course') || activeLanguageCode || 'kn').toLowerCase();

  const currentLang = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === courseParam) || {
        name: courseParam.toUpperCase(),
        flag: '🌐',
      }
    );
  }, [courseParam]);

  // Questions tailored to language
  const questions: QuizQuestion[] = useMemo(() => {
    if (courseParam === 'hi') {
      return [
        {
          id: 1,
          type: 'translation',
          prompt: 'What is the correct meaning of "नमस्ते" (Namaste)?',
          sentence: 'नमस्ते जी, आप कैसे हैं?',
          options: ['Goodbye', 'Hello / Respectful Greetings', 'Please give water', 'Thank you very much'],
          correctIndex: 1,
          explanation: '"Namaste" is the universal respectful greeting in Hindi, signifying mutual honor.',
        },
        {
          id: 2,
          type: 'fill_blank',
          prompt: 'Choose the correct verb form to complete the sentence:',
          sentence: 'मैं रोज़ सुबह चाय _____ हूँ।',
          options: ['पीते', 'पीती / पीता', 'खाते', 'जाते'],
          correctIndex: 1,
          explanation: '"peeta/peeti hoon" is the first-person singular present continuous form of drinking tea.',
        },
        {
          id: 3,
          type: 'audio',
          prompt: 'Listen to the audio clip and select the word you hear:',
          audioText: 'धन्यवाद',
          options: ['धन्यवाद (Thank you)', 'नमस्ते (Hello)', 'रास्ता (Road)', 'परिवार (Family)'],
          correctIndex: 0,
          explanation: 'The spoken phrase was "Dhanyavaad", expressing heartfelt gratitude.',
        },
        {
          id: 4,
          type: 'culture',
          prompt: 'What suffix is added to names in Hindi to show polite respect?',
          sentence: 'Rahul + [_____] = Respectful address',
          options: ['-re', '-Ji', '-da', '-garu'],
          correctIndex: 1,
          explanation: 'The honorific suffix "-Ji" is added to names (e.g., Rahul Ji, Namaste Ji) to denote respect.',
        },
        {
          id: 5,
          type: 'translation',
          prompt: 'What does "रास्ता" (Rasta) mean in daily transit?',
          sentence: 'मेट्रो स्टेशन का रास्ता कहाँ है?',
          options: ['Ticket fare', 'Train carriage', 'Road / Path / Way', 'Platform number'],
          correctIndex: 2,
          explanation: '"Rasta" means road or path, commonly used when asking for transit directions.',
        },
      ];
    }

    if (courseParam === 'en') {
      return [
        {
          id: 1,
          type: 'translation',
          prompt: 'What does "Serendipity" mean in English?',
          sentence: 'Meeting my best friend was pure serendipity.',
          options: [
            'A carefully planned schedule',
            'Fortunate discovery by happy chance',
            'A very serious mistake',
            'A sudden loud sound',
          ],
          correctIndex: 1,
          explanation: '"Serendipity" refers to the occurrence of valuable discoveries by chance.',
        },
        {
          id: 2,
          type: 'fill_blank',
          prompt: 'Choose the correct preposition to complete the sentence:',
          sentence: 'She arrives _____ the station at 9:00 AM.',
          options: ['in', 'at', 'on', 'with'],
          correctIndex: 1,
          explanation: 'We use "at" for specific locations like stations and airports.',
        },
        {
          id: 3,
          type: 'audio',
          prompt: 'Listen to the audio pronunciation and identify the greeting:',
          audioText: 'Good morning',
          options: ['Good morning', 'Good afternoon', 'Good night', 'Goodbye'],
          correctIndex: 0,
          explanation: 'The spoken phrase was "Good morning", used before noon.',
        },
        {
          id: 4,
          type: 'culture',
          prompt: 'What are universally referred to as the "magic words" of English courtesy?',
          sentence: 'Always remember to say _____ and _____.',
          options: ['Hurry & Go', 'Yes & No', 'Please & Thank you', 'Now & Later'],
          correctIndex: 2,
          explanation: '"Please" and "Thank you" are the foundational courtesy expressions in English.',
        },
        {
          id: 5,
          type: 'translation',
          prompt: 'What is the collective term for brothers and sisters?',
          sentence: 'Do you have any _____?',
          options: ['Cousins', 'Siblings', 'Colleagues', 'Neighbors'],
          correctIndex: 1,
          explanation: '"Siblings" refers collectively to brothers and sisters.',
        },
      ];
    }

    if (courseParam === 'te') {
      return [
        {
          id: 1,
          type: 'translation',
          prompt: 'What is the correct meaning of "నమస్కారం" (Namaskaram)?',
          sentence: 'అందరికీ నమస్కారం, బాగున్నారా?',
          options: ['Goodbye', 'Hello / Respectful Greetings', 'Thank you', 'Where to go'],
          correctIndex: 1,
          explanation: '"Namaskaram" is the classic polite greeting across Andhra Pradesh and Telangana.',
        },
        {
          id: 2,
          type: 'fill_blank',
          prompt: 'Choose the correct word to complete the question:',
          sentence: 'మీ పేరు _____? (What is your name?)',
          options: ['ఎక్కడ (Where)', 'ఏమిటి (What)', 'ఎప్పుడు (When)', 'ఎందుకు (Why)'],
          correctIndex: 1,
          explanation: '"Mee peru emiti?" is the standard polite phrase for asking someone their name.',
        },
        {
          id: 3,
          type: 'audio',
          prompt: 'Listen to the audio clip and select the word you hear:',
          audioText: 'ధన్యవాదాలు',
          options: ['ధన్యవాదాలు (Thank you)', 'నమస్కారం (Hello)', 'భోజనం (Meal)', 'శుభోదయం (Good morning)'],
          correctIndex: 0,
          explanation: 'The spoken phrase was "Dhanyavadalu", expressing heartfelt gratitude.',
        },
        {
          id: 4,
          type: 'culture',
          prompt: 'Which honorific suffix is added to names in Telugu to show deep respect?',
          sentence: 'Ramesh + [_____] = Respectful address',
          options: ['-Ji', '-re', '-Garu (-గారు)', '-da'],
          correctIndex: 2,
          explanation: 'The honorific suffix "-Garu" (e.g., Ramesh Garu) is universally used to denote respect in Telugu.',
        },
        {
          id: 5,
          type: 'translation',
          prompt: 'What does "భోజనం" (Bhojanam) mean in daily life?',
          sentence: 'మీరు భోజనం చేశారా? (Did you eat your meal?)',
          options: ['Travel ticket', 'Full meal / Food', 'Market bill', 'Office task'],
          correctIndex: 1,
          explanation: '"Bhojanam" means a proper meal or food, central to everyday hospitality.',
        },
      ];
    }

    if (courseParam === 'ta') {
      return [
        {
          id: 1,
          type: 'translation',
          prompt: 'What is the correct meaning of "வணக்கம்" (Vanakkam)?',
          sentence: 'அனைவருக்கும் வணக்கம்!',
          options: ['Goodbye', 'Hello / Respectful Greetings', 'Please sit', 'I am leaving'],
          correctIndex: 1,
          explanation: '"Vanakkam" is the traditional respectful Tamil greeting with folded hands.',
        },
        {
          id: 2,
          type: 'fill_blank',
          prompt: 'Complete the sentence with the polite Tamil question word:',
          sentence: 'உங்கள் பெயர் _____? (What is your name?)',
          options: ['எங்கு (Where)', 'என்ன (What)', 'எப்போது (When)', 'எப்படி (How)'],
          correctIndex: 1,
          explanation: '"Ungal peyar enna?" is the polite question for asking someone their name.',
        },
        {
          id: 3,
          type: 'audio',
          prompt: 'Listen to the audio clip and select the word you hear:',
          audioText: 'நன்றி',
          options: ['நன்றி (Thank you)', 'வணக்கம் (Hello)', 'காலை வணக்கம் (Good morning)', 'வாருங்கள் (Welcome)'],
          correctIndex: 0,
          explanation: 'The audio clip said "Nandri", expressing sincere gratitude in Tamil.',
        },
        {
          id: 4,
          type: 'culture',
          prompt: 'Which caring phrase is affectionately asked to inquire about well-being?',
          sentence: 'நேரத்திற்கு _____? (Did you have food on time?)',
          options: ['சாப்பிட்டீங்களா (Did you eat?)', 'தூங்கினீர்களா (Did you sleep?)', 'படித்தீர்களா (Did you read?)', 'சென்றீர்களா (Did you go?)'],
          correctIndex: 0,
          explanation: 'Asking "Sappitteengala?" (Did you eat?) is the signature Tamil way to express care.',
        },
        {
          id: 5,
          type: 'translation',
          prompt: 'What does "தண்ணீர்" (Thanneer) mean when dining?',
          sentence: 'கொஞ்சம் தண்ணீர் கொடுங்கள் (Please give water).',
          options: ['Hot Tea', 'Water', 'Filter Coffee', 'Rice'],
          correctIndex: 1,
          explanation: '"Thanneer" means water in Tamil.',
        },
      ];
    }

    // Default Kannada & other languages
    return [
      {
        id: 1,
        type: 'translation',
        prompt: `What is the universal greeting in ${currentLang.name}?`,
        sentence: 'ಎಲ್ಲರಿಗೂ ನಮಸ್ಕಾರ (Namaskara)!',
        options: ['ನಮಸ್ಕಾರ (Hello / Respectful Greetings)', 'ಊಟ (Meal)', 'ರಸ್ತೆ (Road)', 'ಹೋಗೋಣ (Let us go)'],
        correctIndex: 0,
        explanation: '"Namaskara" is the universal respectful greeting spoken with folded hands.',
      },
      {
        id: 2,
        type: 'fill_blank',
        prompt: 'Which word means "Thank you" in polite conversation?',
        sentence: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ _____ (Thank you).',
        options: ['ಧನ್ಯವಾದಗಳು (Dhanyavadagalu)', 'ದಯವಿಟ್ಟು (Please)', 'ಬನ್ನಿ (Come in)', 'ಕುಟುಂಬ (Family)'],
        correctIndex: 0,
        explanation: '"Dhanyavadagalu" expresses sincere gratitude in Kannada.',
      },
      {
        id: 3,
        type: 'audio',
        prompt: 'Listen to the audio clip and select the matching word:',
        audioText: 'ಫಿಲ್ಟರ್ ಕಾಫಿ',
        options: ['ಫಿಲ್ಟರ್ ಕಾಫಿ (Filter Coffee)', 'ಬಿಸಿ ಊಟ (Hot Meal)', 'ನೀರು (Water)', 'ಹಾಲು (Milk)'],
        correctIndex: 0,
        explanation: 'The spoken clip was "Filter Kaapi", the iconic beverage of Karnataka.',
      },
      {
        id: 4,
        type: 'culture',
        prompt: 'What common affectionate greeting asks if someone had food?',
        sentence: 'ನಿಮ್ಮ _____ ಆಯ್ತಾ? (Did you have food?)',
        options: ['ರಸ್ತೆ (Road)', 'ಊಟ (Oota - Meal)', 'ಕೆಲಸ (Work)', 'ಮನೆ (Home)'],
        correctIndex: 1,
        explanation: 'Asking "Oota aaytha?" is an affectionate way of caring for someone’s well-being.',
      },
      {
        id: 5,
        type: 'translation',
        prompt: 'What does "ದಯವಿಟ್ಟು" (Dayavittu) mean when asking for directions?',
        sentence: 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ನಿಲ್ಲಿ.',
        options: ['Hurry up', 'Please / Kindly', 'Goodbye', 'Where is it?'],
        correctIndex: 1,
        explanation: '"Dayavittu" means "please" or "kindly", showing polite courtesy.',
      },
    ];
  }, [courseParam, currentLang.name]);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentQIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handlePlayAudio = () => {
    if (currentQ.audioText) {
      SpeechService.speak(currentQ.audioText, `${courseParam}-IN`);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      notify({
        type: 'success',
        title: 'Correct Answer! (+10 XP)',
        message: currentQ.explanation,
      });
    } else {
      notify({
        type: 'error',
        title: 'Incorrect',
        message: currentQ.explanation,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      notify({
        type: 'success',
        title: '🎉 Quiz Completed!',
        message: `You scored ${score + (selectedOption === currentQ.correctIndex ? 1 : 0)} of ${
          questions.length
        }!`,
      });
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const scorePercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-2xl mx-auto">
      {/* Header */}
      <ModuleHeader
        title={`${currentLang.name} Unit Quiz`}
        subtitle="Adaptive comprehension and grammar checkpoint to reinforce long-term memory."
        icon={HelpCircle}
        badge={`${questions.length} Questions`}
      />

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Question <strong>{currentQIndex + 1}</strong> of {questions.length}
          </span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            Current Score: {score} / {questions.length}
          </span>
        </div>
        <ProgressBar
          value={Math.round(((currentQIndex + 1) / questions.length) * 100)}
          color="blue"
          size="sm"
        />
      </div>

      {quizFinished ? (
        /* Quiz Finished Summary */
        <Card className="p-8 text-center space-y-6 border-2 border-blue-400 dark:border-blue-700 bg-blue-50/20 dark:bg-blue-950/20 shadow-lg animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-lg animate-bounce">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Quiz Completed!
            </h3>
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
              {scorePercentage}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You answered <strong>{score}</strong> out of <strong>{questions.length}</strong> questions
              correctly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-center gap-4">
            <span className="flex items-center gap-1 font-bold text-amber-600">
              <Sparkles className="w-4 h-4" /> +{score * 15} XP Earned
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> Milestone Verified
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={handleRestart}
            >
              Retake Quiz
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate(`/courses?lang=${courseParam}`)}
            >
              Back to Course Syllabus
            </Button>
          </div>
        </Card>
      ) : (
        /* Active Question Card */
        <Card className="p-6 sm:p-8 space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <Badge variant="blue" size="sm">
              {currentQ.type.toUpperCase()}
            </Badge>
            <span className="text-xs text-slate-400">CEFR A1 Evaluation</span>
          </div>

          {/* Question Prompt */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {currentQ.prompt}
            </h3>
            {currentQ.sentence && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                "{currentQ.sentence}"
              </div>
            )}
          </div>

          {/* Audio Button if Audio Question */}
          {currentQ.type === 'audio' && (
            <div className="text-center py-2">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Volume2 className="w-5 h-5 animate-pulse" />}
                onClick={handlePlayAudio}
              >
                Play Audio Clip
              </Button>
            </div>
          )}

          {/* 4 Multiple Choice Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={cn(
                    'p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between select-none',
                    !isSubmitted && isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                      : isSubmitted && isCorrectAnswer
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                      : isSubmitted && isSelected && !isCorrectAnswer
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </span>

                  {isSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Submit */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 animate-fadeIn space-y-1">
              <strong className="text-slate-900 dark:text-slate-100 font-bold">Explanation:</strong>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Submit / Next Button */}
          <div className="flex justify-end pt-2">
            {!isSubmitted ? (
              <Button
                variant="primary"
                size="md"
                disabled={selectedOption === null}
                onClick={handleSubmit}
                className="w-full sm:w-auto"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNextQuestion}
                className="w-full sm:w-auto"
              >
                {currentQIndex + 1 < questions.length ? 'Next Question' : 'See Results'}
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
