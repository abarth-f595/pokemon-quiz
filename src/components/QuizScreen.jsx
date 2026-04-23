import React, { useState, useEffect } from 'react';

const QuizScreen = ({ title, questions, imageUrl, characterName, description, onAnswer, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];

  const allPokemon = [
    "arceus.png", "eevee.png", "entei.png", "espeon.png", "flareon.png", "gardevoir.png", "glaceon.png", "hisuian_zoroark.png", "hisuian_zorua_v2.png", "jolteon.png", "kirlia.png", "latias.png", "latios.png", "leafeon.png", "lucario.png", "magikarp.png", "meowth.png", "mew.png", "mewtwo.png", "pikachu.png", "raikou.png", "ralts.png", "riolu.png", "suicune.png", "sylveon.png", "umbreon.png", "zacian.png", "zacian1.png", "zamazenta.png", "zamazenta1.png", "zoroark.png", "zorua.png"
  ];

  const [floatingPokemon, setFloatingPokemon] = useState([]);

  useEffect(() => {
    // 問題が変わるたびに2〜3匹をランダムに選ぶ
    const count = Math.floor(Math.random() * 2) + 2; 
    // 現在の先生ポケモンを除外してシャッフル
    const shuffled = [...allPokemon].filter(p => !imageUrl.includes(p)).sort(() => 0.5 - Math.random());
    
    const newFloating = [];
    for(let i = 0; i < count; i++) {
        // 問題文にかぶらないよう、画面の左右の端に配置 (vwとvhを使用)
        const isLeft = Math.random() > 0.5;
        // 左なら 2vw 〜 15vw、右なら 75vw 〜 85vw
        const leftPos = isLeft ? (2 + Math.random() * 13) : (75 + Math.random() * 10);
        const topPos = 10 + Math.random() * 70; // 高さ 10vh 〜 80vh
        
        newFloating.push({
            img: shuffled[i],
            left: `${leftPos}vw`,
            top: `${topPos}vh`,
            animDuration: 3 + Math.random() * 2,
            animDelay: Math.random() * 1.5,
            size: 130 + Math.random() * 80 // サイズを大きく（130px〜210px）
        });
    }
    setFloatingPokemon(newFloating);
  }, [currentIndex, imageUrl]);

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    const isCorrect = index === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (onAnswer) {
      onAnswer(currentQuestion.id, isCorrect);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className={`glass-container quiz-screen-container ${currentQuestion.isAdvanced ? 'advanced-mode' : ''}`} style={{ animation: 'fadeIn 0.4s ease-out', position: 'relative' }}>
      
      {/* ランダムな応援ポケモン */}
      {floatingPokemon.map((p, i) => (
        <img 
          key={i} 
          src={`/images/pokemon/${p.img}`} 
          alt="応援ポケモン" 
          style={{
            position: 'fixed', // relativeなコンテナの影響を受けず画面全体で配置する
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
            animation: `float ${p.animDuration}s ease-in-out infinite`,
            animationDelay: `${p.animDelay}s`,
            opacity: 0.85,
            zIndex: 0, // ガラスの背面・背景より手前
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* いつもの先生ポケモン */}
      <img src={imageUrl} alt={characterName} className="floating-character" style={{zIndex: 10}} />
      
      <div className="character-speech-bubble">
        <strong>{characterName}:</strong>「{description}」
      </div>
      
      <div className="quiz-header">
        <span>{title}</span>
        <div className="question-counter">
          {currentQuestion.isAdvanced && (
            <span className="advanced-badge">
              <img src="/images/items/ultra_ball.png" alt="ウルトラボール" className="ultra_ball_icon" />
              応用問題
            </span>
          )}
          <span>問題 {currentIndex + 1} / {questions.length}</span>
        </div>
      </div>

      <div className="question-text">
        {currentQuestion.question}
      </div>

      <div className="options-grid">
        {currentQuestion.options.map((option, index) => {
          let btnClass = "option-btn";
          if (isAnswered) {
             if (index === currentQuestion.correctOptionIndex) {
                btnClass += " correct";
             } else if (index === selectedOption) {
                btnClass += " incorrect";
             }
          }
          return (
            <button 
              key={index}
              className={btnClass}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="feedback-box">
          {selectedOption === currentQuestion.correctOptionIndex ? (
            <h3 className="correct-text">大正解！ 🎉</h3>
          ) : (
            <h3 className="incorrect-text">ざんねん... 💦</h3>
          )}
          <p>{currentQuestion.explanation}</p>
          <button className="next-btn" onClick={handleNext}>
            {currentIndex + 1 < questions.length ? "次の問題へ" : "結果を見る"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
