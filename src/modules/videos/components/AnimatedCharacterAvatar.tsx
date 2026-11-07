import React from 'react';
import { VideoCharacter } from '../types/video.types';

interface AnimatedCharacterAvatarProps {
  character: VideoCharacter;
  isSpeaking: boolean;
  isListening: boolean;
  voiceToneLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedCharacterAvatar: React.FC<AnimatedCharacterAvatarProps> = ({
  character,
  isSpeaking,
  isListening: _isListening,
  voiceToneLabel,
  size = 'md',
}) => {
  const isMale = character.gender === 'male';

  const sizeClasses =
    size === 'sm'
      ? 'w-10 h-10 text-xl'
      : size === 'lg'
      ? 'w-16 h-16 text-3xl'
      : 'w-12 h-12 text-2xl';

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative">
        {/* Animated Soundwave Ripple when actively speaking */}
        {isSpeaking && (
          <span className="absolute -inset-1.5 rounded-2xl bg-blue-500/30 dark:bg-blue-400/25 animate-ping opacity-75" />
        )}

        {/* Outer Avatar Frame */}
        <div
          className={`relative ${sizeClasses} rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
            isSpeaking
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-blue-300 dark:ring-blue-400 scale-105'
              : 'bg-slate-800/80 dark:bg-slate-800 border border-white/10 opacity-75'
          }`}
        >
          {/* Animated SVG Character Face */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hair */}
            {isMale ? (
              <path
                d="M20 40 Q25 15 50 15 Q75 15 80 40 C75 35 65 30 50 30 C35 30 25 35 20 40 Z"
                fill="#2c2a29"
              />
            ) : (
              <path
                d="M15 55 Q20 12 50 12 Q80 12 85 55 Q90 70 80 80 C75 55 70 28 50 28 C30 28 25 55 20 80 Q10 70 15 55 Z"
                fill="#3a2518"
              />
            )}

            {/* Face Contour */}
            <circle cx="50" cy="52" r="32" fill="#fed7aa" />

            {/* Glasses for Doctor or Interviewer personas */}
            {character.role.includes('Doctor') || character.role.includes('Interviewer') ? (
              <g stroke="#334155" strokeWidth="2.5">
                <circle cx="39" cy="48" r="8" fill="none" />
                <circle cx="61" cy="48" r="8" fill="none" />
                <line x1="47" y1="48" x2="53" y2="48" />
              </g>
            ) : null}

            {/* Eyes (Blinking Animation) */}
            <g className={isSpeaking ? 'animate-pulse' : ''}>
              <ellipse cx="38" cy="48" rx="3.5" ry="4" fill="#1e293b" />
              <circle cx="39.5" cy="46.5" r="1.2" fill="#ffffff" />
              <ellipse cx="62" cy="48" rx="3.5" ry="4" fill="#1e293b" />
              <circle cx="63.5" cy="46.5" r="1.2" fill="#ffffff" />
            </g>

            {/* Cheeks Blush */}
            <circle cx="30" cy="56" r="4" fill="#fb7185" opacity="0.4" />
            <circle cx="70" cy="56" r="4" fill="#fb7185" opacity="0.4" />

            {/* Nose */}
            <path
              d="M48 51 Q50 56 52 51"
              stroke="#d97706"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Talking Mouth Animation */}
            {isSpeaking ? (
              <g className="animate-bounce">
                <ellipse cx="50" cy="67" rx="7" ry="5" fill="#be123c" />
                <path d="M45 65 Q50 64 55 65" stroke="#ffffff" strokeWidth="2" />
                <ellipse cx="50" cy="69" rx="4" ry="2" fill="#fda4af" />
              </g>
            ) : (
              /* Listening / Resting Smile */
              <path
                d="M43 66 Q50 72 57 66"
                stroke="#9a3412"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </svg>

          {/* Live Activity Badge */}
          {isSpeaking && (
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {/* Name and State Pill */}
      <div className="mt-1 text-center">
        <span className="text-[11px] font-black text-white block tracking-tight">
          {character.name}
        </span>
        <span className="text-[8px] text-white/70 block truncate max-w-[80px]">
          {isSpeaking ? (
            <span className="text-emerald-300 font-extrabold flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Speaking
            </span>
          ) : (
            character.role
          )}
        </span>
        {voiceToneLabel && isSpeaking && (
          <span className="text-[7px] text-blue-200/90 font-mono block">
            {voiceToneLabel}
          </span>
        )}
      </div>
    </div>
  );
};
