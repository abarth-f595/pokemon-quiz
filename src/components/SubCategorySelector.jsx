import React from 'react';

const SubCategorySelector = ({ subjectData, onSelectSubCategory, onBack }) => {
  return (
    <div className="glass-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="card-character" style={{ height: '100px', marginBottom: '10px' }}>
        <img src={subjectData.imageUrl} alt={subjectData.characterName} style={{ maxHeight: '100%', objectFit: 'contain' }} />
      </div>
      <h1 className="app-title" style={{ fontSize: '2rem' }}>{subjectData.title}</h1>
      <p className="subtitle" style={{ marginBottom: '30px' }}>どのジャンルの問題に挑戦する？</p>
      
      <div className="options-grid">
        {subjectData.subCategories.map(cat => (
          <button 
            key={cat.id}
            className="option-btn"
            style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.95)', borderLeft: `6px solid ${subjectData.color}` }}
            onClick={() => onSelectSubCategory(cat.id)}
          >
            {cat.title}
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

export default SubCategorySelector;
