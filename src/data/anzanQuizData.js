/**
 * 暗算練習クイズデータ（200問）
 * 出典: anzan_200.md — a × b × c の3つかけ算
 * Level 1: 50問（2〜6の数字）
 * Level 2: 80問（2〜9の数字）
 * Level 3: 70問（大きい数が入る 11〜15）
 *
 * 4択形式：正解 + ランダムな3つのダミー選択肢（正解の近い数値）
 */

/**
 * 正解の値に基づいてダミー選択肢を3つ生成するヘルパー関数
 * @param {number} correct - 正解の値
 * @returns {string[]} 正解を含む4択の配列（最初が正解）
 */
const makeOptions = (correct) => {
  const offsets = [-2, -1, 1, 2, -5, 5, -10, 10, -3, 3].filter((o) => correct + o > 0);
  const used = new Set([correct]);
  const dummies = [];
  for (const o of offsets) {
    if (dummies.length >= 3) break;
    const v = correct + o;
    if (!used.has(v)) {
      used.add(v);
      dummies.push(String(v));
    }
  }
  // 念のため不足分を補う
  let extra = 1;
  while (dummies.length < 3) {
    if (!used.has(correct + extra)) {
      dummies.push(String(correct + extra));
      used.add(correct + extra);
    }
    extra++;
  }
  return [String(correct), ...dummies];
};

/**
 * 問題データを生成する
 * @param {string} id - 問題ID
 * @param {number} term - 学期 (1〜3)
 * @param {number} a - かけ算の第1数
 * @param {number} b - かけ算の第2数
 * @param {number} c - かけ算の第3数
 * @param {boolean} isAdvanced - 応用問題フラグ
 * @returns {object} 問題オブジェクト
 */
const makeQ = (id, term, a, b, c, isAdvanced = false) => {
  const correct = a * b * c;
  return {
    id,
    term,
    isAdvanced,
    question: `頭の中で計算しよう！ ${a} × ${b} × ${c} = ?`,
    options: makeOptions(correct),
    correctOptionIndex: 0,
    explanation: `まず ${a} × ${b} = ${a * b}、次に ${a * b} × ${c} = ${correct} です！左から順に計算するのがコツです。`,
  };
};

// ========== Level 1: やさしい (2〜6) 50問 term=1 ==========
const level1Questions = [
  makeQ("ANZ-L1-001", 1, 2, 2, 4),
  makeQ("ANZ-L1-002", 1, 3, 3, 3),
  makeQ("ANZ-L1-003", 1, 2, 6, 2),
  makeQ("ANZ-L1-004", 1, 6, 5, 2),
  makeQ("ANZ-L1-005", 1, 2, 2, 3),
  makeQ("ANZ-L1-006", 1, 3, 6, 6),
  makeQ("ANZ-L1-007", 1, 2, 6, 3),
  makeQ("ANZ-L1-008", 1, 6, 5, 3),
  makeQ("ANZ-L1-009", 1, 5, 6, 4),
  makeQ("ANZ-L1-010", 1, 2, 3, 5),
  makeQ("ANZ-L1-011", 1, 4, 4, 3),
  makeQ("ANZ-L1-012", 1, 3, 4, 2),
  makeQ("ANZ-L1-013", 1, 2, 5, 2),
  makeQ("ANZ-L1-014", 1, 4, 4, 6),
  makeQ("ANZ-L1-015", 1, 4, 2, 5),
  makeQ("ANZ-L1-016", 1, 6, 2, 5),
  makeQ("ANZ-L1-017", 1, 2, 6, 4),
  makeQ("ANZ-L1-018", 1, 6, 4, 6),
  makeQ("ANZ-L1-019", 1, 3, 2, 2),
  makeQ("ANZ-L1-020", 1, 3, 4, 2),
  makeQ("ANZ-L1-021", 1, 3, 2, 5),
  makeQ("ANZ-L1-022", 1, 4, 5, 4),
  makeQ("ANZ-L1-023", 1, 3, 4, 4),
  makeQ("ANZ-L1-024", 1, 3, 4, 2),
  makeQ("ANZ-L1-025", 1, 6, 3, 6),
  makeQ("ANZ-L1-026", 1, 3, 3, 5),
  makeQ("ANZ-L1-027", 1, 5, 4, 6),
  makeQ("ANZ-L1-028", 1, 3, 4, 2),
  makeQ("ANZ-L1-029", 1, 3, 2, 4),
  makeQ("ANZ-L1-030", 1, 5, 4, 2),
  makeQ("ANZ-L1-031", 1, 3, 6, 4),
  makeQ("ANZ-L1-032", 1, 3, 5, 5),
  makeQ("ANZ-L1-033", 1, 5, 3, 4),
  makeQ("ANZ-L1-034", 1, 3, 3, 6),
  makeQ("ANZ-L1-035", 1, 6, 4, 6),
  makeQ("ANZ-L1-036", 1, 5, 6, 5),
  makeQ("ANZ-L1-037", 1, 4, 3, 3),
  makeQ("ANZ-L1-038", 1, 6, 5, 2),
  makeQ("ANZ-L1-039", 1, 2, 2, 3),
  makeQ("ANZ-L1-040", 1, 3, 5, 6),
  makeQ("ANZ-L1-041", 1, 2, 5, 5),
  makeQ("ANZ-L1-042", 1, 6, 5, 6),
  makeQ("ANZ-L1-043", 1, 4, 6, 2),
  makeQ("ANZ-L1-044", 1, 2, 6, 4),
  makeQ("ANZ-L1-045", 1, 4, 2, 4),
  makeQ("ANZ-L1-046", 1, 5, 3, 5),
  makeQ("ANZ-L1-047", 1, 2, 4, 6),
  makeQ("ANZ-L1-048", 1, 3, 6, 2),
  makeQ("ANZ-L1-049", 1, 4, 6, 6),
  makeQ("ANZ-L1-050", 1, 3, 3, 4),
];

