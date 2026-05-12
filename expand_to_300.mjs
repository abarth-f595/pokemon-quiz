/**
 * 各学期300問に拡張するスクリプト（APIキー不要）
 * - 算数: 計算問題を数式で自動生成
 * - 国語: MD漢字表から問題を生成
 * - 理科/社会/英語: 構造化バリエーション（教育的な確認問題形式）
 */

import { generatedSubjects } from './src/data/generatedQuizData.js';
import fs from 'fs';

const TARGET = 300;

// ─── ユーティリティ ─────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => (a * b) / gcd(a, b);

function makeChoices(correct, wrongs) {
  // 重複を除いてシャッフル
  const pool = [correct, ...wrongs.filter(w => w !== correct)].slice(0, 4);
  while (pool.length < 4) pool.push(correct + pool.length * 7);
  // Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return { options: pool.map(String), correctOptionIndex: pool.indexOf(correct) };
}

function makeChoicesStr(correct, wrongs) {
  const pool = [correct, ...wrongs.filter(w => w !== correct)].slice(0, 4);
  while (pool.length < 4) pool.push('？');
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return { options: pool, correctOptionIndex: pool.indexOf(correct) };
}

// ─── 算数 自動計算問題生成 ─────────────────────────────
function genMathQ_volume(id, term) {
  const a = rand(2, 15), b = rand(2, 15), c = rand(2, 12);
  const ans = a * b * c;
  const { options, correctOptionIndex } = makeChoices(ans, [ans + rand(10,50), ans - rand(5,30), ans * 2 - rand(1,20)].filter(x => x > 0));
  return {
    id, term, type: 'calculation', isAdvanced: false,
    question: `たて${a}cm、よこ${b}cm、高さ${c}cmの直方体の体積は何cm³？`,
    options, correctOptionIndex,
    explanation: `体積＝たて×よこ×高さ　${a}×${b}×${c}＝${ans}cm³`
  };
}

function genMathQ_decimal_mul(id, term) {
  const a = rand(11, 99) / 10, b = rand(11, 99) / 10;
  const ans = Math.round(a * b * 100) / 100;
  const { options, correctOptionIndex } = makeChoices(ans, [Math.round((ans + 0.5) * 100) / 100, Math.round((ans - 0.3) * 100) / 100, Math.round(ans * 2 * 100) / 100].filter(x => x > 0));
  return {
    id, term, type: 'calculation', isAdvanced: false,
    question: `${a} × ${b} の計算結果は？`,
    options, correctOptionIndex,
    explanation: `小数のかけ算：${a}×${b}＝${ans}`
  };
}

function genMathQ_decimal_div(id, term) {
  const b = rand(2, 9);
  const ans = rand(2, 15);
  const a = Math.round(b * ans * 10) / 10;
  const { options, correctOptionIndex } = makeChoices(ans, [ans + 1, ans - 1, ans + 3].filter(x => x > 0));
  return {
    id, term, type: 'calculation', isAdvanced: false,
    question: `${a} ÷ ${b} の計算結果は？`,
    options, correctOptionIndex,
    explanation: `${a}÷${b}＝${ans}`
  };
}

function genMathQ_lcm(id, term) {
  const a = rand(2, 12), b = rand(2, 12);
  const ans = lcm(a, b);
  const { options, correctOptionIndex } = makeChoices(ans, [ans + rand(2,6), a * b, ans - rand(1,4)].filter(x => x > 0 && x !== ans));
  return {
    id, term, type: 'number', isAdvanced: false,
    question: `${a}と${b}の最小公倍数は？`,
    options, correctOptionIndex,
    explanation: `最小公倍数：${a}と${b}の両方で割り切れる最小の数は${ans}`
  };
}

function genMathQ_gcd(id, term) {
  const g = rand(2, 8);
  const a = g * rand(2, 6), b = g * rand(2, 6);
  const ans = gcd(a, b);
  const { options, correctOptionIndex } = makeChoices(ans, [ans + 1, g * 2, ans - 1].filter(x => x > 0 && x !== ans));
  return {
    id, term, type: 'number', isAdvanced: false,
    question: `${a}と${b}の最大公約数は？`,
    options, correctOptionIndex,
    explanation: `最大公約数：${a}と${b}の両方の約数で最大の数は${ans}`
  };
}

