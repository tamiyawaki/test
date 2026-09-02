import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy/safe initialization of Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using smart fallback educational generator.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy_key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. AI Interactive Chat (With Companion Persona)
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, character = "poko", grade = 1, context = "" } = req.body;

    const charDescriptions: Record<string, string> = {
      poko: "名前: ポコ（元気なタヌキの子）。語尾は「〜ぽこ！」「〜だよ！」。明るく元気で、とにかく褒めて励ます。失敗しても『すごいチャレンジだぽこ！』と励ます。",
      luna: "名前: ルナ（優しいフクロウの博士）。語尾は「〜ですね」「〜ですよ」「ホッホー！」。物知りで言葉の不思議を優しく教えてくれる。",
      piko: "名前: ピコ（ひらめきロボット）。語尾は「〜ピピッ！」「〜ロボ！」。数字やパズルが大好きで、わかりやすいヒントをくれる。",
      kou: "名前: コウ（夜空を飛ぶ元気なコウモリの子）。語尾は「〜だよ！」「〜バサッ！」「〜だね！」。耳が良くて子どもの話をじっくり聞き、夜空や星、宇宙、ワクワクする冒険が大好き。",
    };

    const gradeInstructions: Record<number, string> = {
      1: "対象: 小学校1年生。漢字は使わずひらがな・カタカナ中心。文は短くやさしく（2〜3文）。擬音や楽しい表現を使う。",
      2: "対象: 小学校2年生。習う簡単な漢字にはかっこで読みをつけるかひらがな。わかりやすい例えを使う。",
      3: "対象: 小学校3年生。優しく親しみやすい言葉遣い。知的好奇心を刺激する説明をする。",
    };

    const systemInstruction = `
あなたは日本の小学校低学年の子ども向け教育アプリに登場するマスコットキャラクターです。
${charDescriptions[character] || charDescriptions.poko}
${gradeInstructions[grade] || gradeInstructions[1]}

ルール:
1. 子どもの発言に寄り添い、優しく楽しく対話してください。
2. 絶対に怒ったり否定したりせず、褒めて自己肯定感を高めます。
3. 必要に応じて「次は何をする？」「一緒に考えてみよう！」と問いかけます。
4. 返答は100〜180文字程度の短く読みやすい長さにしてください。
`;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if API key is not present
      const fallbacks: Record<string, string[]> = {
        poko: [
          `すごいぽこ！ ${message ? `「${message}」って` : ""}よく気づいたぽこね！いっしょに どんどん チャレンジしてみようぽこ！`,
          `わくわくするぽこ〜！ ${character === "poko" ? "ポコ" : "ぼく"}も いっしょに まなべて とっても うれしいぽこ！ つぎも がんばろう！`,
          `えらいぽこ！ よくかんがえたね！ ぽこぽこ はなまるを あげるぽこ〜！💮`,
        ],
        luna: [
          `ホッホー！ とても すてきな 考えですね。言葉や文字には 不思議がいっぱいありますよ。`,
          `よく気づきましたね！ その調子で 一歩ずつ 楽しく学んでいきましょう。`,
        ],
        piko: [
          `ピピッ！ ひらめきパワー 100パーセント！ 計算もパズルも バッチリですロボ！`,
          `ナイスロボ！ ピコも いっしょに 考えるのが とても 楽しいですピピッ！`,
        ],
        kou: [
          `バサバサ〜！ ${message ? `「${message}」って` : ""}とっても いい着眼点だね！ おほしさまみたいに キラリとひらめいたよ！🦇⭐`,
          `ナイスチャレンジ！ コウも いっしょに 夜空を飛んでいるみたいに ワクワクするよ！ つぎも いってみようバサッ！✨`,
          `すごいすごい！ よく気がついたね！ はなまるスターを プレゼントするよ！🦇💮`,
        ],
      };
      const list = fallbacks[character] || fallbacks.poko;
      const reply = list[Math.floor(Math.random() * list.length)];
      return res.json({ reply, audioText: reply });
    }

    const ai = getAI();
    const prompt = `コンテキスト: ${context || "なし"}\n子どものメッセージ: ${message || "こんにちは！"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const reply = response.text || "いっしょに たのしく おべんきょう しようね！";
    res.json({ reply, audioText: reply });
  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({
      error: "対話の生成に失敗しました",
      reply: "すごいね！ いっしょに たのしく がんばろうぽこ！",
    });
  }
});

// 2. Generate Custom Math Problem with Visual Hint
app.post("/api/ai/math-problem", async (req, res) => {
  try {
    const { grade = 1, topic = "addition", interest = "animals", difficulty = "normal" } = req.body;

    const systemInstruction = `
