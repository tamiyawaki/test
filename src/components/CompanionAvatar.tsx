import React from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, MessageCircleHeart } from 'lucide-react';
import { Companion } from '../types';
import { COMPANIONS } from '../data/characters';
import { speech } from '../utils/speech';
import { soundEffects } from '../utils/soundEffects';

interface CompanionAvatarProps {
  companion?: Companion;
  characterId?: string;
  speechText?: string;
  expression?: 'idle' | 'happy' | 'talking' | 'thinking' | 'cheering';
  showBubble?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  onTap?: () => void;
  voiceEnabled?: boolean;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  companion: propCompanion,
  characterId,
  speechText,
  expression = 'idle',
  showBubble = true,
  size = 'md',
  onTap,
  voiceEnabled = true,
}) => {
  const companion =
    propCompanion ||
    (characterId && COMPANIONS[characterId]) ||
    COMPANIONS.poko;

  const [isSpeakingLocal, setIsSpeakingLocal] = React.useState(false);

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!speechText) return;

    soundEffects.playPop();
    setIsSpeakingLocal(true);
    speech.speak(speechText, {
      pitch: companion?.voicePitch ?? 1.2,
      rate: companion?.voiceRate ?? 0.95,
      onEnd: () => setIsSpeakingLocal(false),
      onError: () => setIsSpeakingLocal(false),
    });
  };

  // Avatar SVG and character render
  const renderAvatarGraphic = () => {
    const cid = companion?.id || 'poko';
    switch (cid) {
      case 'poko': // Raccoon / Tanuki
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Tanuki ears */}
            <div className="absolute -top-2 left-2 w-5 h-5 bg-amber-800 rounded-full border-2 border-amber-900 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-amber-300 rounded-full" />
            </div>
            <div className="absolute -top-2 right-2 w-5 h-5 bg-amber-800 rounded-full border-2 border-amber-900 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-amber-300 rounded-full" />
            </div>
            {/* Leaf on head */}
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-emerald-500 font-black text-lg drop-shadow-sm select-none"
            >
              🍃
            </motion.div>
            {/* Main Face */}
            <div className="w-full h-full bg-gradient-to-b from-amber-500 to-amber-600 rounded-full border-4 border-amber-800 flex flex-col items-center justify-center shadow-inner overflow-hidden">
              {/* Tanuki eye mask */}
              <div className="w-4/5 h-6 bg-amber-900/80 rounded-full flex items-center justify-around px-1 mt-1">
                {/* Eyes */}
                <motion.div
                  animate={
                    expression === 'happy' || expression === 'cheering'
                      ? { scaleY: [1, 0.2, 1] }
                      : { scaleY: [1, 1, 0.1, 1] }
                  }
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.95, 1] }}
                  className="w-3 h-3.5 bg-white rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-neutral-900 rounded-full" />
                </motion.div>
                {/* Snout/Nose */}
                <div className="w-3 h-2 bg-amber-200 rounded-full flex items-center justify-center -mb-2">
                  <div className="w-1.5 h-1 bg-amber-950 rounded-full" />
                </div>
                {/* Right Eye */}
                <motion.div
                  animate={
                    expression === 'happy' || expression === 'cheering'
                      ? { scaleY: [1, 0.2, 1] }
                      : { scaleY: [1, 1, 0.1, 1] }
                  }
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.95, 1] }}
                  className="w-3 h-3.5 bg-white rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-neutral-900 rounded-full" />
                </motion.div>
              </div>
              {/* Cheeks & Smile */}
              <div className="flex items-center gap-4 mt-0.5">
                <div className="w-2.5 h-1.5 bg-rose-400 rounded-full opacity-80" />
                <div className="text-amber-950 font-bold text-xs">
                  {expression === 'happy' || expression === 'cheering' ? '▽' : 'ω'}
                </div>
                <div className="w-2.5 h-1.5 bg-rose-400 rounded-full opacity-80" />
              </div>
            </div>
          </div>
        );

      case 'luna': // Owl
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Owl Feathers/Ears */}
            <div className="absolute -top-2 left-2 w-4 h-4 bg-purple-700 rounded-tl-full" />
            <div className="absolute -top-2 right-2 w-4 h-4 bg-purple-700 rounded-tr-full" />
            {/* Graduation Cap / Glasses */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-indigo-700 font-bold text-base select-none">
              🎓
            </div>
            {/* Main Face */}
            <div className="w-full h-full bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full border-4 border-indigo-900 flex flex-col items-center justify-center shadow-inner overflow-hidden">
              {/* Big Wise Eyes with Glasses */}
              <div className="flex items-center gap-1 mt-1">
                <div className="w-5 h-5 bg-amber-100 rounded-full border-2 border-amber-400 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-indigo-950 rounded-full flex items-start justify-start p-0.5">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
                {/* Beak */}
                <div className="w-2.5 h-3 bg-amber-400 rounded-b-md -mt-1" />
                <div className="w-5 h-5 bg-amber-100 rounded-full border-2 border-amber-400 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-indigo-950 rounded-full flex items-start justify-start p-0.5">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
              </div>
              {/* Feathers on chest */}
              <div className="text-purple-200 text-[10px] tracking-widest mt-0.5">vvv</div>
            </div>
          </div>
        );

      case 'piko': // Robot
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Antenna */}
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <div className="w-3 h-3 bg-rose-500 rounded-full border border-sky-900 animate-pulse" />
              <div className="w-1 h-2 bg-sky-700" />
            </motion.div>
            {/* Robot Head */}
            <div className="w-full h-full bg-gradient-to-b from-sky-400 to-cyan-600 rounded-2xl border-4 border-sky-950 flex flex-col items-center justify-center shadow-inner overflow-hidden p-1">
              {/* Screen display */}
              <div className="w-4/5 h-7 bg-slate-900 rounded-lg flex items-center justify-around px-1 border border-cyan-300/50">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2.5 h-2.5 bg-emerald-400 rounded-sm shadow-[0_0_6px_#34d399]"
                />
                <div className="text-cyan-300 font-mono text-[9px]">⚡</div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                  className="w-2.5 h-2.5 bg-emerald-400 rounded-sm shadow-[0_0_6px_#34d399]"
                />
              </div>
              {/* Dial/Speaker grill */}
              <div className="flex gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-sky-200 rounded-full" />
                <div className="w-1.5 h-1.5 bg-sky-200 rounded-full" />
                <div className="w-1.5 h-1.5 bg-sky-200 rounded-full" />
              </div>
            </div>
          </div>
        );

      case 'kou': // Bat (コウモリ)
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Left Flapping Bat Wing */}
            <motion.div
              animate={{
                rotate: expression === 'cheering' ? [-25, 25, -25] : [-12, 14, -12],
                scale: expression === 'cheering' ? [1, 1.15, 1] : [1, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: expression === 'cheering' ? 0.4 : 1.2,
                ease: 'easeInOut',
              }}
              className="absolute -left-3.5 top-3.5 w-6 h-8 origin-right z-0 pointer-events-none drop-shadow-sm"
            >
              <svg viewBox="0 0 24 30" className="w-full h-full fill-indigo-900 stroke-indigo-950 stroke-1">
                <path d="M24,10 C18,6 12,0 4,2 C2,10 6,18 0,26 C8,22 14,26 18,22 C22,24 24,18 24,10 Z" />
              </svg>
            </motion.div>

            {/* Right Flapping Bat Wing */}
            <motion.div
              animate={{
                rotate: expression === 'cheering' ? [25, -25, 25] : [12, -14, 12],
                scale: expression === 'cheering' ? [1, 1.15, 1] : [1, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: expression === 'cheering' ? 0.4 : 1.2,
                ease: 'easeInOut',
              }}
              className="absolute -right-3.5 top-3.5 w-6 h-8 origin-left z-0 pointer-events-none drop-shadow-sm"
            >
              <svg viewBox="0 0 24 30" className="w-full h-full fill-indigo-900 stroke-indigo-950 stroke-1 scale-x-[-1]">
                <path d="M24,10 C18,6 12,0 4,2 C2,10 6,18 0,26 C8,22 14,26 18,22 C22,24 24,18 24,10 Z" />
              </svg>
            </motion.div>

            {/* Left Pointy Ear */}
            <motion.div
              animate={{ rotate: [-16, -20, -16] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute -top-3 left-1 w-5 h-6 bg-indigo-900 rounded-t-full border-2 border-indigo-950 flex items-center justify-center z-10 origin-bottom"
            >
              <div className="w-2.5 h-3.5 bg-pink-300 rounded-t-full" />
            </motion.div>

            {/* Right Pointy Ear */}
            <motion.div
              animate={{ rotate: [16, 20, 16] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute -top-3 right-1 w-5 h-6 bg-indigo-900 rounded-t-full border-2 border-indigo-950 flex items-center justify-center z-10 origin-bottom"
            >
              <div className="w-2.5 h-3.5 bg-pink-300 rounded-t-full" />
            </motion.div>

            {/* Star Hairpin / Charm */}
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-2.5 left-2 text-yellow-300 text-xs drop-shadow-md z-20 select-none"
            >
              ⭐
            </motion.div>

            {/* Main Face */}
            <div className="relative z-10 w-full h-full bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-900 rounded-full border-4 border-indigo-950 flex flex-col items-center justify-center shadow-inner overflow-hidden">
              {/* Eyes Container */}
              <div className="w-4/5 flex items-center justify-around px-1 mt-1">
                {/* Left Eye */}
                <motion.div
                  animate={
                    expression === 'happy' || expression === 'cheering'
                      ? { scaleY: [1, 0.2, 1] }
                      : { scaleY: [1, 1, 0.1, 1] }
                  }
                  transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.9, 0.95, 1] }}
                  className="w-3.5 h-4 bg-white rounded-full flex items-center justify-center shadow-inner"
                >
                  <div className="w-2 h-2.5 bg-indigo-950 rounded-full flex items-start justify-start p-0.5">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </motion.div>

                {/* Cute Bat Nose */}
                <div className="w-2 h-1.5 bg-pink-300 rounded-full -mb-1" />

                {/* Right Eye */}
                <motion.div
                  animate={
                    expression === 'happy' || expression === 'cheering'
                      ? { scaleY: [1, 0.2, 1] }
                      : { scaleY: [1, 1, 0.1, 1] }
                  }
                  transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.9, 0.95, 1] }}
                  className="w-3.5 h-4 bg-white rounded-full flex items-center justify-center shadow-inner"
                >
                  <div className="w-2 h-2.5 bg-indigo-950 rounded-full flex items-start justify-start p-0.5">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </motion.div>
              </div>

              {/* Cheeks & Fangs Mouth */}
              <div className="flex items-center justify-center gap-2 mt-1">
                {/* Left Blush */}
                <div className="w-2 h-1.5 bg-pink-400 rounded-full opacity-80" />

                {/* Mouth with cute fangs */}
                <div className="relative flex flex-col items-center">
                  <div className="text-white font-extrabold text-[10px] leading-none">
                    {expression === 'happy' || expression === 'cheering' ? '▽' : 'ᴗ'}
                  </div>
                  {/* Two tiny white fangs */}
                  <div className="flex gap-1.5 -mt-0.5">
                    <div className="w-1 h-1 bg-white rounded-b-full shadow-xs" />
                    <div className="w-1 h-1 bg-white rounded-b-full shadow-xs" />
                  </div>
                </div>

                {/* Right Blush */}
                <div className="w-2 h-1.5 bg-pink-400 rounded-full opacity-80" />
              </div>

              {/* Belly star/sparkle mark */}
              <div className="text-indigo-200 text-[8px] tracking-widest -mb-1 opacity-70">
                ✦
              </div>
            </div>
          </div>
        );
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    hero: 'w-32 h-32',
  };

  return (
    <div
      id={`companion-${companion?.id || 'poko'}`}
      onClick={onTap}
      className={`relative inline-flex items-center gap-3 select-none ${onTap ? 'cursor-pointer' : ''}`}
    >
      {/* Animated Avatar */}
      <motion.div
        animate={
          expression === 'cheering'
            ? { y: [0, -12, 0], rotate: [0, -5, 5, 0] }
            : expression === 'talking'
            ? { scale: [1, 1.05, 1], y: [0, -3, 0] }
            : { y: [0, -4, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: expression === 'cheering' ? 0.8 : expression === 'talking' ? 0.6 : 2.5,
          ease: 'easeInOut',
        }}
        className={`relative ${sizeClasses[size]} shrink-0 drop-shadow-md`}
      >
        {renderAvatarGraphic()}

        {/* Talking sound wave indicator */}
        {isSpeakingLocal && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full border border-amber-900 text-xs shadow-md"
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
        )}
      </motion.div>

      {/* Speech Bubble */}
      {showBubble && speechText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative max-w-xs md:max-w-md bg-white rounded-2xl p-3 md:p-4 shadow-md border-2 border-amber-200 text-neutral-800 text-sm md:text-base leading-relaxed"
        >
          {/* Bubble tail */}
          <div className="absolute -left-2 top-4 w-3 h-3 bg-white border-l-2 border-b-2 border-amber-200 -rotate-45" />

          <div className="flex items-start justify-between gap-2">
            <div className="font-medium">{speechText}</div>

            {voiceEnabled && (
              <button
                id="companion-read-aloud-btn"
                type="button"
                onClick={handleSpeak}
                className="shrink-0 p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full transition active:scale-95 shadow-sm"
                title="こえで きく"
                aria-label="こえで きく"
              >
                <Volume2 className={`w-4 h-4 ${isSpeakingLocal ? 'text-rose-600 animate-pulse' : ''}`} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
