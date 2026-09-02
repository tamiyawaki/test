import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flame, Droplets, Leaf, Star, Heart } from 'lucide-react';
import { AdventureUIConfig } from '../../../types';
import { soundEffects } from '../../../utils/soundEffects';

interface MagicChargeWidgetProps {
  config: AdventureUIConfig;
  isEvaluated: boolean;
  isCorrect: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const MagicChargeWidget: React.FC<MagicChargeWidgetProps> = ({
  config,
  isEvaluated,
  isCorrect,
  onSelectAnswer,
}) => {
  const monsterName = config.monsterName || 'こどもドラゴン';
  const monsterEmoji = config.monsterEmoji || '🐲';
  const spells = config.spells || [
    { id: 'sp1', name: '魔法1', element: 'fire' as const, power: 100, label: '炎', isCorrect: true },
  ];

  const [selectedSpellId, setSelectedSpellId] = useState<string | null>(null);

  const getElementIcon = (element: string) => {
    switch (element) {
      case 'fire':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'nature':
        return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'star':
      default:
        return <Star className="w-5 h-5 text-yellow-400" />;
    }
  };

  const handleCastSpell = (spell: (typeof spells)[0]) => {
    if (isEvaluated) return;
    soundEffects.playSparkle();
    setSelectedSpellId(spell.id);
    onSelectAnswer(spell.label.split(' ')[0] || spell.name);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center p-3">
      {/* Monster Battle Encounter Stage */}
      <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-orange-950 via-stone-900 to-stone-950 rounded-3xl border-2 border-orange-500/50 shadow-2xl p-4 flex flex-col justify-between items-center overflow-hidden">
        {/* Monster HUD Header */}
        <div className="w-full flex items-center justify-between px-2 z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-stone-900/80 rounded-full border border-orange-500/40 text-xs text-orange-200">
            <span className="text-sm">{monsterEmoji}</span>
            <span className="font-extrabold">{monsterName}</span>
          </div>

          {/* Friendship/HP Bar */}
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <div className="w-24 sm:w-32 h-3 bg-stone-800 rounded-full overflow-hidden border border-rose-500/40 p-0.5">
              <motion.div
                initial={{ width: '40%' }}
                animate={{ width: isEvaluated && isCorrect ? '100%' : '50%' }}
                className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full"
              />
            </div>
            <span className="text-[11px] text-rose-300 font-bold">
              {isEvaluated && isCorrect ? '100% なかよし！' : 'なかよし度'}
            </span>
          </div>
        </div>

        {/* Creature Graphic in Center */}
        <motion.div
          animate={
            isEvaluated && isCorrect
              ? { scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }
              : { y: [0, -6, 0] }
          }
          transition={{ repeat: isEvaluated && isCorrect ? 0 : Infinity, duration: 2.5 }}
          className="relative flex flex-col items-center z-10 my-auto"
        >
          <div className="text-6xl sm:text-7xl filter drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]">
            {monsterEmoji}
          </div>
          <span className="text-xs text-orange-200/90 font-bold mt-1 bg-black/40 px-2.5 py-0.5 rounded-full">
            {isEvaluated && isCorrect ? '✨ こころを 開いてくれたよ！' : '「ボクと おともだちに なってくれる？」'}
          </span>
        </motion.div>

        {/* Bottom Spell Cast Prompt */}
        <div className="text-xs text-orange-300 font-medium z-10 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          <span>正しい魔法の 呪文を 唱えて チャージしよう！</span>
        </div>
      </div>

      {/* Spell Choices Palette */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4">
        {spells.map((spell) => {
          const isSelected = selectedSpellId === spell.id;
          let spellBorder = 'border-orange-500/30 hover:border-orange-400 bg-stone-900/90';

          if (isSelected) {
            spellBorder = isEvaluated
              ? isCorrect
                ? 'border-yellow-300 bg-orange-900/90 ring-4 ring-yellow-400/50 shadow-yellow-400/50 scale-102'
                : 'border-rose-400 bg-stone-900'
              : 'border-orange-400 bg-orange-950 ring-2 ring-orange-400 scale-102';
          }

          return (
            <button
              key={spell.id}
              type="button"
              disabled={isEvaluated}
              onClick={() => handleCastSpell(spell)}
              className={`flex items-center gap-3 p-3 rounded-2xl border-2 shadow-lg text-left transition-all cursor-pointer disabled:opacity-70 ${spellBorder}`}
            >
              <div className="p-2 bg-stone-800 rounded-xl border border-stone-700 shadow-inner">
                {getElementIcon(spell.element)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-sm sm:text-base text-yellow-200 truncate">
                  {spell.name}
                </div>
                <div className="text-xs text-stone-300 font-bold mt-0.5">
                  属性: {spell.element} 魔法
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-orange-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