あなたは日本の小学校低学年向けの算数学習アシスタントです。
指定された学年、単元、子どもの好きなテーマに合わせて、楽しく解ける算数問題（1問）を作成してください。

学年基準:
- 1年生: 10までの数、20までの繰り上がり/繰り下がりの足し算・引き算、時計（何時・何時半）、1桁の文章題。ひらがな中心。
- 2年生: 100までの計算、2桁の足し算・引き算、かけ算九九、長さ(cm/mm)、時計（何時何分）、簡単な図形。
- 3年生: 3桁・4桁の計算、かけ算の筆算、わり算、分数・小数の基礎、重さ・長さ、時間計算。

必ず指定のJSON形式で返してください。
`;

    const userPrompt = `
学年: 小学校${grade}年生
単元: ${topic}
子どもの好きなテーマ: ${interest}
難易度: ${difficulty}
`;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback sample
      const fallbackQuestions = [
        {
          questionText: "りんごが 3こ あります。おともだちから 2こ もらいました。ぜんぶで なんこに なったかな？",
          formula: "3 + 2 = ?",
          correctAnswer: "5",
          options: ["4", "5", "6", "7"],
          hint: "さいしょに 3こ あって、そこに 2こ ふえたよ。ゆびで かぞえてみてね！",
          explanation: "3に 2を たすと、3、4、5！ ぜんぶで 5こ だよ。だいせいかい！",
          visualType: "apples",
          visualCountA: 3,
          visualCountB: 2,
          visualOperator: "+",
          encouragement: "よく かぞえられたね！ はなまるぽこ！💮",
        },
        {
          questionText: "こうえんに ことりが 6わ いました。2わ とんでいきました。のこりは なんわかな？",
          formula: "6 - 2 = ?",
          correctAnswer: "4",
          options: ["3", "4", "5", "8"],
          hint: "6わ から 2わ へったよ。ひきざん してみよう！",
          explanation: "6から 2を ひくと、のこりは 4わ だね！ ばっちり！",
          visualType: "birds",
          visualCountA: 6,
          visualCountB: 2,
          visualOperator: "-",
          encouragement: "ひきざん めいじん だね！",
        },
      ];
      const q = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      return res.json(q);
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING, description: "問題文（学年に合わせた漢字・ひらがな）" },
            formula: { type: Type.STRING, description: "計算式（例: 4 + 3 = ?）" },
            correctAnswer: { type: Type.STRING, description: "正解の数値または答え" },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4つの選択肢（正解を含む）",
            },
            hint: { type: Type.STRING, description: "子どもに寄り添うヒント" },
            explanation: { type: Type.STRING, description: "正解した時のやさしい解説" },
            visualType: { type: Type.STRING, description: "視覚アイテム（apples, stars, animals, blocks, cars, cookies）" },
            visualCountA: { type: Type.INTEGER, description: "最初の数" },
            visualCountB: { type: Type.INTEGER, description: "2つめの数" },
            visualOperator: { type: Type.STRING, description: "演算子 (+, -, *, /)" },
            encouragement: { type: Type.STRING, description: "キャラクターからのほめ言葉" },
          },
          required: ["questionText", "correctAnswer", "options", "hint", "explanation", "encouragement"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Math problem generation error:", error);
    res.status(500).json({ error: "問題の生成に失敗しました" });
  }
});

// 3. Generate Japanese Language Quest
app.post("/api/ai/japanese-quest", async (req, res) => {
  try {
    const { grade = 1, type = "kanji", theme = "daily" } = req.body;

    const systemInstruction = `
