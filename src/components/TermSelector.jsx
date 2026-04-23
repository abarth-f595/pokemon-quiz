import React from 'react';

const TermSelector = ({ subjectData, onSelectTerm, onBack }) => {
  const terms = [
    { id: 1, title: "1学期 の もんだい" },
    { id: 2, title: "2学期 の もんだい" },
    { id: 3, title: "3学期 の もんだい" },
    { id: 'review', title: "ふりかえり編" },
    { id: 'advanced', title: "応用問題編" }
  ];

  return (
    <div className="glass-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="card-character" style={{ height: '100px', marginBottom: '10px' }}>
        <img src={subjectData.imageUrl} alt={subjectData.characterName} style={{ maxHeight: '100%', objectFit: 'contain' }} />
      </div>
      <h1 className="app-title" style={{ fontSize: '2rem' }}>{subjectData.title}</h1>
      <p className="subtitle" style={{ marginBottom: '30px' }}>挑戦する学期を選んでね！</p>

      <div className="options-grid">
        {terms.map(term => (
          <button
            key={term.id}
            className="option-btn"
            style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.95)', borderLeft: `6px solid ${subjectData.color}` }}
            onClick={() => onSelectTerm(term.id)}
          >
            {term.title}
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button className="home-btn" onClick={onBack} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff' }}>
          もどる
        </button>
      </div>
    </div>
  );
};

export default TermSelector;
