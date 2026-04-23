import React from 'react';

const ResultScreen = ({ score, total, onGoHome, onStartAdvanced, hasAdvancedData }) => {
  const percentage = Math.round((score / total) * 100);
  
  let evaluation = "";
  let ballImageUrl = "";
  
  const basePath = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/";

  if (percentage === 100) {
    evaluation = "パーフェクト！ ポケモンマスターだ！🏆";
    ballImageUrl = basePath + "master-ball.png";
  } else if (percentage >= 80) {
    evaluation = "エリート級！ 四天王にちょうせんできるぞ！✨";
    ballImageUrl = basePath + "luxury-ball.png";
  } else if (percentage >= 60) {
    evaluation = "すごいぞ！ ジムリーダー級の実力だ！🎖️";
    ballImageUrl = basePath + "ultra-ball.png";
  } else if (percentage >= 30) {
    evaluation = "よくがんばった！ ベテラントレーナーへ成長中！🎒";
    ballImageUrl = basePath + "great-ball.png";
  } else {
    evaluation = "ここからスタート！ ポケモンをもっと知ろう！💪";
    ballImageUrl = basePath + "poke-ball.png";
  }

  const isMidTierOrHigher = percentage >= 60;

  return (
    <div className="glass-container result-screen" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <h1 className="app-title">通常クイズけっか</h1>
      
      <div className="rank-ball-container">
        <img src={ballImageUrl} alt="ランクボール" className="rank-ball" />
      </div>

      <div className="score-display">
        {score} / {total} 問 正解
      </div>
      
      <p className="evaluation-text">{evaluation}</p>

      {isMidTierOrHigher && hasAdvancedData ? (
        <div className="advanced-challenge-container" style={{ marginTop: '30px' }}>
          <h2 style={{ color: '#f1c40f', marginBottom: '15px', animation: 'pulse 1s infinite' }}>❗ 応用問題 出現 ❗</h2>
          <button className="next-btn" onClick={onStartAdvanced} style={{ background: 'linear-gradient(135deg, #192a56, #273c75)', color: 'white', border: '1px solid #fbc531' }}>
            ウルトラボール級！応用問題に挑戦する
          </button>
          <br /><br />
          <button className="home-btn" onClick={onGoHome} style={{ fontSize: '1rem', padding: '10px 20px', background: 'transparent', color: '#fff', border: '1px solid #fff' }}>
             今はやめておく（ホームへ戻る）
          </button>
        </div>
      ) : (
        <button className="home-btn" onClick={onGoHome}>
          最初の画面にもどる
        </button>
      )}
    </div>
  );
};

export default ResultScreen;
