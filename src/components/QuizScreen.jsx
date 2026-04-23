import React, { useState } from 'react';

const QuizScreen = ({ title, questions, imageUrl, characterName, description, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === currentQuestion.correctOptionIndex) {
      setScore(score + 1);
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
    <div className={`glass-container quiz-screen-container ${currentQuestion.isAdvanced ? 'advanced-mode' : ''}`} style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <img src={imageUrl} alt={characterName} className="floating-character" />
      
      <div className="character-speech-bubble">
        <strong>{characterName}:</strong>「{description}」
      </div>
      
      <div className="quiz-header">
        <span>{title}</span>
        <div className="question-counter">
          {currentQuestion.isAdvanced && (
            <span className="advanced-badge">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/beast-ball.png" alt="ウルトラボール" className="ultra_ball_icon" />
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
            <h3 className="correct-text">せいかい！ 🎉</h3>
          ) : (
            <h3 className="incorrect-text">ざんねん... 💦</h3>
          )}
          <p>{currentQuestion.explanation}</p>
          <button className="next-btn" onClick={handleNext}>
            {currentIndex + 1 < questions.length ? "次の問題へ" : "けっかを見る"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
