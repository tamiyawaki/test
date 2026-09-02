import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { AdventureUIConfig } from '../../../types';
import { soundEffects } from '../../../utils/soundEffects';

interface SteppingStonesWidgetProps {
  config: AdventureUIConfig;
  isEvaluated: boolean;
  isCorrect: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const SteppingStonesWidget: React.FC<SteppingStonesWidgetProps> = ({
  config,
  isEvaluated,
  isCorrect,
  onSelectAnswer,
}) => {
  const stones = config.stones || [
    { id: 's1', text: '3', subText: '', isCorrect: false, feedback: 'おしい！' },
    { id: 's2', text: '4', subText: '', isCorrect: true, feedback: 'だいせいかい！' },
  ];

  const [selectedStoneId, setSelectedStoneId] = useState<string | null>(null);

  const handleSelectStone = (stone: (typeof stones)[0]) => {
    if (isEvaluated) return;
    soundEffects.playPop();
    setSelectedStoneId(stone.id);
    onSelectAnswer(stone.text);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center p-3">
      {/* Animated River Crossing Scene */}
      <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-teal-900 via-emerald-950 to-teal-950 rounded-3xl border-2 border-teal-500/50 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
        {/* River Water Ripple Animation Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 -left-10 w-40 h-8 bg-cyan-300 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-2/4 -right-10 w-40 h-8 bg-teal-300 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-32 h-6 bg-emerald-300 rounded-full blur-lg" />
        </div>

        {/* Start Bank Header */}
        <div className="w-full flex items-center justify-between text-xs z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-800/80 rounded-full text-emerald-200 border border-emerald-400/40">
            <span>🌿 こちらの岸 (スタート)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-800/80 rounded-full text-amber-200 border border-amber-400/40 font-bold">
            <span>🏁 むこうの岸 (ゴール)</span>
          </div>
        </div>

        {/* Stepping Stones Field */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 my-auto z-10">
          {stones.map((stone) => {
            const isSelected = selectedStoneId === stone.id;
            let stoneStyle = 'bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 border-stone-500 text-stone-100 hover:border-emerald-400 hover:scale-105';

            if (isSelected) {
              if (isEvaluated) {
                stoneStyle = isCorrect
                  ? 'bg-gradient-to-b from-emerald-600 to-teal-800 border-yellow-300 ring-4 ring-yellow-400/50 text-white scale-105 shadow-yellow-400/50'
                  : 'bg-gradient-to-b from-rose-800 to-stone-900 border-rose-400 text-rose-100';
              } else {
                stoneStyle = 'bg-gradient-to-b from-teal-700 to-emerald-900 border-teal-300 ring-2 ring-teal-400 text-white scale-105';
              }
            }

            return (
              <motion.button
                key={stone.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                disabled={isEvaluated}
                onClick={() => handleSelectStone(stone)}
                className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-3 shadow-xl transition-all cursor-pointer ${stoneStyle}`}
              >
                {/* Stepping Stone Surface Texture */}
                <div className="font-black text-2xl sm:text-3xl tracking-wide drop-shadow-md">
                  {stone.text}
                </div>
                {stone.subText && (
                  <span className="text-[11px] font-medium text-emerald-200/80 mt-0.5">
                    {stone.subText}
                  </span>
                )}

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2">
                    {isEvaluated ? (
                      isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-yellow-300 bg-emerald-900 rounded-full" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-400 bg-stone-900 rounded-full" />
                      )
                    ) : (
                      <span className="text-lg animate-bounce">👣</span>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* River Water Surface Info */}
        <div className="flex items-center justify-center gap-2 text-xs text-teal-300 font-medium z-10">
          <Waves className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>正しい石を踏むと 向こう岸へ ジャンプできるよ！</span>
        </div>
      </div>
    </div>
  );
};
