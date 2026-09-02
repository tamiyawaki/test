import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Clock, RotateCw } from 'lucide-react';
import { AdventureUIConfig } from '../../../types';
import { soundEffects } from '../../../utils/soundEffects';

interface CompassDialWidgetProps {
  config: AdventureUIConfig;
  isEvaluated: boolean;
  isCorrect: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const CompassDialWidget: React.FC<CompassDialWidgetProps> = ({
  config,
  isEvaluated,
  isCorrect,
  onSelectAnswer,
}) => {
  const targetAngle = config.compassTargetAngle ?? 270;
  const labels = config.compassLabels || ['12 (0分)', '3 (15分)', '6 (30分)', '9 (45分)'];

  // Current dial angle choices: 0 (12), 90 (3), 180 (6), 270 (9)
  const [currentAngle, setCurrentAngle] = useState(0);

  const angles = [
    { label: labels[0] || '12時', angle: 0, val: '12:00' },
    { label: labels[1] || '3時', angle: 90, val: '3:15' },
    { label: labels[2] || '6時', angle: 180, val: '6:30' },
    { label: labels[3] || '9時', angle: 270, val: '3:45' },
  ];

  const handleSelectAngle = (item: (typeof angles)[0]) => {
    if (isEvaluated) return;
    soundEffects.playPop();
    setCurrentAngle(item.angle);
    onSelectAnswer(item.val);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center p-3">
      {/* Compass Dial Display */}
      <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 rounded-3xl border-2 border-indigo-500/50 shadow-2xl p-4 flex flex-col justify-between items-center overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-900/80 rounded-full border border-indigo-400/40 text-indigo-200 text-xs">
          <Compass className="w-4 h-4 text-indigo-300" />
          <span>時空の 星座羅針盤</span>
        </div>

        {/* Rotating Compass Needle Dial */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-amber-500 bg-stone-950 shadow-inner flex items-center justify-center my-auto">
          {/* Compass Markings */}
          <div className="absolute top-1 text-[10px] font-black text-amber-300">12 (00)</div>
          <div className="absolute right-1 text-[10px] font-black text-amber-300">3 (15)</div>
          <div className="absolute bottom-1 text-[10px] font-black text-amber-300">6 (30)</div>
          <div className="absolute left-1 text-[10px] font-black text-amber-300">9 (45)</div>

          {/* Center Needle */}
          <motion.div
            animate={{ rotate: currentAngle }}
            transition={{ type: 'spring', stiffness: 100, damping: 12 }}
            className="w-1.5 h-28 sm:h-34 absolute flex flex-col justify-between items-center pointer-events-none"
          >
            {/* North Red Needle Arrow */}
            <div className="w-0 h-0 border-x-6 border-x-transparent border-b-16 border-b-rose-500" />
            {/* Center Pivot */}
            <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-stone-900 z-10 shadow" />
            {/* South Gold Needle Arrow */}
            <div className="w-0 h-0 border-x-6 border-x-transparent border-t-16 border-t-amber-400" />
          </motion.div>
        </div>

        <span className="text-xs text-indigo-300/80">
          下のボタンを押して 羅針盤の針を セットしよう！
        </span>
      </div>

      {/* Angle Direction Buttons */}
      <div className="w-full grid grid-cols-2 gap-2 sm:gap-3 mt-4">
        {angles.map((item) => {
          const isSelected = currentAngle === item.angle;
          let btnStyle = 'bg-stone-900 border-indigo-500/40 text-stone-100 hover:border-indigo-400';

          if (isSelected) {
            btnStyle = isEvaluated
              ? isCorrect
                ? 'bg-indigo-900 border-yellow-300 ring-4 ring-yellow-400/50 text-yellow-200 shadow-yellow-400/50'
                : 'bg-rose-950 border-rose-400 text-rose-200'
              : 'bg-indigo-950 border-indigo-400 ring-2 ring-indigo-400 text-indigo-100';
          }

          return (
            <button
              key={item.angle}
              type="button"
              disabled={isEvaluated}
              onClick={() => handleSelectAngle(item)}
              className={`p-3 rounded-2xl border-2 flex items-center justify-between shadow-lg transition-all cursor-pointer disabled:opacity-60 ${btnStyle}`}
            >
              <div className="font-extrabold text-sm">{item.label}</div>
              <RotateCw className="w-4 h-4 text-amber-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
