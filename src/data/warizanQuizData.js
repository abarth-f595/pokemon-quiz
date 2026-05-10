
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

const makeQ = (id, term, dividend, divisor, isAdvanced = false) => {
  const correct = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  
  let questionStr = `筆算で計算しよう！ ${dividend} ÷ ${divisor} = ?`;
  let ansStr = String(correct);
  if (remainder > 0) {
    ansStr = `${correct} あまり ${remainder}`;
  }
  
  // Create dummies
  const dummies = [];
  let offset = 1;
  while(dummies.length < 3) {
      let dAns = correct + (Math.random() > 0.5 ? offset : -offset);
      if (dAns <= 0) dAns = correct + offset;
      
      let dStr = String(dAns);
      if (remainder > 0) {
          let dRem = remainder + (Math.random() > 0.5 ? 1 : -1);
          if (dRem <= 0 || dRem >= divisor) dRem = Math.max(1, remainder - 1);
          dStr = `${dAns} あまり ${dRem}`;
      }
      if (!dummies.includes(dStr) && dStr !== ansStr) {
          dummies.push(dStr);
      }
      offset++;
  }

  return {
    id,
    term,
    isAdvanced,
    question: questionStr,
    options: [ansStr, ...dummies],
    correctOptionIndex: 0,
    explanation: `${dividend} ÷ ${divisor} は、筆算を使って位をそろえて計算しましょう。`,
  };
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const level1 = []; // 2桁÷1桁
for (let i = 1; i <= 300; i++) {
  let divisor = rand(2, 9);
  let dividend = rand(10, 99);
  level1.push(makeQ(`WARI-L1-${i}`, 1, dividend, divisor));
}

const level2 = []; // 3桁÷1桁、2桁÷2桁
for (let i = 1; i <= 300; i++) {
  let divisor = Math.random() > 0.5 ? rand(2, 9) : rand(10, 50);
  let dividend = divisor < 10 ? rand(100, 999) : rand(20, 99);
  level2.push(makeQ(`WARI-L2-${i}`, 2, dividend, divisor));
}

const level3 = []; // 3桁÷2桁
for (let i = 1; i <= 300; i++) {
  let divisor = rand(11, 99);
  let dividend = rand(100, 999);
  level3.push(makeQ(`WARI-L3-${i}`, 3, dividend, divisor, true));
}

export const warizanSubject = {
  title: "割り算の筆算 (900問)",
  color: "#feca57",
  characterName: "ミュウツー",
  description: "正確にわり算の筆算をこなそう！あまりにも注意だ！",
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
  hasSubCategories: false,
  questions: [...level1, ...level2, ...level3],
};