あなたは日本の小学校低学年向けの国語学習アシスタントです。
指定された学年・種類（漢字、ことば、ぶんづくり、しりとり、反対ことば、短文読解）に合わせて、楽しく学べる国語の問題を作成してください。

学年基準:
- 1年生: ひらがな、カタカナ、1年生で習う80字の漢字（日、月、火、水、木、金、土、山、川、花、草、犬、空など）、助詞（は、を、へ）の使い方。
- 2年生: 2年生の漢字（160字）、ことばの意味、反対言葉、なかまのことば、簡単な主語・述語。
- 3年生: 3年生の漢字（200字）、ことわざ・慣用句の基礎、ローマ字、修飾語、段落の読み取り。

必ず指定のJSON形式で返してください。
`;

    const userPrompt = `
学年: 小学校${grade}年生
タイプ: ${type}（kanji: 漢字の読み書き, vocabulary: ことばパズル, sentence: ぶんづくり, reading: 短いおはなし読解）
テーマ: ${theme}
`;

    if (!process.env.GEMINI_API_KEY) {
      const fallbackJapanese = [
        {
          title: "かんじの よみかた クイズ",
          questionText: "「青い【空】を 見あげる」の【空】は、どう読むかな？",
          kanjiChar: "空",
          furigana: "そら",
          correctAnswer: "そら",
          options: ["そら", "うみ", "やま", "ほし"],
          hint: "あたまの うえに ひろがっている、あおい ものだよ！",
          explanation: "「空」は「そら」と読むよ！ 晴れた日の青空、きもちいいね！",
          exampleSentence: "青空（あおぞら）に 白い雲が うかんでいるね。",
          encouragement: "かんじマスターに 一歩近づいたぽこ！💮",
        },
        {
          title: "ことばの パズル",
          questionText: "「おおきい」の はんたいの ことばは なあに？",
          kanjiChar: "",
          furigana: "",
          correctAnswer: "ちいさい",
          options: ["ちいさい", "ながい", "おもい", "たかい"],
          hint: "アリさんや ビー玉のような 大きさのことだよ！",
          explanation: "「大きい」の 反対は「小さい」だね！ 大正解！",
          exampleSentence: "大きな ゾウと、小さな アリさん。",
          encouragement: "ことばの はかせ だね！ ホッホー！🦉",
        },
      ];
      const q = fallbackJapanese[Math.floor(Math.random() * fallbackJapanese.length)];
      return res.json(q);
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "クイズのタイトル" },
            questionText: { type: Type.STRING, description: "問題文" },
            kanjiChar: { type: Type.STRING, description: "関連する漢字（ある場合）" },
            furigana: { type: Type.STRING, description: "読みがな" },
            correctAnswer: { type: Type.STRING, description: "正解" },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4つの選択肢",
            },
            hint: { type: Type.STRING, description: "やさしいヒント" },
            explanation: { type: Type.STRING, description: "わかりやすい解説" },
            exampleSentence: { type: Type.STRING, description: "例文" },
            encouragement: { type: Type.STRING, description: "キャラクターからのほめ言葉" },
          },
          required: ["title", "questionText", "correctAnswer", "options", "hint", "explanation", "encouragement"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Japanese quest error:", error);
    res.status(500).json({ error: "国語問題の生成に失敗しました" });
  }
});

// 4. "Why & How" Curiosity Exploration (子どもなぜなぜ探検隊)
app.post("/api/ai/why-question", async (req, res) => {
  try {
    const { question, grade = 1 } = req.body;

    const systemInstruction = `