// ========== Level 2: ふつう (2〜9) 80問 term=2 ==========
const level2Questions = [
  makeQ("ANZ-L2-001", 2, 4, 2, 7),
  makeQ("ANZ-L2-002", 2, 9, 2, 3),
  makeQ("ANZ-L2-003", 2, 7, 6, 5),
  makeQ("ANZ-L2-004", 2, 2, 5, 3),
  makeQ("ANZ-L2-005", 2, 3, 9, 3),
  makeQ("ANZ-L2-006", 2, 4, 4, 9),
  makeQ("ANZ-L2-007", 2, 4, 6, 8),
  makeQ("ANZ-L2-008", 2, 5, 5, 6),
  makeQ("ANZ-L2-009", 2, 8, 7, 9),
  makeQ("ANZ-L2-010", 2, 9, 3, 5),
  makeQ("ANZ-L2-011", 2, 5, 3, 7),
  makeQ("ANZ-L2-012", 2, 2, 5, 5),
  makeQ("ANZ-L2-013", 2, 2, 3, 2),
  makeQ("ANZ-L2-014", 2, 5, 3, 2),
  makeQ("ANZ-L2-015", 2, 7, 3, 5),
  makeQ("ANZ-L2-016", 2, 6, 9, 5),
  makeQ("ANZ-L2-017", 2, 4, 9, 5),
  makeQ("ANZ-L2-018", 2, 9, 8, 5),
  makeQ("ANZ-L2-019", 2, 3, 3, 8),
  makeQ("ANZ-L2-020", 2, 7, 8, 8),
  makeQ("ANZ-L2-021", 2, 9, 2, 3),
  makeQ("ANZ-L2-022", 2, 2, 8, 7),
  makeQ("ANZ-L2-023", 2, 3, 5, 5),
  makeQ("ANZ-L2-024", 2, 5, 9, 4),
  makeQ("ANZ-L2-025", 2, 8, 4, 6),
  makeQ("ANZ-L2-026", 2, 9, 5, 3),
  makeQ("ANZ-L2-027", 2, 9, 3, 2),
  makeQ("ANZ-L2-028", 2, 2, 3, 5),
  makeQ("ANZ-L2-029", 2, 4, 8, 9),
  makeQ("ANZ-L2-030", 2, 9, 5, 8),
  makeQ("ANZ-L2-031", 2, 2, 4, 8),
  makeQ("ANZ-L2-032", 2, 2, 8, 6),
  makeQ("ANZ-L2-033", 2, 9, 6, 8),
  makeQ("ANZ-L2-034", 2, 9, 4, 5),
  makeQ("ANZ-L2-035", 2, 6, 5, 2),
  makeQ("ANZ-L2-036", 2, 2, 7, 2),
  makeQ("ANZ-L2-037", 2, 2, 9, 4),
  makeQ("ANZ-L2-038", 2, 2, 3, 4),
  makeQ("ANZ-L2-039", 2, 3, 3, 5),
  makeQ("ANZ-L2-040", 2, 8, 3, 5),
  makeQ("ANZ-L2-041", 2, 2, 3, 8),
  makeQ("ANZ-L2-042", 2, 7, 6, 5),
  makeQ("ANZ-L2-043", 2, 7, 5, 6),
  makeQ("ANZ-L2-044", 2, 8, 4, 6),
  makeQ("ANZ-L2-045", 2, 9, 7, 3),
  makeQ("ANZ-L2-046", 2, 2, 9, 3),
  makeQ("ANZ-L2-047", 2, 3, 5, 6),
  makeQ("ANZ-L2-048", 2, 4, 7, 3),
  makeQ("ANZ-L2-049", 2, 5, 7, 6),
  makeQ("ANZ-L2-050", 2, 4, 9, 6),
  makeQ("ANZ-L2-051", 2, 2, 6, 3),
  makeQ("ANZ-L2-052", 2, 4, 6, 3),
  makeQ("ANZ-L2-053", 2, 3, 4, 6),
  makeQ("ANZ-L2-054", 2, 6, 5, 7),
  makeQ("ANZ-L2-055", 2, 5, 6, 9),
  makeQ("ANZ-L2-056", 2, 6, 2, 3),
  makeQ("ANZ-L2-057", 2, 8, 6, 2),
  makeQ("ANZ-L2-058", 2, 2, 7, 4),
  makeQ("ANZ-L2-059", 2, 6, 4, 9),
  makeQ("ANZ-L2-060", 2, 8, 2, 3),
  makeQ("ANZ-L2-061", 2, 3, 4, 2),
  makeQ("ANZ-L2-062", 2, 7, 4, 8),
  makeQ("ANZ-L2-063", 2, 4, 2, 6),
  makeQ("ANZ-L2-064", 2, 7, 2, 7),
  makeQ("ANZ-L2-065", 2, 5, 5, 3),
  makeQ("ANZ-L2-066", 2, 7, 8, 4),
  makeQ("ANZ-L2-067", 2, 5, 4, 4),
  makeQ("ANZ-L2-068", 2, 8, 2, 4),
  makeQ("ANZ-L2-069", 2, 7, 8, 5),
  makeQ("ANZ-L2-070", 2, 6, 4, 3),
  makeQ("ANZ-L2-071", 2, 8, 2, 9),
  makeQ("ANZ-L2-072", 2, 5, 5, 9),
  makeQ("ANZ-L2-073", 2, 7, 6, 5),
  makeQ("ANZ-L2-074", 2, 5, 2, 5),
  makeQ("ANZ-L2-075", 2, 8, 7, 6),
  makeQ("ANZ-L2-076", 2, 3, 6, 7),
  makeQ("ANZ-L2-077", 2, 8, 7, 2),
  makeQ("ANZ-L2-078", 2, 3, 6, 4),
  makeQ("ANZ-L2-079", 2, 6, 2, 3),
  makeQ("ANZ-L2-080", 2, 8, 7, 7),
];

