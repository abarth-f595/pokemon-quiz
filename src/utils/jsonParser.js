export function parseNotebookLMJsonToQuizData(jsonText) {
  let jsonData = [];
  try {
    jsonData = JSON.parse(jsonText);
  } catch (e) {
    console.error("JSON parsing error", e);
    return null;
  }

  // If it's not an array, it might not be the expected NotebookLM format
  if (!Array.isArray(jsonData)) {
      return null;
  }

  const subjectConfig = {
    "国語": { key: "japanese", title: "国語 (アップロード)", color: "#ff7675", characterName: "ヒスイゾロア", img: "/images/pokemon/hisuian_zorua.png" },
    "算数": { key: "math", title: "算数 (アップロード)", color: "#74b9ff", characterName: "アルセウス", img: "/images/pokemon/arceus.png" },
    "理科": { key: "science", title: "理科 (アップロード)", color: "#55efc4", characterName: "スイクン", img: "/images/pokemon/suicune.png" },
    "社会": { key: "society", title: "社会 (アップロード)", color: "#fdcb6e", characterName: "ザマゼンタ", img: "/images/pokemon/zamazenta.png" },
    "英語": { key: "english", title: "英語 (アップロード)", color: "#a29bfe", characterName: "イーブイ", img: "/images/pokemon/eevee.png" }
  };

  const answerPools = {};
  jsonData.forEach(item => {
    const subj = item.科目;
    if (!subj) return;
    if (!answerPools[subj]) answerPools[subj] = [];
    if (item.解答 && !answerPools[subj].includes(item.解答)) {
      answerPools[subj].push(item.解答);
    }
  });

  const processedData = {};

  jsonData.forEach((item, index) => {
    const config = subjectConfig[item.科目] || { 
        key: "custom", 
        title: item.科目 + " (追加)", 
        color: "#e17055", 
        characterName: "ポリゴン",
        img: "/images/pokemon/pikachu.png"
    };

    const subjectKey = "custom_json_" + config.key;

    if (!processedData[subjectKey]) {
      processedData[subjectKey] = {
        title: config.title,
        color: config.color,
        characterName: config.characterName,
        description: "アップロードされたJSONデータです。",
        imageUrl: config.img,
        hasSubCategories: false,
        questions: []
      };
    }

    let term = 1;
    if (item.学期) {
      if (item.学期.includes('二')) term = 2;
      if (item.学期.includes('三')) term = 3;
    }

    const isAdvanced = Math.random() > 0.8; 

    const correct = item.解答;
    let pool = answerPools[item.科目] ? answerPools[item.科目].filter(a => a !== correct) : [];
    
    // Fallback if pool doesn't have enough options
    if (pool.length < 3) {
        pool.push("分かりません");
        pool.push("問題の範囲外");
        pool.push("該当なし");
    }

    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selectedDummies = shuffledPool.slice(0, 3);
    
    const options = [correct, ...selectedDummies];
    const shuffledOptions = options.sort(() => 0.5 - Math.random());
    const correctIndex = shuffledOptions.indexOf(correct);

    processedData[subjectKey].questions.push({
      id: item.id || `custom_json_${Date.now()}_${index}`,
      term: term,
      isAdvanced: isAdvanced,
      question: item.問題文 || "問題文がありません",
      options: shuffledOptions,
      correctOptionIndex: correctIndex,
      explanation: item.解説_採点基準 || "（解説なし）",
    });
  });

  return processedData;
}