あなたは日本の小学校低学年向けの「なぜなぜ探検隊・科学と自然の博士」です。
子どもたちの素朴な疑問（「なぜ空は青いの？」「どうして鳥は飛べるの？」「夜はなぜ暗くなるの？」など）に対し、
6〜9歳の子どもが心から「へぇ〜！おもしろい！」と感動できる、わかりやすい解説をしてください。

要件:
1. 難しい専門用語は使わず、身近なもの（お風呂、絵の具、ボール、光の粒など）に例える。
2. 学年(${grade}年生)に合わせた言葉遣い。
3. 最後に「おうちでできるプチ観察・実験のヒント」または「おもしろミニクイズ」を1つ添える。
4. 全体で250〜350文字程度で、リズミカルに楽しく！
`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        topic: question || "なぜ空は青いの？",
        simpleAnswer: "太陽の光にはたくさんの色が入っていて、青い光が空気の中でいちばん元気に散らばるからだよ！",
        storyExplanation:
          "たいようの ひかりは、じつは にじみたいに『あか・き・あお』など いろんな いろが まざっているんだよ。\n\nそのなかで『あおい ひかり』は、つぶつぶが ちいさくて、そらの 空気に ぶつかると パラパラ〜ッと いちばん ひろがりやすいんだ！\nだから おひるの 空は きれいな あお色に みえるんだよ！",
        tryItIdea: "【おうちじっけん】コップの みずに 牛乳（ぎゅうにゅう）を 1てき いれて、かいちゅうでんとうの ひかりを あててみてね！ ほんのり あおく みえるよ！",
        miniQuiz: {
          question: "ゆうやけ（夕方）の 空が あかくなるのは なんでかな？",
          answer: "あかい光は とおくまですり抜けて 届くからだよ！",
        },
      });
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `子どもの質問: ${question}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "質問のテーマ" },
            simpleAnswer: { type: Type.STRING, description: "一言でいうと（超要約）" },
            storyExplanation: { type: Type.STRING, description: "楽しい例えを使ったくわしい説明（改行入り）" },
            tryItIdea: { type: Type.STRING, description: "おうちでできる観察や遊びのヒント" },
            miniQuiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "関連するおもしろミニクイズ" },
                answer: { type: Type.STRING, description: "クイズの答え" },
              },
              required: ["question", "answer"],
            },
          },
          required: ["topic", "simpleAnswer", "storyExplanation", "tryItIdea", "miniQuiz"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Why question error:", error);
    res.status(500).json({ error: "解説の生成に失敗しました" });
  }
});

