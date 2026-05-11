/**
 * Google Gemini AI を使って小学5年生（札幌市採択教科書）の
 * 高品質クイズ問題を生成し、src/data/generatedQuizData.js を更新するスクリプト。
 *
 * 使い方:
 *   node generate_quiz_gemini.mjs
 *
 * 事前準備:
 *   1. npm install @google/generative-ai
 *   2. 環境変数 GEMINI_API_KEY にAPIキーをセット
 *      PowerShell: $env:GEMINI_API_KEY = "your-api-key"
 *      または .env.local に GEMINI_API_KEY=your-api-key を記述
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env.local を手動で読み込む（dotenv不要）
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY が設定されていません。');
  console.error('PowerShell: $env:GEMINI_API_KEY = "your-api-key"');
  console.error('または .env.local に GEMINI_API_KEY=your-api-key を記述してください。');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// 各教科の設定（札幌市採択教科書）
const SUBJECTS = [
  {
    id: 'japanese',
    name: '国語',
    textbook: '光村図書 五銀河',
    terms: {
      1: ['詩の表現技法（比喩・擬人法・反復法）', '漢字の成り立ち（象形・指事・会意・形声）', '物語「なまえつけてよ」', '俳句の基本（季語・五七五）', '5年生配当漢字（1学期）'],
      2: ['物語「たずねびと」', '随筆「枕草子」（清少納言）', '説明文「固有種が教えてくれること」', '5年生配当漢字（2学期）', '段落と文章構成'],
      3: ['物語「大造じいさんとガン」（椋鳩十）', '伝記「やなせたかし」', '意見文の書き方', '5年生配当漢字（3学期）', '敬語（丁寧語・尊敬語・謙譲語）'],
    },
  },
  {
    id: 'math',
    name: '算数',
    textbook: '啓林館 わくわく算数5',
    terms: {
      1: ['整数と小数（位と大きさ）', '体積（立方体・直方体）', '比例と関係', '小数のかけ算・わり算', '合同な図形'],
      2: ['整数の性質（公倍数・公約数）', '分数と小数の関係', '分数のたし算・ひき算', '図形の角', '平均'],
      3: ['割合とグラフ（百分率・帯グラフ・円グラフ）', '単位量あたりの大きさ', '速さ', '四角形の面積', '正多角形と円'],
    },
  },
  {
    id: 'science',
    name: '理科',
    textbook: '啓林館 理科5年',
    terms: {
      1: ['天気の変化（雲と天気の関係・気象情報）', '植物の発芽（水・空気・温度）', '植物の成長（日光・肥料）', 'メダカの誕生（雌雄の違い・たまごの変化）'],
      2: ['人の誕生（胎児の成長）', '川の流れ（浸食・運搬・堆積）', '台風と自然災害', '花のつくりと実のでき方'],
      3: ['もののとけ方（溶解・再結晶）', '電磁石の性質（コイル・電流）', '電気の利用', '振り子（周期・糸の長さ）'],
    },
  },
  {
    id: 'social',
    name: '社会',
    textbook: '東京書籍 新しい社会5',
    terms: {
      1: ['日本の国土と地形（山地・平野・川・海岸線）', '日本の気候（地域差・季節風）', '低地と高地の暮らし', '農業（米づくり・食料生産）'],
      2: ['水産業（漁業の種類・輸入）', '工業（自動車・鉄鋼・食品加工）', '工業地帯・工業地域', '貿易と運輸'],
      3: ['情報化社会とメディア', '環境問題と公害（四大公害）', '国土の自然環境保全', '日本の社会（国際化・少子高齢化）'],
    },
  },
  {
    id: 'english',
    name: '外国語（英語）',
    textbook: '東京書籍 NEW HORIZON Elementary 5',
    terms: {
      1: ['自己紹介（名前・出身・できること）', '誕生日の言い方', '時刻と日課', 'アルファベット大文字・小文字'],
      2: ['教科と時間割', '場所の言い方（道案内）', '自分の町の紹介', '夏休みの思い出'],
      3: ['できること・したいこと（can / want to）', '日本の行事と文化の紹介', '将来の夢', '世界の国々と文化'],
    },
  },
];

// 1テームあたり何問生成するか
const QUESTIONS_PER_TERM = 100;
const DELAY_MS = 2000; // レート制限対策

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateQuestionsForTerm(subject, term, topics) {
  const prompt = `
あなたは小学5年生向けクイズの専門家です。
以下の条件で「4択クイズ問題」を${QUESTIONS_PER_TERM}問、JSON配列として生成してください。

【教科】${subject.name}（${subject.textbook}）
【学期】${term}学期
【学習内容】${topics.join('、')}

【条件】
1. 難易度は小学5年生に適切なレベル
2. 各問題は4つの選択肢（options配列）を持つ
3. 正解は必ずしもindex 0でなくよい（0〜3でランダムに配置）
4. 選択肢は具体的で、明らかに間違いとわかる紛らわしい選択肢も含める
5. explanationは「なぜ正解か」を80文字以内でわかりやすく説明
6. isAdvanced: false（通常問題）にすること
7. 問題は互いに重複しないこと
8. 日本語で回答すること

【出力形式（JSONのみ、説明文は不要）】
[
  {
    "id": "${subject.id}_t${term}_q001",
    "term": ${term},
    "type": "standard",
    "question": "問題文",
    "options": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    "correctOptionIndex": 0,
    "explanation": "解説文",
    "isAdvanced": false
  },
  ...
]

必ず${QUESTIONS_PER_TERM}問すべて生成し、JSON配列のみを返してください。
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // JSONブロック抽出
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`JSON抽出失敗: ${text.substring(0, 200)}`);

  let questions = JSON.parse(jsonMatch[0]);

  // IDをユニークにする
  questions = questions.map((q, i) => ({
    ...q,
    id: `${subject.id}_t${term}_q${String(i + 1).padStart(3, '0')}_${Date.now()}`,
    term,
    isAdvanced: false,
  }));

  return questions;
}

async function generateAdvancedQuestions(subject) {
  const allTopics = Object.values(subject.terms).flat();
  const prompt = `
あなたは小学5年生向けクイズの専門家です。
以下の条件で「応用・発展レベルの4択クイズ問題」を30問、JSON配列として生成してください。

【教科】${subject.name}（${subject.textbook}）
【出題範囲】全学期（${allTopics.slice(0, 6).join('、')} など）

【条件】
1. 難易度は小学5年生の中〜上位レベル（応用・発展問題）
2. 複数の単元をまたいだ問題や、応用的な思考が必要な問題
3. 各問題は4つの選択肢を持つ
4. 正解インデックスは0〜3でランダムに
5. isAdvanced: true にすること

【出力形式（JSONのみ）】
[
  {
    "id": "adv_placeholder",
    "term": "advanced",
    "type": "advanced",
    "question": "問題文",
    "options": ["A", "B", "C", "D"],
    "correctOptionIndex": 1,
    "explanation": "解説",
    "isAdvanced": true
  }
]
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('JSON抽出失敗（応用問題）');

  let questions = JSON.parse(jsonMatch[0]);
  questions = questions.map((q, i) => ({
    ...q,
    id: `${subject.id}_adv_q${String(i + 1).padStart(3, '0')}_${Date.now()}`,
    term: 'advanced',
    isAdvanced: true,
  }));
  return questions;
}

async function main() {
  console.log('🚀 Gemini AI による問題生成を開始します...\n');

  const allSubjects = [];

  for (const subject of SUBJECTS) {
    console.log(`\n📚 ${subject.name}（${subject.textbook}）の問題を生成中...`);
    const allQuestions = [];

    for (const [term, topics] of Object.entries(subject.terms)) {
      console.log(`  📝 ${term}学期 (${QUESTIONS_PER_TERM}問)...`);
      try {
        const questions = await generateQuestionsForTerm(subject, Number(term), topics);
        allQuestions.push(...questions);
        console.log(`  ✅ ${term}学期: ${questions.length}問 生成完了`);
        await sleep(DELAY_MS);
      } catch (err) {
        console.error(`  ❌ ${term}学期 生成エラー:`, err.message);
      }
    }

    // 応用問題
    console.log('  📝 応用問題 (30問)...');
    try {
      const advQuestions = await generateAdvancedQuestions(subject);
      allQuestions.push(...advQuestions);
      console.log(`  ✅ 応用問題: ${advQuestions.length}問 生成完了`);
      await sleep(DELAY_MS);
    } catch (err) {
      console.error('  ❌ 応用問題 生成エラー:', err.message);
    }

    allSubjects.push({ id: subject.id, questions: allQuestions });
    console.log(`  🎉 ${subject.name} 合計: ${allQuestions.length}問`);
  }

  // generatedQuizData.js に書き出し
  const output = `// 自動生成: generate_quiz_gemini.mjs (Google Gemini AI)
// 生成日時: ${new Date().toISOString()}
// 札幌市採択教科書準拠 小学5年生 全教科

export const generatedSubjects = ${JSON.stringify(allSubjects, null, 2)};
`;

  const outPath = path.join(__dirname, 'src', 'data', 'generatedQuizData.js');
  fs.writeFileSync(outPath, output, 'utf-8');

  const totalQ = allSubjects.reduce((s, sub) => s + sub.questions.length, 0);
  console.log(`\n✅ 完了！ 合計 ${totalQ} 問を ${outPath} に書き出しました。`);
  console.log('次のステップ: npm run build && git add src/data/generatedQuizData.js && git commit -m "feat: Gemini AI生成問題に更新"');
}

main().catch((err) => {
  console.error('生成中にエラーが発生しました:', err);
  process.exit(1);
});
