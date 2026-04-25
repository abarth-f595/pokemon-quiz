import React, { useState } from 'react';
import { OPERATION_LABELS, DIFFICULTY_LABELS } from '../utils/calcGenerator';

/**
 * CalcDrillSelector.jsx
 * 計算ドリルの演算種類・難易度・問題数を選択する画面
 */

const OPERATIONS   = ['add', 'sub', 'mul', 'div', 'mixed'];
const DIFFICULTIES = ['easy', 'normal', 'hard'];
const COUNTS       = [10, 20, 30];

// 難易度のテーマカラー（非選択時も区別がつくように）
const DIFF_THEME = {
  easy:   { bg: '#00b894', text: '#fff' },
  normal: { bg: '#f39c12', text: '#fff' },
  hard:   { bg: '#c0392b', text: '#fff' },
};

// ボタンの共通スタイル生成ヘルパー
const btnStyle = (selected, accentColor) => ({
  padding: '14px 8px',
  borderRadius: '12px',
  border: selected ? '3px solid #fff' : '2px solid rgba(0,0,0,0.25)',
  background: selected ? accentColor : 'rgba(255,255,255,0.85)',
  color: selected ? '#fff' : '#222',
  fontWeight: 'bold',
  fontSize: '1rem',
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'all 0.2s',
  transform: selected ? 'scale(1.05)' : 'scale(1)',
  textShadow: selected ? '0 1px 3px rgba(0,0,0,0.4)' : 'none',
  boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 4px rgba(0,0,0,0.1)',
});

const CalcDrillSelector = ({ onStart, onBack }) => {
  const [operation,  setOperation]  = useState('mul');
  const [difficulty, setDifficulty] = useState('normal');
  const [count,      setCount]      = useState(10);

  return (
    <div className="glass-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>

      {/* ポケモン */}
      <div className="card-character" style={{ height: '100px', marginBottom: '8px' }}>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png"
          alt="ケーシィ"
          style={{ maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
        />
      </div>

      <h1 className="app-title" style={{ fontSize: '2rem', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
        ⚡ 計算ドリル
      </h1>
      <p className="subtitle" style={{ marginBottom: '24px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
        ケーシィと一緒にタイムアタック！
      </p>

      {/* ── 演算種類 ── */}
      <section style={{ marginBottom: '20px' }}>
        <h3 style={{
          color: '#fff', marginBottom: '10px', fontSize: '0.95rem',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px',
          display: 'inline-block',
        }}>
          🧮 演算の種類
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {OPERATIONS.map(op => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              style={{
                ...btnStyle(operation === op, '#6c5ce7'),
                gridColumn: op === 'mixed' ? '1 / -1' : 'auto',
              }}
            >
              {OPERATION_LABELS[op]}
            </button>
          ))}
        </div>
      </section>

      {/* ── 難易度 ── */}
      <section style={{ marginBottom: '20px' }}>
        <h3 style={{
          color: '#fff', marginBottom: '10px', fontSize: '0.95rem',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px',
          display: 'inline-block',
        }}>
          💪 難易度
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={btnStyle(difficulty === d, DIFF_THEME[d].bg)}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </section>

      {/* ── 問題数 ── */}
      <section style={{ marginBottom: '28px' }}>
        <h3 style={{
          color: '#fff', marginBottom: '10px', fontSize: '0.95rem',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px',
          display: 'inline-block',
        }}>
          📝 問題数
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {COUNTS.map(c => (
            <button
              key={c}
              onClick={() => setCount(c)}
              style={btnStyle(count === c, '#0984e3')}
            >
              {c}問
            </button>
          ))}
        </div>
      </section>

      {/* スタートボタン */}
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
          marginBottom: '14px',
          textShadow: '0 1px 3px rgba(0,0,0,0.3)',
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
        >
          もどる
        </button>
      </div>
    </div>
  );
};

export default CalcDrillSelector;
