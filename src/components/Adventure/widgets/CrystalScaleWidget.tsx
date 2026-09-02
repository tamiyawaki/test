import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, Sparkles, Plus, Trash2 } from 'lucide-react';
import { AdventureUIConfig } from '../../../types';
import { soundEffects } from '../../../utils/soundEffects';

interface CrystalScaleWidgetProps {
  config: AdventureUIConfig;
  isEvaluated: boolean;
  isCorrect: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const CrystalScaleWidget: React.FC<CrystalScaleWidgetProps> = ({
  config,
  isEvaluated,
  isCorrect,
  onSelectAnswer,
}) => {
  const targetWeight = config.targetWeight || 10;
  const leftPanItems = config.leftPan || [{ id: 'l1', name: '重さ 6', weight: 6, icon: '🔮' }];
  const availableItems = config.availableItems || [
    { id: 'r2', name: '小 (2)', weight: 2, icon: '💎' },
    { id: 'r3', name: '中 (3)', weight: 3, icon: '♦️' },
    { id: 'r4', name: '大 (4)', weight: 4, icon: '⭐' },
    { id: 'r5', name: '特大 (5)', weight: 5, icon: '🟢' },
  ];

  const leftTotalWeight = leftPanItems.reduce((acc, item) => acc + item.weight, 0);

  // Items added to the right pan by the player
  const [rightPanItems, setRightPanItems] = useState<typeof availableItems>([]);

  const rightTotalWeight = rightPanItems.reduce((acc, item) => acc + item.weight, 0);
  const combinedTotal = leftTotalWeight + rightTotalWeight;

  // Calculate tilt angle: balanced when leftTotal + rightTotal === targetWeight, or if left === right
  // Here right pan aims to make the equation work or equal target
  const weightDiff = rightTotalWeight - (targetWeight - leftTotalWeight);
  const tiltAngle = Math.max(-15, Math.min(15, weightDiff * 3));

  const handleAddItem = (item: (typeof availableItems)[0]) => {
    if (isEvaluated) return;
    soundEffects.playPop();
    const next = [...rightPanItems, item];
    setRightPanItems(next);
    const sum = next.reduce((acc, i) => acc + i.weight, 0);
    onSelectAnswer(String(sum));
  };

  const handleRemoveItem = (index: number) => {
    if (isEvaluated) return;
    soundEffects.playPop();
    const next = rightPanItems.filter((_, i) => i !== index);
    setRightPanItems(next);
    const sum = next.reduce((acc, i) => acc + i.weight, 0);
    onSelectAnswer(String(sum));
  };

  const handleReset = () => {
    if (isEvaluated) return;
    soundEffects.playPop();
    setRightPanItems([]);
    onSelectAnswer('0');
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center p-3 sm:p-4">
      {/* Target Goal Header */}
      <div className="flex items-center gap-3 px-4 py-2 bg-cyan-950/80 rounded-full border border-cyan-400/40 text-cyan-200 text-xs sm:text-sm mb-4 shadow-lg">
        <Scale className="w-4 h-4 text-cyan-300" />
        <span>めざす重さ: <strong className="text-yellow-300 font-extrabold text-base">{targetWeight}</strong>（左の皿 ＋ 右の皿）</span>
      </div>

      {/* Balance Scale Stage */}
      <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 rounded-3xl border-2 border-cyan-600/40 shadow-2xl flex flex-col items-center justify-between p-4 overflow-hidden">
        {/* Fulcrum and Beam */}
        <div className="w-full relative mt-4">
          {/* Central Pivot Post */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-4 h-28 bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 rounded-b-md z-0 shadow-md" />

          {/* Tilting Balance Beam */}
          <motion.div
            animate={{ rotate: tiltAngle }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            className="relative w-4/5 mx-auto h-3 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 rounded-full shadow-lg z-10 flex items-center justify-between px-2"
          >
            {/* Center Pivot Point */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-amber-300 rounded-full border-2 border-amber-900 shadow-md flex items-center justify-center">
              <div className="w-2 h-2 bg-amber-900 rounded-full" />
            </div>

            {/* Left Pan Attachment */}
            <div className="relative -ml-4 flex flex-col items-center">
              <div className="w-0.5 h-14 bg-cyan-300/80" />
              {/* Left Plate */}
              <div className="w-24 sm:w-28 min-h-[50px] bg-gradient-to-b from-cyan-800/90 to-cyan-950 border-2 border-cyan-300 rounded-b-2xl rounded-t-sm shadow-xl p-1 flex flex-wrap items-center justify-center gap-1">
                {leftPanItems.map((item, i) => (
                  <span key={i} className="text-xl" title={item.name}>
                    {item.icon}
                  </span>
                ))}
                <span className="text-[11px] font-black text-cyan-200 block w-full text-center">
                  重さ: {leftTotalWeight}
                </span>
              </div>
            </div>

            {/* Right Pan Attachment */}
            <div className="relative -mr-4 flex flex-col items-center">
              <div className="w-0.5 h-14 bg-cyan-300/80" />
              {/* Right Plate */}
              <div className="w-24 sm:w-28 min-h-[50px] bg-gradient-to-b from-purple-800/90 to-purple-950 border-2 border-purple-300 rounded-b-2xl rounded-t-sm shadow-xl p-1 flex flex-wrap items-center justify-center gap-1">
                {rightPanItems.length === 0 ? (
                  <span className="text-[10px] text-purple-300/60 py-2">クリスタルを置く</span>
                ) : (
                  rightPanItems.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isEvaluated}
                      onClick={() => handleRemoveItem(i)}
                      className="text-lg hover:scale-125 transition-transform cursor-pointer"
                      title="タップで取り除く"
                    >
                      {item.icon}
                    </button>
                  ))
                )}
                <span className="text-[11px] font-black text-purple-200 block w-full text-center">
                  重さ: {rightTotalWeight}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Calculation Indicator */}
        <div className="w-full flex items-center justify-between px-3 text-xs z-10">
          <span className="text-cyan-300 font-bold">
            合計: {leftTotalWeight} ＋ {rightTotalWeight} ＝{' '}
            <strong className={combinedTotal === targetWeight ? 'text-green-400 text-sm font-black' : 'text-yellow-300 text-sm'}>
              {combinedTotal}
            </strong>
          </span>
          {rightPanItems.length > 0 && !isEvaluated && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-rose-300 hover:text-rose-200 flex items-center gap-1 bg-rose-950/50 px-2 py-1 rounded-md border border-rose-700/50 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> リセット
            </button>
          )}
        </div>
      </div>

      {/* Available Crystal Item Palette */}
      <div className="w-full mt-4">
        <p className="text-xs font-bold text-slate-300 mb-2 text-center">
          下のクリスタルをタップして 右の皿にのせよう！
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {availableItems.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={isEvaluated}
              onClick={() => handleAddItem(item)}
              className="flex items-center justify-center gap-2 p-2.5 bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-white rounded-xl border border-cyan-500/40 shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="text-left">
                <div className="text-xs font-black text-yellow-300">重さ +{item.weight}</div>
              </div>
              <Plus className="w-3.5 h-3.5 text-cyan-400 ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
