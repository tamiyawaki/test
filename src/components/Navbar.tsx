import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Languages,
  PenTool,
  Award,
  Users,
  TreePine,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { GradeLevel, CompanionId, MainTab } from '../types';
import { COMPANIONS } from '../data/characters';
import { soundEffects } from '../utils/soundEffects';

interface NavbarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  selectedCompanionId: CompanionId;
  onSelectCompanion: (id: CompanionId) => void;
  stars: number;
  showFurigana: boolean;
  onToggleFurigana: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenScratchpad: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedGrade,
  onSelectGrade,
  selectedCompanionId,
  onSelectCompanion,
  stars,
  showFurigana,
  onToggleFurigana,
  voiceEnabled,
  onToggleVoice,
  onOpenScratchpad,
}) => {
  const [showCompanionMenu, setShowCompanionMenu] = React.useState(false);
  const currentCompanion = COMPANIONS[selectedCompanionId] || COMPANIONS.poko;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: App Logo & Mascot */}
        <div className="flex items-center gap-3">
          <button
            id="nav-logo-btn"
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onSelectTab('home');
            }}
            className="flex items-center gap-2 text-left group transition active:scale-95"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:bg-emerald-600 transition">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-emerald-900 tracking-tight">
                  わくわく まなびの もり
                </span>
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-300 hidden md:inline">
                  AI知育
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium hidden sm:block">
                しょうがっこう ていがくねんの AIたいわ アプリ
              </p>
            </div>
          </button>

          {/* Grade Selector Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-emerald-50/80 p-1 rounded-2xl border border-emerald-200">
            {([1, 2, 3] as GradeLevel[]).map((g) => (
              <button
                key={g}
                id={`grade-pill-${g}`}
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  onSelectGrade(g);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedGrade === g
                    ? 'bg-emerald-600 text-white shadow-sm scale-105'
                    : 'text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {g}ねんせい
              </button>
            ))}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Grade Selector on Mobile */}
          <div className="lg:hidden">
            <select
              value={selectedGrade}
              onChange={(e) => {
                soundEffects.playPop();
                onSelectGrade(Number(e.target.value) as GradeLevel);
              }}
              className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl px-2 py-1.5 outline-none cursor-pointer"
            >
              <option value={1}>1ねん</option>
              <option value={2}>2ねん</option>
              <option value={3}>3ねん</option>
            </select>
          </div>

          {/* Active Companion Switcher */}
          <div className="relative">
            <button
              id="companion-switch-btn"
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setShowCompanionMenu(!showCompanionMenu);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-2xl transition active:scale-95 text-xs font-bold text-amber-900 shadow-sm"
              title="あいぼうを えらぶ"
            >
              <span className="text-base">
                {selectedCompanionId === 'poko'
                  ? '🦝'
                  : selectedCompanionId === 'luna'
                  ? '🦉'
                  : selectedCompanionId === 'piko'
                  ? '🤖'
                  : '🦇'}
              </span>
              <span className="hidden sm:inline">{currentCompanion.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-amber-700" />
            </button>

            {/* Companion Dropdown Menu */}
            {showCompanionMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl p-2 shadow-xl border-2 border-amber-200 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-bold text-neutral-500 px-2 py-1">あいぼうを えらぶ</div>
                {Object.values(COMPANIONS).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      onSelectCompanion(c.id as CompanionId);
                      setShowCompanionMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition ${
                      selectedCompanionId === c.id
                        ? 'bg-amber-100 text-amber-950 font-bold'
                        : 'hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <span className="text-xl">
                      {c.id === 'poko' ? '🦝' : c.id === 'luna' ? '🦉' : c.id === 'piko' ? '🤖' : '🦇'}
                    </span>
                    <div>
                      <div className="text-xs font-bold">{c.name}</div>
                      <div className="text-[10px] text-neutral-500">{c.species}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Star Counter */}
          <motion.div
            key={stars}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-xs sm:text-sm rounded-2xl shadow-sm border border-amber-500 select-none cursor-pointer"
            onClick={() => {
              soundEffects.playSparkle();
              onSelectTab('stickers');
            }}
            title="あつめた スター（シール帳をひらく）"
          >
            <Sparkles className="w-4 h-4 text-amber-900 fill-amber-900 animate-spin-slow" />
            <span>{stars}</span>
          </motion.div>

          {/* Furigana Toggle */}
          <button
            id="furigana-toggle-btn"
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onToggleFurigana();
            }}
            className={`p-2 rounded-2xl border transition active:scale-95 text-xs font-bold flex items-center gap-1 ${
              showFurigana
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-neutral-100 border-neutral-300 text-neutral-400'
            }`}
            title={showFurigana ? 'ふりがな: あり' : 'ふりがな: なし'}
          >
            <Languages className="w-4 h-4" />
            <span className="hidden md:inline">{showFurigana ? 'ふりがな ON' : 'OFF'}</span>
          </button>

          {/* Voice Sound Toggle */}
          <button
            id="voice-toggle-btn"
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onToggleVoice();
            }}
            className={`p-2 rounded-2xl border transition active:scale-95 ${
              voiceEnabled
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-neutral-100 border-neutral-300 text-neutral-400'
            }`}
            title={voiceEnabled ? 'よみあげ おんせい: ON' : 'おんせい: OFF'}
            aria-label="おんせい きりかえ"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Blackboard / Scratchpad Button */}
          <button
            id="open-scratchpad-btn"
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onOpenScratchpad();
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-amber-300 rounded-2xl font-bold text-xs shadow-sm transition active:scale-95 border border-slate-700"
            title="けいさん メモ・こくばん"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">こくばん</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="bg-emerald-600 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto py-1.5 no-scrollbar">
          {[
            { id: 'home', label: '🏠 もり', short: 'もり' },
            { id: 'adventure', label: '⚔️ ぼうけん (生成UI)', short: '⚔️ぼうけん' },
            { id: 'math', label: '🔢 さんすう', short: 'さんすう' },
            { id: 'japanese', label: '📚 こくご', short: 'こくご' },
            { id: 'curiosity', label: '🔍 なぜなぜ', short: 'なぜなぜ' },
            { id: 'story', label: '📖 おはなし', short: 'おはなし' },
            { id: 'stickers', label: '🌟 シール帳', short: 'シール' },
            { id: 'parent-report', label: '👨‍👩‍👧 おうちのひと', short: 'レポート' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              type="button"
              onClick={() => {
                soundEffects.playPop();
                onSelectTab(tab.id as MainTab);
              }}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1 ${
                currentTab === tab.id
                  ? tab.id === 'adventure'
                    ? 'bg-amber-400 text-stone-950 shadow-lg ring-2 ring-yellow-300 scale-105'
                    : 'bg-white text-emerald-900 shadow-md scale-105'
                  : tab.id === 'adventure'
                  ? 'bg-amber-500/30 text-yellow-200 hover:bg-amber-500/50 border border-amber-400/40'
                  : 'text-emerald-100 hover:bg-emerald-700/80'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
