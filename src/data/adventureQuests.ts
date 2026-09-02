import { AdventureQuest, AdventureWorldId, AdventureLootItem } from '../types';

export interface AdventureWorldInfo {
  id: AdventureWorldId;
  name: string;
  subtitle: string;
  themeColor: string;
  bgGradient: string;
  cardBorder: string;
  icon: string;
  description: string;
  musicMood: string;
}

export const ADVENTURE_WORLDS: Record<AdventureWorldId, AdventureWorldInfo> = {
  forest: {
    id: 'forest',
    name: 'エメラルドの まほうの森',
    subtitle: '妖精と 巨木の ふしぎな せかい',
    themeColor: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-900 to-green-950',
    cardBorder: 'border-emerald-500/50',
    icon: '🌲',
    description: '数の妖精や 森の守り神が すむ 豊かな森。川の飛び石や 古代の石板を 解き明かそう！',
    musicMood: '爽やかな森の風',
  },
  castle: {
    id: 'castle',
    name: '星くずの 魔法城',
    subtitle: 'きらめく 天空の アーケード',
    themeColor: '#8b5cf6',
    bgGradient: 'from-indigo-950 via-purple-950 to-slate-950',
    cardBorder: 'border-purple-500/50',
    icon: '🏰',
    description: '星のエネルギーで 封印された 宝箱や 魔法薬の 研究室が まっている！',
    musicMood: '神秘的なワルツ',
  },
  volcano: {
    id: 'volcano',
    name: '紅蓮の ドラゴン火山',
    subtitle: 'あつあつ 溶岩と 試練のどうくつ',
    themeColor: '#f97316',
    bgGradient: 'from-orange-950 via-red-950 to-stone-950',
    cardBorder: 'border-orange-500/50',
    icon: '🌋',
    description: '優しい赤ちゃんドラゴンが 迷子になっている！ 勇気の魔法で 助けてあげよう！',
    musicMood: '勇壮なファンファーレ',
  },
  ocean: {
    id: 'ocean',
    name: '深海の クリスタル神殿',
    subtitle: '光るサンゴと イルカのうた',
    themeColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-blue-950 to-slate-950',
    cardBorder: 'border-cyan-500/50',
    icon: '🌊',
    description: '重さのバランスをとる 水晶の天秤や 海の言葉パズルが 眠る神秘の神殿！',
    musicMood: 'キラキラ深海アンビエント',
  },
  galaxy: {
    id: 'galaxy',
    name: '星空の オーロラ銀河',
    subtitle: '時間と 空間を こえる 宇宙ステーション',
    themeColor: '#ec4899',
    bgGradient: 'from-fuchsia-950 via-purple-950 to-indigo-950',
    cardBorder: 'border-pink-500/50',
    icon: '🌌',
    description: '星の羅針盤を 回して ワープ航路を 開け！ コウモリの コウも 大喜び！',
    musicMood: 'コズミックスペースサウンド',
  },
};

export const PRESET_ADVENTURE_LOOT: AdventureLootItem[] = [
  {
    id: 'item_starlight_key',
    name: '星くずの まほうの鍵',
    icon: '🗝️',
    description: 'どんな 封印の宝箱も ピカピカ光って 開けてくれる 伝説の鍵。',
    rarity: 'rare',
  },
  {
    id: 'item_emerald_feather',
    name: 'エメラルドの 風の羽',
    icon: '🪶',
    description: '持つだけで 足が軽くなり、川の飛び石を すいすい 渡れる。',
    rarity: 'common',
  },
  {
    id: 'item_dragon_orb',
    name: 'ドラゴンフレイムの 宝珠',
    icon: '🔮',
    description: 'あたたかいドラゴンの 友情が こもった 光るオーブ。',
    rarity: 'epic',
  },
  {
    id: 'item_crystal_scale_mini',
    name: '真実の ミニ水晶天秤',
    icon: '⚖️',
    description: 'ものの 正確な重さや 数のバランスを 教えてくれる 神秘の道具。',
    rarity: 'legendary',
  },
  {
    id: 'item_galaxy_compass',
    name: 'コズミック 宇宙羅針盤',
    icon: '🧭',
    description: '時間の 迷路でも 正しい未来を 指し示してくれる 星の羅針盤。',
    rarity: 'epic',
  },
];

