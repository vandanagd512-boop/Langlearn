import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LanguageCatalogItem } from '../types/language-catalog.types';
import { BookOpen, Clock, Users, CheckCircle2, ArrowRight, Heart } from 'lucide-react';

interface LanguageDetailModalProps {
  language: LanguageCatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStartCourse: (lang: LanguageCatalogItem) => void;
  onToggleFavorite: (code: string) => void;
  isFavorite: boolean;
}

export const LanguageDetailModal: React.FC<LanguageDetailModalProps> = ({
  language,
  isOpen,
  onClose,
  onStartCourse,
  onToggleFavorite,
  isFavorite,
}) => {
  if (!language) return null;

  const progressPercent = Math.round(
    (language.completedLessons / (language.totalLessons || 1)) * 100
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="space-y-6 -mt-2">
        {/* Banner with gradient & flag */}
        <div
          className={`w-full h-36 rounded-2xl bg-gradient-to-tr ${language.bannerGradient} p-5 flex items-end justify-between text-white relative overflow-hidden shadow-md`}
        >
          {/* Watermark symbol */}
          <div className="absolute right-3 -bottom-4 text-7xl select-none opacity-20 pointer-events-none">
            {language.flag}
          </div>

          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-sm">
              {language.flag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{language.name}</h2>
                <span className="text-base font-bold text-white/90">({language.nativeName})</span>
              </div>
              <p className="text-xs text-white/80">{language.category} Language • {language.difficulty}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleFavorite(language.code)}
            className="relative z-10 p-2 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition active:scale-95"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Lessons</span>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>{language.totalLessons}</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Duration</span>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>~{language.estimatedHours} hrs</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Learners</span>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{language.learnersCount}</span>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overview</h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {language.fullDescription}
          </p>
        </div>

        {/* Course Progress */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Your Current Progress</span>
            <span className="text-blue-600 dark:text-blue-400">
              {language.completedLessons} / {language.totalLessons} Lessons ({progressPercent}%)
            </span>
          </div>
          <ProgressBar value={progressPercent} color="blue" size="md" />
        </div>

        {/* Skills Covered Pills */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Core Curriculum Competencies
          </h4>
          <div className="flex flex-wrap gap-2">
            {language.skillsCovered.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-900/40"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => onStartCourse(language)}
            className="flex-1 shadow-md"
          >
            {language.isStarted ? 'Continue to Course Structure' : 'Enroll & Start Learning'}
          </Button>
          <Button size="lg" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
