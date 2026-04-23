export function parseMarkdownToQuizData(mdText) {
  const lines = mdText.split('\n');
  let subjectData = {
    title: "カスタム教科書",
    color: "#e17055", // default color
    characterName: "ポリゴン",
    description: "ユーザーが作成した特別な教科データです。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png",
    hasSubCategories: false,
    questions: []
  };

  let currentTerm = 1;
  let isAdvanced = false;
  let currentQuestion = null;

  const pushCurrentQuestion = () => {
    if (currentQuestion && currentQuestion.question && currentQuestion.options.length > 0) {
      const correctAnswer = currentQuestion.options[0];
      const shuffledOptions = [...currentQuestion.options].sort(() => 0.5 - Math.random());
      const correctIndex = shuffledOptions.indexOf(correctAnswer);
      
      currentQuestion.options = shuffledOptions;
      currentQuestion.correctOptionIndex = correctIndex;
      subjectData.questions.push(currentQuestion);
      currentQuestion = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('# ')) {
      subjectData.title = line.replace('# ', '').trim();
    } else if (line.toLowerCase().startsWith('color:')) {
      subjectData.color = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.toLowerCase().startsWith('charactername:')) {
      subjectData.characterName = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.toLowerCase().startsWith('description:')) {
      subjectData.description = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.toLowerCase().startsWith('imageurl:')) {
      subjectData.imageUrl = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.startsWith('## ')) {
      pushCurrentQuestion(); // Push if there was an unhandled question
      
      const termTitle = line.replace('## ', '').trim();
      if (termTitle.includes('1') || termTitle.includes('１')) currentTerm = 1;
      else if (termTitle.includes('2') || termTitle.includes('２')) currentTerm = 2;
      else if (termTitle.includes('3') || termTitle.includes('３')) currentTerm = 3;
      else if (termTitle.includes('ふりかえり') || termTitle.includes('review')) currentTerm = 'review';
      else if (termTitle.includes('応用') || termTitle.includes('advanced')) {
          currentTerm = 'advanced';
          isAdvanced = true;
      }
      
      if (!termTitle.includes('応用') && !termTitle.includes('advanced')) {
          isAdvanced = false;
      }
    } else if (line.startsWith('Q:')) {
      pushCurrentQuestion(); // Safe check for previous un-pushed question
      currentQuestion = {
        id: `custom_${Date.now()}_${Math.random().toString().substring(2, 8)}`,
        term: currentTerm,
        isAdvanced: isAdvanced || currentTerm === 'advanced',
        question: line.replace('Q:', '').trim(),
        options: [],
        correctOptionIndex: 0,
        explanation: ""
      };
    } else if (line.startsWith('A1:')) {
      if (currentQuestion) currentQuestion.options.unshift(line.replace('A1:', '').trim());
    } else if (line.match(/^A[2-9]:/)) {
      if (currentQuestion) currentQuestion.options.push(line.substring(line.indexOf(':') + 1).trim());
    } else if (line.startsWith('解説:')) {
      if (currentQuestion) currentQuestion.explanation = line.replace('解説:', '').trim();
    }
  }

  // Push the final question if exists
  pushCurrentQuestion();

  return subjectData;
}
