import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Unlock, Lock, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { AdventureUIConfig } from '../../../types';
import { soundEffects } from '../../../utils/soundEffects';

interface ChestLockWidgetProps {
  config: AdventureUIConfig;
  isEvaluated: boolean;
  isCorrect: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const ChestLockWidget: React.FC<ChestLockWidgetProps> = ({
  config,
  isEvaluated,
  isCorrect,
  onSelectAnswer,
}) => {
  const dials = config.lockDials || [
    { label: '十の位', current: 0, options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    { label: '一の位', current: 0, options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
  ];

  const [dialValues, setDialValues] = useState<(number | string)[]>(() =>
    dials.map((d) => d.options[0] ?? 0)
  );

  const handleCycleDial = (dialIndex: number, direction: 'up' | 'down') => {
    if (isEvaluated) return;
    soundEffects.playPop();
    setDialValues((prev) => {
      const next = [...prev];
      const opts = dials[dialIndex].options;
      const curIdx = opts.indexOf(next[dialIndex]);
      let newIdx = direction === 'up' ? curIdx + 1 : curIdx - 1;
      if (newIdx >= opts.length) newIdx = 0;
      if (newIdx < 0) newIdx = opts.length - 1;
      next[dialIndex] = opts[newIdx];

      // Combine dial values as answer
      const combined = next.join('');
      onSelectAnswer(combined);
      return next;
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center p-4">
      {/* Treasure Chest Graphic */}
      <motion.div
        animate={{
          scale: isEvaluated && isCorrect ? [1, 1.08, 1] : 1,
          rotate: isEvaluated && isCorrect ? [0, -2, 2, 0] : 0,
        }}
        transition={{ duration: 0.6 }}
        className={`relative w-full max-w-md bg-gradient-to-b ${
          isEvaluated && isCorrect
            ? 'from-amber-700 via-amber-800 to-amber-950 border-yellow-300 shadow-yellow-500/40'
            : 'from-stone-800 via-stone-900 to-stone-950 border-amber-600/70 shadow-amber-900/30'
        } rounded-3xl border-4 p-6 shadow-2xl flex flex-col items-center`}
      >
        {/* Shimmering Chest Lock Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-amber-500/20 rounded-full border border-amber-400/40 text-amber-300">
            {isEvaluated && isCorrect ? (
              <Unlock className="w-6 h-6 text-yellow-300 animate-bounce" />
            ) : (
              <Lock className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <span className="font-extrabold text-amber-200 tracking-wider text-sm sm:text-base">
            {isEvaluated && isCorrect ? '✨ 封印解除！ 宝箱オープン！' : '🗝️ 魔法のダイヤル暗号'}
          </span>
        </div>

        {/* Rotary Dials Container */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 my-2 bg-stone-950/80 p-4 sm:p-6 rounded-2xl border-2 border-amber-900/60 shadow-inner">
          {dials.map((dial, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-amber-400/80 mb-1">{dial.label}</span>

              {/* Up Button */}
              <button
                type="button"
                disabled={isEvaluated}
                onClick={() => handleCycleDial(idx, 'up')}
                className="w-12 h-8 bg-amber-700 hover:bg-amber-600 active:scale-95 text-amber-100 rounded-t-xl flex items-center justify-center border-t border-x border-amber-500 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              {/* Dial Value Display */}
              <div className="w-14 h-16 bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-400 flex items-center justify-center shadow-inner relative overflow-hidden">
                <span className="font-black text-2xl sm:text-3xl text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]">
                  {dialValues[idx]}
                </span>
                <div className="absolute inset-x-0 top-0 h-1 bg-amber-300/30" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-900/50" />
              </div>

              {/* Down Button */}
              <button
                type="button"
                disabled={isEvaluated}
                onClick={() => handleCycleDial(idx, 'down')}
                className="w-12 h-8 bg-amber-700 hover:bg-amber-600 active:scale-95 text-amber-100 rounded-b-xl flex items-center justify-center border-b border-x border-amber-500 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Current Combined Code Display */}
        <div className="mt-3 text-center">
          <p className="text-xs text-amber-300/70">
            現在の合わせ番号: <strong className="text-yellow-300 text-base">{dialValues.join('')}</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
