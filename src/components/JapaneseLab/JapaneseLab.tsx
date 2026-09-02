import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  Volume2,
  Mic,
  Send,
  Lightbulb,
  CheckCircle2,
  Shuffle,
  Wand2,
  Swords,
} from 'lucide-react';
import { GradeLevel, Companion, JapaneseQuestion, JapaneseTopic } from '../../types';
import { PRESET_JAPANESE_QUESTIONS } from '../../data/presetLessons';
import { CompanionAvatar } from '../CompanionAvatar';
import { speech } from '../../utils/speech';
import { soundEffects } from '../../utils/soundEffects';

interface JapaneseLabProps {
  grade: GradeLevel;
  companion: Companion;
  voiceEnabled: boolean;
  onEarnStars: (amount: number, question: string, isCorrect: boolean) => void;
  onSwitchToAdventure?: () => void;
}

export const JapaneseLab: React.FC<JapaneseLabProps> = ({
  grade,
  companion,
  voiceEnabled,
  onEarnStars,
  onSwitchToAdventure,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'sentence' | 'shiritori'>('quiz');

  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [companionFeedback, setCompanionFeedback] = useState<string>(companion.greeting);

  // Sentence Builder State
  const [whoBlock, setWhoBlock] = useState('かわいい ネコちゃんが');
  const [whereBlock, setWhereBlock] = useState('にじの はしの うえで');
  const [whatBlock, setWhatBlock] = useState('たいやきを たべた！');
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isBuildingStory, setIsBuildingStory] = useState(false);

  // Shiritori State
  const [shiritoriHistory, setShiritoriHistory] = useState<Array<{ sender: 'ai' | 'user'; word: string; ruby?: string }>>([
    { sender: 'ai', word: 'りんご', ruby: 'りんご' },
  ]);
  const [userShiritoriInput, setUserShiritoriInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const gradePresetQuestions = PRESET_JAPANESE_QUESTIONS.filter((q) => q.grade === grade);
  const currentQ: JapaneseQuestion =
    gradePresetQuestions[currentIndex % gradePresetQuestions.length] || gradePresetQuestions[0];

  const handleSelectOption = (option: string) => {
    if (isEvaluated) return;
    soundEffects.playPop();
    setSelectedAnswer(option);
  };

  const handleCheckAnswer = () => {
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
      setCompanionFeedback(currentQ.encouragement || 'だいせいかい！ ことばの たつじんだぽこ！💮');
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
      setCompanionFeedback(`おしい！ ヒントをみて もういっかい かんがえてみよう！`);
      onEarnStars(1, currentQ.questionText, false);

      if (voiceEnabled) {
        speech.speak(`おしい！ ${currentQ.hint}`, {
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
    setCompanionFeedback('つぎの こくごクイズに 挑戦しよう！');
  };

  // Sentence Randomizer & AI Expander
  const WHO_OPTIONS = [
    'かわいい ネコちゃんが',
    'くいしんぼうな クマさんが',
    'うちゅうひこうしの サルくんが',
    '元気いっぱいの 1年生が',
    'まほうつかいの 女の子が',
  ];
  const WHERE_OPTIONS = [
    'もりの ひみつきちで',
    'ふしぎな お菓子のくにで',
    '月のおもてがわで',
    'きらきら光る 川のほとりで',
    '小学校の 校庭で',
  ];
  const WHAT_OPTIONS = [
    'たいやきを おいしそうに たべた！',
    'みんなで 楽しく ダンスした！',
    'たからの 地図を みつけた！',
    'そらとぶ 自転車に のった！',
    'おおきな 虹を かいた！',
  ];

  const handleShuffleSentence = () => {
    soundEffects.playPop();
    setWhoBlock(WHO_OPTIONS[Math.floor(Math.random() * WHO_OPTIONS.length)]);
    setWhereBlock(WHERE_OPTIONS[Math.floor(Math.random() * WHERE_OPTIONS.length)]);
    setWhatBlock(WHAT_OPTIONS[Math.floor(Math.random() * WHAT_OPTIONS.length)]);
  };

  const handleExpandSentenceWithAI = async () => {
    soundEffects.playSparkle();
    setIsBuildingStory(true);
    const combined = `${whoBlock} ${whereBlock} ${whatBlock}`;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: companion.id,
          grade,
          context: `子どもがつくった文: 「${combined}」`,
          message: `この文をもとに、楽しい短い続きのお話を2〜3文で話してください。`,
        }),
      });
      const data = await res.json();
      setGeneratedStory(data.reply || `${combined} そして、みんなで大笑いしました！めでたしめでたし！`);
      onEarnStars(2, `ぶんづくり: ${combined}`, true);

      if (voiceEnabled && data.reply) {
        speech.speak(data.reply, { pitch: companion.voicePitch, rate: companion.voiceRate });
      }
    } catch (e) {
      setGeneratedStory(`${combined} とっても わくわくする すてきな おはなしだね！💮`);
    } finally {
      setIsBuildingStory(false);
    }
  };

  // Shiritori Handler
  const handleSendShiritori = async () => {
    const word = userShiritoriInput.trim();
    if (!word) return;

    soundEffects.playPop();
    const lastAIWord = shiritoriHistory[shiritoriHistory.length - 1]?.word || 'りんご';
    const lastChar = lastAIWord.slice(-1);

    // Add user word
    const updated = [...shiritoriHistory, { sender: 'user' as const, word }];
    setShiritoriHistory(updated);
    setUserShiritoriInput('');

    // Check if word ends with 'ん'
    if (word.endsWith('ん') || word.endsWith('ン')) {
      soundEffects.playHint();
      setCompanionFeedback('あっ！「ん」がついちゃったぽこ！ でも たくさん 言えて すごかったよ！');
      return;
    }

    // AI responses
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: companion.id,
          grade,
          context: `しりとりゲーム。前の子どもの単語: 「${word}」`,
          message: `子どもの「${word}」の最後の文字から始まる、日本の小学生が知っている楽しい単語（ひらがな）を1つだけ返してください。例: ゴリラなら「らっぱ」`,
        }),
      });
      const data = await res.json();
      const aiWord = (data.reply || 'たいよう').replace(/[^ぁ-んァ-ヶー]/g, '').slice(0, 5) || 'たいよう';

      setShiritoriHistory([...updated, { sender: 'ai' as const, word: aiWord }]);
      soundEffects.playCorrect();
      onEarnStars(2, `しりとり: ${word} -> ${aiWord}`, true);

      if (voiceEnabled) {
        speech.speak(`ぼくは「${aiWord}」！ つぎは「${aiWord.slice(-1)}」だよ！`, {
          pitch: companion.voicePitch,
          rate: companion.voiceRate,
        });
      }
    } catch (e) {
      console.warn('Shiritori error:', e);
    }
  };

  // Voice Input for Shiritori
  const handleVoiceShiritori = () => {
    if (isListening) {
      speech.stopListening();
      setIsListening(false);
      return;
    }

    soundEffects.playPop();
    setIsListening(true);
    speech.startListening(
      (text) => {
        setUserShiritoriInput(text);
        setIsListening(false);
      },
      () => setIsListening(false),
      (err) => {
        console.warn('Voice recognition error:', err);
        setIsListening(false);
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Companion Speech Bar */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 p-4 rounded-3xl border-2 border-purple-200 flex items-center justify-between gap-4">
        <CompanionAvatar
          companion={companion}
          speechText={companionFeedback}
          expression={isCorrect ? 'happy' : showHint ? 'thinking' : 'talking'}
          voiceEnabled={voiceEnabled}
        />

        {/* Subtab Switcher & Adventure Button */}
        <div className="flex items-center gap-2 flex-wrap">
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

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-purple-200 shadow-sm">
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setActiveSubTab('quiz');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeSubTab === 'quiz' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900 hover:bg-purple-50'
              }`}
            >
              📚 かんじ・ことば
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setActiveSubTab('sentence');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeSubTab === 'sentence' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900 hover:bg-purple-50'
              }`}
            >
              🧩 ぶんづくり
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setActiveSubTab('shiritori');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeSubTab === 'shiritori' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-900 hover:bg-purple-50'
              }`}
            >
              🦁 AIしりとり
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Quiz & Reading */}
      {activeSubTab === 'quiz' && (
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-purple-200 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-900 font-extrabold text-xs rounded-full border border-purple-300">
                しょうがく {grade}ねんせい
              </span>
              <h2 className="font-extrabold text-lg sm:text-xl text-neutral-800">{currentQ.title}</h2>
            </div>

            <button
              type="button"
              onClick={() => {
                if (voiceEnabled) {
                  speech.speak(
                    `${currentQ.readingStory ? currentQ.readingStory + '。' : ''}${currentQ.questionText}`,
                    { pitch: companion.voicePitch, rate: companion.voiceRate }
                  );
                }
              }}
              className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-full transition active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>よんでみる</span>
            </button>
          </div>

          {/* Reading Story Box (if present) */}
          {currentQ.readingStory && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-sm sm:text-base text-neutral-800 leading-relaxed font-serif">
              <div className="text-xs font-bold text-amber-900 mb-1">📖 おはなし:</div>
              {currentQ.readingStory}
            </div>
          )}

          {/* Kanji Spotlight Graphic (if present) */}
          {currentQ.kanjiChar && (
            <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
              <div className="w-24 h-24 bg-white rounded-2xl border-4 border-purple-400 shadow-md flex items-center justify-center text-5xl font-black text-purple-950 font-serif">
                {currentQ.kanjiChar}
              </div>
              <div className="mt-2 text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
                この漢字の読みかたは？
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="p-4 sm:p-5 bg-purple-50/50 rounded-2xl border-2 border-purple-100 text-base sm:text-lg font-bold text-neutral-800 whitespace-pre-line leading-relaxed">
            {currentQ.questionText}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {currentQ.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`py-4 px-3 rounded-2xl font-black text-base sm:text-xl transition transform active:scale-95 border-3 shadow-md flex items-center justify-center ${
                  selectedAnswer === option
                    ? isEvaluated
                      ? isCorrect
                        ? 'bg-emerald-500 border-emerald-700 text-white scale-105'
                        : 'bg-rose-500 border-rose-700 text-white'
                      : 'bg-purple-400 border-purple-600 text-white scale-105 ring-4 ring-purple-300'
                    : 'bg-neutral-50 hover:bg-purple-100/60 border-neutral-200 text-neutral-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-neutral-100">
            <button
              type="button"
              onClick={() => {
                soundEffects.playHint();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 border border-yellow-300"
            >
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span>{showHint ? 'ヒントを かくす' : 'ヒントを みる'}</span>
            </button>

            {!isEvaluated ? (
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm sm:text-base shadow-lg transition active:scale-95 disabled:opacity-40"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>こたえあわせ！</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm sm:text-base shadow-lg transition active:scale-95 animate-bounce-gentle"
              >
                <span>つぎの クイズへ！</span>
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Hint */}
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
                  <span>ルナはかせの ヒント:</span>
                </div>
                <p>{currentQ.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Subtab 2: Sentence Construction Studio */}
      {activeSubTab === 'sentence' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-pink-200 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-xl text-neutral-800">🧩 ぶんづくり スタジオ</h2>
              <p className="text-xs text-neutral-500">
                「だれが」「どこで」「なにをした」を くみあわせて、たのしい 文を つくろう！
              </p>
            </div>

            <button
              type="button"
              onClick={handleShuffleSentence}
              className="flex items-center gap-1 px-3 py-2 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-2xl font-bold text-xs transition active:scale-95 border border-pink-300"
            >
              <Shuffle className="w-4 h-4" />
              <span>シャッフル！</span>
            </button>
          </div>

          {/* Sentence Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Who */}
            <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-200 space-y-2">
              <div className="text-xs font-bold text-rose-800">① だれが（しゅご）</div>
              <select
                value={whoBlock}
                onChange={(e) => setWhoBlock(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-xl p-2.5 text-xs sm:text-sm font-bold text-neutral-800 outline-none"
              >
                {WHO_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Where */}
            <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-200 space-y-2">
              <div className="text-xs font-bold text-sky-800">② どこで（ばしょ）</div>
              <select
                value={whereBlock}
                onChange={(e) => setWhereBlock(e.target.value)}
                className="w-full bg-white border border-sky-300 rounded-xl p-2.5 text-xs sm:text-sm font-bold text-neutral-800 outline-none"
              >
                {WHERE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* What */}
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 space-y-2">
              <div className="text-xs font-bold text-emerald-800">③ なにをした（じゅつご）</div>
              <select
                value={whatBlock}
                onChange={(e) => setWhatBlock(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs sm:text-sm font-bold text-neutral-800 outline-none"
              >
                {WHAT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Constructed Sentence Display */}
          <div className="p-6 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-2xl border-2 border-pink-300 text-center space-y-3">
            <div className="text-xs font-bold text-pink-700">できた文:</div>
            <div className="text-lg sm:text-2xl font-black text-neutral-900 tracking-wide">
              「{whoBlock} {whereBlock} {whatBlock}」
            </div>

            <button
              type="button"
              onClick={handleExpandSentenceWithAI}
              disabled={isBuildingStory}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${isBuildingStory ? 'animate-spin' : ''}`} />
              <span>{isBuildingStory ? 'おはなしを ふくらませ中...' : 'AIと つづきをつくろう！'}</span>
            </button>
          </div>

          {/* AI Generated Follow-up Story */}
          {generatedStory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-white rounded-2xl border-2 border-purple-300 shadow-md space-y-2"
            >
              <div className="flex items-center justify-between text-purple-900 font-bold text-sm">
                <span>✨ AI絵本作家の つづきのお話:</span>
                <button
                  type="button"
                  onClick={() => speech.speak(generatedStory, { pitch: companion.voicePitch, rate: companion.voiceRate })}
                  className="p-1.5 bg-purple-100 hover:bg-purple-200 rounded-full text-purple-800"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-neutral-800 text-base leading-relaxed">{generatedStory}</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Subtab 3: AI Shiritori Arena */}
      {activeSubTab === 'shiritori' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200 space-y-6"
        >
          <div>
            <h2 className="font-extrabold text-xl text-neutral-800">🦁 AIしりとり アリーナ</h2>
            <p className="text-xs text-neutral-500">
              {companion.name}と 交互に ことばを つなげよう！「ん」がついたら まけだよ！
            </p>
          </div>

          {/* Shiritori Chain History */}
          <div className="h-64 overflow-y-auto p-4 bg-amber-50/60 rounded-2xl border-2 border-amber-200 flex flex-col gap-3">
            {shiritoriHistory.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: item.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 ${
                  item.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {item.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center text-sm">
                    {companion.id === 'poko' ? '🦝' : companion.id === 'luna' ? '🦉' : '🤖'}
                  </div>
                )}

                <div
                  className={`px-4 py-2.5 rounded-2xl text-base sm:text-lg font-black shadow-sm ${
                    item.sender === 'user'
                      ? 'bg-emerald-500 text-white rounded-br-none'
                      : 'bg-white border-2 border-amber-300 text-amber-950 rounded-bl-none'
                  }`}
                >
                  {item.word}
                </div>

                {item.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                    きみ
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Input Box with Voice and Send */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userShiritoriInput}
              onChange={(e) => setUserShiritoriInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendShiritori();
              }}
              placeholder={`「${shiritoriHistory[shiritoriHistory.length - 1]?.word.slice(-1) || 'ご'}」からはじまることば...`}
              className="flex-1 bg-neutral-50 border-2 border-amber-300 rounded-2xl px-4 py-3 text-base font-bold text-neutral-800 outline-none focus:border-amber-500 focus:bg-white"
            />

            {/* Mic button */}
            <button
              type="button"
              onClick={handleVoiceShiritori}
              className={`p-3 rounded-2xl border-2 transition active:scale-95 ${
                isListening
                  ? 'bg-rose-500 border-rose-700 text-white animate-pulse'
                  : 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
              }`}
              title="こえで いってみる"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send button */}
            <button
              type="button"
              onClick={handleSendShiritori}
              disabled={!userShiritoriInput.trim()}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-md transition active:scale-95 disabled:opacity-40"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
