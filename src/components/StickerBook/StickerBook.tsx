import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Lock, Trophy, TreePine, Star } from 'lucide-react';
import { Sticker, Companion } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface StickerBookProps {
  stickers: Sticker[];
  totalStars: number;
  companion: Companion;
}

export const StickerBook: React.FC<StickerBookProps> = ({
  stickers,
  totalStars,
  companion,
}) => {
  const unlockedCount = stickers.filter((s) => s.unlocked || totalStars >= s.requiredStars).length;
  const progressPercent = Math.min(100, Math.round((unlockedCount / stickers.length) * 100));

  // Determine Learning Tree Level
  const treeLevel = Math.min(5, Math.floor(totalStars / 10) + 1);
  const treeTitles = [
    'めばえの たね 🌱',
    'わかばの き 🌿',
    'みどりの き 🌲',
    '花さく たいじゅ 🌸',
    'にじの まほうのき 🌈',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-emerald-500/20 p-6 rounded-3xl border-2 border-amber-300 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-amber-200 text-amber-900 font-extrabold text-xs rounded-full">
            🌟 ごほうび シールちょう
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">
            あつめた シール & まなびの き
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            算数や国語をといてスターを集めると、キラキラのシールがアンロックされるよ！
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-md">
          <Trophy className="w-8 h-8 text-amber-500" />
          <div>
            <div className="text-xs font-bold text-neutral-500">あつめた シール</div>
            <div className="text-lg font-black text-amber-950">
              {unlockedCount} / {stickers.length} まい ({progressPercent}%)
            </div>
          </div>
        </div>
      </div>

      {/* Growing Learning Tree Card */}
      <div className="bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 rounded-3xl p-6 sm:p-8 border-4 border-emerald-200 shadow-lg text-center space-y-4">
        <div className="text-xs font-bold text-emerald-800 bg-emerald-100 inline-block px-4 py-1 rounded-full border border-emerald-300">
          🌲 あなたの『まなびの木』 ステージ {treeLevel}
        </div>

        <div className="text-5xl sm:text-7xl select-none animate-bounce-gentle">
          {treeLevel === 1 && '🌱'}
          {treeLevel === 2 && '🌿'}
          {treeLevel === 3 && '🌲'}
          {treeLevel === 4 && '🌳🌸'}
          {treeLevel >= 5 && '🌈🌳✨'}
        </div>

        <h3 className="text-xl font-black text-emerald-950">
          {treeTitles[treeLevel - 1] || treeTitles[0]}
        </h3>

        {/* Star Progress Bar */}
        <div className="max-w-md mx-auto space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-neutral-600">
            <span>現在のスター: {totalStars} ⭐</span>
            <span>つぎのレベルまで: {Math.max(0, treeLevel * 10 - totalStars)} ⭐</span>
          </div>
          <div className="w-full h-4 bg-emerald-200 rounded-full overflow-hidden p-0.5 border border-emerald-300">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ((totalStars % 10) / 10) * 100)}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Stickers Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200 space-y-4">
        <h3 className="font-extrabold text-lg text-neutral-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>シール コレクション</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {stickers.map((sticker) => {
            const isUnlocked = sticker.unlocked || totalStars >= sticker.requiredStars;

            return (
              <motion.button
                key={sticker.id}
                type="button"
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => {
                  if (isUnlocked) {
                    soundEffects.playSparkle();
                  } else {
                    soundEffects.playHint();
                  }
                }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all min-h-[140px] shadow-sm select-none ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-amber-50 to-yellow-50 border-amber-300 hover:border-amber-400 hover:shadow-md'
                    : 'bg-neutral-100 border-neutral-200 opacity-60'
                }`}
              >
                {/* Icon or Lock */}
                <div className="text-4xl sm:text-5xl my-2">
                  {isUnlocked ? sticker.icon : <Lock className="w-8 h-8 text-neutral-400 mx-auto" />}
                </div>

                {/* Sticker Name */}
                <div className="font-extrabold text-xs sm:text-sm text-neutral-800 line-clamp-1">
                  {sticker.name}
                </div>

                {/* Description or Requirement */}
                <div className="text-[10px] text-neutral-500 mt-1">
                  {isUnlocked ? (
                    <span className="text-emerald-700 font-bold">ゲット！✨</span>
                  ) : (
                    <span>あと {Math.max(0, sticker.requiredStars - totalStars)} ⭐</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
