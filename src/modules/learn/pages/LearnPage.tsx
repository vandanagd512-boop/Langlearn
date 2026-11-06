import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { SUPPORTED_LANGUAGES } from '@/config/constants';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Compass,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  Flame,
  Zap,
  Award,
} from 'lucide-react';

interface SkillNode {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  subtitle: string;
  iconName: string;
  status: 'completed' | 'current' | 'locked';
  stars: number;
  totalStars: number;
  xpReward: number;
  lessonId: string;
  sampleWords: { word: string; meaning: string }[];
}

export const LearnPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeLanguageCode, user, dailyGoalMinutes } = useAppStore();

  const currentLang = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === activeLanguageCode) ||
      SUPPORTED_LANGUAGES.find((l) => l.code === 'kn') ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [activeLanguageCode]);

  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  // Skill nodes generator tailored to current language
  const skillNodes: SkillNode[] = useMemo(() => {
    const lang = currentLang.name;
    return [
      {
        id: 'node-1',
        unit: 1,
        unitTitle: 'Unit 1: Fundamentals & Script',
        title: 'Alphabet & Phonetics',
        subtitle: `Master essential ${lang} consonants, vowels, and acoustic tones`,
        iconName: '🔤',
        status: 'completed',
        stars: 3,
        totalStars: 3,
        xpReward: 25,
        lessonId: 'les-1',
        sampleWords: [
          { word: currentLang.code === 'kn' ? 'ನಮಸ್ಕಾರ' : currentLang.code === 'hi' ? 'नमस्ते' : 'Hello', meaning: 'Greetings' },
          { word: currentLang.code === 'kn' ? 'ಸ್ವರ' : currentLang.code === 'hi' ? 'स्वर' : 'Vowel', meaning: 'Primary sound' },
        ],
      },
      {
        id: 'node-2',
        unit: 1,
        unitTitle: 'Unit 1: Fundamentals & Script',
        title: 'Essential Greetings',
        subtitle: `Polite introductions, saying thank you, and goodbyes`,
        iconName: '👋',
        status: 'completed',
        stars: 3,
        totalStars: 3,
        xpReward: 30,
        lessonId: 'les-2',
        sampleWords: [
          { word: currentLang.code === 'kn' ? 'ಧನ್ಯವಾದ' : currentLang.code === 'hi' ? 'धन्यवाद' : 'Thank you', meaning: 'Gratitude' },
          { word: currentLang.code === 'kn' ? 'ಶುಭೋದಯ' : currentLang.code === 'hi' ? 'सुप्रभात' : 'Good Morning', meaning: 'Morning greeting' },
        ],
      },
      {
        id: 'node-3',
        unit: 2,
        unitTitle: 'Unit 2: Daily Social Exchange',
        title: 'Numbers & Counting',
        subtitle: 'Count 1-100, tell time, and handle marketplace currency',
        iconName: '🔢',
        status: 'current',
        stars: 1,
        totalStars: 3,
        xpReward: 35,
        lessonId: 'les-3',
        sampleWords: [
          { word: currentLang.code === 'kn' ? 'ಒಂದು, ಎರಡು' : currentLang.code === 'hi' ? 'एक, दो' : 'One, Two', meaning: 'Base numbers' },
          { word: currentLang.code === 'kn' ? 'ಎಷ್ಟು ಬೆಲೆ?' : currentLang.code === 'hi' ? 'कितना दाम?' : 'How much?', meaning: 'Price inquiry' },
        ],
      },
      {
        id: 'node-4',
        unit: 2,
        unitTitle: 'Unit 2: Daily Social Exchange',
        title: 'Food & Dining Out',
        subtitle: 'Order regional dishes, express preferences, and ask for the bill',
        iconName: '🍛',
        status: 'locked',
        stars: 0,
        totalStars: 3,
        xpReward: 40,
        lessonId: 'les-4',
        sampleWords: [
          { word: currentLang.code === 'kn' ? 'ಊಟ' : currentLang.code === 'hi' ? 'खाना' : 'Food / Meal', meaning: 'Meal' },
          { word: currentLang.code === 'kn' ? 'ನೀರು' : currentLang.code === 'hi' ? 'पानी' : 'Water', meaning: 'Beverage' },
        ],
      },
      {
        id: 'node-5',
        unit: 3,
        unitTitle: 'Unit 3: Travel & City Navigation',
        title: 'Directions & Commute',
        subtitle: 'Ask for buses, metros, landmarks, and street directions',
        iconName: '🧭',
        status: 'locked',
        stars: 0,
        totalStars: 3,
        xpReward: 45,
        lessonId: 'les-5',
        sampleWords: [
          { word: currentLang.code === 'kn' ? 'ಎಲ್ಲಿ?' : currentLang.code === 'hi' ? 'कहाँ?' : 'Where?', meaning: 'Location query' },
          { word: currentLang.code === 'kn' ? 'ಹತ್ತಿರ' : currentLang.code === 'hi' ? 'पास' : 'Near', meaning: 'Proximity' },
        ],
      },
      {
        id: 'node-6',
        unit: 3,
        unitTitle: 'Unit 3: Travel & City Navigation',
        title: 'Mastery Checkpoint & Final Exam',
        subtitle: 'Comprehensive evaluation covering Units 1 to 3',
        iconName: '🏆',
        status: 'locked',
        stars: 0,
        totalStars: 3,
        xpReward: 100,
        lessonId: 'les-6',
        sampleWords: [
          { word: 'Final Exam', meaning: 'Timed assessment' },
        ],
      },
    ];
  }, [currentLang]);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
  };

  const handleStartLesson = (node: SkillNode) => {
    navigate(`/lessons?course=${currentLang.code}&lesson=${node.lessonId}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Top Banner: Active Language & Quick Stats */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-xl shadow-blue-500/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-white/15 rounded-2xl backdrop-blur-sm">
              {currentLang.flag}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">{currentLang.name} Pathway</h1>
                <Badge variant="blue" className="bg-white/20 text-white border-0 text-[10px]">
                  CEFR A1–A2
                </Badge>
              </div>
              <p className="text-xs text-blue-100">Interactive Curriculum & Skill Roadmap</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/languages')}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition text-white"
          >
            Switch
          </button>
        </div>

        {/* Mini stats bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-blue-200 uppercase font-semibold flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-300" /> Streak
            </span>
            <span className="text-sm font-bold">{user?.streakDays ?? 5} Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-blue-200 uppercase font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-300" /> Total XP
            </span>
            <span className="text-sm font-bold">{user?.xpPoints ?? 340} XP</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-blue-200 uppercase font-semibold flex items-center gap-1">
              <Compass className="w-3 h-3 text-emerald-300" /> Goal
            </span>
            <span className="text-sm font-bold">{dailyGoalMinutes || 15}m / day</span>
          </div>
        </div>
      </div>

      {/* Quick Practice Pill */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 animate-pulse" />
          <div className="text-xs">
            <span className="font-bold">Daily Review Available!</span>
            <p className="text-[11px] opacity-80">Boost memory retention with rapid flashcards</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="primary"
          className="bg-amber-600 hover:bg-amber-700 text-white shadow-none text-xs px-3 py-1.5 h-auto"
          onClick={() => navigate('/practice?mode=flashcards')}
        >
          Review
        </Button>
      </div>

      {/* Sequential Skill Tree Roadmap */}
      <div className="space-y-8 relative">
        {/* Curving path connecting line */}
        <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 -z-0 rounded-full" />

        {skillNodes.map((node, index) => {
          const isCompleted = node.status === 'completed';
          const isCurrent = node.status === 'current';
          const isLocked = node.status === 'locked';

          // Horizontal zig-zag offset for Apple/Duolingo style road
          const offsets = ['translate-x-0', 'translate-x-6', '-translate-x-6', 'translate-x-4', '-translate-x-4', 'translate-x-0'];
          const offsetClass = offsets[index % offsets.length];

          return (
            <div key={node.id} className="relative z-10 flex flex-col items-center space-y-2">
              {/* Unit boundary header if first in unit */}
              {(index === 0 || skillNodes[index - 1].unit !== node.unit) && (
                <div className="w-full my-3 px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {node.unitTitle}
                  </span>
                  <Badge variant={isCompleted ? 'green' : 'blue'}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
              )}

              {/* Node Circle */}
              <button
                onClick={() => handleNodeClick(node)}
                className={`group relative flex items-center justify-center transition-all duration-300 transform active:scale-95 ${offsetClass}`}
              >
                {/* Glowing ring for current node */}
                {isCurrent && (
                  <span className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping opacity-75" />
                )}

                <div
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform group-hover:scale-105 border-4 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-300 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-white dark:border-slate-900 text-white ring-4 ring-blue-500/50 shadow-blue-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-2xl">{node.iconName}</span>
                  {isCompleted && (
                    <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                  {isLocked && (
                    <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-slate-400 dark:bg-slate-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </button>

              {/* Node Title & XP Pill */}
              <div
                onClick={() => handleNodeClick(node)}
                className={`cursor-pointer text-center space-y-0.5 px-3 py-1 rounded-xl transition ${offsetClass}`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1">
                  {node.title}
                </div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                  <span className="text-amber-500 font-semibold">+{node.xpReward} XP</span>
                  <span>•</span>
                  <span>
                    {'★'.repeat(node.stars)}
                    {'☆'.repeat(node.totalStars - node.stars)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Bottom Modal / Drawer */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 animate-fadeIn"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl p-6 space-y-5 border-t border-slate-200 dark:border-slate-800 shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-3xl">
                  {selectedNode.iconName}
                </div>
                <div>
                  <Badge variant={selectedNode.status === 'completed' ? 'green' : 'blue'}>
                    {selectedNode.unitTitle}
                  </Badge>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {selectedNode.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {selectedNode.subtitle}
            </p>

            {/* Key Vocabulary Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Core Vocabulary Taught
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedNode.sampleWords.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">
                      {item.word}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={() => handleStartLesson(selectedNode)}
              >
                {selectedNode.status === 'completed' ? 'Practice Lesson Again' : 'Start Lesson Now'}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/practice?mode=flashcards')}
                >
                  Flashcards
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Award className="w-3.5 h-3.5" />}
                  onClick={() => navigate('/quiz')}
                >
                  Take Unit Quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};