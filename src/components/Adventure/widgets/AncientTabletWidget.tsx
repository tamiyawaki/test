import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scroll, Sparkles, Check } from 'lucide-react';
import { AdventureUIConfig } from '../../../types';
import { soundEffects } from '../../../utils/soundEffects';

interface AncientTabletWidgetProps {
  config: AdventureUIConfig;
  isEvaluated: boolean;
  isCorrect: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const AncientTabletWidget: React.FC<AncientTabletWidgetProps> = ({
  config,
  isEvaluated,
  isCorrect,
  onSelectAnswer,
}) => {
  const prompt = config.tabletPrompt || '古代の石板に 刻まれた 文字';
  const runes = config.runes || [
    { id: 'r1', char: '光', meaning: 'ひかり', isCorrect: true },
    { id: 'r2', char: '闇', meaning: 'やみ', isCorrect: false },
  ];

  const [selectedRuneId, setSelectedRuneId] = useState<string | null>(null);

  const handleSelectRune = (rune: (typeof runes)[0]) => {
    if (isEvaluated) return;
    soundEffects.playPop();
    setSelectedRuneId(rune.id);
    onSelectAnswer(rune.char);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center p-3">
      {/* Stone Tablet Canvas */}
      <div className="w-full bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 rounded-3xl border-4 border-stone-600 shadow-2xl p-5 flex flex-col items-center relative overflow-hidden">
        {/* Stone Texture & Runes Border */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="flex items-center gap-2 mb-4">
          <Scroll className="w-5 h-5 text-emerald-400" />
          <span className="font-extrabold text-emerald-300 text-sm">📜 古代の巨木石板</span>
        </div>

        {/* Ancient Inscribed Text with Slot */}
        <div className="w-full bg-stone-950/80 p-4 sm:p-5 rounded-2xl border-2 border-emerald-800/60 flex items-center justify-center text-center shadow-inner">
          <span className="font-bold text-lg sm:text-2xl text-emerald-100 leading-relaxed">
            {prompt}
          </span>
        </div>

        {/* Selected Rune Preview in Slot */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-stone-300">はめこんだ文字:</span>
          <div
            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-xl shadow-inner ${
              selectedRuneId
                ? 'bg-emerald-900/80 border-emerald-400 text-yellow-300'
                : 'bg-stone-900 border-dashed border-stone-600 text-stone-500'
            }`}
          >
            {runes.find((r) => r.id === selectedRuneId)?.char || '？'}
          </div>
        </div>
      </div>

      {/* Rune Selection Options */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
        {runes.map((rune) => {
          const isSelected = selectedRuneId === rune.id;
          let runeStyle = 'bg-stone-800 border-stone-600 text-stone-100 hover:border-emerald-400 hover:bg-stone-750';

          if (isSelected) {
            runeStyle = isEvaluated
              ? isCorrect
                ? 'bg-emerald-900 border-yellow-300 ring-4 ring-yellow-400/50 text-yellow-200'
                : 'bg-rose-950 border-rose-400 text-rose-200'
              : 'bg-emerald-900/90 border-emerald-400 ring-2 ring-emerald-400 text-emerald-100';
          }

          return (
            <button
              key={rune.id}
              type="button"
              disabled={isEvaluated}
              onClick={() => handleSelectRune(rune)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center shadow-md transition-all cursor-pointer disabled:opacity-60 ${runeStyle}`}
            >
              <span className="font-black text-2xl mb-1 drop-shadow-sm">{rune.char}</span>
              <span className="text-[11px] font-medium opacity-80">{rune.meaning}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
