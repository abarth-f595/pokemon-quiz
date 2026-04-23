const fs = require('fs');
const path = require('path');

// Read the JSON file
const jsonPath = path.join(__dirname, '小学5年生 全教科 年間学習内容問題データベース .json');
let jsonData = [];
try {
  const content = fs.readFileSync(jsonPath, 'utf8');
  jsonData = JSON.parse(content);
} catch (e) {
  console.error("Could not read JSON:", e);
}

// Map subject names to keys and styles
const subjectConfig = {
  "国語": { key: "japanese", title: "国語 (追加問題)", color: "#ff7675", characterName: "ヒスイゾロア" },
  "算数": { key: "math", title: "算数 (追加問題)", color: "#74b9ff", characterName: "アルセウス" },
  "理科": { key: "science", title: "理科 (追加問題)", color: "#55efc4", characterName: "スイクン" },
  "社会": { key: "society", title: "社会 (追加問題)", color: "#fdcb6e", characterName: "ザマゼンタ" },
  "英語": { key: "english", title: "英語 (追加問題)", color: "#a29bfe", characterName: "イーブイ" }
};

const processedData = {};

let advancedCount = 0;

// Group by subject to build answer pools for dummy options
const answerPools = {};
jsonData.forEach(item => {
  const subj = item.科目;
  if (!answerPools[subj]) answerPools[subj] = [];
  if (!answerPools[subj].includes(item.解答)) {
    answerPools[subj].push(item.解答);
  }
});

jsonData.forEach((item, index) => {
  const config = subjectConfig[item.科目];
  if (!config) return;

  const subjectKey = "notebook_" + config.key;

  if (!processedData[subjectKey]) {
    processedData[subjectKey] = {
      title: config.title,
      color: config.color,
      characterName: config.characterName,
      description: "NotebookLMが生成した学習データです。",
      imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", // Pikachu for all?
      hasSubCategories: false,
      questions: []
    };
  }

  // Determine term
  let term = 1;
  if (item.学期.includes('二')) term = 2;
  if (item.学期.includes('三')) term = 3;

  const isAdvanced = Math.random() > 0.8; // Randomly make 20% advanced questions

  // Generate Dummy Options
  const correct = item.解答;
  const pool = answerPools[item.科目].filter(a => a !== correct);
  
  // Shuffle pool and pick up to 3
  const shuffledPool = pool.sort(() => 0.5 - Math.random());
  const selectedDummies = shuffledPool.slice(0, 3);
  
  const options = [correct, ...selectedDummies];
  // Shuffle options
  const shuffledOptions = options.sort(() => 0.5 - Math.random());
  const correctIndex = shuffledOptions.indexOf(correct);

  processedData[subjectKey].questions.push({
    id: item.id || `nb_${index}`,
    term: term,
    isAdvanced: isAdvanced,
    question: item.問題文,
    options: shuffledOptions,
    correctOptionIndex: correctIndex,
    explanation: item.解説_採点基準 || "（解説なし）",
  });
});

const outputCode = `export const notebookQuizData = ${JSON.stringify(processedData, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'src/data/notebookQuizData.js'), outputCode);

console.log('Successfully generated src/data/notebookQuizData.js');
