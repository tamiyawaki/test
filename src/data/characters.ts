import { Companion } from '../types';

export const COMPANIONS: Record<string, Companion> = {
  poko: {
    id: 'poko',
    name: 'ポコ (Poko)',
    title: 'げんきな もりの ぼうけんか',
    species: 'タヌキのこ',
    avatarColor: '#f97316', // orange
    accentBg: 'bg-amber-100 text-amber-900 border-amber-300',
    borderColor: 'border-amber-400',
    greeting: 'やっほー！ ぼく ポコだぽこ！ いっしょに たのしく まなぼうぽこ！',
    catchphrase: 'ぽこぽこ はなまる！💮',
    description: 'いつも あかるく げんきいっぱい！ どんな チャレンジも おうえん するよ！',
    voicePitch: 1.35,
    voiceRate: 0.95,
  },
  luna: {
    id: 'luna',
    name: 'ルナ (Luna)',
    title: 'ものしり フクロウはかせ',
    species: 'フクロウ',
    avatarColor: '#8b5cf6', // purple
    accentBg: 'bg-purple-100 text-purple-900 border-purple-300',
    borderColor: 'border-purple-400',
    greeting: 'ホッホー！ わたしは ルナです。ことばや かんじの ふしぎを いっしょに さがしましょう！',
    catchphrase: 'すてきな ひらめき ですね！🦉',
    description: 'ことばの まほうが だいすき。やさしく ヒントを おしえてくれるよ！',
    voicePitch: 1.15,
    voiceRate: 0.9,
  },
  piko: {
    id: 'piko',
    name: 'ピコ (Piko)',
    title: 'ひらめき けいさんロボ',
    species: 'ロボット',
    avatarColor: '#0ea5e9', // cyan/blue
    accentBg: 'bg-sky-100 text-sky-900 border-sky-300',
    borderColor: 'border-sky-400',
    greeting: 'ピピッ！ ぼくは ピコロボ！ かずの パズルや とけいの なぞを とこうピピッ！',
    catchphrase: 'エネルギー 100パーセント！🤖',
    description: 'さんすうや けいさんが とくい！ ブロックを つかって わかりやすく おしえるよ！',
    voicePitch: 1.45,
    voiceRate: 1.0,
  },
  kou: {
    id: 'kou',
    name: 'コウ (Kou)',
    title: 'よぞらの ほしぞら たんけんか',
    species: 'コウモリ',
    avatarColor: '#6366f1', // indigo / night purple
    accentBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    borderColor: 'border-indigo-400',
    greeting: 'バサバサ〜！ ぼく コウモリの コウだよ！ よるの そらの ように ふしぎな せかいを いっしょに たんけんしよう！',
    catchphrase: 'キラリ！ おほしさま キャッチ！🦇⭐',
    description: 'よるの そらを じゆうに とびまわる コウモリの こ。みみが よくきこえて、みんなの こえを しっかり きくよ！',
    voicePitch: 1.25,
    voiceRate: 0.95,
  },
};
