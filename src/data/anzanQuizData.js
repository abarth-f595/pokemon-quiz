
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

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const level1 = [];
for (let i = 1; i <= 300; i++) {
  level1.push(makeQ(`ANZ-L1-${i}`, 1, rand(2,6), rand(2,6), rand(2,6)));
}

const level2 = [];
for (let i = 1; i <= 300; i++) {
  level2.push(makeQ(`ANZ-L2-${i}`, 2, rand(2,9), rand(2,9), rand(2,9)));
}

const level3 = [];
for (let i = 1; i <= 300; i++) {
  level3.push(makeQ(`ANZ-L3-${i}`, 3, rand(3,15), rand(3,15), rand(2,9), true));
}

export const anzanQuizData = {
  anzan_math: {
    title: "暗算 (a×b×c 900問)",
    color: "#74b9ff",
    characterName: "アルセウス",
    description: "3つの数のかけ算を頭の中で！左から順に計算しよう。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png",
    hasSubCategories: false,
    questions: [...level1, ...level2, ...level3],
  },
};
