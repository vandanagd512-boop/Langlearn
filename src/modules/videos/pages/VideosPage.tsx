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
  RotateCcw,
  BookOpen,
  FastForward,
  Rewind,
} from 'lucide-react';
import { ALL_VIDEO_LESSONS } from '../data/videos.data';
import { VideoLesson, VideoDurationCategory, VideoProficiencyLevel } from '../types/video.types';
import { SpeechService } from '@/services/speech/speech.service';
import { useNotification } from '@/context/NotificationContext';
import { useAppStore } from '@/state/store';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

export const VideosPage: React.FC = () => {
  const { activeLanguageCode, setActiveLanguageCode } = useAppStore();
  const { notify } = useNotification();

  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [completedVideos, setCompletedVideos] = useState<string[]>(['vid-kn-beginner-1']);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);

  // Filter lessons by active language
  const languageLessons = useMemo(() => {
    const list = ALL_VIDEO_LESSONS.filter((v) => v.languageCode === activeLanguageCode);
    return list.length > 0 ? list : ALL_VIDEO_LESSONS.filter((v) => v.languageCode === 'kn');
  }, [activeLanguageCode]);

  const [selectedLesson, setSelectedLesson] = useState<VideoLesson>(languageLessons[0]);

  // Update selected lesson if language changes
  const handleLanguageChange = (code: string) => {
    setActiveLanguageCode(code);
    const newLangList = ALL_VIDEO_LESSONS.filter((v) => v.languageCode === code);
    if (newLangList.length > 0) {
      setSelectedLesson(newLangList[0]);
    }
    setIsPlaying(false);
    setCurrentTimeSec(0);
  };

  // Filtered list
  const filteredVideos = useMemo(() => {
    return languageLessons.filter((vid) => {
      const matchDuration = selectedDuration === 'all' || vid.durationCategory === selectedDuration;
      const matchLevel = selectedLevel === 'all' || vid.level === selectedLevel;
      const matchSearch =
        !searchQuery.trim() ||
        vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.topicLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDuration && matchLevel && matchSearch;
    });
  }, [languageLessons, selectedDuration, selectedLevel, searchQuery]);

  // Compute active transcript line based on currentTimeSec
  const activeTranscriptIndex = useMemo(() => {
    const transcript = selectedLesson.transcript;
    let idx = 0;
    for (let i = 0; i < transcript.length; i++) {
      if (currentTimeSec >= transcript[i].seconds) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [currentTimeSec, selectedLesson.transcript]);

  const activeLine = selectedLesson.transcript[activeTranscriptIndex] || selectedLesson.transcript[0];

  // Playback timer ticker
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.round(1000 / playbackRate);
    const timer = setInterval(() => {
      setCurrentTimeSec((prev) => {
        if (prev >= selectedLesson.durationSeconds) {
          setIsPlaying(false);
          handleCompleteLesson();
          return selectedLesson.durationSeconds;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackRate, selectedLesson.durationSeconds]);

  // Pronounce active line when it changes during playback
  useEffect(() => {
    if (isPlaying && !isAudioMuted && activeLine) {
      const speechCode = `${selectedLesson.languageCode}-IN`;
      SpeechService.speak(activeLine.text, speechCode).catch(() => {});
    }
  }, [activeTranscriptIndex, isPlaying, isAudioMuted]);

  const handleSelectVideo = (video: VideoLesson) => {
    setSelectedLesson(video);
    setIsPlaying(false);
    setCurrentTimeSec(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (!isAudioMuted && activeLine) {
        SpeechService.speak(activeLine.text, `${selectedLesson.languageCode}-IN`).catch(() => {});
      }
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTimeSec(seconds);
    setIsPlaying(true);
    notify({
      type: 'info',
      message: `Seeked to ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
    });
  };

  const handleRewind10 = () => {
    setCurrentTimeSec((prev) => Math.max(0, prev - 10));
  };

  const handleForward10 = () => {
    setCurrentTimeSec((prev) => Math.min(selectedLesson.durationSeconds, prev + 10));
  };

  const handleRestart = () => {
    setCurrentTimeSec(0);
    setIsPlaying(true);
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const handlePronounceWord = (term: string, langCode: string) => {
    const speechCode = `${langCode}-IN`;
    SpeechService.speak(term, speechCode);
  };

  const handleCompleteLesson = () => {
    if (completedVideos.includes(selectedLesson.id)) {
      notify({
        type: 'info',
        message: 'You have already completed this video lesson.',
      });
      return;
    }

    setCompletedVideos((prev) => [...prev, selectedLesson.id]);
    notify({
      type: 'success',
      title: 'Lesson Completed! 🏆',
      message: `Earned +${selectedLesson.xpReward} XP for completing "${selectedLesson.title}".`,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isCompleted = completedVideos.includes(selectedLesson.id);
  const progressPercent = Math.min(100, Math.round((currentTimeSec / selectedLesson.durationSeconds) * 100));

  return (
    <div className="space-y-5 animate-fadeIn pb-14">
      <ModuleHeader
        title="100+ Video Masterclass Academy"
        subtitle="Complete video curriculum from Beginner (A1) to Fluent (C1) with transcripts."
        icon={Video}
        badge="100+ Masterclasses"
      />

      {/* Language Switcher Bar */}
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

      {/* Interactive Video Masterclass Box - Guaranteed Never Blank */}
      <Card className="overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800 shadow-xl bg-slate-950 text-white">
        <div className="relative aspect-video w-full flex flex-col justify-between overflow-hidden">
          {!isPlaying ? (
            /* HD Video Poster View when Paused / Stopped */
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${selectedLesson.gradient} flex flex-col justify-between p-4 cursor-pointer select-none`}
              onClick={handleTogglePlay}
            >
              <div className="flex items-center justify-between z-10">
                <Badge variant="blue" className="bg-black/60 text-white backdrop-blur-md text-[10px] border-0">
                  {selectedLesson.levelLabel}
                </Badge>
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedLesson.durationFormatted}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
                <button
                  type="button"
                  className="w-16 h-16 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition backdrop-blur-sm"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                <span className="text-xs font-bold mt-2.5 tracking-wide drop-shadow">
                  Tap to Start Video Masterclass
                </span>
                <span className="text-[10px] text-white/80 mt-0.5">
                  Native Audio • Interactive Subtitles • HD
                </span>
              </div>

              <div className="bg-black/50 backdrop-blur-md p-2.5 rounded-xl text-xs z-10">
                <span className="font-bold block truncate">{selectedLesson.title}</span>
                <span className="text-[10px] text-white/80 block truncate">
                  {selectedLesson.instructorAvatar} {selectedLesson.instructor} • {selectedLesson.topicLabel}
                </span>
              </div>
            </div>
          ) : (
            /* Active Live Classroom Video Presentation */
            <div className={`relative inset-0 w-full h-full bg-gradient-to-tr ${selectedLesson.gradient} flex flex-col justify-between p-3.5 select-none`}>
              {/* Top status bar */}
              <div className="flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white font-black text-[10px] tracking-wider uppercase">
                    Live Lesson
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-white/90">
                    1080p HD
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 transition text-white"
                    title={isAudioMuted ? 'Unmute' : 'Mute'}
                  >
                    {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
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

              {/* Center Stage: Animated Instructor & Current Sentence */}
              <div className="my-auto text-center space-y-2 z-10 px-2">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-lg animate-pulse">
                    {selectedLesson.instructorAvatar}
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-white block">
                      {selectedLesson.instructor}
                    </span>
                    <span className="text-[9px] text-white/70 block">
                      {selectedLesson.topicLabel} Masterclass
                    </span>
                  </div>
                </div>

                {/* Main active phrase card */}
                <div className="p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 max-w-sm mx-auto shadow-2xl space-y-1">
                  <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Current Focus Phrase</span>
                  </div>
                  <p className="text-base font-bold text-white drop-shadow leading-snug">
                    {activeLine.text}
                  </p>
                  <p className="text-xs text-white/80 italic">
                    "{activeLine.translation}"
                  </p>
                </div>

                {/* Animated Audio Visualizer Bars */}
                <div className="flex items-center justify-center gap-1 h-3.5 pt-1">
                  {[40, 75, 100, 60, 90, 45, 80, 65, 95, 50, 70].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-white/70 rounded-full animate-bounce"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 90}ms`,
                        animationDuration: '700ms',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Scrubber & Time */}
              <div className="space-y-1 z-10">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/80 font-mono px-0.5">
                  <span>{formatTime(currentTimeSec)}</span>
                  <span>{selectedLesson.durationFormatted}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Controls & Information */}
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
                onClick={handleRewind10}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                title="Rewind 10s"
              >
                <Rewind className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleForward10}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                title="Forward 10s"
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Playback speed buttons */}
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
              {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
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
              {selectedLesson.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {selectedLesson.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-xs">
            <span className="font-bold text-amber-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              +{selectedLesson.xpReward} XP Reward
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

      {/* Interactive Transcript */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Interactive Lesson Transcript</span>
          </h3>
          <span className="text-[10px] text-slate-400">Tap line to seek</span>
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {selectedLesson.transcript.map((line, idx) => {
            const isLineActive = activeTranscriptIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => handleSeek(line.seconds)}
                className={`w-full text-left p-2.5 rounded-xl border transition group flex items-start gap-2.5 ${
                  isLineActive
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <span
                  className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 mt-0.5 transition ${
                    isLineActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                  }`}
                >
                  {line.time}
                </span>
                <div className="space-y-0.5 min-w-0">
                  <span
                    className={`text-xs block ${
                      isLineActive
                        ? 'font-bold text-blue-700 dark:text-blue-300'
                        : 'font-semibold text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {line.text}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {line.translation}
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
          {selectedLesson.keyVocabulary.map((vocab, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {vocab.term}
                </span>
                <button
                  onClick={() => handlePronounceWord(vocab.term, selectedLesson.languageCode)}
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
            {selectedLesson.languageName} Video Curriculum ({filteredVideos.length} Lessons)
          </h3>
          <span className="text-[11px] text-blue-600 font-bold">A1 to C1</span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons (e.g. Coffee, Auto, Grammar, Alphabet)..."
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
            const isCurrent = video.id === selectedLesson.id;
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
    </div>
  );
};
