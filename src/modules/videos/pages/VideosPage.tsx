import React, { useState, useEffect, useMemo } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Video,
  Play,
  Pause,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Award,
  Zap,
  Search,
  BookOpen,
  FastForward,
  Rewind,
  RotateCcw,
  SkipBack,
  SkipForward,
  Mic,
} from 'lucide-react';
import { ALL_VIDEO_LESSONS, REAL_LIFE_CATEGORIES } from '../data/videos.data';
import { VideoLesson, VideoDurationCategory, VideoProficiencyLevel } from '../types/video.types';
import { AnimatedCharacterAvatar } from '../components/AnimatedCharacterAvatar';
import { SpeechService } from '@/services/speech/speech.service';
import { PronunciationService, PronunciationScoreResult } from '@/services/speech/pronunciation.service';
import { CertificateModal } from '@/components/certificate/CertificateModal';
import { useNotification } from '@/context/NotificationContext';
import { useAppStore } from '@/state/store';
import { StorageService } from '@/utils/storage';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

export const VideosPage: React.FC = () => {
  const { activeLanguageCode, setActiveLanguageCode, user } = useAppStore();
  const { notify } = useNotification();

  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [completedVideos, setCompletedVideos] = useState<string[]>(() =>
    StorageService.getItem<string[]>('completed_video_lessons', [])
  );
  const [isPracticingTurn, setIsPracticingTurn] = useState<boolean>(false);
  const [turnScoreResult, setTurnScoreResult] = useState<PronunciationScoreResult | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Lessons list filtered by active language
  const languageLessons = useMemo(() => {
    const list = ALL_VIDEO_LESSONS.filter((v) => v.languageCode === activeLanguageCode);
    return list.length > 0 ? list : ALL_VIDEO_LESSONS.filter((v) => v.languageCode === 'kn');
  }, [activeLanguageCode]);

  // Language completion statistics: Certificate unlocked ONLY when ALL videos in this language are completed!
  const completedInLanguageCount = useMemo(() => {
    return languageLessons.filter((vid) => completedVideos.includes(vid.id)).length;
  }, [languageLessons, completedVideos]);

  const isLanguageFullyCompleted =
    languageLessons.length > 0 && completedInLanguageCount >= languageLessons.length;

  const langProgressPercent = languageLessons.length > 0
    ? Math.min(100, Math.round((completedInLanguageCount / languageLessons.length) * 100))
    : 0;

  const fallbackLesson: VideoLesson = languageLessons[0] || ALL_VIDEO_LESSONS[0];
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson>(fallbackLesson);

  // Sync selected lesson when activeLanguageCode changes
  useEffect(() => {
    if (selectedLesson && selectedLesson.languageCode !== activeLanguageCode) {
      const match = ALL_VIDEO_LESSONS.find((v) => v.languageCode === activeLanguageCode);
      if (match) {
        setSelectedLesson(match);
        setActiveSentenceIndex(0);
      }
    }
  }, [activeLanguageCode, selectedLesson]);

  const activeLesson: VideoLesson = selectedLesson || fallbackLesson;

  // Filtered list by category, search, level, duration
  const filteredVideos = useMemo(() => {
    const baseList = languageLessons.length > 0 ? languageLessons : ALL_VIDEO_LESSONS;
    return baseList.filter((vid) => {
      const matchCat = selectedCategory === 'all' || vid.categoryId === selectedCategory;
      const matchDuration = selectedDuration === 'all' || vid.durationCategory === selectedDuration;
      const matchLevel = selectedLevel === 'all' || vid.level === selectedLevel;
      const matchSearch =
        !searchQuery.trim() ||
        vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.topicLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDuration && matchLevel && matchSearch;
    });
  }, [languageLessons, selectedCategory, selectedDuration, selectedLevel, searchQuery]);

  // Sync selected lesson when activeLanguageCode changes
  const handleLanguageChange = (code: string) => {
    setActiveLanguageCode(code);
    const newLangList = ALL_VIDEO_LESSONS.filter((v) => v.languageCode === code);
    if (newLangList.length > 0) {
      setSelectedLesson(newLangList[0]);
    }
    SpeechService.stop();
    setIsPlaying(false);
    setActiveSentenceIndex(0);
  };

  const totalSentences = activeLesson?.transcript?.length || 0;
  const currentSentence =
    activeLesson?.transcript?.[activeSentenceIndex] || activeLesson?.transcript?.[0];

  // Auto-scroll active transcript line into view
  useEffect(() => {
    const lineElem = document.getElementById(`transcript-item-${activeSentenceIndex}`);
    if (lineElem) {
      lineElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSentenceIndex]);

  /**
   * Continuous Flowing Audio Narration Engine:
   * When sentence speech finishes (or times out via watchdog), advances to the next sentence!
   * When all sentences in the video finish, advances automatically to the NEXT video lesson!
   */
  useEffect(() => {
    if (!isPlaying) {
      SpeechService.stop();
      return;
    }

    let isCancelled = false;
    const speechCode = `${activeLesson.languageCode}-IN`;

    // Dynamic display time calculation: ~65ms per character, clamped between 3.5s and 9s
    const textLen = currentSentence?.text?.length || 30;
    const estimatedDurationMs = Math.round(
      Math.max(3200, Math.min(9000, textLen * 65)) / playbackRate
    );

    const playSentenceStep = async () => {
      if (!isMuted && currentSentence) {
        // Speaker alternation: 0 for Speaker A (Vandana - female), 1 for Speaker B (Gowda - male)
        const speakerIndex = currentSentence.speakerIndex ?? (activeSentenceIndex % 2 === 0 ? 0 : 1);
        // Two distinct voice tones: 1.20 (female bright tone) vs 0.85 (male warm, deep tone)
        const pitch = speakerIndex === 0 ? 1.20 : 0.85;

        // Use SpeechSynthesis with safety watchdog timer so mobile browsers NEVER stall
        await new Promise<void>((resolve) => {
          let finished = false;
          const complete = () => {
            if (!finished) {
              finished = true;
              resolve();
            }
          };

          // Watchdog timer: if browser voice hangs or fails, keep video rolling smoothly
          const watchdog = setTimeout(complete, estimatedDurationMs + 1200);

          SpeechService.speak(currentSentence.text, speechCode, playbackRate, pitch, speakerIndex)
            .then(() => {
              clearTimeout(watchdog);
              complete();
            })
            .catch(() => {
              clearTimeout(watchdog);
              complete();
            });
        });
      } else {
        // If muted, show sentence for duration
        await new Promise((resolve) => setTimeout(resolve, estimatedDurationMs));
      }

      if (isCancelled) return;

      // Natural pause between sentences (700ms scaled by rate)
      const interSentencePause = Math.round(700 / playbackRate);
      await new Promise((resolve) => setTimeout(resolve, interSentencePause));

      if (isCancelled) return;

      // Next sentence OR next video
      if (activeSentenceIndex < totalSentences - 1) {
        setActiveSentenceIndex((prev) => prev + 1);
      } else {
        // Video finished: Auto-advance to next video lesson
        handleCompleteLesson();
        handleAutoAdvanceNextVideo();
      }
    };

    playSentenceStep();

    return () => {
      isCancelled = true;
    };
  }, [activeSentenceIndex, isPlaying, activeLesson.id, playbackRate, isMuted]);

  // Auto-advance to next video in curriculum (Certificate unlocked ONLY when ALL videos in language are completed)
  const handleAutoAdvanceNextVideo = () => {
    let updatedCompleted = completedVideos;
    if (!completedVideos.includes(activeLesson.id)) {
      updatedCompleted = [...completedVideos, activeLesson.id];
      setCompletedVideos(updatedCompleted);
      StorageService.setItem('completed_video_lessons', updatedCompleted);
    }

    const newLangCount = languageLessons.filter((v) => updatedCompleted.includes(v.id)).length;
    const isNowAllDone = languageLessons.length > 0 && newLangCount >= languageLessons.length;

    if (isNowAllDone) {
      // Completed ALL videos in this language! Pop up the Certificate of Fluency!
      setShowCertificateModal(true);
      setIsPlaying(false);
      notify({
        type: 'success',
        title: `🏆 All ${activeLesson.languageName} Videos Completed!`,
        message: `Outstanding! You completed all ${languageLessons.length} videos in ${activeLesson.languageName}! Official Certificate of Fluency unlocked!`,
      });
    } else {
      // Advance to next video in curriculum
      const currentIndex = filteredVideos.findIndex((v) => v.id === activeLesson.id);
      const nextIndex = (currentIndex + 1) % filteredVideos.length;
      const nextLesson = filteredVideos[nextIndex];

      setSelectedLesson(nextLesson);
      setActiveSentenceIndex(0);
      setIsPlaying(true);

      notify({
        type: 'success',
        title: 'Video Finished! 🎬 Advancing Next',
        message: `Progress: ${newLangCount}/${languageLessons.length} in ${activeLesson.languageName}. Now playing: "${nextLesson.title}"`,
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextVideo = () => {
    SpeechService.stop();
    handleAutoAdvanceNextVideo();
  };

  const handlePrevVideo = () => {
    SpeechService.stop();
    const currentIndex = filteredVideos.findIndex((v) => v.id === activeLesson.id);
    const prevIndex = (currentIndex - 1 + filteredVideos.length) % filteredVideos.length;
    const prevLesson = filteredVideos[prevIndex];

    setSelectedLesson(prevLesson);
    setActiveSentenceIndex(0);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVideo = (video: VideoLesson) => {
    SpeechService.stop();
    setSelectedLesson(video);
    setIsPlaying(false);
    setActiveSentenceIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      SpeechService.stop();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeekSentence = (idx: number) => {
    SpeechService.stop();
    setActiveSentenceIndex(idx);
    setIsPlaying(true);
    notify({
      type: 'info',
      message: `Jumped to sentence ${idx + 1} of ${totalSentences}`,
    });
  };

  const handleNextSentence = () => {
    SpeechService.stop();
    if (activeSentenceIndex < totalSentences - 1) {
      setActiveSentenceIndex((prev) => prev + 1);
      setIsPlaying(true);
    } else {
      handleAutoAdvanceNextVideo();
    }
  };

  const handlePrevSentence = () => {
    SpeechService.stop();
    if (activeSentenceIndex > 0) {
      setActiveSentenceIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    SpeechService.stop();
    setActiveSentenceIndex(0);
    setIsPlaying(true);
    setTurnScoreResult(null);
  };

  const handlePracticeCurrentSentence = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notify({
        type: 'warning',
        title: 'Microphone Required',
        message: 'Speech recognition is not supported on this browser. Try Google Chrome on Android or Desktop.',
      });
      return;
    }

    SpeechService.stop();
    setIsPlaying(false);

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = `${activeLesson.languageCode}-IN`;

      recognition.onstart = () => {
        setIsPracticingTurn(true);
        setTurnScoreResult(null);
        notify({
          type: 'info',
          title: '🎙️ Listening...',
          message: `Repeat: "${currentSentence?.text}" now!`,
        });
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const spoken = event.results?.[0]?.[0]?.transcript || '';
        setIsPracticingTurn(false);
        if (spoken && currentSentence) {
          const result = PronunciationService.computeAccuracy(spoken, currentSentence.text);
          setTurnScoreResult(result);
          if (result.score >= 80) {
            notify({
              type: 'success',
              title: `Outstanding Accuracy: ${result.score}% 🌟`,
              message: `You said: "${result.heard}" (+15 XP)`,
            });
          } else {
            notify({
              type: 'warning',
              title: `Accuracy: ${result.score}% 👍`,
              message: `We heard: "${result.heard}". Try once more!`,
            });
          }
        }
      };

      recognition.onerror = () => {
        setIsPracticingTurn(false);
      };

      recognition.onend = () => {
        setIsPracticingTurn(false);
      };

      recognition.start();
    } catch {
      setIsPracticingTurn(false);
    }
  };

  const handlePronounceWord = (term: string, langCode: string) => {
    const speechCode = `${langCode}-IN`;
    SpeechService.speak(term, speechCode);
  };

  const handleCompleteLesson = () => {
    let updatedCompleted = completedVideos;
    if (!completedVideos.includes(activeLesson.id)) {
      updatedCompleted = [...completedVideos, activeLesson.id];
      setCompletedVideos(updatedCompleted);
      StorageService.setItem('completed_video_lessons', updatedCompleted);
    }

    const newLangCount = languageLessons.filter((v) => updatedCompleted.includes(v.id)).length;
    const isNowAllDone = languageLessons.length > 0 && newLangCount >= languageLessons.length;

    if (isNowAllDone) {
      // Completed ALL videos in this language! Pop up Certificate
      setShowCertificateModal(true);
      notify({
        type: 'success',
        title: `🏆 ${activeLesson.languageName} Fluency Mastered!`,
        message: `Incredible achievement! You have completed all ${languageLessons.length} videos in ${activeLesson.languageName}! Official Certificate of Fluency unlocked!`,
      });
    } else {
      notify({
        type: 'success',
        title: 'Lesson Mastered! 🏆',
        message: `Earned +${activeLesson.xpReward} XP for "${activeLesson.title}". Language Progress: ${newLangCount}/${languageLessons.length} in ${activeLesson.languageName}. Complete all videos in ${activeLesson.languageName} to unlock your Fluency Certificate!`,
      });
    }
  };

  const isCompleted = completedVideos.includes(activeLesson.id);
  const progressPercent = Math.min(
    100,
    Math.round(((activeSentenceIndex + 1) / totalSentences) * 100)
  );

  const characterPair = activeLesson.characterPair || {
    speakerA: { name: 'Vandana', avatar: '👩', role: 'Inquirer', gender: 'female' },
    speakerB: { name: 'Gowda', avatar: '👨', role: 'Friend', gender: 'male' },
  };

  const activeSpeakerIndex =
    currentSentence?.speakerIndex ?? (activeSentenceIndex % 2 === 0 ? 0 : 1);
  const activeSpeaker =
    activeSpeakerIndex === 0 ? characterPair.speakerA : characterPair.speakerB;

  return (
    <div className="space-y-5 animate-fadeIn pb-14">
      <ModuleHeader
        title="Interactive Video Academy"
        subtitle="Continuous sentence-by-sentence flowing lessons with auto-advance."
        icon={Video}
        badge="Continuous Flow"
      />

      {/* Language Switcher Bar & Fluency Progress */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 pl-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Course Language:</span>
          </span>
          <select
            value={activeLanguageCode}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-white dark:bg-slate-900 text-xs font-bold py-1 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Language Fluency Certificate Progress Tracker */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-blue-200/70 dark:border-blue-900/50 shadow-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isLanguageFullyCompleted
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600'
                    : 'bg-blue-100 dark:bg-blue-900/60 text-blue-600'
                }`}
              >
                <Award className="w-4 h-4 fill-current" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                  {activeLesson.languageName} Fluency Certificate Progress
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {completedInLanguageCount} of {languageLessons.length} videos completed ({langProgressPercent}%)
                </span>
              </div>
            </div>

            {isLanguageFullyCompleted ? (
              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-[11px] shadow-sm hover:scale-105 active:scale-95 transition flex items-center gap-1.5 shrink-0"
              >
                <span>🏆</span>
                <span>View Certificate</span>
              </button>
            ) : (
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 inline-flex items-center gap-1">
                  <span>🔒</span>
                  <span>Certificate at 100%</span>
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isLanguageFullyCompleted
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }`}
              style={{ width: `${langProgressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-medium pt-0.5">
            <span>
              {isLanguageFullyCompleted
                ? `🎉 All ${activeLesson.languageName} videos completed! Official Certificate unlocked.`
                : `Complete all ${languageLessons.length} videos in ${activeLesson.languageName} to unlock your Certificate.`}
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0 ml-2">
              {langProgressPercent}% Done
            </span>
          </div>
        </div>
      </div>

      {/* Native Flowing Video Stage (100% In-App, Zero External Dependencies) */}
      <Card className="overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-slate-950 text-white">
        <div className="relative min-h-[470px] sm:min-h-[480px] w-full flex flex-col justify-between overflow-hidden select-none">
          {!isPlaying ? (
            /* HD Video Cover Poster when Paused */
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${activeLesson.gradient} flex flex-col justify-between p-4 cursor-pointer`}
              onClick={handleTogglePlay}
            >
              <div className="flex items-center justify-between z-10">
                <Badge variant="blue" className="bg-black/60 text-white backdrop-blur-md text-[10px] border-0">
                  {activeLesson.levelLabel}
                </Badge>
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeLesson.durationFormatted}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
                <button
                  type="button"
                  className="w-16 h-16 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition backdrop-blur-sm"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                <span className="text-sm font-bold mt-3 tracking-wide drop-shadow">
                  Tap to Start Flowing Video Lesson
                </span>
                <span className="text-xs text-white/80 mt-1 max-w-xs">
                  Real-life 2-way dialogue with Vandana & Gowda • Spoken native narration
                </span>
              </div>

              <div className="bg-black/70 backdrop-blur-md p-3 rounded-2xl text-xs z-10 flex items-center justify-between border border-white/10">
                <div className="min-w-0 pr-2">
                  <span className="font-bold block truncate text-sm">{activeLesson.title}</span>
                  <span className="text-[11px] text-white/80 block truncate">
                    {activeLesson.topicLabel} • 2-Character Interactive Dialogue
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15">
                  <span className="text-xs font-bold flex items-center gap-1">
                    <span>{characterPair.speakerA.avatar}</span>
                    <span>{characterPair.speakerA.name}</span>
                  </span>
                  <span className="text-xs text-amber-300 font-extrabold">&</span>
                  <span className="text-xs font-bold flex items-center gap-1">
                    <span>{characterPair.speakerB.avatar}</span>
                    <span>{characterPair.speakerB.name}</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Active Live Presentation with In-Video Dual Dialogue Stage */
            <div className={`relative inset-0 w-full h-full min-h-[470px] sm:min-h-[480px] bg-gradient-to-tr ${activeLesson.gradient} flex flex-col justify-between p-3.5`}>
              {/* Top Status Bar */}
              <div className="flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white font-black text-[10px] tracking-wider uppercase">
                    Live Masterclass
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-white/90">
                    Sentence {activeSentenceIndex + 1}/{totalSentences}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 transition text-white"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleTogglePlay}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 transition text-white"
                    title="Pause"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Center Flowing Presentation Stage - Characters & In-Video Dialogue */}
              <div className="my-auto space-y-2 z-10 w-full max-w-md mx-auto">
                {/* Dual Characters Duo: Vandana (left) & Gowda (right) */}
                <div className="flex items-center justify-between gap-2 px-1">
                  {/* Speaker A: Vandana */}
                  <div
                    className={`flex-1 p-2 rounded-2xl transition-all duration-300 ${
                      activeSpeakerIndex === 0
                        ? 'bg-blue-600/40 border-2 border-blue-400 ring-2 ring-blue-400/40 shadow-xl scale-102'
                        : 'opacity-55 bg-black/40 border border-white/10 scale-95'
                    }`}
                  >
                    <AnimatedCharacterAvatar
                      character={characterPair.speakerA}
                      isSpeaking={activeSpeakerIndex === 0}
                      isListening={activeSpeakerIndex === 1}
                      voiceToneLabel="Female Tone"
                      size="md"
                    />
                  </div>

                  {/* Center Voice Wave & Turn Indicator */}
                  <div className="flex flex-col items-center justify-center px-1 shrink-0">
                    <div className="flex items-center gap-0.5 h-4">
                      {[40, 80, 50, 95, 60].map((h, i) => (
                        <span
                          key={i}
                          className={`w-0.5 rounded-full ${
                            activeSpeakerIndex === 0 ? 'bg-blue-400' : 'bg-emerald-400'
                          } animate-bounce`}
                          style={{
                            height: `${h}%`,
                            animationDelay: `${i * 90}ms`,
                            animationDuration: '600ms',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-amber-300 uppercase tracking-wider mt-1">
                      Turn {activeSentenceIndex + 1}/{totalSentences}
                    </span>
                    <span className="text-[8px] text-white/70 font-mono">
                      {activeSpeakerIndex === 0 ? 'Vandana speaks' : 'Gowda replies'}
                    </span>
                  </div>

                  {/* Speaker B: Gowda */}
                  <div
                    className={`flex-1 p-2 rounded-2xl transition-all duration-300 ${
                      activeSpeakerIndex === 1
                        ? 'bg-emerald-600/40 border-2 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl scale-102'
                        : 'opacity-55 bg-black/40 border border-white/10 scale-95'
                    }`}
                  >
                    <AnimatedCharacterAvatar
                      character={characterPair.speakerB}
                      isSpeaking={activeSpeakerIndex === 1}
                      isListening={activeSpeakerIndex === 0}
                      voiceToneLabel="Male Tone"
                      size="md"
                    />
                  </div>
                </div>

                {/* IN-VIDEO SPEECH BUBBLE: Pointing directly to active speaker */}
                <div className="relative pt-1">
                  {/* Directional speech pointer arrow pointing UP to Vandana or Gowda */}
                  <div
                    className={`absolute -top-1 w-3.5 h-3.5 rotate-45 transition-all duration-300 ${
                      activeSpeakerIndex === 0
                        ? 'left-10 bg-slate-950 border-t-2 border-l-2 border-blue-400'
                        : 'right-10 bg-slate-950 border-t-2 border-l-2 border-emerald-400'
                    }`}
                  />

                  {/* Main Speech Balloon Card */}
                  <div
                    className={`p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-xl border-2 transition-all duration-300 shadow-2xl space-y-2.5 ${
                      activeSpeakerIndex === 0
                        ? 'border-blue-400/80 shadow-blue-500/20'
                        : 'border-emerald-400/80 shadow-emerald-500/20'
                    }`}
                  >
                    {/* Active Speaker Banner inside Video */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/15">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{activeSpeaker.avatar}</span>
                        <span className="text-xs font-black tracking-wide text-white">
                          {activeSpeaker.name}
                        </span>
                        <span
                          className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full ${
                            activeSpeakerIndex === 0
                              ? 'bg-blue-500 text-white shadow-xs'
                              : 'bg-emerald-500 text-white shadow-xs'
                          }`}
                        >
                          {activeSpeakerIndex === 0 ? 'Asking / Voice 1' : 'Replying / Voice 2'}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-amber-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1">
                        <Volume2 className="w-2.5 h-2.5" />
                        Speaking Now
                      </span>
                    </div>

                    {/* Dialogue Line Spoken inside Video */}
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-bold text-white drop-shadow-md leading-snug">
                        {currentSentence?.text}
                      </p>
                      <p className="text-xs sm:text-sm text-cyan-200 font-medium italic drop-shadow-xs">
                        "{currentSentence?.translation}"
                      </p>
                    </div>

                    {/* Previous Context Ribbon inside Video */}
                    {activeSentenceIndex > 0 && activeLesson.transcript[activeSentenceIndex - 1] && (
                      <div className="pt-1.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-white/60">
                        <span className="font-bold text-amber-300 shrink-0">
                          {activeSpeakerIndex === 0 ? characterPair.speakerB.name : characterPair.speakerA.name}:
                        </span>
                        <span className="italic truncate">
                          "{activeLesson.transcript[activeSentenceIndex - 1]?.text}"
                        </span>
                      </div>
                    )}

                    {/* Real Pronunciation Practice inside Video */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={handlePracticeCurrentSentence}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 shadow-sm ${
                          isPracticingTurn
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-white/15 hover:bg-white/25 text-white active:scale-95'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isPracticingTurn ? 'Listening to you...' : 'Practice Speaking Line'}</span>
                      </button>

                      {turnScoreResult ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                          Accuracy: {turnScoreResult.score}% ⭐
                        </span>
                      ) : (
                        <span className="text-[9px] text-white/60 font-mono">
                          Tap mic to test voice
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Scrubber & Time Bar */}
              <div className="space-y-1 z-10 pt-2">
                <div className="w-full bg-white/25 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="bg-blue-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/90 font-mono px-0.5">
                  <span>Part {activeSentenceIndex + 1}/{totalSentences}</span>
                  <span>{activeLesson.durationFormatted}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={handlePrevSentence}
                disabled={activeSentenceIndex === 0}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 disabled:opacity-40"
                title="Previous Sentence"
              >
                <Rewind className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextSentence}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                title="Next Sentence"
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                title="Restart Video"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handlePrevVideo}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition text-xs font-bold flex items-center gap-1"
                title="Previous Video Lesson"
              >
                <SkipBack className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev Video</span>
              </button>
              <button
                onClick={handleNextVideo}
                className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition text-xs font-bold flex items-center gap-1"
                title="Next Video Lesson"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Next Video</span>
              </button>
            </div>

            {/* Playback speed buttons */}
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
              {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackRate(speed)}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    playbackRate === speed
                      ? 'bg-blue-600 text-white font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {activeLesson.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {activeLesson.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-xs">
            <span className="font-bold text-amber-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              +{activeLesson.xpReward} XP Reward
            </span>

            <Button
              size="sm"
              variant={isCompleted ? 'secondary' : 'primary'}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={handleCompleteLesson}
              className="text-xs py-1 h-auto"
            >
              {isCompleted ? 'Completed ✓' : 'Mark as Watched'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Interactive Flowing 2-Way Dialogue Transcript */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Interactive Dialogue Timeline ({characterPair.speakerA.name} & {characterPair.speakerB.name} • {totalSentences} Turns)</span>
          </h3>
          <span className="text-[10px] text-slate-400">Tap line to seek & listen</span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {activeLesson.transcript.map((line, idx) => {
            const isLineActive = activeSentenceIndex === idx;
            const lineSpeakerIndex = line.speakerIndex ?? (idx % 2 === 0 ? 0 : 1);
            const isSpeakerA = lineSpeakerIndex === 0;
            const speakerChar = isSpeakerA ? characterPair.speakerA : characterPair.speakerB;
            const displayName = line.speaker === 'Ravi'
              ? characterPair.speakerA.name
              : line.speaker === 'Arun'
              ? characterPair.speakerB.name
              : (line.speaker || speakerChar.name);

            return (
              <button
                key={idx}
                id={`transcript-item-${idx}`}
                onClick={() => handleSeekSentence(idx)}
                className={`w-full text-left p-3 rounded-2xl border transition group flex items-start gap-2.5 ${
                  isLineActive
                    ? isSpeakerA
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/70 shadow-md ring-2 ring-blue-500/40'
                      : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 shadow-md ring-2 ring-emerald-500/40'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                {/* Avatar and Timestamp */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shadow-xs ${
                      isSpeakerA
                        ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700'
                        : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700'
                    }`}
                  >
                    {isSpeakerA ? characterPair.speakerA.avatar : characterPair.speakerB.avatar}
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                      isLineActive
                        ? isSpeakerA ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {line.time || `0:${idx * 15 < 10 ? '0' : ''}${idx * 15}`}
                  </span>
                </div>

                {/* Dialogue Text & Speaker Tag */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isSpeakerA
                          ? 'bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {displayName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isSpeakerA ? 'Asking / Initiating' : 'Replying'}
                    </span>
                    {isLineActive && (
                      <span className="ml-auto text-[9px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 animate-pulse">
                        <Volume2 className="w-3 h-3" />
                        Speaking Now
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-xs block ${
                      isLineActive
                        ? 'font-bold text-slate-900 dark:text-slate-100'
                        : 'font-medium text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {line.text}
                  </span>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block italic">
                    "{line.translation}"
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Key Vocabulary Taught */}
      <Card className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Key Vocabulary Taught</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {activeLesson.keyVocabulary.map((vocab, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {vocab.term}
                </span>
                <button
                  onClick={() => handlePronounceWord(vocab.term, activeLesson.languageCode)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition"
                  title="Pronounce"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{vocab.phonetic}</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                {vocab.meaning}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 100+ Video Lessons Directory */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {activeLesson.languageName} Video Curriculum ({filteredVideos.length} Lessons)
          </h3>
          <span className="text-[11px] text-blue-600 font-bold">A1 to C1</span>
        </div>

        {/* 20 Real-Life Conversation Categories Carousel */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            🌟 All Categories ({languageLessons.length})
          </button>
          {REAL_LIFE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.id}. {cat.title}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 130 topics (e.g. Doctor, Restaurant, UPI, Job Interview, Airport)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Level Filters: Beginner to Fluent */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Levels' },
            { id: 'beginner', label: '🟢 A1 Beginner' },
            { id: 'elementary', label: '🔵 A2 Elementary' },
            { id: 'intermediate', label: '🟡 B1 Intermediate' },
            { id: 'fluent', label: '🟣 C1 Fluent' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id as VideoProficiencyLevel | 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedLevel === lvl.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Duration Filters: 2min, 5min, 10min, 15min */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Durations' },
            { id: '2min', label: '⚡ 2 Min Quick' },
            { id: '5min', label: '🎯 5 Min Core' },
            { id: '10min', label: '📚 10 Min Deep' },
            { id: '15min', label: '🎓 15 Min Master' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDuration(tab.id as VideoDurationCategory | 'all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition ${
                selectedDuration === tab.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filtered Video Lessons List */}
        <div className="space-y-2">
          {filteredVideos.map((video) => {
            const isCurrent = video.id === activeLesson.id;
            const hasCompleted = completedVideos.includes(video.id);

            return (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/50 shadow-sm ring-1 ring-blue-500/20'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${video.gradient} text-white flex items-center justify-center shrink-0 shadow-sm text-base`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        {video.levelLabel}
                      </span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-500 truncate">
                        {video.topicLabel}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {video.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {video.subtitle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 block">
                    {video.durationFormatted}
                  </span>
                  {hasCompleted ? (
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Done ✓
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-500 font-bold">
                      +{video.xpReward} XP
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certificate of Fluency Modal issued to user's name upon completing all videos in language */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        userName={user?.name || (user?.email ? user.email.split('@')[0] : 'Active Learner')}
        languageName={activeLesson.languageName}
        courseTitle={`${activeLesson.languageName} Complete Fluency Curriculum (${languageLessons.length} Real-Life Masterclasses)`}
      />
    </div>
  );
};