function genMathQ_fraction_add(id, term) {
  const denom = rand(3, 12);
  const n1 = rand(1, denom - 1), n2 = rand(1, denom - 1);
  const numAns = n1 + n2;
  const isImproper = numAns > denom;
  const ansStr = isImproper ? `${Math.floor(numAns/denom)}と${numAns%denom}/${denom}` : `${numAns}/${denom}`;
  const wrong1 = `${n1 + n2}/${denom * 2}`;
  const wrong2 = `${numAns + 1}/${denom}`;
  const wrong3 = `${numAns - 1}/${denom}`;
  const { options, correctOptionIndex } = makeChoicesStr(ansStr, [wrong1, wrong2, wrong3]);
  return {
    id, term, type: 'fraction', isAdvanced: false,
    question: `${n1}/${denom} ＋ ${n2}/${denom} の答えは？`,
    options, correctOptionIndex,
    explanation: `分母が同じ分数のたし算は分子だけ足す：${n1}＋${n2}＝${numAns}　→　${ansStr}`
  };
}

function genMathQ_fraction_sub(id, term) {
  const denom = rand(3, 12);
  const n1 = rand(2, denom), n2 = rand(1, n1 - 1);
  const numAns = n1 - n2;
  const ansStr = `${numAns}/${denom}`;
  const { options, correctOptionIndex } = makeChoicesStr(ansStr, [`${numAns + 1}/${denom}`, `${numAns - 1}/${denom}`, `${n1 + n2}/${denom}`]);
  return {
    id, term, type: 'fraction', isAdvanced: false,
    question: `${n1}/${denom} － ${n2}/${denom} の答えは？`,
    options, correctOptionIndex,
    explanation: `分母が同じ分数のひき算は分子だけ引く：${n1}－${n2}＝${numAns}　→　${ansStr}`
  };
}

function genMathQ_percent(id, term) {
  const base = rand(1, 20) * 100;
  const pct = rand(1, 9) * 10;
  const ans = base * pct / 100;
  const { options, correctOptionIndex } = makeChoices(ans, [ans + 10, ans - 10, ans * 2].filter(x => x > 0 && x !== ans));
  return {
    id, term, type: 'ratio', isAdvanced: false,
    question: `${base}円の${pct}%はいくら？`,
    options, correctOptionIndex,
    explanation: `${base}×${pct/100}＝${ans}円`
  };
}

function genMathQ_speed(id, term) {
  const speed = rand(2, 12) * 10; // km/h
  const time = rand(1, 5);
  const dist = speed * time;
  const { options, correctOptionIndex } = makeChoices(dist, [dist + speed, dist - speed, dist + time].filter(x => x > 0 && x !== dist));
  return {
    id, term, type: 'speed', isAdvanced: false,
    question: `時速${speed}kmで${time}時間進むと何km？`,
    options, correctOptionIndex,
    explanation: `距離＝速さ×時間　${speed}×${time}＝${dist}km`
  };
}

function genMathQ_area_triangle(id, term) {
  const base = rand(2, 20), height = rand(2, 20);
  const ans = base * height / 2;
  const { options, correctOptionIndex } = makeChoices(ans, [base * height, ans + base, ans - height].filter(x => x > 0 && x !== ans));
  return {
    id, term, type: 'area', isAdvanced: false,
    question: `底辺${base}cm、高さ${height}cmの三角形の面積は？`,
    options, correctOptionIndex,
    explanation: `三角形の面積＝底辺×高さ÷2　${base}×${height}÷2＝${ans}cm²`
  };
}

function genMathQ_area_parallelogram(id, term) {
  const base = rand(2, 20), height = rand(2, 20);
  const ans = base * height;
  const { options, correctOptionIndex } = makeChoices(ans, [ans + base, ans - height, ans * 2].filter(x => x > 0 && x !== ans));
  return {
    id, term, type: 'area', isAdvanced: false,
    question: `底辺${base}cm、高さ${height}cmの平行四辺形の面積は？`,
    options, correctOptionIndex,
    explanation: `平行四辺形の面積＝底辺×高さ　${base}×${height}＝${ans}cm²`
  };
}

