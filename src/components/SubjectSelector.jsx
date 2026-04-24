import React from 'react';
import { parseMarkdownToQuizData } from '../utils/mdParser';
import { parseNotebookLMJsonToQuizData } from '../utils/jsonParser';

const SubjectSelector = ({ quizData, onSelectSubject, onAddCustomSubject }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isJson = file.name.toLowerCase().endsWith('.json');
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      if (isJson) {
        const customDataDict = parseNotebookLMJsonToQuizData(text);
        if (customDataDict && onAddCustomSubject) {
          onAddCustomSubject(customDataDict, true);
        }
      } else {
        const customData = parseMarkdownToQuizData(text);
        if (customData && onAddCustomSubject) onAddCustomSubject(customData, false);
      }
      e.target.value = null;
    };
    reader.readAsText(file);
  };
  return (
    <div className="glass-container">
      <h1 className="app-title">ポケモンクイズ道場</h1>
      <p className="subtitle">小学5年生レベルの知識で挑戦だ！</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <label className="primary-btn" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 'bold' }}>
          <input type="file" accept=".md,.json" onChange={handleFileUpload} style={{ display: 'none' }} />
          <span>+ 教科データ(.md / .json)をアップロード</span>
        </label>
      </div>
      
      <div className="subject-grid">
        {Object.entries(quizData).map(([key, data]) => (
          <div 
            key={key} 
            className="subject-card"
            style={{ backgroundColor: data.color }}
            onClick={() => onSelectSubject(key)}
          >
            <div className="card-character">
              <img src={data.imageUrl} alt={data.characterName} />
            </div>
            <h2>{data.title}</h2>
            <div className="card-character-info">
              <strong>{data.characterName}</strong>
              <p>{data.description.split('。')[0]}。</p>
            </div>
            {/* 応用問題への直接ショートカットボタン */}
            <button
              className="advanced-shortcut-btn"
              onClick={(e) => {
                e.stopPropagation(); // カード全体のクリックを防ぐ
                onSelectSubject(key, 'advanced');
              }}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '7px 0',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(0,0,0,0.25)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                letterSpacing: '0.03em',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
            >
              ⚡ 応用問題にちょうせん
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