// 5. Interactive Story Maker (おはなしをつくろう)
app.post("/api/ai/story-maker", async (req, res) => {
  try {
    const { hero = "うさぎの ピョンタ", setting = "お菓子のくに", magicItem = "そらとぶ ぼうし", grade = 1 } = req.body;

    const systemInstruction = `
あなたは子どもと一緒に絵本を作る作家です。
子どもが選んだ「主人公」「場所」「ふしぎなアイテム」を使って、
小学校低学年向けの心温まる3場面のショートストーリーを作成してください。

構成:
1. はじまり（主人公の紹介と旅立ち）
2. ぼうけん（不思議な出来事やアイテムの活躍）
3. できた！（うれしい結末とみんなの笑顔）
各場面に、子どもが想像しやすい情景と、キャラクターのセリフを入れてください。
`;

    const userPrompt = `
主人公: ${hero}
場所: ${setting}
アイテム: ${magicItem}
学年: ${grade}年生
`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        title: `${hero}と ${magicItem}の だいぼうけん`,
        scenes: [
          {
            sceneNumber: 1,
            sceneTitle: "はじまりの あさ",
            content: `あるひ、${hero}は ${setting}へ おさんぽに でかけました。ぽかぽか おひさまが わらっています。「きょうは なにが おきるかな？」`,
            illustrationPrompt: "sunny morning with cute hero walking happily",
            badge: "🌈 ぼうけんの はじまり",
          },
          {
            sceneNumber: 2,
            sceneTitle: "ふしぎな アイテム！",
            content: `もりのおくで、ピカピカ ひかる「${magicItem}」を みつけました！ 手にとってみると... ふわふわ〜っと 体が うきあがりました！「わあ、すごい！」`,
            illustrationPrompt: "magic glowing item floating in magical world",
            badge: "✨ まほうの ちから",
          },
          {
            sceneNumber: 3,
            sceneTitle: "みんなで にこにこ",
            content: `${magicItem}の おかげで、こまっていた 森のおともだちを たすけることが できました。みんなで たのしく パーティーを しました。めでたし めでたし！`,
            illustrationPrompt: "happy party with friends laughing and eating treats",
            badge: "🏆 ゆうしゃバッジ",
          },
        ],
        praiseMessage: "すてきな おはなしが 完成したね！ あなたは 天才絵本作家だぽこ！💮",
      });
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "ものがたりのタイトル" },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  sceneTitle: { type: Type.STRING },
                  content: { type: Type.STRING, description: "場面のお話（2〜3文）" },
                  illustrationPrompt: { type: Type.STRING },
                  badge: { type: Type.STRING, description: "場面の称号" },
                },
                required: ["sceneNumber", "sceneTitle", "content", "badge"],
              },
            },
            praiseMessage: { type: Type.STRING, description: "キャラクターからのほめ言葉" },
          },
          required: ["title", "scenes", "praiseMessage"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Story maker error:", error);
    res.status(500).json({ error: "お話の生成に失敗しました" });
  }
});

// 6. Sentence Maker & Free Talk Evaluator (優しい採点・アドバイス)
app.post("/api/ai/evaluate-answer", async (req, res) => {
  try {
    const { question, userAnswer, correctAnswer, grade = 1 } = req.body;

    const systemInstruction = `
あなたは小学校低学年の子どもの回答を採点・応援する優しいAI先生です。
子どもの回答が正解か、部分点か、惜しいかを判定し、常に前向きで自己肯定感を高めるメッセージを返してください。

判定ルール:
1. isCorrect: boolean (大筋で合っていればtrue)
2. feedback: 肯定的な言葉から始め、なぜそうなるかを優しく説明。
3. bonusStar: 1〜3 (頑張りに応じて星をあげる)
`;

    if (!process.env.GEMINI_API_KEY) {
      const isCorrect = String(userAnswer).trim() === String(correctAnswer).trim();
      return res.json({
        isCorrect,
        feedback: isCorrect
          ? "大正解！ 素晴らしいひらめきだぽこ！💮"
          : `惜しい！ とっても いい チャレンジだよ！ 正解は「${correctAnswer}」だよ。つぎも がんばろう！`,
        bonusStar: isCorrect ? 3 : 1,
      });
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `問題: ${question}\n正解の目安: ${correctAnswer}\n子どもの回答: ${userAnswer}\n学年: ${grade}年生`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING, description: "励ましと解説のメッセージ" },
            bonusStar: { type: Type.INTEGER, description: "獲得スター数 (1〜3)" },
          },
          required: ["isCorrect", "feedback", "bonusStar"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Evaluation error:", error);
    res.status(500).json({
      isCorrect: true,
      feedback: "よくがんばったね！ はなまるぽこ！💮",
      bonusStar: 2,
    });
  }
});