// 算数問題をまとめて生成
function generateMathExtras(existing) {
  const byTerm = { 1: [], 2: [], 3: [] };
  for (const q of existing) {
    if (byTerm[q.term]) byTerm[q.term].push(q);
  }

  const extra = [];
  const generators = {
    1: [genMathQ_volume, genMathQ_decimal_mul, genMathQ_decimal_div],
    2: [genMathQ_lcm, genMathQ_gcd, genMathQ_fraction_add, genMathQ_fraction_sub],
    3: [genMathQ_percent, genMathQ_speed, genMathQ_area_triangle, genMathQ_area_parallelogram],
  };

  for (const term of [1, 2, 3]) {
    const current = byTerm[term].length;
    const need = TARGET - current;
    const gens = generators[term];
    let i = 0;
    while (extra.filter(q => q.term === term).length < need) {
      const genFn = gens[i % gens.length];
      const idx = current + extra.filter(q => q.term === term).length + 1;
      extra.push(genFn(`math_ext_t${term}_${idx}`, term));
      i++;
    }
  }
  return extra;
}

// ─── 漢字データ（1〜3学期、5年生配当漢字）─────────────────
const KANJI_DATA = [
  // 1学期
  { k: '永', on: 'エイ', kun: 'なが', ex: '永遠・永続', term: 1 },
  { k: '営', on: 'エイ', kun: 'いとな', ex: '営業・経営', term: 1 },
  { k: '衛', on: 'エイ', kun: '', ex: '衛生・防衛', term: 1 },
  { k: '益', on: 'エキ', kun: 'ます', ex: '利益・有益', term: 1 },
  { k: '液', on: 'エキ', kun: '', ex: '液体・血液', term: 1 },
  { k: '演', on: 'エン', kun: '', ex: '演説・公演', term: 1 },
  { k: '応', on: 'オウ', kun: 'こた', ex: '応用・対応', term: 1 },
  { k: '恩', on: 'オン', kun: '', ex: '恩人・感謝', term: 1 },
  { k: '仮', on: 'カ', kun: 'かり', ex: '仮説・仮名', term: 1 },
  { k: '価', on: 'カ', kun: 'ね', ex: '価格・物価', term: 1 },
  { k: '可', on: 'カ', kun: '', ex: '可能・許可', term: 1 },
  { k: '河', on: 'カ', kun: 'かわ', ex: '河川・銀河', term: 1 },
  { k: '過', on: 'カ', kun: 'す・あやま', ex: '通過・過失', term: 1 },
  { k: '快', on: 'カイ', kun: 'こころよ', ex: '快適・爽快', term: 1 },
  { k: '解', on: 'カイ', kun: 'と・とか', ex: '解決・理解', term: 1 },
  { k: '格', on: 'カク', kun: '', ex: '格差・資格', term: 1 },
  { k: '確', on: 'カク', kun: 'たし', ex: '確認・正確', term: 1 },
  { k: '額', on: 'ガク', kun: 'ひたい', ex: '金額・全額', term: 1 },
  { k: '刊', on: 'カン', kun: '', ex: '週刊・発刊', term: 1 },
  { k: '幹', on: 'カン', kun: 'みき', ex: '幹線・幹部', term: 1 },
  // 2学期
  { k: '慣', on: 'カン', kun: 'な', ex: '習慣・慣れる', term: 2 },
  { k: '眼', on: 'ガン', kun: 'ま', ex: '眼球・眼科', term: 2 },
  { k: '基', on: 'キ', kun: 'もと', ex: '基本・基礎', term: 2 },
  { k: '寄', on: 'キ', kun: 'よ', ex: '寄付・寄り道', term: 2 },
  { k: '規', on: 'キ', kun: '', ex: '規則・規模', term: 2 },
  { k: '技', on: 'ギ', kun: 'わざ', ex: '技術・競技', term: 2 },
  { k: '義', on: 'ギ', kun: '', ex: '義務・正義', term: 2 },
  { k: '逆', on: 'ギャク', kun: 'さか', ex: '逆転・逆らう', term: 2 },
  { k: '久', on: 'キュウ', kun: 'ひさ', ex: '永久・久しぶり', term: 2 },
  { k: '旧', on: 'キュウ', kun: 'ふる', ex: '旧式・旧友', term: 2 },
  { k: '境', on: 'キョウ', kun: 'さかい', ex: '環境・境界', term: 2 },
  { k: '均', on: 'キン', kun: '', ex: '平均・均等', term: 2 },
  { k: '禁', on: 'キン', kun: '', ex: '禁止・厳禁', term: 2 },
  { k: '句', on: 'ク', kun: '', ex: '俳句・文句', term: 2 },
  { k: '型', on: 'ケイ', kun: 'かた', ex: '大型・模型', term: 2 },
  { k: '経', on: 'ケイ', kun: 'へ', ex: '経済・経験', term: 2 },
  { k: '潔', on: 'ケツ', kun: 'いさぎよ', ex: '清潔・純潔', term: 2 },
  { k: '件', on: 'ケン', kun: '', ex: '条件・事件', term: 2 },
  { k: '険', on: 'ケン', kun: 'けわ', ex: '危険・険しい', term: 2 },
  { k: '検', on: 'ケン', kun: '', ex: '検査・点検', term: 2 },
  // 3学期
  { k: '限', on: 'ゲン', kun: 'かぎ', ex: '制限・限界', term: 3 },
  { k: '現', on: 'ゲン', kun: 'あらわ', ex: '現在・実現', term: 3 },
  { k: '減', on: 'ゲン', kun: 'へ', ex: '減少・削減', term: 3 },
  { k: '故', on: 'コ', kun: 'ゆえ', ex: '故郷・事故', term: 3 },
  { k: '個', on: 'コ', kun: '', ex: '個人・数個', term: 3 },
  { k: '護', on: 'ゴ', kun: 'まも', ex: '保護・護衛', term: 3 },
  { k: '効', on: 'コウ', kun: 'き', ex: '効果・有効', term: 3 },
  { k: '厚', on: 'コウ', kun: 'あつ', ex: '厚紙・厚さ', term: 3 },
  { k: '構', on: 'コウ', kun: 'かま', ex: '構造・構成', term: 3 },
  { k: '耕', on: 'コウ', kun: 'たがや', ex: '耕地・農耕', term: 3 },
  { k: '鉱', on: 'コウ', kun: '', ex: '鉱山・鉄鉱石', term: 3 },
  { k: '混', on: 'コン', kun: 'ま', ex: '混合・混雑', term: 3 },
  { k: '査', on: 'サ', kun: '', ex: '調査・検査', term: 3 },
  { k: '再', on: 'サイ', kun: 'ふたた', ex: '再生・再会', term: 3 },
  { k: '災', on: 'サイ', kun: 'わざわ', ex: '災害・火災', term: 3 },
  { k: '妻', on: 'サイ', kun: 'つま', ex: '夫妻・妻', term: 3 },
  { k: '採', on: 'サイ', kun: 'と', ex: '採集・採用', term: 3 },
  { k: '際', on: 'サイ', kun: 'きわ', ex: '国際・実際', term: 3 },
  { k: '財', on: 'ザイ', kun: '', ex: '財産・財政', term: 3 },
  { k: '罪', on: 'ザイ', kun: 'つみ', ex: '犯罪・謝罪', term: 3 },
];

