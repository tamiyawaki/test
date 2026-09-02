import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, FlaskConical, Plus } from 'lucide-react';
import { AdventureUIConfig } from '../../../types';
import { soundEffects } from '../../../utils/soundEffects';

interface PotionAlchemyWidgetProps {
  config: AdventureUIConfig;
  isEvaluated: boolean;
  isCorrect: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const PotionAlchemyWidget: React.FC<PotionAlchemyWidgetProps> = ({
  config,
  isEvaluated,
  isCorrect,
  onSelectAnswer,
}) => {
  const potionTarget = config.potionTarget || '星くずポーション';
  const ingredients = config.ingredients || [
    { id: 'ing1', name: 'しずく (7滴)', icon: '💧', amount: 7, isCorrect: true },
    { id: 'ing2', name: 'しずく (5滴)', icon: '✨', amount: 5, isCorrect: false },
  ];

  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);

  const handleSelectIngredient = (ing: (typeof ingredients)[0]) => {
    if (isEvaluated) return;
    soundEffects.playPop();
    setSelectedIngredientId(ing.id);
    onSelectAnswer(String(ing.amount));
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center p-3">
      {/* Cauldron Stage */}
      <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 rounded-3xl border-2 border-purple-500/50 shadow-2xl p-4 flex flex-col justify-between items-center overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/80 rounded-full border border-purple-400/40 text-purple-200 text-xs">
          <FlaskConical className="w-4 h-4 text-purple-300" />
          <span>調合目標: <strong className="text-yellow-300">{potionTarget}</strong></span>
        </div>

        {/* Cauldron Visual */}
        <div className="relative flex flex-col items-center my-auto">
          {/* Bubbles animation */}
          <div className="flex gap-2 mb-1">
            <motion.div
              animate={{ y: [-5, -20], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2.5 h-2.5 bg-purple-300 rounded-full blur-[0.5px]"
            />
            <motion.div
              animate={{ y: [-5, -25], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
              className="w-3.5 h-3.5 bg-pink-300 rounded-full blur-[0.5px]"
            />
            <motion.div
              animate={{ y: [-5, -20], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: 0.6 }}
              className="w-2 h-2 bg-yellow-300 rounded-full blur-[0.5px]"
            />
          </div>

          {/* Cauldron Pot */}
          <div className="w-28 sm:w-36 h-20 bg-gradient-to-b from-stone-800 to-stone-950 rounded-b-full border-4 border-stone-600 shadow-2xl flex items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{
                scale: isEvaluated && isCorrect ? [1, 1.2, 1] : 1,
              }}
              className="w-full h-8 bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-500 rounded-full blur-xs opacity-90 absolute top-1"
            />
            <span className="text-3xl z-10">
              {isEvaluated && isCorrect ? '✨' : '🧪'}
            </span>
          </div>
        </div>

        <span className="text-xs text-purple-300/80">
          ぴったりになる 材料の量を えらんで 入れよう！
        </span>
      </div>

      {/* Ingredient Vials */}
      <div className="w-full grid grid-cols-2 gap-2 sm:gap-3 mt-4">
        {ingredients.map((ing) => {
          const isSelected = selectedIngredientId === ing.id;
          let ingStyle = 'bg-stone-900 border-purple-500/40 text-stone-100 hover:border-purple-400';

          if (isSelected) {
            ingStyle = isEvaluated
              ? isCorrect
                ? 'bg-purple-900 border-yellow-300 ring-4 ring-yellow-400/50 text-yellow-200 shadow-yellow-400/50'
                : 'bg-rose-950 border-rose-400 text-rose-200'
              : 'bg-purple-950 border-purple-400 ring-2 ring-purple-400 text-purple-100';
          }

          return (
            <button
              key={ing.id}
              type="button"
              disabled={isEvaluated}
              onClick={() => handleSelectIngredient(ing)}
              className={`p-3 rounded-2xl border-2 flex items-center gap-3 shadow-lg transition-all cursor-pointer disabled:opacity-60 ${ingStyle}`}
            >
              <span className="text-2xl">{ing.icon}</span>
              <div className="text-left flex-1">
                <div className="font-extrabold text-sm">{ing.name}</div>
                <div className="text-[11px] text-purple-300 font-bold">量: {ing.amount}</div>
              </div>
              <Plus className="w-4 h-4 text-purple-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
