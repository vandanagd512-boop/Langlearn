import React, { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Award, Printer, Share2, X, CheckCircle, Sparkles } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  languageName: string;
  courseTitle?: string;
  issueDate?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  userName,
  languageName,
  courseTitle = 'Complete Real-Life Conversational Curriculum',
  issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { notify } = useNotification();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `🏆 I just earned my official Certificate of Fluency in ${languageName} on LangLearn! Mastered real-life speaking and pronunciation!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `LangLearn Fluency Certificate — ${languageName}`,
          text,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      notify({
        type: 'success',
        title: 'Certificate Link Copied! 📋',
        message: 'Share your achievement with friends on social media!',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Verified Certificate of Fluency
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <div
            ref={certificateRef}
            className="relative bg-gradient-to-br from-amber-50/40 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-8 border-double border-amber-500/40 p-6 sm:p-8 rounded-2xl text-center space-y-4 shadow-inner"
          >
            {/* Top Emblem */}
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow">
                L
              </span>
              <span className="font-extrabold tracking-widest text-xs uppercase text-slate-700 dark:text-slate-300">
                LangLearn AI Academy
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <h1 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-slate-900 dark:text-slate-100 uppercase">
                Certificate of Fluency & Mastery
              </h1>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold tracking-wider uppercase">
                Official Credential of Conversational Competence
              </p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              This officially certifies that
            </p>

            {/* Learner Name */}
            <div className="py-2 border-b-2 border-slate-300 dark:border-slate-700 max-w-sm mx-auto">
              <span className="text-lg sm:text-2xl font-bold font-serif text-blue-700 dark:text-blue-400">
                {userName || 'Dedicated Language Scholar'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              has successfully mastered the comprehensive <strong>{languageName}</strong> language curriculum, completing dialogues across 20 real-life speaking situations with verified pronunciation accuracy.
            </p>

            <div className="text-[11px] font-mono text-slate-500">
              Curriculum: {courseTitle}
            </div>

            {/* Footer with Seal & Signatures */}
            <div className="flex items-end justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                  Issue Date
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {issueDate}
                </span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Credential ID: LL-{Math.abs(languageName.split('').reduce((a, b) => a + b.charCodeAt(0), 1000))}
                </span>
              </div>

              {/* Gold Seal Emblem */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 p-0.5 shadow-lg flex items-center justify-center text-center">
                <div className="w-full h-full rounded-full border-2 border-dashed border-white/60 flex flex-col items-center justify-center p-1 bg-amber-500 text-white leading-none">
                  <Sparkles className="w-4 h-4 fill-current mb-0.5" />
                  <span className="text-[8px] font-black uppercase">Verified</span>
                  <span className="text-[7px]">Academy</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-sm font-serif italic font-bold text-slate-700 dark:text-slate-300 block">
                  Academic Director
                </span>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                  LangLearn Global
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={handleShare}
          >
            Share
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Print / Save PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