export const PRESET_ADVENTURE_QUESTS: AdventureQuest[] = [
  // 1. Forest - Stepping Stones
  {
    id: 'quest_forest_1',
    grade: 1,
    worldId: 'forest',
    worldName: 'エメラルドの まほうの森',
    worldEmoji: '🌲',
    stageNumber: 1,
    totalStages: 3,
    subject: 'math',
    title: 'せせらぎの 川渡りチャレンジ！',
    storyIntro: '森の奥へ行くには、キラキラ光る「数の飛び石」を 正しく踏んで 川を渡る必要があります！',
    characterMood: 'excited',
    questionPrompt: '「あわせて 7」に なる 石を えらんで 川を わたろう！ （いま 3こ もっているよ）',
    hint: '3に いくつ たすと 7に なるかな？ 指で 3から 4, 5, 6, 7と 数えてみよう！',
    loreExplanation: '3 + 4 = 7 だね！ 4の飛び石が 光って 安全に 向こう岸へ 渡れました！',
    encouragement: 'すごいジャンプ！ 川を 軽快に 飛び越えたぽこ！💮',
    correctAnswer: '4',
    uiConfig: {
      widgetType: 'stepping_stones',
      riverTheme: 'forest',
      stones: [
        { id: 'st_1', text: '2', subText: '3 + 2 = 5', isCorrect: false, feedback: '2だと 5になって 水が チャポン！' },
        { id: 'st_2', text: '4', subText: '3 + 4 = 7 ✨', isCorrect: true, feedback: '大正解！ 虹の橋が かかった！' },
        { id: 'st_3', text: '5', subText: '3 + 5 = 8', isCorrect: false, feedback: '5だと 8で ちょっと 大きいかな？' },
        { id: 'st_4', text: '3', subText: '3 + 3 = 6', isCorrect: false, feedback: 'あと 1たりないぽこ！' },
      ],
    },
    rewards: {
      stars: 3,
      exp: 40,
      lootItem: PRESET_ADVENTURE_LOOT[1],
    },
  },

  // 2. Castle - Chest Lock
  {
    id: 'quest_castle_1',
    grade: 2,
    worldId: 'castle',
    worldName: '星くずの 魔法城',
    worldEmoji: '🏰',
    stageNumber: 2,
    totalStages: 3,
    subject: 'math',
    title: '黄金の 宝箱ダイヤル暗号',
    storyIntro: '魔法城の 最深部で、星の紋章が 刻まれた 重厚な宝箱を 発見しました！ 2つのダイヤルを 合わせて 封印を 解除しよう！',
    characterMood: 'thinking',
    questionPrompt: '九九の 呪文: 「7 × 8」の 答えに ダイヤル（十の位 と 一の位）を 合わせよ！',
    hint: '7のだん: 7×7=49, そのつぎは 49に 7を たすと...？',
    loreExplanation: 'しちは 五十六（56）！ ダイヤルが カチリと はまり、宝箱が まばゆく 開きました！',
    encouragement: '九九マスターだロボ！ 素晴らしい ひらめき！✨',
    correctAnswer: '56',
    uiConfig: {
      widgetType: 'chest_lock',
      targetCode: '56',
      lockDials: [
        { label: '十のくらい', current: 3, options: [3, 4, 5, 6, 7] },
        { label: '一のくらい', current: 2, options: [2, 4, 6, 8, 9] },
      ],
    },
    rewards: {
      stars: 4,
      exp: 60,
      lootItem: PRESET_ADVENTURE_LOOT[0],
    },
  },

  // 3. Ocean - Crystal Scale
  {
    id: 'quest_ocean_1',
    grade: 1,
    worldId: 'ocean',
    worldName: '深海の クリスタル神殿',
    worldEmoji: '🌊',
    stageNumber: 1,
    totalStages: 3,
    subject: 'math',
    title: '水晶の 天秤バランスの儀式',
    storyIntro: '神殿の門を 開けるには、左右の天秤の 重さを ぴったり 同じ「10」に そろえる必要があります！',
    characterMood: 'thinking',
    questionPrompt: '左の皿には「6」の 水晶が 乗っています。右の皿に クリスタルを のせて「10」に バランスさせよう！',
    hint: '6 + [ ? ] = 10 だよ！ 10まで あと いくつかな？',
    loreExplanation: '6 + 4 = 10！ 天秤が 完璧に 水平になり、神殿の 水門が 静かに 開きました！',
    encouragement: '天秤ピタリ賞！ バランス感覚が バツグンだぽこ！⚖️',
    correctAnswer: '4',
    uiConfig: {
      widgetType: 'crystal_scale',
      targetWeight: 10,
      leftPan: [
        { id: 'lp_1', name: '巨大アメジスト', weight: 6, icon: '🔮' },
      ],
      availableItems: [
        { id: 'rp_2', name: '小サファイア (重さ 2)', weight: 2, icon: '💎' },
        { id: 'rp_3', name: '中ルビー (重さ 3)', weight: 3, icon: '♦️' },
        { id: 'rp_4', name: '光のトパーズ (重さ 4)', weight: 4, icon: '⭐' },
        { id: 'rp_5', name: '巨大エメラルド (重さ 5)', weight: 5, icon: '🟢' },
      ],
    },
    rewards: {
      stars: 3,
      exp: 50,
      lootItem: PRESET_ADVENTURE_LOOT[3],
    },
  },

  // 4. Volcano - Magic Charge (Friendly Monster encounter)
  {
    id: 'quest_volcano_1',
    grade: 2,
    worldId: 'volcano',
    worldName: '紅蓮の ドラゴン火山',
    worldEmoji: '🌋',
    stageNumber: 3,
    totalStages: 3,
    isBossStage: true,
    subject: 'japanese',
    title: '炎の こどもドラゴンと おともだちの 呪文',
    storyIntro: '道に 迷って 泣いている こどもドラゴン「ボルコ」が いました！ 正しい 言葉の 魔法チャージで 元気付けてあげよう！',
    characterMood: 'excited',
    questionPrompt: '「とても 元気で 【あかるい】 こころ」を 表す 漢字魔法を 選んで チャージしよう！',
    hint: 'お日さま（日）と お月さま（月）が 合体した 漢字だよ！',
    loreExplanation: '【明】るい！ 日と月が 合わさって まわりを 照らす 素敵な 漢字だよ。ドラゴンも にっこり 笑顔に なりました！',
    encouragement: 'ドラゴンと 心が 通じ合ったよ！ 大大大勝利バサッ！🦇🔥',
    correctAnswer: '明',
    uiConfig: {
      widgetType: 'magic_charge',
      monsterName: 'こどもドラゴン・ボルコ',
      monsterEmoji: '🐲',
      monsterHp: 100,
      spells: [
        { id: 'sp_1', name: '【暗】やみビーム', element: 'star', power: 20, label: '暗 (くらい)', isCorrect: false },
        { id: 'sp_2', name: '【明】るいサンシャイン', element: 'fire', power: 100, label: '明 (あかるい)', isCorrect: true },
        { id: 'sp_3', name: '【冷】たいフロスト', element: 'water', power: 20, label: '冷 (つめたい)', isCorrect: false },
        { id: 'sp_4', name: '【重】いストーン', element: 'nature', power: 20, label: '重 (おもい)', isCorrect: false },
      ],
    },
    rewards: {
      stars: 5,
      exp: 80,
      lootItem: PRESET_ADVENTURE_LOOT[2],
    },
  },

  // 5. Galaxy - Compass Dial
  {
    id: 'quest_galaxy_1',
    grade: 3,
    worldId: 'galaxy',
    worldName: '星空の オーロラ銀河',
    worldEmoji: '🌌',
    stageNumber: 2,
    totalStages: 3,
    subject: 'math',
    title: '時空の 羅針盤・タイムワープ設定',
    storyIntro: '銀河特急の ワープ装置を 起動するため、羅針盤の 針を「3時45分」の 角度に 合わせましょう！',
    characterMood: 'thinking',
    questionPrompt: '短針が 3と4の あいだ、長針が「9（45分）」を 指すように 羅針盤を セットせよ！',
    hint: '時計の文字盤で、1周は60分。9の場所は 5×9 = 45分だよ！',
    loreExplanation: 'ぴったり 3時45分！ ワープゲートが 開き、星空の オーロラロードが 出現しました！',
    encouragement: '時間計算パーフェクト！ 宇宙の 旅人になれたね！🚀⭐',
    correctAnswer: '3:45',
    uiConfig: {
      widgetType: 'compass_dial',
      compassTargetAngle: 270,
      compassLabels: ['12 (0分)', '3 (15分)', '6 (30分)', '9 (45分)'],
    },
    rewards: {
      stars: 4,
      exp: 65,
      lootItem: PRESET_ADVENTURE_LOOT[4],
    },
  },

  // 6. Forest - Ancient Tablet
  {
    id: 'quest_forest_2',
    grade: 1,
    worldId: 'forest',
    worldName: 'エメラルドの まほうの森',
    worldEmoji: '🌲',
    stageNumber: 2,
    totalStages: 3,
    subject: 'japanese',
    title: '古代の 巨木石板パズル',
    storyIntro: '大木の 幹に はめ込まれた 古代の石板。かける文字のピースを ピタリと はめて 言葉を 完成させよう！',
    characterMood: 'thinking',
    questionPrompt: '「いぬ が にわ を [ ？ ] まわる」に 入る 正しい ピースは どれかな？',
    hint: 'お庭を 元気に たくさん 走ることを なんて 言うかな？',
    loreExplanation: '「かけまわる」！ 元気いっぱいに 走る 様子だね。石板が 緑色に 輝き始めました！',
    encouragement: 'ことばの はめこみ 大成功！ 知識の 葉っぱが 茂ったよ！🍃',
    correctAnswer: 'かけ',
    uiConfig: {
      widgetType: 'ancient_tablet',
      tabletPrompt: 'いぬ が にわ を ［ ？ ］ まわる',
      slotsCount: 1,
      runes: [
        { id: 'rn_1', char: 'かけ', meaning: '走る（駆ける）', isCorrect: true },
        { id: 'rn_2', char: 'ね', meaning: '寝る', isCorrect: false },
        { id: 'rn_3', char: 'およぎ', meaning: '水で泳ぐ', isCorrect: false },
        { id: 'rn_4', char: 'とまり', meaning: '止まる', isCorrect: false },
      ],
    },
    rewards: {
      stars: 3,
      exp: 45,
      lootItem: PRESET_ADVENTURE_LOOT[1],
    },
  },

  // 7. Castle - Potion Alchemy
  {
    id: 'quest_castle_2',
    grade: 2,
    worldId: 'castle',
    worldName: '星くずの 魔法城',
    worldEmoji: '🏰',
    stageNumber: 1,
    totalStages: 3,
    subject: 'math',
    title: '星くずの ポーション調合室',
    storyIntro: '暗闇を 照らす「スターライト・ポーション」を 作るため、魔法の ビーカーに 水滴を ぴったり「15滴」入れましょう！',
    characterMood: 'excited',
    questionPrompt: 'いま「8滴」入っています。あと 何滴 入れると「15滴」に なるかな？',
    hint: '8 + [ ? ] = 15 だよ。15 - 8 を 計算してみよう！',
    loreExplanation: '8 + 7 = 15滴！ ポーションが キラキラと 七色に 泡立ち、部屋中が 明るくなりました！',
    encouragement: '魔法の錬金術師だ！ 完璧な 調合だぽこ！🧪✨',
    correctAnswer: '7',
    uiConfig: {
      widgetType: 'potion_alchemy',
      potionTarget: '15滴の 星くずポーション',
      potionColor: '#a855f7',
      ingredients: [
        { id: 'ing_5', name: '月光のエキス (5滴)', icon: '💧', amount: 5, isCorrect: false },
        { id: 'ing_7', name: '太陽のしずく (7滴)', icon: '✨', amount: 7, isCorrect: true },
        { id: 'ing_6', name: '水晶パウダー (6滴)', icon: '🔮', amount: 6, isCorrect: false },
        { id: 'ing_8', name: '星の砂 (8滴)', icon: '⭐', amount: 8, isCorrect: false },
      ],
    },
    rewards: {
      stars: 3,
      exp: 50,
      lootItem: PRESET_ADVENTURE_LOOT[0],
    },
  },

  // 8. Volcano - RPG Command Action
  {
    id: 'quest_volcano_2',
    grade: 3,
    worldId: 'volcano',
    worldName: '紅蓮の ドラゴン火山',
    worldEmoji: '🌋',
    stageNumber: 2,
    totalStages: 3,
    subject: 'hybrid',
    title: '溶岩ゴーレムの なぞなぞ対決！',
    storyIntro: '道を ふさぐ 巨大な 岩石ゴーレムが 立ちはだかった！ 最も 賢い 冒険コマンドを 選んで 突破しよう！',
    characterMood: 'excited',
    questionPrompt: 'ゴーレムが 問いかける: 「1mの ひもと 100cmの ひも、どちらが 長い？」',
    hint: '1メートル（m）は 何センチメートル（cm）と同じだったかな？',
    loreExplanation: '1m = 100cm だから「同じ長さ」！ 正解を 告げると、ゴーレムは 感心して 道を あけてくれました！',
    encouragement: '知恵の 勝利！ 単位マスターの 称号を あげるぽこ！🛡️',
    correctAnswer: '同じ長さ',
    uiConfig: {
      widgetType: 'rpg_action',
      actions: [
        { id: 'act_1', title: '「1mのほうが長い！」と答える', desc: 'mのほうが強そうにみえるけど…？', icon: '📏', isCorrect: false, badge: 'パワー判定' },
        { id: 'act_2', title: '「100cmのほうが長い！」と答える', desc: '数が100で大きくみえるけど…？', icon: '🔢', isCorrect: false, badge: 'スピード判定' },
        { id: 'act_3', title: '「どちらも まったく同じ長さ！」と答える', desc: '1m = 100cmの 単位の真実！', icon: '💡', isCorrect: true, badge: '知恵のひらめき' },
        { id: 'act_4', title: '「ひもを 引っぱって 比べる」', desc: '力づくで 引っぱってみる？', icon: '🪢', isCorrect: false, badge: '力くらべ' },
      ],
    },
    rewards: {
      stars: 4,
      exp: 70,
      lootItem: PRESET_ADVENTURE_LOOT[2],
    },
  },
];
