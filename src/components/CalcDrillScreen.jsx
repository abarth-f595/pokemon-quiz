import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateProblems, OPERATION_LABELS, DIFFICULTY_LABELS } from '../utils/calcGenerator';

/**
 * CalcDrillScreen.jsx
 * タイマー付き計算ドリル本体。
 * 問題を自動生成して1問ずつ表示し、終了後に詳細結果を表示する。
 */

// 表示用の時間フォーマット (秒 → "12.3秒" など)
const fmt = (sec) => `${sec.toFixed(1)}秒`;

// 難易度バッジカラー
const DIFF_COLOR = { easy: '#00b894', normal: '#fdcb6e', hard: '#e17055' };

// ============================================================
// 結果サマリー画面（ドリル終了後に CalcDrillScreen 内で表示）
// ============================================================
const ResultSummary = ({ results, totalTime, config, onRetry, onGoHome }) => {
  const correct = results.filter(r => r.isCorrect).length;
  const avgTime  = results.length > 0 ? totalTime / results.length : 0;
  const bestTime = Math.min(...results.map(r => r.elapsed));

  return (
    <div className="glass-container result-screen" style={{ animation: 'fadeIn 0.5s' }}>

      <div className="card-character" style={{ height: '80px', marginBottom: '8px' }}>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png"
          alt="フーディン"
          style={{ maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '4px' }}>⚡ ドリル完了！</h2>
      <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '20px', fontSize: '0.9rem' }}>
        {OPERATION_LABELS[config.operation]} / {DIFFICULTY_LABELS[config.difficulty]} / {config.count}問
      </p>

      {/* スコアサマリー */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '12px', marginBottom: '24px',
      }}>
        {[
          { label: '正解数', value: `${correct} / ${results.length}`, color: correct === results.length ? '#55efc4' : '#fdcb6e' },
          { label: '合計タイム', value: fmt(totalTime), color: '#a29bfe' },
          { label: '平均タイム', value: fmt(avgTime), color: '#74b9ff' },
          { label: '最速タイム', value: fmt(bestTime), color: '#fd79a8' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '12px', padding: '14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 各問の一覧 */}
      <div style={{ maxHeight: '260px', overflowY: 'auto', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              <th style={{ textAlign: 'left',  padding: '6px 4px', opacity: 0.7 }}>#</th>
              <th style={{ textAlign: 'left',  padding: '6px 4px', opacity: 0.7 }}>問題</th>
              <th style={{ textAlign: 'center',padding: '6px 4px', opacity: 0.7 }}>結果</th>
              <th style={{ textAlign: 'right', padding: '6px 4px', opacity: 0.7 }}>タイム</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.problem.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '6px 4px', opacity: 0.6 }}>{i + 1}</td>
                <td style={{ padding: '6px 4px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  {r.problem.display} = {r.problem.answer}
                </td>
                <td style={{ padding: '6px 4px', textAlign: 'center', fontSize: '1.1rem' }}>
                  {r.isCorrect ? '✅' : '❌'}
                </td>
                <td style={{
                  padding: '6px 4px', textAlign: 'right',
                  color: r.elapsed < avgTime * 0.8 ? '#55efc4' : r.elapsed > avgTime * 1.5 ? '#e17055' : '#fff',
                }}>
                  {fmt(r.elapsed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ボタン */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button
          className="home-btn"
          onClick={onRetry}
          style={{
            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            color: '#fff', border: 'none', borderRadius: '12px',
            padding: '14px', fontSize: '1rem', fontWeight: 'bold',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          🔁 もういちど
        </button>
        <button className="home-btn" onClick={onGoHome}>
          🏠 ホームへ
        </button>
      </div>
    </div>
  );
};

// ============================================================
// ドリル本体
// ============================================================
const CalcDrillScreen = ({ operation, difficulty, questionCount, onGoHome }) => {

  // 問題セット (マウント時に生成して固定)
  const [problems] = useState(() => generateProblems(operation, difficulty, questionCount));

  // セッション状態
  const [phase,      setPhase]      = useState('playing'); // 'playing' | 'result'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [isAnswered, setIsAnswered]  = useState(false);
  const resultsRef   = useRef([]);

  // タイマー (re-render を最小化するため ref で管理)
  const [totalElapsed, setTotalElapsed]    = useState(0);
  const [questionElapsed, setQElapsed]     = useState(0);
  const drillStartRef    = useRef(Date.now());
  const questionStartRef = useRef(Date.now());
  const intervalRef      = useRef(null);

  // ドリル開始時にタイマーをスタート
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      setTotalElapsed((now - drillStartRef.current) / 1000);
      setQElapsed((now - questionStartRef.current) / 1000);
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, []);

  // 問題が変わったとき問題タイマーをリセット
  useEffect(() => {
    questionStartRef.current = Date.now();
    setQElapsed(0);
  }, [currentIdx]);

  // 選択肢を選んだとき
  const handleSelect = useCallback((optionIndex) => {
    if (isAnswered) return;

    const elapsed    = (Date.now() - questionStartRef.current) / 1000;
    const isCorrect  = optionIndex === problems[currentIdx].correctIndex;

    setSelected(optionIndex);
    setIsAnswered(true);

    resultsRef.current.push({ problem: problems[currentIdx], selectedIndex: optionIndex, isCorrect, elapsed });

    // 正解・不正解のフラッシュを少し見せてから次へ
    setTimeout(() => {
      if (currentIdx + 1 >= problems.length) {
        // 全問終了
        clearInterval(intervalRef.current);
        const finalTime = (Date.now() - drillStartRef.current) / 1000;
        setTotalElapsed(finalTime);
        setPhase('result');
      } else {
        setCurrentIdx(prev => prev + 1);
        setSelected(null);
        setIsAnswered(false);
      }
    }, 550);
  }, [currentIdx, isAnswered, problems]);

  // ──────────────────────────────────────────────────────────
  // 結果画面
  // ──────────────────────────────────────────────────────────
  if (phase === 'result') {
    return (
      <ResultSummary
        results={resultsRef.current}
        totalTime={totalElapsed}
        config={{ operation, difficulty, count: questionCount }}
        onRetry={() => {
          // 同じ設定でリトライ（リロードと同じ効果を出すためページ再レンダリング）
          resultsRef.current = [];
          drillStartRef.current = Date.now();
          questionStartRef.current = Date.now();
          setPhase('playing');
          setCurrentIdx(0);
          setSelected(null);
          setIsAnswered(false);
          setTotalElapsed(0);
          setQElapsed(0);
          // 新しい問題セットを使いたい場合は onGoHome → 再選択に戻す
          // ここでは同じ問題セットを再利用
          intervalRef.current = setInterval(() => {
            const now = Date.now();
            setTotalElapsed((now - drillStartRef.current) / 1000);
            setQElapsed((now - questionStartRef.current) / 1000);
          }, 100);
        }}
        onGoHome={onGoHome}
      />
    );
  }

  // ──────────────────────────────────────────────────────────
  // プレイ中
  // ──────────────────────────────────────────────────────────
  const problem    = problems[currentIdx];
  const progress   = (currentIdx / questionCount) * 100;

  return (
    <div className="glass-container quiz-screen-container" style={{ animation: 'fadeIn 0.3s' }}>

      {/* ── ヘッダー ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px',
      }}>
        {/* 問題カウンター */}
        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
          <span style={{ color: '#a29bfe', fontSize: '1.5rem' }}>{currentIdx + 1}</span>
          <span style={{ opacity: 0.6 }}> / {questionCount}</span>
        </div>

        {/* バッジ */}
        <div style={{
          background: DIFF_COLOR[difficulty],
          color: '#fff', borderRadius: '20px',
          padding: '4px 12px', fontSize: '0.8rem', fontWeight: 'bold',
        }}>
          {DIFFICULTY_LABELS[difficulty]}
        </div>

        {/* 合計タイマー */}
        <div style={{
          fontSize: '1.1rem', fontWeight: 'bold',
          color: '#ffeaa7', letterSpacing: '0.05em',
        }}>
          🕐 {totalElapsed.toFixed(1)}秒
        </div>
      </div>

      {/* プログレスバー */}
      <div style={{
        height: '6px', background: 'rgba(255,255,255,0.15)',
        borderRadius: '3px', marginBottom: '24px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)',
          borderRadius: '3px', transition: 'width 0.3s ease',
        }} />
      </div>

      {/* ── 問題 ── */}
      <div style={{
        textAlign: 'center',
        margin: '24px 0 8px',
        fontSize: 'clamp(2rem, 8vw, 3.5rem)',
        fontWeight: '900',
        letterSpacing: '0.08em',
        textShadow: '0 4px 12px rgba(0,0,0,0.6)',
        lineHeight: 1.3,
      }}>
        {problem.display}
      </div>
      <div style={{
        textAlign: 'center', fontSize: '1.8rem', fontWeight: '800',
        marginBottom: '8px', opacity: 0.9,
      }}>= ？</div>

      {/* 問題タイマー */}
      <div style={{
        textAlign: 'center', fontSize: '1rem', color: '#fd79a8',
        marginBottom: '28px', fontWeight: 'bold',
      }}>
        ⏱ この問題 {questionElapsed.toFixed(1)}秒
      </div>

      {/* ── 選択肢 ── */}
      <div className="options-grid">
        {problem.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.92)';
          let color = '#333';
          if (isAnswered) {
            if (i === problem.correctIndex)              { bg = '#2ecc71'; color = '#fff'; }
            else if (i === selected && !problem.isCorrect) { bg = '#e74c3c'; color = '#fff'; }
            else                                            { bg = 'rgba(255,255,255,0.5)'; }
          }
          return (
            <button
              key={i}
              className="option-btn"
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
              style={{
                background: bg, color,
                textAlign: 'center',
                fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                transform: isAnswered && i === problem.correctIndex ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* ── ホームボタン ── */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          className="home-btn"
          onClick={onGoHome}
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.85rem', padding: '8px 20px' }}
        >
          中断してホームへ
        </button>
      </div>
    </div>
  );
};

export default CalcDrillScreen;
