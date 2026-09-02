import React from 'react';
import { motion } from 'motion/react';
import {
  TreePine,
  Sparkles,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  Wand2,
  ChevronRight,
  Flame,
  Swords,
  Compass,
} from 'lucide-react';
import { GradeLevel, Companion, MainTab } from '../types';
import { CompanionAvatar } from './CompanionAvatar';
import { soundEffects } from '../utils/soundEffects';

interface HomeHubProps {
  grade: GradeLevel;
  companion: Companion;
  stars: number;
  voiceEnabled: boolean;
  onSelectTab: (tab: MainTab) => void;
  onOpenScratchpad: () => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({
  grade,
  companion,
  stars,
  voiceEnabled,
  onSelectTab,
  onOpenScratchpad,
}) => {
  const GREETINGS: Record<number, string> = {
    1: `${companion.greeting}`,
    2: `こんにちは！ 2ねんせいのみんな、かけ算九九や 漢字の冒険に いっしょに出発しよう！ ${companion.catchphrase}`,
    3: `ようこそ！ 3ねんせいのみんな、算数のパズルや『なぜなぜ探検』で 新しい発見をしよう！ ${companion.catchphrase}`,
  };

  const PORTALS = [
    {
      tab: 'adventure' as MainTab,
      title: '⚔️ 生成UI ぼうけんクエスト',
      subtitle: '宝箱・天秤・飛び石・魔法チャージ',
      description: '問題画面がRPGの世界に大変身！ ダイヤルを回して宝箱を開けたり、水晶の天秤でバランスを取ろう！',
      bgGradient: 'from-amber-500 to-yellow-600',
      cardBg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 hover:from-amber-100 hover:to-yellow-100 border-amber-400 ring-2 ring-amber-300/50',
      badgeBg: 'bg-amber-400 text-stone-950 font-black',
      icon: '⚔️',
    },
    {
      tab: 'math' as MainTab,
      title: '🔢 さんすうの まほう',
      subtitle: 'かず・たしざん・ひきざん・とけい・九九',
      description: 'りんごを さわって 数えたり、時計の針を 動かして 楽しく学ぼう！',
      bgGradient: 'from-amber-400 to-orange-500',
      cardBg: 'bg-orange-50 hover:bg-orange-100/80 border-orange-300',
      badgeBg: 'bg-orange-200 text-orange-900',
      icon: '🍎',
    },
    {
      tab: 'japanese' as MainTab,
      title: '📚 こくごの だいぼうけん',
      subtitle: 'かんじ・ことば・ぶんづくり・AIしりとり',
      description: '言葉のブロックを つなげて文を作ったり、AIと しりとりバトル！',
      bgGradient: 'from-purple-500 to-indigo-600',
      cardBg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-300',
      badgeBg: 'bg-purple-200 text-purple-900',
      icon: '📖',
    },
    {
      tab: 'curiosity' as MainTab,
      title: '🔍 なぜなぜ たんけんたい',
      subtitle: '空の青さ・動物のひみつ・宇宙のなぞ',
      description: '「なんで空は青いの？」「どうして鳥は飛べる？」を AI博士に 聞いてみよう！',
      bgGradient: 'from-teal-400 to-emerald-600',
      cardBg: 'bg-teal-50 hover:bg-teal-100/80 border-teal-300',
      badgeBg: 'bg-teal-200 text-teal-900',
      icon: '🌟',
    },
    {
      tab: 'story' as MainTab,
      title: '📖 おはなし メーカー',
      subtitle: 'AIと つくろう！ あなただけの えほん',
      description: 'すきな 主人公と アイテムを えらぶと、AIが 楽しい絵本を 作ってくれるよ！',
      bgGradient: 'from-pink-400 to-rose-500',
      cardBg: 'bg-pink-50 hover:bg-pink-100/80 border-pink-300',
      badgeBg: 'bg-pink-200 text-pink-900',
      icon: '🎨',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Hero Mascot Welcome Area */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden"
      >
        {/* Background decorative forest elements */}
        <div className="absolute -right-8 -bottom-8 text-emerald-400/20 text-9xl select-none pointer-events-none">
          🌲
        </div>
        <div className="absolute right-24 top-2 text-yellow-300/30 text-5xl select-none pointer-events-none animate-pulse">
          ✨
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>しょうがく {grade}ねんせい モード</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              どきどき まなびの もりへ ようこそ！
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm font-medium max-w-lg">
              AIの ともだちと いっしょに、おしゃべりしながら 算数や国語を たのしく 学ぼう！
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSparkle();
                  onSelectTab('adventure');
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-stone-950 font-black text-xs sm:text-sm rounded-xl shadow-lg ring-2 ring-yellow-200 transition active:scale-95 flex items-center gap-1.5"
              >
                <Swords className="w-4 h-4 text-stone-950" />
                <span>⚔️ ぼうけんクエスト (生成UI)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  onSelectTab('math');
                }}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm rounded-xl backdrop-blur-sm border border-white/40 transition active:scale-95 flex items-center gap-1"
              >
                <span>算数を はじめる</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  onSelectTab('japanese');
                }}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm rounded-xl backdrop-blur-sm border border-white/40 transition active:scale-95 flex items-center gap-1"
              >
                <span>国語を はじめる</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Companion Avatar Hero */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-3xl border border-white/20">
            <CompanionAvatar
              companion={companion}
              speechText={GREETINGS[grade] || GREETINGS[1]}
              expression="happy"
              size="lg"
              voiceEnabled={voiceEnabled}
            />
          </div>
        </div>
      </motion.div>

      {/* Daily Quest / Goal Tracker */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-emerald-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-neutral-800">きょうの まなびミッション</div>
            <div className="text-xs text-neutral-500">もんだいを 3もん といて、シールを ゲットしよう！</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.playSparkle();
              onSelectTab('stickers');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition active:scale-95"
          >
            <Award className="w-4 h-4 text-amber-700" />
            <span>シール帳をみる ({stars} ⭐)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onOpenScratchpad();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold transition active:scale-95"
          >
            <span>こくばんを開く 🖍️</span>
          </button>
        </div>
      </div>

      {/* 4 Main Subject Portals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg text-neutral-800 flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-600" />
            <span>まなびの ゾーンを えらぼう！</span>
          </h2>
          <span className="text-xs text-neutral-400 font-bold">すきな ゾーンを タッチしてね</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {PORTALS.map((portal, idx) => (
            <motion.div
              key={portal.tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEffects.playPop();
                onSelectTab(portal.tab);
              }}
              className={`p-6 rounded-3xl border-3 shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 ${portal.cardBg}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-4xl sm:text-5xl">{portal.icon}</div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${portal.badgeBg}`}>
                  {portal.subtitle.split('・')[0]}
                </span>
              </div>

              <div>
                <h3 className="font-black text-xl text-neutral-900">{portal.title}</h3>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                  {portal.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-black text-neutral-800 border-t border-black/5">
                <span>あそびにいく！</span>
                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-neutral-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
