/**
 * calcGenerator.js
 * 計算ドリル用の問題を自動生成するユーティリティ
 *
 * 対応演算: たし算 / ひき算 / かけ算 / わり算 / 混合
 * 難易度  : かんたん / ふつう / むずかしい
 */

// 整数のランダム生成
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ============================================================
// 難易度別・演算別の問題生成定義
// ============================================================
const GENERATORS = {
  // ── たし算 ──────────────────────────────────────────────
  add: {
    easy:   () => { const a = rand(1,20),  b = rand(1,20);           return { display: `${a} ＋ ${b}`, ans: a+b }; },
    normal: () => { const a = rand(10,99), b = rand(10,99);           return { display: `${a} ＋ ${b}`, ans: a+b }; },
    hard:   () => { const a = rand(100,999),b = rand(100,999);        return { display: `${a} ＋ ${b}`, ans: a+b }; },
  },
  // ── ひき算 ──────────────────────────────────────────────
  sub: {
    easy:   () => { const a = rand(5,20),  b = rand(1,a);            return { display: `${a} ー ${b}`, ans: a-b }; },
    normal: () => { const a = rand(20,99), b = rand(5,a-1);          return { display: `${a} ー ${b}`, ans: a-b }; },
    hard:   () => { const a = rand(200,999),b = rand(50,a-1);        return { display: `${a} ー ${b}`, ans: a-b }; },
  },
  // ── かけ算 ──────────────────────────────────────────────
  mul: {
    easy:   () => { const a = rand(1,9),   b = rand(1,9);            return { display: `${a} × ${b}`, ans: a*b }; },
    normal: () => { const a = rand(2,99),  b = rand(2,9);            return { display: `${a} × ${b}`, ans: a*b }; },
    hard:   () => { const a = rand(10,99), b = rand(10,99);          return { display: `${a} × ${b}`, ans: a*b }; },
  },
  // ── わり算 (割り切れる形で生成) ─────────────────────────
  div: {
    easy:   () => { const b = rand(1,9),  ans = rand(1,9);           return { display: `${ans*b} ÷ ${b}`,  ans }; },
    normal: () => { const b = rand(2,9),  ans = rand(2,20);          return { display: `${ans*b} ÷ ${b}`,  ans }; },
    hard:   () => { const b = rand(2,12), ans = rand(10,99);         return { display: `${ans*b} ÷ ${b}`,  ans }; },
  },
};

// 演算ラベルと記号
export const OPERATION_LABELS = {
  add:   '➕ たし算',
  sub:   '➖ ひき算',
  mul:   '✖ かけ算',
  div:   '➗ わり算',
  mixed: '🔀 混合（4種ランダム）',
};

export const DIFFICULTY_LABELS = {
  easy:   'かんたん',
  normal: 'ふつう',
  hard:   'むずかしい',
};

// ============================================================
// 選択肢（ダミー）生成
// ============================================================
function makeOptions(correct) {
  // 正解の大きさに応じてオフセット幅を変える
  const d = Math.max(1, Math.round(correct * 0.08));
  const candidates = [d, -d, d*2, -d*2, d*3, -d*3, 1, -1, 2, -2, 5, -5];
  const used = new Set([correct]);
  const dummies = [];

  for (const offset of candidates) {
    if (dummies.length >= 3) break;
    const v = correct + offset;
    if (v > 0 && !used.has(v)) {
      used.add(v);
      dummies.push(v);
    }
  }
  // 万が一3つ揃わなかった時の補完
  let extra = 1;
  while (dummies.length < 3) {
    if (!used.has(correct + extra)) { dummies.push(correct + extra); used.add(correct + extra); }
    extra++;
  }

  // Fisher-Yates シャッフル
  const all = [correct, ...dummies];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return { options: all.map(String), correctIndex: all.indexOf(correct) };
}

// ============================================================
// Public API
// ============================================================

/**
 * 1問を生成する
 * @param {'add'|'sub'|'mul'|'div'|'mixed'} operation
 * @param {'easy'|'normal'|'hard'} difficulty
 * @returns {{ id, display, question, options, correctIndex, answer }}
 */
export function generateProblem(operation, difficulty) {
  // 混合の場合はランダムで演算を選択
  const ops = ['add', 'sub', 'mul', 'div'];
  const op = operation === 'mixed' ? ops[rand(0, ops.length - 1)] : operation;

  const gen = GENERATORS[op]?.[difficulty];
  if (!gen) throw new Error(`Unknown operation/difficulty: ${op}/${difficulty}`);

  const { display, ans } = gen();
  const { options, correctIndex } = makeOptions(ans);

  return {
    id:           `${op}_${difficulty}_${Date.now()}_${Math.random()}`,
    display,                        // 問題文（例: "48 × 7"）
    question:     `${display} = ？`, // 表示用
    options,
    correctIndex,
    answer:       ans,
    operation:    op,
    difficulty,
  };
}

/**
 * 複数問を一括生成する
 * @param {'add'|'sub'|'mul'|'div'|'mixed'} operation
 * @param {'easy'|'normal'|'hard'} difficulty
 * @param {number} count
 * @returns {Array}
 */
export function generateProblems(operation, difficulty, count = 10) {
  return Array.from({ length: count }, () => generateProblem(operation, difficulty));
}
