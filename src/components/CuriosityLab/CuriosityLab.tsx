import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Search,
  Sparkles,
  Volume2,
  Mic,
  Send,
  HelpCircle,
  FlaskConical,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { GradeLevel, Companion, CuriosityItem } from '../../types';
import { POPULAR_CURIOSITY_QUESTIONS } from '../../data/presetLessons';
import { CompanionAvatar } from '../CompanionAvatar';
import { speech } from '../../utils/speech';
import { soundEffects } from '../../utils/soundEffects';

interface CuriosityLabProps {
  grade: GradeLevel;
  companion: Companion;
  voiceEnabled: boolean;
  onEarnStars: (amount: number, question: string, isCorrect: boolean) => void;
}

export const CuriosityLab: React.FC<CuriosityLabProps> = ({
  grade,
  companion,
  voiceEnabled,
  onEarnStars,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState<CuriosityItem | null>(null);
  const [showMiniQuizAnswer, setShowMiniQuizAnswer] = useState(false);

  const handleAskQuestion = async (questionToAsk: string) => {
    const q = questionToAsk.trim();
    if (!q) return;

    soundEffects.playPop();
    setIsLoading(true);
    setCurrentItem(null);
    setShowMiniQuizAnswer(false);

    try {
      const res = await fetch('/api/ai/why-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, grade }),
      });
      const data = await res.json();
      if (data) {
        setCurrentItem(data);
        soundEffects.playFanfare();
        onEarnStars(3, `なぜなぜ探究: ${q}`, true);

        if (voiceEnabled && data.simpleAnswer) {
          speech.speak(`${data.simpleAnswer}。${data.storyExplanation}`, {
            pitch: companion.voicePitch,
            rate: companion.voiceRate,
          });
        }
      }
    } catch (e) {
      console.error('Curiosity question error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      speech.stopListening();
      setIsListening(false);
      return;
    }

    soundEffects.playPop();
    setIsListening(true);
    speech.startListening(
      (text) => {
        setInputText(text);
        setIsListening(false);
        handleAskQuestion(text);
      },
      () => setIsListening(false),
      (err) => {
        console.warn('Voice error:', err);
        setIsListening(false);
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Companion Greeting */}
      <div className="bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-indigo-500/10 p-4 rounded-3xl border-2 border-teal-200 flex items-center justify-between gap-4">
        <CompanionAvatar
          companion={companion}
          speechText="どんな『なんで？』『どうして？』でも きいてみてね！ いっしょに なぞを ときあかそうぽこ！🔍"
          expression="talking"
          voiceEnabled={voiceEnabled}
        />
      </div>

      {/* Main Search / Question Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-teal-200 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 text-teal-900 rounded-full font-bold text-xs">
            <Compass className="w-4 h-4 text-teal-700" />
            <span>なぜなぜ探検隊（AI科学・自然そうだんしつ）</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tracking-tight">
            ふしぎに 思うことを なんでも きいてみよう！
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            どうして空は青いの？ なぜ雨が降るの？ どうぶつや 宇宙のことも AIが やさしく おしえるよ！
          </p>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskQuestion(inputText);
              }}
              placeholder="しつもんを 入力してね（例: どうして ほしは ひかるの？）"
              className="w-full bg-teal-50/50 border-2 border-teal-300 rounded-2xl pl-11 pr-4 py-3.5 text-base font-bold text-neutral-800 outline-none focus:border-teal-500 focus:bg-white transition"
            />
            <Search className="w-5 h-5 text-teal-600 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-3.5 rounded-2xl border-2 transition active:scale-95 shadow-sm ${
              isListening
                ? 'bg-rose-500 border-rose-700 text-white animate-pulse'
                : 'bg-teal-100 border-teal-300 text-teal-900 hover:bg-teal-200'
            }`}
            title="こえで しつもん"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => handleAskQuestion(inputText)}
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl font-black text-sm shadow-md transition active:scale-95 disabled:opacity-40 flex items-center gap-2"
          >
            <span>しらべる</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Questions Grid */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-neutral-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>みんなが 気になっている なぜなぜ:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {POPULAR_CURIOSITY_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(item.question);
                  handleAskQuestion(item.question);
                }}
                className="flex items-center gap-3 p-3 bg-teal-50/60 hover:bg-teal-100 border border-teal-200 rounded-2xl text-left transition active:scale-98 group"
              >
                <span className="text-2xl group-hover:scale-110 transition">{item.icon}</span>
                <div>
                  <div className="text-xs font-bold text-teal-950">{item.question}</div>
                  <div className="text-[10px] text-teal-700">{item.topic}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
            <p className="font-bold text-teal-900 text-sm">
              ルナはかせと ピコが ふしぎの こたえを さがしています...✨
            </p>
          </div>
        )}

        {/* Answer Exploration Card */}
        {currentItem && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-6 sm:p-8 bg-gradient-to-br from-teal-50 via-sky-50 to-white rounded-3xl border-3 border-teal-300 shadow-lg space-y-6"
          >
            {/* Header / Summary */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-3 py-1 bg-teal-200 text-teal-900 font-black text-xs rounded-full">
                  💡 なぞが とけたよ！
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-teal-950 mt-2">
                  {currentItem.topic}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (voiceEnabled) {
                    speech.speak(`${currentItem.simpleAnswer}。${currentItem.storyExplanation}`, {
                      pitch: companion.voicePitch,
                      rate: companion.voiceRate,
                    });
                  }
                }}
                className="flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-100 hover:bg-teal-200 px-3 py-1.5 rounded-full transition active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>よんでみる</span>
              </button>
            </div>

            {/* Quick Answer Banner */}
            <div className="p-4 bg-emerald-500 text-white rounded-2xl font-black text-base sm:text-lg shadow-sm">
              🌟 一言でいうと: {currentItem.simpleAnswer}
            </div>

            {/* Story / Detailed Explanation */}
            <div className="p-5 bg-white rounded-2xl border border-teal-200 shadow-inner text-neutral-800 text-base leading-relaxed whitespace-pre-line">
              {currentItem.storyExplanation}
            </div>

            {/* Try It At Home Box */}
            {currentItem.tryItIdea && (
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-amber-900">
                  <FlaskConical className="w-5 h-5 text-amber-700" />
                  <span>おうちでやってみよう！プチ観察・じっけん:</span>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">{currentItem.tryItIdea}</p>
              </div>
            )}

            {/* Mini Quiz */}
            {currentItem.miniQuiz && (
              <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200 space-y-2">
                <div className="text-xs font-bold text-indigo-900">❓ おもしろミニクイズ:</div>
                <div className="text-sm font-bold text-indigo-950">
                  {currentItem.miniQuiz.question}
                </div>

                {!showMiniQuizAnswer ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playCorrect();
                      setShowMiniQuizAnswer(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition active:scale-95"
                  >
                    こたえを みる！
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-white rounded-xl border border-indigo-300 text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>正解: {currentItem.miniQuiz.answer}</span>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
