import React, { useState, useEffect } from 'react';
import SubjectSelector from './components/SubjectSelector';
import SubCategorySelector from './components/SubCategorySelector';
import TermSelector from './components/TermSelector';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import FinalResultScreen from './components/FinalResultScreen';
import { quizData as initialQuizData } from './data/quizData';

function App() {
  const [quizData, setQuizData] = useState(initialQuizData);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'sub_category_selector', 'term_selector', 'normal_quiz', 'normal_result', 'advanced_quiz', 'final_result'
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [normalScore, setNormalScore] = useState(0);
  const [advancedScore, setAdvancedScore] = useState(0);

  // ランダムに選ばれた固定の問題プール
  const [currentNormalQuestions, setCurrentNormalQuestions] = useState([]);
  const [currentAdvancedQuestions, setCurrentAdvancedQuestions] = useState([]);

  const handleSelectSubject = (subjectKey) => {
    setSelectedSubject(subjectKey);
    const subject = quizData[subjectKey];
    if (subject.hasSubCategories) {
      setCurrentScreen('sub_category_selector');
    } else {
      setCurrentScreen('term_selector');
    }
  };

  const handleSelectSubCategory = (subCatId) => {
    setSelectedSubCategory(subCatId);
    setCurrentScreen('term_selector');
  };

  const handleSelectTerm = (termId) => {
    setSelectedTerm(termId);
    
    // 選択されたデータ群から問題を抽出し、シャッフルする
    const subject = quizData[selectedSubject];
    let pool = subject.questions.filter(q => q.term === termId);
    if (selectedSubCategory && subject.hasSubCategories) {
      pool = pool.filter(q => q.type === selectedSubCategory);
    }

    if (termId === 'advanced') {
      // 応用問題編の場合は、通常問題フェーズを飛ばしていきなり応用モードへ
      const advPool = pool.filter(q => q.isAdvanced);
      const shuffled = [...advPool].sort(() => 0.5 - Math.random());
      setCurrentAdvancedQuestions(shuffled.slice(0, 50)); // 最大50問出題可能
      setCurrentNormalQuestions([]);
      setCurrentScreen('advanced_quiz');
    } else {
      // 通常の学期・ふりかえりの場合
      const normalPool = pool.filter(q => !q.isAdvanced);
      const advPool = pool.filter(q => q.isAdvanced);
      
      const shuffledNormal = [...normalPool].sort(() => 0.5 - Math.random());
      setCurrentNormalQuestions(shuffledNormal.slice(0, 10)); // 最大10問出題
      
      const shuffledAdv = [...advPool].sort(() => 0.5 - Math.random());
      setCurrentAdvancedQuestions(shuffledAdv.slice(0, 1)); // 応用は最後に1問
      
      setCurrentScreen('normal_quiz');
    }
  };

  const handleNormalComplete = (finalScore) => {
    setNormalScore(finalScore);
    setCurrentScreen('normal_result');
  };

  const handleStartAdvanced = () => {
    setCurrentScreen('advanced_quiz');
  };

  const handleAdvancedComplete = (finalScore) => {
    setAdvancedScore(finalScore);
    setCurrentScreen('final_result');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
    setSelectedSubject(null);
    setSelectedSubCategory(null);
    setSelectedTerm(null);
    setNormalScore(0);
    setAdvancedScore(0);
  };

  const handleBackToSubject = () => {
    setSelectedSubCategory(null);
    setCurrentScreen('home');
    setSelectedSubject(null);
  };

  const handleAddCustomSubject = (customData, isMultiple = false) => {
    if (isMultiple) {
      setQuizData(prev => ({...prev, ...customData}));
    } else {
      const newKey = `custom_${Date.now()}`;
      setQuizData(prev => ({...prev, [newKey]: customData}));
    }
  };

  const subjectData = selectedSubject ? quizData[selectedSubject] : null;

  // 動的にタイトルを生成
  const getTermTitle = (t) => {
    if(t === 'review') return "ふりかえり編";
    if(t === 'advanced') return "応用問題編";
    return `${t}学期`;
  };

  // 背景画像の制御
  useEffect(() => {
    let bgUrl = '';

    // 科目に基づくナンバリングの決定
    const sub = selectedSubject || '';
    let subjectNumStr = '04'; // デフォルトは04（ホーム等汎用）
    if (sub.includes('japanese')) subjectNumStr = '06';
    else if (sub.includes('society')) subjectNumStr = '09';
    else if (sub.includes('math')) subjectNumStr = '12';
    else if (sub.includes('science')) subjectNumStr = '10';
    else if (sub.includes('english')) subjectNumStr = '01';

    if (currentScreen === 'home') {
      bgUrl = '/images/backgrounds/kabegami_04.png';
    } else if (currentScreen === 'normal_quiz' || currentScreen === 'advanced_quiz') {
      // プレイ中（クイズ中）の壁紙
      // 算数用(12)がwallpaper_側にない場合のフォールバック（02を代用）
      const wId = subjectNumStr === '12' ? '02' : subjectNumStr;
      bgUrl = `/images/backgrounds/wallpaper_${wId}.png`;
    } else if (currentScreen === 'normal_result') {
      bgUrl = `/images/backgrounds/kabegami_${subjectNumStr}.png`;
    } else if (currentScreen === 'final_result') {
      const percentage = currentAdvancedQuestions.length > 0 ? Math.round((advancedScore / currentAdvancedQuestions.length) * 100) : 0;
      if (percentage === 100) {
        bgUrl = '/images/backgrounds/kabegami_99.png'; // 満点
      } else if (percentage <= 50) {
        bgUrl = '/images/backgrounds/kabegami_05.png'; // 50点以下
      } else {
        bgUrl = '/images/backgrounds/kabegami_05.png';
      }
    }
    
    if (bgUrl) {
      document.body.style.backgroundImage = `url('${bgUrl}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = ''; // デフォルトのグラデーションに戻す
    }
  }, [currentScreen, selectedSubject, advancedScore, currentAdvancedQuestions.length]);

  return (
    <>
      {currentScreen === 'home' && (
        <SubjectSelector 
          quizData={quizData} 
          onSelectSubject={handleSelectSubject}
          onAddCustomSubject={handleAddCustomSubject}
        />
      )}

      {currentScreen === 'sub_category_selector' && subjectData && (
        <SubCategorySelector
          subjectData={subjectData}
          onSelectSubCategory={handleSelectSubCategory}
          onBack={handleBackToSubject}
        />
      )}

      {currentScreen === 'term_selector' && subjectData && (
        <TermSelector
          subjectData={subjectData}
          onSelectTerm={handleSelectTerm}
          onBack={subjectData.hasSubCategories ? () => setCurrentScreen('sub_category_selector') : handleBackToSubject}
        />
      )}
      
      {currentScreen === 'normal_quiz' && subjectData && currentNormalQuestions.length > 0 && (
        <QuizScreen 
          title={`${subjectData.title} (${getTermTitle(selectedTerm)} / 通常)`}
          questions={currentNormalQuestions}
          imageUrl={subjectData.imageUrl}
          characterName={subjectData.characterName}
          description={subjectData.description}
          onComplete={handleNormalComplete}
        />
      )}
      
      {currentScreen === 'normal_result' && subjectData && (
        <ResultScreen 
          score={normalScore}
          total={currentNormalQuestions.length}
          hasAdvancedData={currentAdvancedQuestions.length > 0}
          onStartAdvanced={handleStartAdvanced}
          onGoHome={handleGoHome}
        />
      )}

      {currentScreen === 'advanced_quiz' && subjectData && currentAdvancedQuestions.length > 0 && (
        <QuizScreen 
          title={`${subjectData.title} (${getTermTitle(selectedTerm)} / 応用)`}
          questions={currentAdvancedQuestions}
          imageUrl={subjectData.imageUrl}
          characterName={subjectData.characterName}
          description={subjectData.description}
          onComplete={handleAdvancedComplete}
        />
      )}

      {currentScreen === 'final_result' && subjectData && (
        <FinalResultScreen 
          score={advancedScore}
          total={currentAdvancedQuestions.length}
          onGoHome={handleGoHome}
        />
      )}
    </>
  );
}

export default App;
