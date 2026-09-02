import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Swords,
  Shield,
  Sparkles,
  MapPin,
  Compass,
  Trophy,
  Heart,
  Zap,
  Volume2,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Wand2,
  Award,
  ChevronRight,
  Package,
  Layers,
  Flame,
  CheckCircle2,
  Send,
} from 'lucide-react';
import {
  GradeLevel,
  Companion,
  AdventureQuest,
  AdventureWorldId,
  AdventureLootItem,
  UserProgress,
} from '../../types';
import {
  ADVENTURE_WORLDS,
  PRESET_ADVENTURE_QUESTS,
  PRESET_ADVENTURE_LOOT,
} from '../../data/adventureQuests';
import { CompanionAvatar } from '../CompanionAvatar';
import { GenerativeUIQuestRenderer } from './GenerativeUIQuestRenderer';
import { speech } from '../../utils/speech';
import { soundEffects } from '../../utils/soundEffects';

interface AdventureLabProps {
  grade: GradeLevel;
  companion: Companion;
  voiceEnabled: boolean;
  userProgress: UserProgress;
  onEarnStars: (amount: number, question: string, isCorrect: boolean) => void;
  onOpenScratchpad: () => void;
}

export const AdventureLab: React.FC<AdventureLabProps> = ({
  grade,
  companion,
  voiceEnabled,
  userProgress,
  onEarnStars,
  onOpenScratchpad,
}) => {
  const [selectedWorldId, setSelectedWorldId] = useState<AdventureWorldId>('forest');
  const [questIndex, setQuestIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showCustomAIModal, setShowCustomAIModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGeneratingQuest, setIsGeneratingQuest] = useState(false);
  const [dynamicQuests, setDynamicQuests] = useState<AdventureQuest[]>(PRESET_ADVENTURE_QUESTS);

  // Filter quests for active world & grade
  const worldQuests = dynamicQuests.filter(
    (q) => q.worldId === selectedWorldId
  );
  const activeQuests = worldQuests.length > 0 ? worldQuests : dynamicQuests;
  const currentQuest: AdventureQuest =
    activeQuests[questIndex % activeQuests.length] || PRESET_ADVENTURE_QUESTS[0];

  // RPG Player stats derived from progress
  const playerLevel = Math.max(1, Math.floor((userProgress.stars || 8) / 10) + 1);
  const playerExp = (userProgress.stars || 8) % 10;
  const playerHp = isEvaluated && !isCorrect ? 80 : 100;

  const currentWorld = ADVENTURE_WORLDS[selectedWorldId] || ADVENTURE_WORLDS.forest;

  const handleSelectAnswer = (ans: string) => {
    setSelectedAnswer(ans);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer && selectedAnswer !== '0') {
      soundEffects.playHint();
      return;
    }

    const normUser = String(selectedAnswer).trim().toLowerCase();
    const normCorrect = String(currentQuest.correctAnswer).trim().toLowerCase();
    const correct = normUser === normCorrect || normUser.includes(normCorrect);

    setIsEvaluated(true);
    setIsCorrect(correct);

    if (correct) {
      soundEffects.playFanfare();
      soundEffects.playCorrect();
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
      onEarnStars(currentQuest.rewards.stars, `[冒険] ${currentQuest.title}`, true);

      if (voiceEnabled) {
        speech.speak(`${currentQuest.loreExplanation} ${currentQuest.encouragement}`, {
          pitch: companion.voicePitch,
          rate: companion.voiceRate,
        });
      }
    } else {
      soundEffects.playHint();
      setShowHint(true);
      onEarnStars(1, `[冒険] ${currentQuest.title}`, false);

      if (voiceEnabled) {
        speech.speak(`惜しい冒険者よ！ ${currentQuest.hint}`, {
          pitch: companion.voicePitch,
          rate: companion.voiceRate,
        });
      }
    }
  };

  const handleNextQuest = () => {
    soundEffects.playPop();
    setSelectedAnswer(null);
    setIsEvaluated(false);
    setIsCorrect(false);
    setShowHint(false);
    setQuestIndex((prev) => prev + 1);
  };

  // Generate Custom AI Adventure Quest
  const handleGenerateCustomQuest = async () => {
    if (!customPrompt.trim()) return;
    soundEffects.playSparkle();
    setIsGeneratingQuest(true);

    try {
      const res = await fetch('/api/ai/adventure-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          companionId: companion.id,
          worldId: selectedWorldId,
          themeIdea: customPrompt,
        }),
      });

      const newQuest: AdventureQuest = await res.json();
      if (newQuest && newQuest.title) {
        setDynamicQuests((prev) => [newQuest, ...prev]);
        setQuestIndex(0);
        setShowCustomAIModal(false);
        setCustomPrompt('');
        soundEffects.playFanfare();
      }
    } catch (e) {
      console.error('Quest generation failed:', e);
      // Fallback
      setShowCustomAIModal(false);
    } finally {
      setIsGeneratingQuest(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-8">
      {/* 1. Adventure Top Banner & RPG Party Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border-3 border-amber-500/60 p-4 sm:p-5 shadow-2xl text-white relative overflow-hidden">
        {/* Shimmering Ambient Light */}
        <div className="absolute -top-10 right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          {/* Player & Companion RPG Avatar Box */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 p-1 flex items-center justify-center shadow-lg relative">
              <CompanionAvatar
                companion={companion}
                size="md"
                expression={isEvaluated ? (isCorrect ? 'cheering' : 'thinking') : 'happy'}
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow">
                Lv.{playerLevel}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-1.5">
                  <Swords className="w-5 h-5 text-amber-400" />
                  生成UI 冒険クエスト
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-800 border border-indigo-400 text-cyan-200">
                  {currentWorld.name}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <span>相棒: <strong className="text-amber-200">{companion.name}</strong></span>
                <span>•</span>
                <span>ステージ: <strong className="text-yellow-300">{currentQuest.stageNumber} / {currentQuest.totalStages}</strong></span>
              </p>
            </div>
          </div>

          {/* RPG HUD Meters */}
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* HP Meter */}
            <div className="flex items-center gap-1.5 bg-stone-900/80 px-3 py-1.5 rounded-xl border border-rose-500/40">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <div className="text-left">
                <div className="text-[10px] text-rose-300 font-bold">ぼうけんHP</div>
                <div className="w-16 h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-amber-400" style={{ width: `${playerHp}%` }} />
                </div>
              </div>
            </div>

            {/* EXP Meter */}
            <div className="flex items-center gap-1.5 bg-stone-900/80 px-3 py-1.5 rounded-xl border border-cyan-500/40">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <div className="text-left">
                <div className="text-[10px] text-cyan-300 font-bold">EXP: {playerExp}/10</div>
                <div className="w-16 h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400" style={{ width: `${playerExp * 10}%` }} />
                </div>
              </div>
            </div>

            {/* AI Custom Quest Trigger */}
            <button
              type="button"
              onClick={() => setShowCustomAIModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 whitespace-nowrap"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI冒険作成</span>
            </button>
          </div>
        </div>

        {/* 2. World Selection Bar */}
        <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-amber-300/80 shrink-0 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> ワールド選択:
          </span>
          {Object.values(ADVENTURE_WORLDS).map((world) => {
            const isSelected = selectedWorldId === world.id;
            return (
              <button
                key={world.id}
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setSelectedWorldId(world.id);
                  setQuestIndex(0);
                  setIsEvaluated(false);
                  setSelectedAnswer(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-300 scale-105'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-slate-200 border border-slate-700'
                }`}
              >
                <span>{world.icon}</span>
                <span>{world.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Adventure Arena (Narrative + Generative UI Question) */}
      <div className="bg-slate-900/95 rounded-3xl border-3 border-slate-700 shadow-2xl p-4 sm:p-6 text-white relative">
        {/* Quest Story Banner */}
        <div className="bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-slate-900 p-4 rounded-2xl border-2 border-indigo-500/40 mb-5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
              <span>{currentWorld.icon}</span>
              <span>{currentQuest.title}</span>
            </span>
            {currentQuest.isBossStage && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                👑 BOSS STAGE
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {currentQuest.storyIntro}
          </p>

          {/* Question Prompt */}
          <div className="mt-3 p-3 bg-stone-950/80 rounded-xl border border-amber-400/40 flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <div className="text-sm sm:text-base font-black text-yellow-300 leading-snug">
              {currentQuest.questionPrompt}
            </div>
          </div>
        </div>

        {/* 4. Active Companion Bubble in Quest */}
        <div className="flex items-center gap-3 p-3 bg-indigo-900/40 rounded-2xl border border-indigo-400/30 mb-5">
          <div className="w-10 h-10 shrink-0">
            <CompanionAvatar companion={companion} size="sm" />
          </div>
          <div className="flex-1 text-xs text-indigo-100 font-medium">
            <strong className="text-amber-300 mr-1">{companion.name}:</strong>
            <span>
              {isEvaluated
                ? isCorrect
                  ? currentQuest.encouragement
                  : `おしい！ ヒント: ${currentQuest.hint}`
                : companion.catchphrase}
            </span>
          </div>
          {voiceEnabled && (
            <button
              type="button"
              onClick={() => {
                speech.speak(`${currentQuest.questionPrompt} ${companion.catchphrase}`, {
                  pitch: companion.voicePitch,
                  rate: companion.voiceRate,
                });
              }}
              className="p-2 bg-indigo-800 hover:bg-indigo-700 text-yellow-300 rounded-xl cursor-pointer"
              title="音声を再生"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 5. Live Generative UI Question Canvas */}
        <div className="my-4">
          <GenerativeUIQuestRenderer
            quest={currentQuest}
            isEvaluated={isEvaluated}
            isCorrect={isCorrect}
            onSelectAnswer={handleSelectAnswer}
          />
        </div>

        {/* 6. Evaluation & Feedback Result Card */}
        <AnimatePresence>
          {isEvaluated && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-2xl border-2 mb-4 ${
                isCorrect
                  ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100'
                  : 'bg-rose-950/90 border-rose-400 text-rose-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-base flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-yellow-300 animate-bounce" />
                      <span>✨ クエストクリア！ 大大大勝利！💮</span>
                    </>
                  ) : (
                    <span>💥 おしい！ もう一度 パワーをチャージしよう！</span>
                  )}
                </span>
                <span className="text-xs font-bold text-yellow-300">
                  +{isCorrect ? currentQuest.rewards.stars : 1} スター獲得！
                </span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed mb-3">
                {currentQuest.loreExplanation}
              </p>

              {/* Artifact Loot Drop Display */}
              {isCorrect && currentQuest.rewards.lootItem && (
                <div className="flex items-center gap-3 p-2.5 bg-stone-950/70 rounded-xl border border-yellow-400/50 my-2">
                  <span className="text-3xl">{currentQuest.rewards.lootItem.icon}</span>
                  <div>
                    <div className="text-xs font-black text-yellow-300 flex items-center gap-1">
                      <span>お宝ドロップ:</span>
                      <span>{currentQuest.rewards.lootItem.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {currentQuest.rewards.lootItem.description}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 7. Action Control Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {/* Hint Button */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playHint();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold border border-amber-500/40 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>ヒント</span>
            </button>

            {/* Scratchpad Button */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                onOpenScratchpad();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-cyan-300 text-xs font-bold border border-cyan-500/40 cursor-pointer"
            >
              <span>📝 メモ用紙</span>
            </button>
          </div>

          {/* Main Action Submit / Next Button */}
          {!isEvaluated ? (
            <button
              type="button"
              onClick={handleCheckAnswer}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-stone-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 cursor-pointer transition-all"
            >
              <Zap className="w-5 h-5 fill-stone-950" />
              <span>⚡ 解答を放つ！ (Cast Spell)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuest}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-stone-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 cursor-pointer transition-all"
            >
              <span>つぎの クエストへ進む</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Hint Box */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 bg-amber-950/70 border border-amber-400/50 rounded-xl text-amber-200 text-xs flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4 text-yellow-300 shrink-0" />
            <span>{currentQuest.hint}</span>
          </motion.div>
        )}
      </div>

      {/* 8. AI Custom Quest Modal */}
      <AnimatePresence>
        {showCustomAIModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-3 border-amber-500 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-amber-400 animate-spin" />
                  <h3 className="font-black text-lg text-amber-300">
                    AIと オリジナル冒険クエストを創る
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomAIModal(false)}
                  className="text-stone-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                どんな 冒険や パズルに 挑戦したいか 教えてね！ AIが その場で 特製の 生成UIパズル（宝箱、天秤、飛び石、魔法調合など）を 作成するよ！
              </p>

              {/* Sample Quick Ideas */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {['恐竜の火山で 算数バトル！', '星空の時計パズル', '海賊の宝箱の 漢字暗号', '不思議な お菓子の ポーション'].map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setCustomPrompt(idea)}
                    className="text-[11px] px-2.5 py-1 bg-stone-800 hover:bg-stone-700 rounded-full text-amber-200 border border-stone-600"
                  >
                    {idea}
                  </button>
                ))}
              </div>

              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="例: コウモリの コウと いっしょに 月の裏側で 星座の時計合わせをしたい！"
                rows={3}
                className="w-full bg-stone-950 border border-amber-500/50 rounded-2xl p-3 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomAIModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  disabled={isGeneratingQuest || !customPrompt.trim()}
                  onClick={handleGenerateCustomQuest}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs rounded-xl shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingQuest ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>AIが 冒険を生成中...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>冒険ワールドを生成する！</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