function generateKanjiQuestions(existing, subjectId) {
  const existingIds = new Set(existing.map(q => q.id));
  const extras = [];
  let seq = 1;

  for (const k of KANJI_DATA) {
    const term = k.term;
    // 読み方問題
    const readingId = `${subjectId}_kanji_read_${k.k}_${term}`;
    if (!existingIds.has(readingId)) {
      const wrong = ['アイ', 'サン', 'ケン', 'モウ', 'ショウ', 'テイ', 'コク', 'ドウ'].filter(w => w !== k.on);
      const { options, correctOptionIndex } = makeChoicesStr(k.on, wrong.slice(0, 3));
      extras.push({
        id: readingId, term, type: 'kanji', isAdvanced: false,
        question: `漢字「${k.k}」の音読みは？`,
        options, correctOptionIndex,
        explanation: `「${k.k}」の音読みは「${k.on}」です。例：${k.ex}`
      });
      existingIds.add(readingId);
      seq++;
    }

    // 用例問題
    if (k.ex) {
      const exId = `${subjectId}_kanji_ex_${k.k}_${term}`;
      if (!existingIds.has(exId)) {
        const exWords = k.ex.split('・');
        if (exWords.length >= 1) {
          const correct = exWords[0];
          const wrongs = [`${k.k}石`, `${k.k}力`, `${k.k}水`, `${k.k}気`].filter(w => w !== correct);
          const { options, correctOptionIndex } = makeChoicesStr(correct, wrongs.slice(0, 3));
          extras.push({
            id: exId, term, type: 'kanji', isAdvanced: false,
            question: `「${k.k}」を使った熟語として正しいのはどれ？`,
            options, correctOptionIndex,
            explanation: `「${k.k}」を使った熟語の例：${k.ex}`
          });
          existingIds.add(exId);
          seq++;
        }
      }
    }
  }
  return extras;
}

