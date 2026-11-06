import React, { useState, useRef } from 'react';
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
  CheckCircle2,
  Award,
  Zap,
} from 'lucide-react';
import { VIDEO_LESSONS_DATA } from '../data/videos.data';
import { VideoLesson, VideoDurationCategory } from '../types/video.types';
import { SpeechService } from '@/services/speech/speech.service';
import { useNotification } from '@/context/NotificationContext';

export const VideosPage: React.FC = () => {
  const { notify } = useNotification();

  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson>(VIDEO_LESSONS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [completedVideos, setCompletedVideos] = useState<string[]>(['vid-2m-kn-1']);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const filteredVideos = VIDEO_LESSONS_DATA.filter((vid) => {
    if (selectedDuration === 'all') return true;
    return vid.durationCategory === selectedDuration;
  });

  const handleSelectVideo = (video: VideoLesson) => {
    setSelectedLesson(video);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackRate;
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    videoRef.current.play();
    setIsPlaying(true);
    notify({
      type: 'info',
      message: `Jumped to timestamp ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
    });
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
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
      title: 'Lesson Completed! 🎉',
      message: `Earned +${selectedLesson.xpReward} XP for watching "${selectedLesson.title}".`,
    });
  };

  const isCompleted = completedVideos.includes(selectedLesson.id);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ModuleHeader
        title="Interactive Video Academy"
        subtitle="Curated 2-min, 5-min, 10-min, and 15-min immersive lesson video masterclasses."
        icon={Video}
        badge="High Definition"
      />

      {/* Main Video Player Screen */}
      <Card className="overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800 shadow-xl">
        <div className="relative aspect-video bg-black w-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={selectedLesson.videoUrl}
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              handleCompleteLesson();
            }}
            playsInline
          />

          {/* Big Center Play Overlay Button */}
          {!isPlaying && (
            <button
              onClick={handleTogglePlay}
              className="absolute w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition backdrop-blur-sm"
              title="Play Video"
            >
              <Play className="w-7 h-7 fill-current ml-1" />
            </button>
          )}

          {/* Top Pill: Category & Duration */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <Badge variant="blue" className="bg-black/60 text-white backdrop-blur-md text-[10px] border-0">
              {selectedLesson.topicLabel}
            </Badge>
            <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {selectedLesson.durationFormatted}
            </span>
          </div>
        </div>

        {/* Video Controls Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {selectedLesson.instructorAvatar} {selectedLesson.instructor}
              </span>
            </div>

            {/* Playback speed switcher */}
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
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {selectedLesson.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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

      {/* Interactive Transcript with Clickable Timestamps */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Interactive Lesson Transcript</span>
          </h3>
          <span className="text-[10px] text-slate-400">Tap timestamp to seek</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {selectedLesson.transcript.map((line, idx) => (
            <button
              key={idx}
              onClick={() => handleSeek(line.seconds)}
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

      {/* Key Vocabulary Taught in Video */}
      <Card className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Core Vocabulary Introduced</span>
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

      {/* Filter by Duration (2min, 5min, 10min, 15min) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Browse All Video Masterclasses
          </h3>
          <span className="text-[11px] text-slate-400">Filtered by time</span>
        </div>

        {/* Duration Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Lessons' },
            { id: '2min', label: '⚡ 2 Min Quick' },
            { id: '5min', label: '🎯 5 Min Core' },
            { id: '10min', label: '📚 10 Min Deep' },
            { id: '15min', label: '🎓 15 Min Master' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDuration(tab.id as VideoDurationCategory | 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedDuration === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        <div className="space-y-2.5">
          {filteredVideos.map((video) => {
            const isCurrent = video.id === selectedLesson.id;
            const hasCompleted = completedVideos.includes(video.id);

            return (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${video.gradient} text-white flex items-center justify-center shrink-0 shadow-sm text-xl`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="blue" size="sm" className="text-[9px] px-1 py-0">
                        {video.durationCategory.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-semibold truncate">
                        {video.languageName} • {video.topicLabel}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {video.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">
                      {video.subtitle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-mono font-bold text-slate-500 block">
                    {video.durationFormatted}
                  </span>
                  {hasCompleted && (
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Done ✓
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