// 7. Generative UI Adventure Quest Generator
app.post("/api/ai/adventure-quest", async (req, res) => {
  try {
    const {
      grade = 1,
      companionId = "poko",
      worldId = "forest",
      themeIdea = "森のたからさがし",
    } = req.body;

    const worldNames: Record<string, { name: string; emoji: string }> = {
      forest: { name: "エメラルドの まほうの森", emoji: "🌲" },
      castle: { name: "星くずの 魔法城", emoji: "🏰" },
      volcano: { name: "紅蓮の ドラゴン火山", emoji: "🌋" },
      ocean: { name: "深海の クリスタル神殿", emoji: "🌊" },
      galaxy: { name: "星空の オーロラ銀河", emoji: "🌌" },
    };

    const targetWorld = worldNames[worldId] || worldNames.forest;

    if (!process.env.GEMINI_API_KEY) {
      // Smart offline fallback Generative UI Quest
      const sampleQuests = [
        {
          id: `ai_quest_${Date.now()}`,
          grade,
          worldId,
          worldName: targetWorld.name,
          worldEmoji: targetWorld.emoji,
          stageNumber: 1,
          totalStages: 3,
          subject: "math",
          title: `${themeIdea}の 暗号解除！`,
          storyIntro: `${themeIdea}の 現場に 到着しました！ 封印された 魔法のダイヤルを 正しい数字に 合わせよう！`,
          characterMood: "excited",
          questionPrompt: "「あわせて 10」に なるように 3に たす数を ダイヤルで 合わせよ！",
          hint: "10 - 3 は いくつかな？",
          loreExplanation: "3 + 7 = 10！ ダイヤルの 封印が パッと 解除されました！",
          encouragement: "大正解！ 素晴らしい ひらめきだぽこ！💮",
          correctAnswer: "7",
          uiConfig: {
            widgetType: "chest_lock",
            targetCode: "7",
            lockDials: [
              { label: "ダイヤル", current: 5, options: [3, 5, 7, 8, 9] },
            ],
          },
          rewards: {
            stars: 4,
            exp: 50,
            lootItem: {
              id: "item_starlight_key",
              name: "星くずの まほうの鍵",
              icon: "🗝️",
              description: "どんな 封印の宝箱も ピカピカ光って 開けてくれる 伝説の鍵。",
              rarity: "rare",
            },
          },
        },
      ];
      return res.json(sampleQuests[0]);
    }

    const ai = getAI();
    const systemInstruction = `
あなたは小学校低学年向けのRPG風知育アプリの冒険クエストおよびGenerative UI（生成UI）をデザインするゲームディレクター兼AI先生です。
子どもがワクワクするようなストーリーと、直感的に解ける「Generative UI」パラメータをJSON形式で生成してください。

選択可能な Generative UI widgetType:
1. 'chest_lock': 宝箱や扉のダイヤル暗号。lockDials (label, current, options配列) を設定。
2. 'crystal_scale': 天秤の重さバランス。targetWeight, leftPan, availableItems を設定。
3. 'stepping_stones': 川や溶岩の飛び石。stones配列 (id, text, isCorrect, feedback) を設定。
4. 'magic_charge': モンスターや精霊と仲良くなる魔法。monsterName, monsterEmoji, spells配列を設定。
5. 'ancient_tablet': 石板の穴埋めパズル。tabletPrompt, runes配列を設定。
6. 'potion_alchemy': 魔法薬の調合。potionTarget, ingredients配列を設定。
7. 'compass_dial': 羅針盤や時計。compassLabels配列を設定。
8. 'rpg_action': 冒険コマンド選択。actions配列を設定。

対象学年: 小学校${grade}年生（${grade === 1 ? "ひらがな中心で優しく" : grade === 2 ? "2年生の漢字・九九など" : "3年生の知恵と計算"}）。
世界観: ${targetWorld.name}
テーマ: ${themeIdea}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `学年: ${grade}年生\n相棒: ${companionId}\n冒険テーマ: ${themeIdea}\nこのテーマにぴったりなGenerative UIアドベンチャークエストを1つ作成してください。`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            grade: { type: Type.INTEGER },
            worldId: { type: Type.STRING },
            worldName: { type: Type.STRING },
            worldEmoji: { type: Type.STRING },
            stageNumber: { type: Type.INTEGER },
            totalStages: { type: Type.INTEGER },
            isBossStage: { type: Type.BOOLEAN },
            subject: { type: Type.STRING, enum: ["math", "japanese", "curiosity", "hybrid"] },
            title: { type: Type.STRING },
            storyIntro: { type: Type.STRING },
            characterMood: { type: Type.STRING, enum: ["excited", "thinking", "cheering"] },
            questionPrompt: { type: Type.STRING },
            hint: { type: Type.STRING },
            loreExplanation: { type: Type.STRING },
            encouragement: { type: Type.STRING },
            correctAnswer: { type: Type.STRING },
            uiConfig: {
              type: Type.OBJECT,
              properties: {
                widgetType: {
                  type: Type.STRING,
                  enum: [
                    "chest_lock",
                    "crystal_scale",
                    "stepping_stones",
                    "magic_charge",
                    "ancient_tablet",
                    "potion_alchemy",
                    "compass_dial",
                    "rpg_action",
                  ],
                },
                targetCode: { type: Type.STRING },
                targetWeight: { type: Type.INTEGER },
                riverTheme: { type: Type.STRING },
                monsterName: { type: Type.STRING },
                monsterEmoji: { type: Type.STRING },
                tabletPrompt: { type: Type.STRING },
                potionTarget: { type: Type.STRING },
                lockDials: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      current: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["label", "options"],
                  },
                },
                stones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      subText: { type: Type.STRING },
                      isCorrect: { type: Type.BOOLEAN },
                      feedback: { type: Type.STRING },
                    },
                    required: ["id", "text", "isCorrect"],
                  },
                },
                spells: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      element: { type: Type.STRING, enum: ["fire", "water", "nature", "star"] },
                      power: { type: Type.INTEGER },
                      label: { type: Type.STRING },
                      isCorrect: { type: Type.BOOLEAN },
                    },
                    required: ["id", "name", "element", "label", "isCorrect"],
                  },
                },
                runes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      char: { type: Type.STRING },
                      meaning: { type: Type.STRING },
                      isCorrect: { type: Type.BOOLEAN },
                    },
                    required: ["id", "char", "meaning", "isCorrect"],
                  },
                },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      icon: { type: Type.STRING },
                      amount: { type: Type.INTEGER },
                      isCorrect: { type: Type.BOOLEAN },
                    },
                    required: ["id", "name", "icon", "amount", "isCorrect"],
                  },
                },
                actions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      desc: { type: Type.STRING },
                      icon: { type: Type.STRING },
                      isCorrect: { type: Type.BOOLEAN },
                      badge: { type: Type.STRING },
                    },
                    required: ["id", "title", "desc", "icon", "isCorrect", "badge"],
                  },
                },
              },
              required: ["widgetType"],
            },
            rewards: {
              type: Type.OBJECT,
              properties: {
                stars: { type: Type.INTEGER },
                exp: { type: Type.INTEGER },
                lootItem: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    icon: { type: Type.STRING },
                    description: { type: Type.STRING },
                    rarity: { type: Type.STRING, enum: ["common", "rare", "epic", "legendary"] },
                  },
                  required: ["id", "name", "icon", "description", "rarity"],
                },
              },
              required: ["stars", "exp"],
            },
          },
          required: [
            "id",
            "title",
            "storyIntro",
            "questionPrompt",
            "hint",
            "loreExplanation",
            "encouragement",
            "correctAnswer",
            "uiConfig",
            "rewards",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    parsed.worldId = worldId;
    parsed.worldName = targetWorld.name;
    parsed.worldEmoji = targetWorld.emoji;
    parsed.grade = grade;

    res.json(parsed);
  } catch (error) {
    console.error("Adventure quest generator error:", error);
    res.status(500).json({ error: "冒険クエストの生成に失敗しました" });
  }
});

// Vite middleware for development or static serving for production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Educational App server running on http://0.0.0.0:${PORT}`);
  });
}

start();
