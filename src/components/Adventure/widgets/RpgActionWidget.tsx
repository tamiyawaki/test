import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Swords, Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdventureUIConfig } from '../../../types';
import { soundEffects } from '../../../utils/soundEffects';

interface RpgActionWidgetProps {
  config: AdventureUIConfig;
  isEvaluated: boolean;
  isCorrect: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const RpgActionWidget: React.FC<RpgActionWidgetProps> = ({
  config,
  isEvaluated,
  isCorrect,
  onSelectAnswer,
}) => {
  const actions = config.actions || [
    { id: 'a1', title: 'コマンド1', desc: '説明', icon: '⚔️', isCorrect: true, badge: '知恵' },
  ];

  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  const handleSelectAction = (action: (typeof actions)[0]) => {
    if (isEvaluated) return;
    soundEffects.playPop();
    setSelectedActionId(action.id);
    onSelectAnswer(action.title.replace(/「|」/g, ''));
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center p-3">
      {/* RPG Command Deck Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const isSelected = selectedActionId === action.id;
          let cardStyle = 'bg-stone-900/90 border-stone-700 text-stone-100 hover:border-amber-400 hover:scale-102';

          if (isSelected) {
            cardStyle = isEvaluated
              ? isCorrect
                ? 'bg-gradient-to-b from-amber-900 to-stone-950 border-yellow-300 ring-4 ring-yellow-400/50 text-yellow-100 shadow-yellow-400/50 scale-102'
                : 'bg-rose-950/90 border-rose-400 text-rose-100'
              : 'bg-amber-950 border-amber-400 ring-2 ring-amber-400 text-amber-100 scale-102';
          }

          return (
            <motion.button
              key={action.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={isEvaluated}
              onClick={() => handleSelectAction(action)}
              className={`p-4 rounded-2xl border-2 shadow-xl flex flex-col text-left transition-all cursor-pointer disabled:opacity-60 relative ${cardStyle}`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-2xl">{action.icon}</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-stone-800 border border-stone-600 text-amber-300">
                  {action.badge}
                </span>
              </div>

              <div className="font-extrabold text-sm sm:text-base text-yellow-200 mb-1">
                {action.title}
              </div>

              <div className="text-xs text-stone-300 leading-relaxed opacity-90">
                {action.desc}
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
