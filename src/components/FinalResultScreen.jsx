import React from 'react';

const FinalResultScreen = ({ score, total, onGoHome }) => {
  const isPerfect = score === total;
  const evaluation = isPerfect 
    ? "すごいぞ！ 応用問題もカンペキだ！ 真のポケモンマスター！🏆" 
    : "あと少し！ でも応用問題に挑戦した勇気は素晴らしい！✨";

  return (
    <div className="glass-container result-screen advanced-mode" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <h1 className="app-title">応用問題 クリア結果</h1>
      
      <div className="rank-ball-container">
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/beast-ball.png" 
          alt="ウルトラボール" 
          className="rank-ball ultra_ball_icon" 
          style={{ width: '120px', height: '120px', imageRendering: 'auto' }}
        />
      </div>

      <div className="score-display">
        {score} / {total} 問 正解
      </div>
      
      <p className="evaluation-text">{evaluation}</p>
      
      <button className="home-btn" onClick={onGoHome}>
        最初の画面にもどる
      </button>
    </div>
  );
};

export default FinalResultScreen;
