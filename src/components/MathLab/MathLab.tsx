import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  Volume2,
  Clock as ClockIcon,
  Wand2,
  RefreshCw,
  Plus,
  Minus,
  Swords,
} from 'lucide-react';
import { GradeLevel, Companion, MathQuestion, MathTopic } from '../../types';
import { PRESET_MATH_QUESTIONS } from '../../data/presetLessons';
import { CompanionAvatar } from '../CompanionAvatar';
import { speech } from '../../utils/speech';
import { soundEffects } from '../../utils/soundEffects';

interface MathLabProps {
  grade: GradeLevel;
  companion: Companion;
  voiceEnabled: boolean;
  onEarnStars: (amount: number, question: string, isCorrect: boolean) => void;
  onSwitchToAdventure?: () => void;
}

export const MathLab: React.FC<MathLabProps> = ({
  grade,
  companion,
  voiceEnabled,
  onEarnStars,
  onSwitchToAdventure,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<MathTopic>('counting');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [companionFeedback, setCompanionFeedback] = useState<string>(companion.greeting);

  // Interactive 10-frame visual counters (child can click to toggle count)
  const [counterItems, setCounterItems] = useState<boolean[]>(Array(10).fill(true));
  const [customInterest, setCustomInterest] = useState<string>('animals');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<MathQuestion[]>([]);

  // Interactive Clock State
  const [clockHour, setClockHour] = useState(3);
  const [clockMinute, setClockMinute] = useState(0);

  // Filter available questions for current grade
  const gradePresetQuestions = PRESET_MATH_QUESTIONS.filter((q) => q.grade === grade);
  const activeQuestions = customQuestions.length > 0 ? customQuestions : gradePresetQuestions;
  const currentQ: MathQuestion =
    activeQuestions[currentIndex % activeQuestions.length] || gradePresetQuestions[0];

  const handleSelectOption = (option: string) => {
    if (isEvaluated) return;
    soundEffects.playPop();
    setSelectedAnswer(option);
  };

  const handleCheckAnswer = async () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQ.correctAnswer;
    setIsEvaluated(true);
    setIsCorrect(correct);

    if (correct) {
      soundEffects.playCorrect();
      soundEffects.playFanfare();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
      setCompanionFeedback(currentQ.encouragement || 'だいせいかい！ ぽこぽこ はなまる！💮');
      onEarnStars(3, currentQ.questionText, true);

      if (voiceEnabled) {
        speech.speak(`${currentQ.explanation} ${currentQ.encouragement}`, {
          pitch: companion.voicePitch,
          rate: companion.voiceRate,
        });
      }
    } else {
      soundEffects.playHint();
      setShowHint(true);
      setCompanionFeedback(`おしい！ もういっかい かぞえてみよう！ ヒント: ${currentQ.hint}`);
      onEarnStars(1, currentQ.questionText, false);

      if (voiceEnabled) {
        speech.speak(`おしいぽこ！ ${currentQ.hint}`, {
          pitch: companion.voicePitch,
          rate: companion.voiceRate,
        });
      }
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playPop();
    setSelectedAnswer(null);
    setIsEvaluated(false);
    setIsCorrect(false);
    setShowHint(false);
    setCurrentIndex((prev) => prev + 1);
    setCompanionFeedback('つぎの もんだいに チャレンジだぽこ！');
  };

  // Generate Custom AI Word Problem
  const handleGenerateAIProblem = async () => {
    soundEffects.playSparkle();
    setIsGeneratingAI(true);
    setCompanionFeedback('AIが あなただけの 特別な 算数問題をつくっているよ...✨');

    try {
      const res = await fetch('/api/ai/math-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          topic: selectedTopic,
          interest: customInterest,
          difficulty: 'normal',
        }),
      });
      const data = await res.json();
      if (data && data.questionText) {
        const newQ: MathQuestion = {
          id: `ai_${Date.now()}`,
          grade,
          topic: selectedTopic,
          title: `🪄 AI ${customInterest}の もんだい`,
          questionText: data.questionText,
          formula: data.formula,
          correctAnswer: data.correctAnswer,
          options: data.options || ['1', '2', '3', '4'],
          hint: data.hint || 'ゆびで かぞえてみよう！',
          explanation: data.explanation || 'だいせいかい！',
          visualType: data.visualType || 'apples',
          visualCountA: data.visualCountA || 3,
          visualCountB: data.visualCountB || 2,
          visualOperator: data.visualOperator || '+',
          encouragement: data.encouragement || 'すばらしい けいさん力だね！',
        };
        setCustomQuestions([newQ]);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setIsEvaluated(false);
        setIsCorrect(false);
        setShowHint(false);
        setCompanionFeedback('あたらしい もんだいが できたぽこ！ チャレンジしてみてね！');
      }
    } catch (e) {
      console.error('AI generation error:', e);
      setCompanionFeedback('もんだいの じゅんびが できたよ！ いっしょに とこう！');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Render Visual Counters
  const renderVisualManipulative = () => {
    const itemEmoji: Record<string, string> = {
      apples: '🍎',
      stars: '⭐',
      blocks: '🟩',
      cars: '🚗',
      animals: '🐱',
      cookies: '🍪',
      shapes: '🔺',
    };

    const emoji = itemEmoji[currentQ.visualType || 'apples'] || '🍎';
    const countA = currentQ.visualCountA ?? 4;
    const countB = currentQ.visualCountB;
    const operator = currentQ.visualOperator;

    if (currentQ.visualType === 'clock') {
      const hour = currentQ.clockHour ?? 3;
      const minute = currentQ.clockMinute ?? 0;
      return (
        <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
          <div className="relative w-36 h-36 bg-white rounded-full border-4 border-amber-800 shadow-inner flex items-center justify-center">
            {/* Clock numbers 1-12 */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = Math.sin(angle) * 50;
              const y = -Math.cos(angle) * 50;
              return (
                <div
                  key={num}
                  className="absolute text-xs font-black text-amber-950 font-mono"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  {num}
                </div>
              );
            })}
            {/* Center dot */}
            <div className="w-3 h-3 bg-rose-600 rounded-full z-20" />
            {/* Hour hand */}
            <div
              className="absolute w-1.5 h-10 bg-amber-950 rounded-full origin-bottom z-10"
              style={{
                transform: `rotate(${(hour % 12) * 30 + (minute / 60) * 30}deg) translateY(-50%)`,
              }}
            />
            {/* Minute hand */}
            <div
              className="absolute w-1 h-14 bg-sky-600 rounded-full origin-bottom z-10"
              style={{
                transform: `rotate(${minute * 6}deg) translateY(-50%)`,
              }}
            />
          </div>
          <div className="mt-3 text-xs text-amber-900 font-bold bg-white px-3 py-1 rounded-full border border-amber-300">
            短いはり（じかん）: {hour} / 長いはり（ふん）: {minute}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200">
        <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
          <span>🖐️ さわって かぞえてみよう！</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Group A */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-white rounded-xl border border-amber-200 shadow-sm min-w-[120px]">
            {Array.from({ length: countA }).map((_, i) => (
              <motion.button
                key={`a-${i}`}
                type="button"
                whileTap={{ scale: 0.8 }}
                onClick={() => soundEffects.playPop()}
                className="text-2xl sm:text-3xl hover:scale-110 transition cursor-pointer select-none"
              >
                {emoji}
              </motion.button>
            ))}
          </div>

          {/* Operator */}
          {operator && (
            <div className="text-2xl font-black text-amber-800 bg-amber-200 w-9 h-9 rounded-full flex items-center justify-center shadow-inner">
              {operator}
            </div>
          )}

          {/* Group B */}
          {countB !== undefined && (
            <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-white rounded-xl border border-amber-200 shadow-sm min-w-[120px]">
              {Array.from({ length: countB }).map((_, i) => (
                <motion.button
                  key={`b-${i}`}
                  type="button"
                  whileTap={{ scale: 0.8 }}
                  onClick={() => soundEffects.playPop()}
                  className="text-2xl sm:text-3xl hover:scale-110 transition cursor-pointer select-none"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Companion Bar with Speech */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-sky-500/10 p-4 rounded-3xl border-2 border-amber-200 flex items-center justify-between gap-4">
        <CompanionAvatar
          companion={companion}
          speechText={companionFeedback}
          expression={isCorrect ? 'happy' : showHint ? 'thinking' : 'talking'}
          voiceEnabled={voiceEnabled}
        />

        {/* AI Custom Problem Generator Bar & Adventure Link */}
        <div className="flex items-center gap-2">
          {onSwitchToAdventure && (
            <button
              type="button"
              onClick={onSwitchToAdventure}
              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-stone-950 font-black text-xs rounded-xl shadow border border-amber-400 transition active:scale-95 whitespace-nowrap"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>⚔️ ぼうけんモードへ</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 bg-white/80 p-2 rounded-2xl border border-amber-200 shadow-sm">
            <span className="text-xs font-bold text-neutral-600">好きなテーマ:</span>
            <select
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              className="text-xs font-bold bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-1 text-amber-950 outline-none cursor-pointer"
            >
              <option value="animals">どうぶつ 🐱</option>
              <option value="dinosaurs">きょうりゅう 🦖</option>
              <option value="sweets">おかし・ケーキ 🍰</option>
              <option value="trains">でんしゃ・くるま 🚅</option>
              <option value="space">うちゅう・ロケット 🚀</option>
            </select>

            <button
              id="ai-generate-math-btn"
              type="button"
              onClick={handleGenerateAIProblem}
              disabled={isGeneratingAI}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-extrabold text-xs shadow transition active:scale-95 disabled:opacity-50"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? 'さくせい中...' : 'AIで問題をつくる'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200 space-y-6"
      >
        {/* Question Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-full border border-emerald-300">
              しょうがく {grade}ねんせい
            </span>
            <h2 className="font-extrabold text-lg sm:text-xl text-neutral-800">{currentQ.title}</h2>
          </div>

          <button
            type="button"
            onClick={() => {
              if (voiceEnabled) {
                speech.speak(currentQ.questionText, {
                  pitch: companion.voicePitch,
                  rate: companion.voiceRate,
                });
              }
            }}
            className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full transition active:scale-95"
            title="もんだいを よみあげる"
          >
            <Volume2 className="w-4 h-4" />
            <span>よんでみる</span>
          </button>
        </div>

        {/* Question Content */}
        <div className="p-4 sm:p-6 bg-amber-50/50 rounded-2xl border-2 border-amber-100 text-base sm:text-xl font-bold text-neutral-800 leading-relaxed">
          {currentQ.questionText}
          {currentQ.formula && (
            <div className="mt-3 text-2xl sm:text-3xl font-black text-amber-800 tracking-wider">
              {currentQ.formula}
            </div>
          )}
        </div>

        {/* Visual Count Manipulatives */}
        {renderVisualManipulative()}

        {/* Answer Options Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-neutral-500">こたえを えらんでね:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {currentQ.options.map((option) => (
              <button
                key={option}
                id={`math-opt-${option}`}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`py-4 sm:py-5 px-3 rounded-2xl font-black text-lg sm:text-2xl transition transform active:scale-95 border-3 shadow-md flex items-center justify-center ${
                  selectedAnswer === option
                    ? isEvaluated
                      ? isCorrect
                        ? 'bg-emerald-500 border-emerald-700 text-white scale-105 shadow-emerald-200'
                        : 'bg-rose-500 border-rose-700 text-white'
                      : 'bg-amber-400 border-amber-600 text-amber-950 scale-105 ring-4 ring-amber-300'
                    : 'bg-neutral-50 hover:bg-amber-100/60 border-neutral-200 text-neutral-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Check / Hint / Next */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-neutral-100">
          <button
            type="button"
            onClick={() => {
              soundEffects.playHint();
              setShowHint(!showHint);
              if (!showHint && voiceEnabled) {
                speech.speak(`ヒントだよ！ ${currentQ.hint}`, {
                  pitch: companion.voicePitch,
                  rate: companion.voiceRate,
                });
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 border border-yellow-300"
          >
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            <span>{showHint ? 'ヒントを かくす' : 'ヒントを みる'}</span>
          </button>

          <div className="flex items-center gap-3">
            {!isEvaluated ? (
              <button
                id="check-math-btn"
                type="button"
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-black text-sm sm:text-base shadow-lg transition active:scale-95 disabled:opacity-40"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>こたえあわせ！</span>
              </button>
            ) : (
              <button
                id="next-math-btn"
                type="button"
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm sm:text-base shadow-lg transition active:scale-95 animate-bounce-gentle"
              >
                <span>つぎの もんだいへ！</span>
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Hint Box */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-300 text-yellow-900 text-sm font-medium"
            >
              <div className="font-bold flex items-center gap-1.5 mb-1 text-yellow-800">
                <Lightbulb className="w-4 h-4" />
                <span>ルナ＆ピコの ヒント:</span>
              </div>
              <p>{currentQ.hint}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