// ========== Level 3: 応用 (大きい数 11〜15) 70問 term=3 isAdvanced=true ==========
const level3Questions = [
  makeQ("ANZ-L3-001", 3, 3, 8, 14, true),
  makeQ("ANZ-L3-002", 3, 2, 14, 6, true),
  makeQ("ANZ-L3-003", 3, 7, 8, 11, true),
  makeQ("ANZ-L3-004", 3, 7, 3, 13, true),
  makeQ("ANZ-L3-005", 3, 8, 7, 14, true),
  makeQ("ANZ-L3-006", 3, 4, 5, 14, true),
  makeQ("ANZ-L3-007", 3, 6, 4, 14, true),
  makeQ("ANZ-L3-008", 3, 6, 12, 6, true),
  makeQ("ANZ-L3-009", 3, 9, 9, 14, true),
  makeQ("ANZ-L3-010", 3, 9, 11, 4, true),
  makeQ("ANZ-L3-011", 3, 5, 13, 3, true),
  makeQ("ANZ-L3-012", 3, 11, 2, 4, true),
  makeQ("ANZ-L3-013", 3, 9, 3, 14, true),
  makeQ("ANZ-L3-014", 3, 9, 14, 8, true),
  makeQ("ANZ-L3-015", 3, 3, 14, 2, true),
  makeQ("ANZ-L3-016", 3, 2, 15, 9, true),
  makeQ("ANZ-L3-017", 3, 9, 4, 14, true),
  makeQ("ANZ-L3-018", 3, 15, 9, 8, true),
  makeQ("ANZ-L3-019", 3, 13, 9, 9, true),
  makeQ("ANZ-L3-020", 3, 13, 9, 5, true),
  makeQ("ANZ-L3-021", 3, 6, 13, 5, true),
  makeQ("ANZ-L3-022", 3, 12, 4, 3, true),
  makeQ("ANZ-L3-023", 3, 4, 11, 5, true),
  makeQ("ANZ-L3-024", 3, 9, 14, 7, true),
  makeQ("ANZ-L3-025", 3, 8, 8, 15, true),
  makeQ("ANZ-L3-026", 3, 8, 11, 9, true),
  makeQ("ANZ-L3-027", 3, 8, 8, 15, true),
  makeQ("ANZ-L3-028", 3, 9, 13, 5, true),
  makeQ("ANZ-L3-029", 3, 2, 8, 13, true),
  makeQ("ANZ-L3-030", 3, 9, 4, 12, true),
  makeQ("ANZ-L3-031", 3, 8, 2, 11, true),
  makeQ("ANZ-L3-032", 3, 12, 9, 4, true),
  makeQ("ANZ-L3-033", 3, 8, 12, 7, true),
  makeQ("ANZ-L3-034", 3, 7, 13, 8, true),
  makeQ("ANZ-L3-035", 3, 9, 3, 11, true),
  makeQ("ANZ-L3-036", 3, 5, 7, 11, true),
  makeQ("ANZ-L3-037", 3, 5, 12, 2, true),
  makeQ("ANZ-L3-038", 3, 4, 5, 14, true),
  makeQ("ANZ-L3-039", 3, 13, 5, 9, true),
  makeQ("ANZ-L3-040", 3, 4, 13, 3, true),
  makeQ("ANZ-L3-041", 3, 8, 6, 14, true),
  makeQ("ANZ-L3-042", 3, 3, 5, 11, true),
  makeQ("ANZ-L3-043", 3, 3, 2, 13, true),
  makeQ("ANZ-L3-044", 3, 7, 3, 15, true),
  makeQ("ANZ-L3-045", 3, 14, 8, 2, true),
  makeQ("ANZ-L3-046", 3, 12, 7, 9, true),
  makeQ("ANZ-L3-047", 3, 6, 14, 9, true),
  makeQ("ANZ-L3-048", 3, 7, 11, 5, true),
  makeQ("ANZ-L3-049", 3, 5, 9, 15, true),
  makeQ("ANZ-L3-050", 3, 14, 7, 2, true),
  makeQ("ANZ-L3-051", 3, 9, 13, 5, true),
  makeQ("ANZ-L3-052", 3, 6, 15, 6, true),
  makeQ("ANZ-L3-053", 3, 14, 3, 5, true),
  makeQ("ANZ-L3-054", 3, 9, 14, 9, true),
  makeQ("ANZ-L3-055", 3, 5, 6, 14, true),
  makeQ("ANZ-L3-056", 3, 6, 7, 14, true),
  makeQ("ANZ-L3-057", 3, 8, 7, 13, true),
  makeQ("ANZ-L3-058", 3, 6, 13, 6, true),
  makeQ("ANZ-L3-059", 3, 7, 5, 11, true),
  makeQ("ANZ-L3-060", 3, 5, 14, 5, true),
  makeQ("ANZ-L3-061", 3, 13, 5, 3, true),
  makeQ("ANZ-L3-062", 3, 6, 4, 11, true),
  makeQ("ANZ-L3-063", 3, 6, 2, 11, true),
  makeQ("ANZ-L3-064", 3, 11, 9, 4, true),
  makeQ("ANZ-L3-065", 3, 14, 9, 9, true),
  makeQ("ANZ-L3-066", 3, 6, 14, 2, true),
  makeQ("ANZ-L3-067", 3, 9, 8, 11, true),
  makeQ("ANZ-L3-068", 3, 15, 4, 4, true),
  makeQ("ANZ-L3-069", 3, 15, 5, 3, true),
  makeQ("ANZ-L3-070", 3, 8, 14, 9, true),
];

/**
 * 暗算クイズデータのエクスポート
 * math カテゴリにマージするための形式
 */
export const anzanQuizData = {
  anzan_math: {
    title: "暗算 (a×b×c 200問)",
    color: "#74b9ff",
    characterName: "アルセウス",
    description: "3つの数のかけ算を頭の中で！左から順に計算しよう。",
    imageUrl: "/images/pokemon/arceus.png",
    hasSubCategories: false,
    questions: [
      ...level1Questions,
      ...level2Questions,
      ...level3Questions,
    ],
  },
};
