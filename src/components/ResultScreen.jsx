import React, { useEffect, useState } from 'react';
import { getStats } from '../utils/storage';

const ResultScreen = ({ score, total, onGoHome, onStartAdvanced, hasAdvancedData, subjectId }) => {
  const percentage = Math.round((score / total) * 100);
  
  let evaluation = "";
  let ballImageUrl = "";
  
  const basePath = "/images/pokemon/";

  if (percentage === 100) {
    evaluation = "パーフェクト！ ポケモンマスターだ！🏆";
    ballImageUrl = basePath + "master_ball.png";
  } else if (percentage >= 80) {
    evaluation = "エリート級！ 四天王にちょうせんできるぞ！✨";
    ballImageUrl = basePath + "luxury_ball.png";
  } else if (percentage >= 60) {
    evaluation = "すごいぞ！ ジムリーダー級の実力だ！🎖️";
    ballImageUrl = basePath + "ultra_ball.png";
  } else if (percentage >= 30) {
    evaluation = "よくがんばった！ ベテラントレーナーへ成長中！🎒";
    ballImageUrl = basePath + "super_ball.png";
  } else {
    evaluation = "ここからスタート！ ポケモンをもっと知ろう！💪";
    ballImageUrl = basePath + "monster_ball.png";
  }

  const isMidTierOrHigher = percentage >= 60;

  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    if (!subjectId) return;
    const stats = getStats();
    if (stats[subjectId] && stats[subjectId].totalAnswered > 0) {
        const { totalAnswered, totalCorrect, terms } = stats[subjectId];
        const overallAcc = Math.round((totalCorrect / totalAnswered) * 100);
        
        // 苦手な分野を探す
        let weakestTerm = null;
        let lowestAcc = 1;
        let strongestTerm = null;
        let highestAcc = 0;

        Object.keys(terms).forEach(t => {
            if (terms[t].totalAnswered >= 3) {
                const acc = terms[t].totalCorrect / terms[t].totalAnswered;
                if (acc < lowestAcc) { lowestAcc = acc; weakestTerm = t; }
                if (acc > highestAcc) { highestAcc = acc; strongestTerm = t; }
            }
        });

        let msg = `🎯 累計成績: ${totalCorrect}問正解 / ${totalAnswered}問中 (${overallAcc}%)`;
        if (weakestTerm && lowestAcc < 0.6) {
           msg += ` \n💡 ${weakestTerm}学期（または範囲）がニガテみたいだ。次はその範囲が多く出題されるよ！`;
        } else if (strongestTerm && highestAcc >= 0.8) {
           msg += ` \n🌟 ${strongestTerm}学期（または範囲）はカンペキだね！スゴイ！`;
        }
        setAiMessage(msg);
    }
  }, [subjectId]);

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

      {aiMessage && (
        <div className="ai-feedback" style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.8)', borderRadius: '15px', color: '#2c3e50', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {aiMessage.split('\n').map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

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
