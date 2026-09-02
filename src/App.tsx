/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GradeLevel,
  CompanionId,
  MainTab,
  UserProgress,
  LearningLog,
  Sticker,
} from './types';
import { COMPANIONS } from './data/characters';
import { INITIAL_STICKERS } from './data/stickers';
import { Navbar } from './components/Navbar';
import { HomeHub } from './components/HomeHub';
import { AdventureLab } from './components/Adventure/AdventureLab';
import { MathLab } from './components/MathLab/MathLab';
import { JapaneseLab } from './components/JapaneseLab/JapaneseLab';
import { CuriosityLab } from './components/CuriosityLab/CuriosityLab';
import { StoryMaker } from './components/StoryMaker/StoryMaker';
import { StickerBook } from './components/StickerBook/StickerBook';
import { ParentReport } from './components/ParentReport/ParentReport';
import { ScratchpadModal } from './components/ScratchpadModal';
import { soundEffects } from './utils/soundEffects';

const STORAGE_KEY = 'wakuwaku_learning_progress_v1';
const LOGS_STORAGE_KEY = 'wakuwaku_learning_logs_v1';

export default function App() {
  // State with LocalStorage Persistence
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load saved progress:', e);
      }
    }
    return {
      stars: 8,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedStickerIds: ['s_start', 's_star_1', 's_hiragana_hero'],
      totalQuestionsAnswered: 3,
      correctCount: 3,
      createdStoriesCount: 0,
      curiosityCount: 1,
      favoriteCompanion: 'poko',
      selectedGrade: 1,
      showFurigana: true,
      voiceEnabled: true,
    };
  });

  const [learningLogs, setLearningLogs] = useState<LearningLog[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOGS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load saved logs:', e);
      }
    }
    return [
      {
        id: 'init_1',
        timestamp: 'きょう 10:15',
        subject: 'math',
        topic: 'かずのかぞえっこ',
        question: 'りんごを かぞえよう（5こ）',
        isCorrect: true,
        starsEarned: 3,
        grade: 1,
      },
      {
        id: 'init_2',
        timestamp: 'きょう 10:20',
        subject: 'japanese',
        topic: '1年生のかんじ',
        question: '大きな【木】が たっている',
        isCorrect: true,
        starsEarned: 3,
        grade: 1,
      },
    ];
  });

  // Save Progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }, [progress]);

  // Save Logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(learningLogs));
    } catch (e) {
      console.warn('Failed to save logs:', e);
    }
  }, [learningLogs]);

  // Sound effects sync with voiceEnabled setting
  useEffect(() => {
    soundEffects.setEnabled(progress.voiceEnabled);
  }, [progress.voiceEnabled]);

  const activeCompanion = COMPANIONS[progress.favoriteCompanion] || COMPANIONS.poko;

  // Handler: Earn Stars and record learning log
  const handleEarnStars = (amount: number, question: string, isCorrect: boolean) => {
    const newStars = progress.stars + amount;
    const isStory = currentTab === 'story';
    const isCuriosity = currentTab === 'curiosity';

    // Check newly unlocked stickers
    const newUnlockedIds = [...progress.unlockedStickerIds];
    INITIAL_STICKERS.forEach((s) => {
      if (newStars >= s.requiredStars && !newUnlockedIds.includes(s.id)) {
        newUnlockedIds.push(s.id);
      }
    });

    setProgress((prev) => ({
      ...prev,
      stars: newStars,
      unlockedStickerIds: newUnlockedIds,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      createdStoriesCount: isStory ? prev.createdStoriesCount + 1 : prev.createdStoriesCount,
      curiosityCount: isCuriosity ? prev.curiosityCount + 1 : prev.curiosityCount,
    }));

    // Add log
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: LearningLog = {
      id: `log_${Date.now()}`,
      timestamp: `きょう ${timeStr}`,
      subject:
        currentTab === 'math'
          ? 'math'
          : currentTab === 'japanese'
          ? 'japanese'
          : currentTab === 'curiosity'
          ? 'curiosity'
          : 'story',
      topic: currentTab,
      question: question.slice(0, 40),
      isCorrect,
      starsEarned: amount,
      grade: progress.selectedGrade,
    };

    setLearningLogs((prev) => [newLog, ...prev]);
  };

  // Build current stickers list with unlocked flag computed
  const currentStickers: Sticker[] = INITIAL_STICKERS.map((s) => ({
    ...s,
    unlocked: progress.unlockedStickerIds.includes(s.id) || progress.stars >= s.requiredStars,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-emerald-50/30 to-amber-100/40 text-neutral-900 flex flex-col font-sans selection:bg-amber-300 selection:text-amber-950">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedGrade={progress.selectedGrade}
        onSelectGrade={(grade) => setProgress((prev) => ({ ...prev, selectedGrade: grade }))}
        selectedCompanionId={progress.favoriteCompanion}
        onSelectCompanion={(id) => setProgress((prev) => ({ ...prev, favoriteCompanion: id }))}
        stars={progress.stars}
        showFurigana={progress.showFurigana}
        onToggleFurigana={() => setProgress((prev) => ({ ...prev, showFurigana: !prev.showFurigana }))}
        voiceEnabled={progress.voiceEnabled}
        onToggleVoice={() => setProgress((prev) => ({ ...prev, voiceEnabled: !prev.voiceEnabled }))}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HomeHub
                grade={progress.selectedGrade}
                companion={activeCompanion}
                stars={progress.stars}
                voiceEnabled={progress.voiceEnabled}
                onSelectTab={setCurrentTab}
                onOpenScratchpad={() => setIsScratchpadOpen(true)}
              />
            </motion.div>
          )}

          {currentTab === 'adventure' && (
            <motion.div
              key="tab-adventure"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdventureLab
                grade={progress.selectedGrade}
                companion={activeCompanion}
                voiceEnabled={progress.voiceEnabled}
                userProgress={progress}
                onEarnStars={handleEarnStars}
                onOpenScratchpad={() => setIsScratchpadOpen(true)}
              />
            </motion.div>
          )}

          {currentTab === 'math' && (
            <motion.div
              key="tab-math"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MathLab
                grade={progress.selectedGrade}
                companion={activeCompanion}
                voiceEnabled={progress.voiceEnabled}
                onEarnStars={handleEarnStars}
                onSwitchToAdventure={() => setCurrentTab('adventure')}
              />
            </motion.div>
          )}

          {currentTab === 'japanese' && (
            <motion.div
              key="tab-japanese"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <JapaneseLab
                grade={progress.selectedGrade}
                companion={activeCompanion}
                voiceEnabled={progress.voiceEnabled}
                onEarnStars={handleEarnStars}
                onSwitchToAdventure={() => setCurrentTab('adventure')}
              />
            </motion.div>
          )}

          {currentTab === 'curiosity' && (
            <motion.div
              key="tab-curiosity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CuriosityLab
                grade={progress.selectedGrade}
                companion={activeCompanion}
                voiceEnabled={progress.voiceEnabled}
                onEarnStars={handleEarnStars}
              />
            </motion.div>
          )}

          {currentTab === 'story' && (
            <motion.div
              key="tab-story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StoryMaker
                grade={progress.selectedGrade}
                companion={activeCompanion}
                voiceEnabled={progress.voiceEnabled}
                onEarnStars={handleEarnStars}
              />
            </motion.div>
          )}

          {currentTab === 'stickers' && (
            <motion.div
              key="tab-stickers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StickerBook
                stickers={currentStickers}
                totalStars={progress.stars}
                companion={activeCompanion}
              />
            </motion.div>
          )}

          {currentTab === 'parent-report' && (
            <motion.div
              key="tab-report"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ParentReport
                progress={progress}
                learningLogs={learningLogs}
                grade={progress.selectedGrade}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Blackboard / Scratchpad Modal */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-200/80 bg-white/70 py-4 text-center text-xs text-neutral-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-800">わくわく まなびの もり</span>
            <span>小学校低学年向け AI知育Webアプリケーション</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setCurrentTab('parent-report');
              }}
              className="text-indigo-600 hover:underline font-bold"
            >
              おうちのひと向け レポート
            </button>
            <span>•</span>
            <span>AIキャラクター: ポコ 🦝 / ルナ 🦉 / ピコ 🤖</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
