import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  Volume2,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Award,
  RotateCcw,
} from 'lucide-react';
import { GradeLevel, Companion, CreatedStory, StoryScene } from '../../types';
import { CompanionAvatar } from '../CompanionAvatar';
import { speech } from '../../utils/speech';
import { soundEffects } from '../../utils/soundEffects';

interface StoryMakerProps {
  grade: GradeLevel;
  companion: Companion;
  voiceEnabled: boolean;
  onEarnStars: (amount: number, question: string, isCorrect: boolean) => void;
}

export const StoryMaker: React.FC<StoryMakerProps> = ({
  grade,
  companion,
  voiceEnabled,
  onEarnStars,
}) => {
  const [hero, setHero] = useState('うさぎの ピョンタ');
  const [setting, setSetting] = useState('お菓子のくに');
  const [magicItem, setMagicItem] = useState('そらとぶ ぼうし');
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState<CreatedStory | null>(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const HEROES = [
    { label: 'うさぎの ピョンタ', icon: '🐰' },
    { label: 'こどもの 恐竜 ガオくん', icon: '🦖' },
    { label: '空飛ぶ ロボット ピピ', icon: '🤖' },
    { label: '元気な 小学生の ぼく/わたし', icon: '🎒' },
    { label: 'まほうつかいの ネコ', icon: '🐱' },
  ];

  const SETTINGS = [
    { label: 'お菓子のくに 🍰', icon: '🍭' },
    { label: '雲の上の 空中王国 ☁️', icon: '🏰' },
    { label: 'きらきら 光る 深海 🌊', icon: '🐬' },
    { label: '星がいっぱいの 宇宙ステーション 🚀', icon: '🪐' },
    { label: 'ひみつの まほうのもり 🌲', icon: '🍄' },
  ];

  const ITEMS = [
    { label: 'そらとぶ ぼうし 🎩', icon: '✨' },
    { label: 'にじいろの ステッキ 🪄', icon: '🌈' },
    { label: 'なんでも わかる めがね 👓', icon: '🔍' },
    { label: 'ピカピカ ひかる 宝石 💎', icon: '⭐' },
    { label: 'どこでも ドア 🚪', icon: '🗝️' },
  ];

  const handleGenerateStory = async () => {
    soundEffects.playSparkle();
    setIsGenerating(true);
    setStory(null);
    setActiveSceneIndex(0);

    try {
      const res = await fetch('/api/ai/story-maker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero, setting, magicItem, grade }),
      });
      const data = await res.json();
      if (data && data.scenes) {
        const newStory: CreatedStory = {
          id: `story_${Date.now()}`,
          title: data.title || `${hero}の だいぼうけん`,
          hero,
          setting,
          magicItem,
          scenes: data.scenes,
          praiseMessage: data.praiseMessage || 'すてきな おはなしが 完成したぽこ！💮',
          createdAt: new Date().toLocaleDateString('ja-JP'),
        };
        setStory(newStory);
        soundEffects.playFanfare();
        try {
          confetti({ particleCount: 70, spread: 80 });
        } catch (e) {}

        onEarnStars(5, `えほん作成: ${newStory.title}`, true);

        if (voiceEnabled && newStory.scenes[0]) {
          speech.speak(
            `『${newStory.title}』。第1場面: ${newStory.scenes[0].sceneTitle}。${newStory.scenes[0].content}`,
            { pitch: companion.voicePitch, rate: companion.voiceRate }
          );
        }
      }
    } catch (e) {
      console.error('Story maker error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReadCurrentScene = () => {
    if (!story || !story.scenes[activeSceneIndex]) return;
    const sc = story.scenes[activeSceneIndex];
    speech.speak(`第${sc.sceneNumber}場面、${sc.sceneTitle}。${sc.content}`, {
      pitch: companion.voicePitch,
      rate: companion.voiceRate,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-indigo-500/10 p-4 rounded-3xl border-2 border-amber-200 flex items-center justify-between gap-4">
        <CompanionAvatar
          companion={companion}
          speechText="きみだけの 絵本を つくろう！ どんな 主人公で どんな 冒険にする？📖"
          expression="talking"
          voiceEnabled={voiceEnabled}
        />
      </div>

      {/* Creator Selection Area */}
      {!story && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full">
              🎨 AIえほんスタジオ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-800">
              ものがたりの たねを えらぼう！
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              すきな「主人公」「ばしょ」「まほうのアイテム」を タッチしてね！
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Hero */}
            <div className="p-4 bg-orange-50/70 rounded-2xl border-2 border-orange-200 space-y-3">
              <div className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>しゅじんこう（だれ？）</span>
              </div>
              <div className="space-y-1.5">
                {HEROES.map((h) => (
                  <button
                    key={h.label}
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      setHero(h.label);
                    }}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left font-bold text-xs transition ${
                      hero === h.label
                        ? 'bg-orange-500 text-white shadow-md scale-102'
                        : 'bg-white hover:bg-orange-100 text-neutral-800 border border-orange-200'
                    }`}
                  >
                    <span className="text-lg">{h.icon}</span>
                    <span>{h.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Setting */}
            <div className="p-4 bg-sky-50/70 rounded-2xl border-2 border-sky-200 space-y-3">
              <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-sky-500 text-white rounded-full flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>ばしょ（どこへいく？）</span>
              </div>
              <div className="space-y-1.5">
                {SETTINGS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      setSetting(s.label);
                    }}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left font-bold text-xs transition ${
                      setting === s.label
                        ? 'bg-sky-500 text-white shadow-md scale-102'
                        : 'bg-white hover:bg-sky-100 text-neutral-800 border border-sky-200'
                    }`}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Magic Item */}
            <div className="p-4 bg-purple-50/70 rounded-2xl border-2 border-purple-200 space-y-3">
              <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>アイテム（ひみつの道具）</span>
              </div>
              <div className="space-y-1.5">
                {ITEMS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      setMagicItem(item.label);
                    }}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left font-bold text-xs transition ${
                      magicItem === item.label
                        ? 'bg-purple-500 text-white shadow-md scale-102'
                        : 'bg-white hover:bg-purple-100 text-neutral-800 border border-purple-200'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center pt-2">
            <button
              id="generate-story-btn"
              type="button"
              onClick={handleGenerateStory}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl font-black text-base sm:text-lg shadow-xl transition active:scale-95 disabled:opacity-50"
            >
              <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'AIが 絵本を 書いています...' : '🌟 えほんを つくる！'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Generated Story Book View */}
      {story && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50/90 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-300 space-y-6"
        >
          {/* Story Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-200 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-800 bg-amber-200 px-3 py-1 rounded-full">
                📖 あなたのオリジナルえほん
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-serif mt-1">
                {story.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReadCurrentScene}
                className="flex items-center gap-1 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-2xl transition active:scale-95 shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>このページを よむ</span>
              </button>

              <button
                type="button"
                onClick={() => setStory(null)}
                className="flex items-center gap-1 px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs rounded-2xl transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>べつの話をつくる</span>
              </button>
            </div>
          </div>

          {/* Book Page Spread */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-inner border-2 border-amber-200 min-h-[280px] flex flex-col justify-between space-y-4 font-serif">
            <div>
              {/* Scene Badge & Title */}
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-3">
                <span className="bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  {story.scenes[activeSceneIndex]?.badge || `場面 ${activeSceneIndex + 1}`}
                </span>
                <span className="font-mono text-neutral-400">
                  {activeSceneIndex + 1} / {story.scenes.length} ページ
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-neutral-800 mb-4">
                {story.scenes[activeSceneIndex]?.sceneTitle}
              </h3>

              <p className="text-base sm:text-xl text-neutral-800 leading-loose tracking-wide">
                {story.scenes[activeSceneIndex]?.content}
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setActiveSceneIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={activeSceneIndex === 0}
                className="flex items-center gap-1 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 rounded-xl font-bold text-xs text-neutral-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>まえのページ</span>
              </button>

              <div className="flex items-center gap-2">
                {story.scenes.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      setActiveSceneIndex(i);
                    }}
                    className={`w-3 h-3 rounded-full transition ${
                      activeSceneIndex === i ? 'bg-amber-600 scale-125' : 'bg-neutral-300'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setActiveSceneIndex((prev) => Math.min(story.scenes.length - 1, prev + 1));
                }}
                disabled={activeSceneIndex === story.scenes.length - 1}
                className="flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-white rounded-xl font-bold text-xs transition"
              >
                <span>つぎのページ</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Praise & Award */}
          <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl border border-emerald-300 flex items-center justify-between gap-3 text-emerald-950 font-bold text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-700 shrink-0" />
              <span>{story.praiseMessage}</span>
            </div>
            <span className="bg-white px-3 py-1 rounded-full text-emerald-800 text-xs shadow-sm font-black shrink-0">
              ⭐ 5スターGET！
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
