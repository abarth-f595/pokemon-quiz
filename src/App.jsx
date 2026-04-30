import React, { useState, useEffect } from 'react';
import SubjectSelector from './components/SubjectSelector';
import SubCategorySelector from './components/SubCategorySelector';
import TermSelector from './components/TermSelector';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import FinalResultScreen from './components/FinalResultScreen';
import CalcDrillSelector from './components/CalcDrillSelector';
import CalcDrillScreen from './components/CalcDrillScreen';
import { quizData as initialQuizData } from './data/quizData';
import { getStats, getTermAccuracy, recordResult } from './utils/storage';
import { startBGM, stopBGM, setVolume, setMuted, getVolume, getMuted } from './utils/gymBGM';

function App() {
  const [quizData, setQuizData] = useState(initialQuizData);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'sub_category_selector', 'term_selector', 'normal_quiz', 'normal_result', 'advanced_quiz', 'final_result', 'calc_drill_selector', 'calc_drill_playing'
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [normalScore, setNormalScore] = useState(0);
  const [advancedScore, setAdvancedScore] = useState(0);
  const [calcDrillConfig, setCalcDrillConfig] = useState(null); // 計算ドリルの設定

  // 音量設定（localStorage で永続化）
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('bgm_volume');
    return saved !== null ? parseFloat(saved) : 1.0;
  });
  const [muted, setMutedState] = useState(() => {
    return localStorage.getItem('bgm_muted') === 'true';
  });
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolumeState(v);
    setVolume(v);
    localStorage.setItem('bgm_volume', v);
    if (v > 0 && muted) {
      setMutedState(false);
      setMuted(false);
      localStorage.setItem('bgm_muted', 'false');
    }
  };

  const handleToggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
    localStorage.setItem('bgm_muted', next);
  };

  // 初期値をBGMモジュールに反映
  useEffect(() => {
    setVolume(volume);
    setMuted(muted);
  }, []);

  // ランダムに選ばれた固定の問題プール
  const [currentNormalQuestions, setCurrentNormalQuestions] = useState([]);
  const [currentAdvancedQuestions, setCurrentAdvancedQuestions] = useState([]);

  const handleSelectSubject = (subjectKey, mode) => {
    setSelectedSubject(subjectKey);
    const subject = quizData[subjectKey];

    // 計算ドリルは専用の選択画面へ
    if (subject.isCalcDrill) {
      setCurrentScreen('calc_drill_selector');
      return;
    }

    if (mode === 'advanced') {
      // ホーム画面から直接「応用問題」を起動する
      setSelectedTerm('advanced');
      const advPool = subject.questions.filter(q => q.isAdvanced);
      const shuffled = [...advPool].sort(() => 0.5 - Math.random());
      setCurrentAdvancedQuestions(shuffled.slice(0, 10)); // 最大10問
      setCurrentNormalQuestions([]);
      setCurrentScreen('advanced_quiz');
      return;
    }

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
      setCurrentAdvancedQuestions(shuffled.slice(0, 10)); // 最大10問
      setCurrentNormalQuestions([]);
      setCurrentScreen('advanced_quiz');
    } else if (termId === 'mix') {
      // 総集編：全学期ミックス + 苦手克服アダプティブロジック
      let allNormal = subject.questions.filter(q => !q.isAdvanced);
      
      // 各学期の正答率を取得し、苦手度（1 - 正答率）を計算
      const termWeights = {
        1: Math.max(0.2, 1 - getTermAccuracy(selectedSubject, '1')),
        2: Math.max(0.2, 1 - getTermAccuracy(selectedSubject, '2')),
        3: Math.max(0.2, 1 - getTermAccuracy(selectedSubject, '3'))
      };

      // 問題ごとに基本ウェイトに乱数を掛けてスコア付けし、ソート
      const scoredMix = allNormal.map(q => {
        const weight = termWeights[q.term] || 0.5; // ふりかえり等はデフォルト
        return { ...q, randomScore: Math.random() * weight };
      });

      scoredMix.sort((a, b) => b.randomScore - a.randomScore); // スコアが高い（苦手＆乱数大）ものを上へ
      
      setCurrentNormalQuestions(scoredMix.slice(0, 10));

      const advPool = subject.questions.filter(q => q.isAdvanced);
      const shuffledAdv = [...advPool].sort(() => 0.5 - Math.random());
      setCurrentAdvancedQuestions(shuffledAdv.slice(0, 1));
      
      setCurrentScreen('normal_quiz');
    } else {
      // 通常の学期・ふりかえりの場合もアダプティヴ（苦手な問題を優先）
      const normalPool = pool.filter(q => !q.isAdvanced);
      const advPool = pool.filter(q => q.isAdvanced);
      
      const stats = getStats();
      const subjectStats = stats[selectedSubject] || { questions: {} };
      
      const scoredNormal = normalPool.map(q => {
          const qStats = subjectStats.questions[q.id] || { totalAnswered: 0, totalCorrect: 0 };
          const accuracy = qStats.totalAnswered === 0 ? 0.5 : (qStats.totalCorrect / qStats.totalAnswered);
          const weight = Math.max(0.1, 1 - accuracy); // 取れてない問題を優先
          return { ...q, randomScore: Math.random() * weight };
      });
      
      scoredNormal.sort((a, b) => b.randomScore - a.randomScore);
      setCurrentNormalQuestions(scoredNormal.slice(0, 10)); // 最大10問
      
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

  const handleAnswer = (questionId, isCorrect) => {
    recordResult(selectedSubject, selectedTerm, questionId, isCorrect);
  };

  const subjectData = selectedSubject ? quizData[selectedSubject] : null;

  // 動的にタイトルを生成
  const getTermTitle = (t) => {
    if(t === 'mix') return "総集編 (AIアダプティブ)";
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
    else if (sub.includes('math') || sub.includes('anzan')) subjectNumStr = '12';
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

  // BGM制御: クイズ・ドリル画面中は再生、それ以外はフェードアウト停止
  useEffect(() => {
    if (
      currentScreen === 'normal_quiz' ||
      currentScreen === 'advanced_quiz' ||
      currentScreen === 'calc_drill_playing'
    ) {
      startBGM();
    } else {
      stopBGM();
    }
  }, [currentScreen]);

  // アイコンの選択
  const volumeIcon = muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊';

  return (
    <>
      {/* フローティング音量コントロール */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px',
        }}
      >
        {showVolumeSlider && (
          <div
            style={{
              background: 'rgba(30,30,60,0.88)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              音量
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              style={{
                writingMode: 'vertical-lr',
                direction: 'rtl',
                width: '6px',
                height: '80px',
                cursor: 'pointer',
                accentColor: '#ffd700',
              }}
            />
            <span style={{ color: '#ffd700', fontSize: '11px' }}>
              {muted ? '0' : Math.round(volume * 100)}
            </span>
          </div>
        )}
        <button
          onClick={() => setShowVolumeSlider(v => !v)}
          onDoubleClick={handleToggleMute}
          title={`音量: ${Math.round(volume * 100)}%\nシングルクリック: スライダー表示\nダブルクリック: ミュート切替`}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '2px solid rgba(255,215,0,0.7)',
            background: 'rgba(30,30,60,0.85)',
            fontSize: '22px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            transition: 'transform 0.15s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {volumeIcon}
        </button>
      </div>

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
          onAnswer={handleAnswer}
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
          subjectId={selectedSubject}
        />
      )}

      {currentScreen === 'advanced_quiz' && subjectData && currentAdvancedQuestions.length > 0 && (
        <QuizScreen 
          title={`${subjectData.title} (${getTermTitle(selectedTerm)} / 応用)`}
          questions={currentAdvancedQuestions}
          imageUrl={subjectData.imageUrl}
          characterName={subjectData.characterName}
          description={subjectData.description}
          onAnswer={handleAnswer}
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

      {/* ── 計算ドリル ── */}
      {currentScreen === 'calc_drill_selector' && (
        <CalcDrillSelector
          onStart={(config) => {
            setCalcDrillConfig(config);
            setCurrentScreen('calc_drill_playing');
          }}
          onBack={() => {
            setSelectedSubject(null);
            setCurrentScreen('home');
          }}
        />
      )}

      {currentScreen === 'calc_drill_playing' && calcDrillConfig && (
        <CalcDrillScreen
          operation={calcDrillConfig.operation}
          difficulty={calcDrillConfig.difficulty}
          questionCount={calcDrillConfig.count}
          onGoHome={() => {
            setCurrentScreen('home');
            setSelectedSubject(null);
            setCalcDrillConfig(null);
          }}
        />
      )}
    </>
  );
}

export default App;
