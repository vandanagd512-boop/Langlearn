import React, { useState, useMemo } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Video,
  Play,
  Clock,
  Sparkles,
  Volume2,
  CheckCircle2,
  Award,
  Zap,
  Search,
  BookOpen,
  Link2,
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
  const [completedVideos, setCompletedVideos] = useState<string[]>(['vid-kn-beginner-1']);
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState<string>('');
  const [activeCustomId, setActiveCustomId] = useState<string | null>(null);

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
    setActiveCustomId(null);
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

  const handleSelectVideo = (video: VideoLesson) => {
    setSelectedLesson(video);
    setActiveCustomId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePronounceWord = (term: string, langCode: string) => {
    const speechCode = `${langCode}-IN`;
    SpeechService.speak(term, speechCode);
  };

  const handlePronounceTranscript = (text: string) => {
    const speechCode = `${selectedLesson.languageCode}-IN`;
    SpeechService.speak(text, speechCode);
    notify({
      type: 'info',
      message: `Pronouncing: "${text}"`,
    });
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

  // Extract YouTube ID from standard URL formats
  const handleLoadCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = customYoutubeUrl.trim();
    if (!raw) return;

    let extractedId = '';
    // YouTube formats: youtu.be/ID or youtube.com/watch?v=ID or embed/ID
    const matchShort = raw.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const matchWatch = raw.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    const matchEmbed = raw.match(/embed\/([a-zA-Z0-9_-]+)/);

    if (matchShort && matchShort[1]) extractedId = matchShort[1];
    else if (matchWatch && matchWatch[1]) extractedId = matchWatch[1];
    else if (matchEmbed && matchEmbed[1]) extractedId = matchEmbed[1];
    else if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) extractedId = raw;

    if (extractedId) {
      setActiveCustomId(extractedId);
      notify({
        type: 'success',
        title: 'Custom Video Loaded',
        message: 'Playing custom YouTube video lesson.',
      });
    } else {
      notify({
        type: 'error',
        message: 'Invalid YouTube link. Please paste a valid YouTube video URL.',
      });
    }
  };

  const activeYoutubeId = activeCustomId || selectedLesson.youtubeId || 'w2Uf2w8Y0tM';
  const isCompleted = completedVideos.includes(selectedLesson.id);

  return (
    <div className="space-y-5 animate-fadeIn pb-14">
      <ModuleHeader
        title="Real Video Masterclass Academy"
        subtitle="100% authentic video masterclasses from Beginner (A1) to Fluent (C1)."
        icon={Video}
        badge="Real Video Lessons"
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

      {/* Real YouTube Video Player Box - Guaranteed Never Blank */}
      <Card className="overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800 shadow-xl bg-slate-950 text-white">
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
          <iframe
            key={activeYoutubeId}
            src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
            title={selectedLesson.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Information & Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {selectedLesson.instructorAvatar}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                  {selectedLesson.instructor}
                </span>
                <span className="text-[10px] text-slate-400">Certified Language Instructor</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge variant="blue" size="sm" className="text-[10px]">
                {selectedLesson.levelLabel}
              </Badge>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedLesson.durationFormatted}
              </span>
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

      {/* Custom Video URL Input Option */}
      <Card className="p-3.5 space-y-2 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40">
        <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-300">
          <span className="flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Watch Custom YouTube Lesson</span>
          </span>
          {activeCustomId && (
            <button
              onClick={() => setActiveCustomId(null)}
              className="text-[10px] text-blue-600 hover:underline"
            >
              Reset to Course Video
            </button>
          )}
        </div>
        <form onSubmit={handleLoadCustomVideo} className="flex gap-2">
          <input
            type="text"
            value={customYoutubeUrl}
            onChange={(e) => setCustomYoutubeUrl(e.target.value)}
            placeholder="Paste any YouTube video link (e.g. https://youtu.be/...)"
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Button type="submit" size="sm" variant="primary" className="text-xs py-1 h-auto px-3">
            Play Video
          </Button>
        </form>
      </Card>

      {/* Interactive Transcript & Study Notes */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Interactive Lesson Notes & Sentences</span>
          </h3>
          <span className="text-[10px] text-slate-400">Tap to hear audio</span>
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {selectedLesson.transcript.map((line, idx) => (
            <button
              key={idx}
              onClick={() => handlePronounceTranscript(line.text)}
              className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-800 transition group flex items-start gap-2.5"
            >
              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold group-hover:bg-blue-600 group-hover:text-white transition shrink-0 mt-0.5">
                {line.time}
              </span>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  {line.text}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {line.translation}
                </span>
              </div>
            </button>
          ))}
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
            const isCurrent = video.id === selectedLesson.id && !activeCustomId;
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
                    <Play className="w-4 h-4 fill-current ml-0.5" />
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