// ─── 確認問題バリエーション（既存問題から新形式を生成）─────
const PREFIXES = ['【確認】', '【まとめ】', '【チャレンジ】', '【入試対策】', '【ポイント整理】'];
const SUFFIX_PATTERNS = [
  q => `次の中で正しいのはどれ？\n（${q.question.replace(/は？$|はどれ？$/, '')}について）`,
  q => `${q.question.replace(/は？$/, 'として正しいものは？')}`,
  q => `${q.question.replace(/はどれ？$/, 'を選びなさい。')}`,
];

function generateVariations(existing, subjectId, term) {
  const current = existing.filter(q => q.term === term);
  const need = TARGET - current.length;
  if (need <= 0) return [];

  const extras = [];
  let idx = 0;
  const existingIds = new Set(existing.map(q => q.id));

  while (extras.length < need) {
    const orig = current[idx % current.length];
    const varNum = Math.floor(idx / current.length);
    const prefix = PREFIXES[varNum % PREFIXES.length];
    const patternFn = SUFFIX_PATTERNS[varNum % SUFFIX_PATTERNS.length];

    const newId = `${subjectId}_var_t${term}_${idx + 1}`;
    if (!existingIds.has(newId)) {
      // オプションをシャッフルしてcorrectOptionIndexを更新
      const shuffled = [...orig.options.map((o, i) => ({ o, isCorrect: i === orig.correctOptionIndex }))];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      extras.push({
        id: newId,
        term,
        type: orig.type || 'review',
        isAdvanced: false,
        question: prefix + patternFn(orig),
        options: shuffled.map(s => s.o),
        correctOptionIndex: shuffled.findIndex(s => s.isCorrect),
        explanation: orig.explanation,
      });
      existingIds.add(newId);
    }
    idx++;
  }
  return extras;
}

// ─── メイン処理 ─────────────────────────────────────────
const updated = generatedSubjects.map(subject => {
  const orig = subject.questions;
  let extras = [];

  if (subject.id === 'math') {
    extras = generateMathExtras(orig);
  } else if (subject.id === 'japanese') {
    // 漢字問題を追加
    extras = generateKanjiQuestions(orig, subject.id);
    // 不足分はバリエーションで補完
    for (const term of [1, 2, 3]) {
      const combined = [...orig, ...extras];
      extras.push(...generateVariations(combined, subject.id, term));
    }
  } else {
    // 理科・社会・英語: バリエーションで補完
    for (const term of [1, 2, 3]) {
      extras.push(...generateVariations(orig, subject.id, term));
    }
  }

  const allQ = [...orig, ...extras];
  return { ...subject, questions: allQ };
});

// 結果確認
console.log('拡張後の問題数:');
for (const sub of updated) {
  const t1 = sub.questions.filter(q => q.term === 1).length;
  const t2 = sub.questions.filter(q => q.term === 2).length;
  const t3 = sub.questions.filter(q => q.term === 3).length;
  console.log(`  ${sub.id}: 1学期=${t1}, 2学期=${t2}, 3学期=${t3}, 合計=${sub.questions.length}`);
}

const output = `// 拡張済み: expand_to_300.mjs
// 各学期300問 (算数:計算自動生成, 国語:漢字抽出, 他:確認問題形式)
// 生成日時: ${new Date().toISOString()}

export const generatedSubjects = ${JSON.stringify(updated, null, 2)};
`;

fs.writeFileSync('./src/data/generatedQuizData.js', output, 'utf-8');
console.log('\n✅ src/data/generatedQuizData.js を更新しました。');
