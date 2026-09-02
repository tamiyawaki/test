import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Heart,
  Award,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { GradeLevel, LearningLog, UserProgress } from '../../types';

interface ParentReportProps {
  progress: UserProgress;
  learningLogs: LearningLog[];
  grade: GradeLevel;
}

export const ParentReport: React.FC<ParentReportProps> = ({
  progress,
  learningLogs,
  grade,
}) => {
  const total = progress.totalQuestionsAnswered;
  const correct = progress.correctCount;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;

  // Pedagogical advice based on grade
  const gradeAdvice: Record<number, string> = {
    1: '1年生の時期は「学ぶこと＝楽しい！」と感じることが一番大切です。正解した時はもちろん、間違えても「よく気づいたね」「いいチャレンジだったね」とプロセスを褒めてあげてください。',
    2: '2年生は繰り上がり・繰り下がりや九九、漢字の数が増えてくる時期です。時計や買い物など、日常生活の身近な場面とお勉強をリンクさせて会話すると理解が深まります。',
    3: '3年生は「なぜ？どうして？」という知的好奇心が大きく広がる時期です。「なぜなぜ探検隊」で調べたことを、お夕飯の時にお子さまから教えてもらうと自信がつきます。',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 p-6 rounded-3xl border-2 border-indigo-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-900 font-extrabold text-xs rounded-full">
            👨‍👩‍👧 保護者・おうちの方向けレポート
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 mt-1">
            がんばりの きろく & 成長レポート
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            お子さまの学習の進み具合、挑戦した問題、興味を持ったテーマをひと目で確認できます。
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-indigo-200 shadow-sm text-xs font-bold text-indigo-900">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>学年設定: 小学{grade}年生</span>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-sm space-y-1">
          <div className="text-xs font-bold text-neutral-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>集めたスター</span>
          </div>
          <div className="text-2xl font-black text-amber-600">{progress.stars} ⭐</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-sm space-y-1">
          <div className="text-xs font-bold text-neutral-500 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>正答率</span>
          </div>
          <div className="text-2xl font-black text-emerald-600">{accuracy}%</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-sm space-y-1">
          <div className="text-xs font-bold text-neutral-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
            <span>解いた問題数</span>
          </div>
          <div className="text-2xl font-black text-sky-700">{total} 問</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-sm space-y-1">
          <div className="text-xs font-bold text-neutral-500 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-purple-500" />
            <span>作成した絵本</span>
          </div>
          <div className="text-2xl font-black text-purple-700">{progress.createdStoriesCount} 冊</div>
        </div>
      </div>

      {/* Pedagogical Guidance Tip Box */}
      <div className="p-6 bg-gradient-to-r from-rose-50 to-orange-50 rounded-3xl border-2 border-rose-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-rose-900 font-extrabold text-base">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span>AI先生からの お声がけアドバイス（小学{grade}年生向け）</span>
        </div>
        <p className="text-neutral-700 text-sm leading-relaxed">{gradeAdvice[grade]}</p>
      </div>

      {/* Learning Logs Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-indigo-100 space-y-4">
        <h3 className="font-extrabold text-lg text-neutral-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span>さいきんの 学習ログ</span>
        </h3>

        {learningLogs.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 text-sm">
            まだ学習ログがありません。算数や国語の問題を解くとここに記録されます！
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
            {learningLogs.slice(0, 15).map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        log.subject === 'math'
                          ? 'bg-amber-100 text-amber-900'
                          : log.subject === 'japanese'
                          ? 'bg-purple-100 text-purple-900'
                          : log.subject === 'curiosity'
                          ? 'bg-teal-100 text-teal-900'
                          : 'bg-pink-100 text-pink-900'
                      }`}
                    >
                      {log.subject === 'math'
                        ? '算数'
                        : log.subject === 'japanese'
                        ? '国語'
                        : log.subject === 'curiosity'
                        ? 'なぜなぜ'
                        : 'おはなし'}
                    </span>
                    <span className="font-bold text-neutral-800 line-clamp-1">{log.question}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">{log.timestamp}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {log.isCorrect ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>正解 (+{log.starsEarned}⭐)</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold">チャレンジ (+{log.starsEarned}⭐)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
