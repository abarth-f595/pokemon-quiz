import React, { useState } from 'react';
import { OPERATION_LABELS, DIFFICULTY_LABELS } from '../utils/calcGenerator';

/**
 * CalcDrillSelector.jsx
 * 計算ドリルの演算種類・難易度・問題数を選択する画面
 */

// 選択肢の定義
const OPERATIONS  = ['add', 'sub', 'mul', 'div', 'mixed'];
const DIFFICULTIES = ['easy', 'normal', 'hard'];
const COUNTS      = [10, 20, 30];

// 難易度の色
const DIFF_COLORS = {
  easy:   '#00b894',
  normal: '#fdcb6e',
  hard:   '#e17055',
};

const CalcDrillSelector = ({ onStart, onBack }) => {
  const [operation,  setOperation]  = useState('mul');   // デフォルト: かけ算
  const [difficulty, setDifficulty] = useState('normal');
  const [count,      setCount]      = useState(10);

  return (
    <div className="glass-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>

      {/* ポケモンキャラクター */}
      <div className="card-character" style={{ height: '100px', marginBottom: '10px' }}>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png"
          alt="フーディン"
          style={{ maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>

      <h1 className="app-title" style={{ fontSize: '2rem' }}>⚡ 計算ドリル</h1>
      <p className="subtitle" style={{ marginBottom: '28px' }}>
        フーディンと一緒にタイムアタック開始！
      </p>

      {/* ── 演算種類の選択 ── */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '1rem', opacity: 0.85 }}>
          🧮 演算の種類
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {OPERATIONS.map(op => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              style={{
                padding: '12px 8px',
                borderRadius: '12px',
                border: operation === op ? '3px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                background: operation === op ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: operation === op ? 'scale(1.04)' : 'scale(1)',
                gridColumn: op === 'mixed' ? '1 / -1' : 'auto', // 混合は全幅
              }}
            >
              {OPERATION_LABELS[op]}
            </button>
          ))}
        </div>
      </section>

      {/* ── 難易度の選択 ── */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '1rem', opacity: 0.85 }}>
          💪 難易度
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={{
                padding: '12px 8px',
                borderRadius: '12px',
                border: difficulty === d ? '3px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                background: difficulty === d ? DIFF_COLORS[d] : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: difficulty === d ? 'scale(1.05)' : 'scale(1)',
                textShadow: difficulty === d ? '0 1px 3px rgba(0,0,0,0.4)' : 'none',
              }}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </section>

      {/* ── 問題数の選択 ── */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '1rem', opacity: 0.85 }}>
          📝 問題数
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {COUNTS.map(c => (
            <button
              key={c}
              onClick={() => setCount(c)}
              style={{
                padding: '12px 0',
                borderRadius: '12px',
                border: count === c ? '3px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                background: count === c ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: count === c ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {c}問
            </button>
          ))}
        </div>
      </section>

      {/* ── スタートボタン ── */}
      <button
        onClick={() => onStart({ operation, difficulty, count })}
        style={{
          width: '100%',
          padding: '18px',
          borderRadius: '16px',
          border: 'none',
          background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.4rem',
          fontFamily: 'inherit',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(108,92,231,0.5)',
          transition: 'all 0.2s',
          letterSpacing: '0.05em',
          marginBottom: '14px',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(108,92,231,0.6)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 6px 20px rgba(108,92,231,0.5)'; }}
      >
        ⚡ スタート！
      </button>

      <div style={{ textAlign: 'center' }}>
        <button
          className="home-btn"
          onClick={onBack}
          style={{ background: 'transparent', color: '#fff', border: '1px solid #fff' }}
        >
          もどる
        </button>
      </div>
    </div>
  );
};

export default CalcDrillSelector;
