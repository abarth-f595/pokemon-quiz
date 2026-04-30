const PREFIX = 'pokemon_quiz_';

/**
 * データをローカルストレージから取得します
 */
export const getStats = () => {
    try {
        const data = localStorage.getItem(`${PREFIX}stats`);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('Failed to get stats from local storage', e);
        return {};
    }
};

/**
 * データをローカルストレージに保存します
 */
export const saveStats = (stats) => {
    try {
        localStorage.setItem(`${PREFIX}stats`, JSON.stringify(stats));
    } catch (e) {
        console.error('Failed to save stats to local storage', e);
    }
};

/**
 * 特定の問題の解答結果を記録し、正答率を更新します
 * @param {string} subjectId - 教科のID (e.g., 'japanese', 'math')
 * @param {string} term - 学期またはカテゴリ (e.g., '1', '2', 'advanced')
 * @param {string} questionId - 問題の一意のID
 * @param {boolean} isCorrect - 正解かどうか
 */
export const recordResult = (subjectId, term, questionId, isCorrect) => {
    const stats = getStats();
    
    if (!stats[subjectId]) {
        stats[subjectId] = {
            totalAnswered: 0,
            totalCorrect: 0,
            terms: {},
            questions: {} // 各問題の成否履歴（必要に応じて）
        };
    }
    
    if (!stats[subjectId].terms[term]) {
        stats[subjectId].terms[term] = {
            totalAnswered: 0,
            totalCorrect: 0
        };
    }

    if (!stats[subjectId].questions[questionId]) {
        stats[subjectId].questions[questionId] = {
            totalAnswered: 0,
            totalCorrect: 0
        };
    }

    // 教科全体の更新
    stats[subjectId].totalAnswered++;
    if (isCorrect) stats[subjectId].totalCorrect++;

    // 学期/カテゴリ別の更新
    stats[subjectId].terms[term].totalAnswered++;
    if (isCorrect) stats[subjectId].terms[term].totalCorrect++;

    // 問題個別の更新
    stats[subjectId].questions[questionId].totalAnswered++;
    if (isCorrect) stats[subjectId].questions[questionId].totalCorrect++;

    saveStats(stats);
};

/**
 * アダプティブな10問セットを構築する
 * - weakGuaranteed 問は苦手問題（2回以上回答して正答率60%未満）を確実に含める
 * - 残りはランダムに選択してシャッフル
 * @param {string} subjectId
 * @param {Array} questions - isAdvanced でない問題の配列
 * @param {number} count - 合計問題数（デフォルト10）
 * @param {number} weakGuaranteed - 苦手問題の最低数（デフォルト2）
 */
export const buildAdaptiveQuiz = (subjectId, questions, count = 10, weakGuaranteed = 2) => {
  const stats = getStats();
  const subjectStats = stats[subjectId] || { questions: {} };

  // 各問題に正答率情報を付与
  const scored = questions.map(q => {
    const qStats = subjectStats.questions[q.id] || { totalAnswered: 0, totalCorrect: 0 };
    const accuracy = qStats.totalAnswered === 0
      ? null
      : qStats.totalCorrect / qStats.totalAnswered;
    return { ...q, _accuracy: accuracy, _answered: qStats.totalAnswered };
  });

  // 苦手問題: 2回以上回答済みで正答率60%未満 → 正答率が低い順にソート
  const weak = scored
    .filter(q => q._answered >= 2 && q._accuracy < 0.6)
    .sort((a, b) => a._accuracy - b._accuracy);

  const weakIds = new Set(weak.map(q => q.id));
  const others = scored.filter(q => !weakIds.has(q.id));

  // 苦手問題から最低 weakGuaranteed 問を確保
  const weakTake = Math.min(weakGuaranteed, weak.length);
  const selected = weak.slice(0, weakTake);

  // 残り枠をランダムに埋める
  const pool = [...weak.slice(weakTake), ...others].sort(() => 0.5 - Math.random());
  const fillCount = Math.min(count - weakTake, pool.length);
  selected.push(...pool.slice(0, fillCount));

  // 問題順をシャッフル
  return selected.sort(() => 0.5 - Math.random());
};

/**
 * 指定した教科内の特定カテゴリの正答率（0.0 ~ 1.0）を取得します。
 * 問題数が少なすぎる場合は 0.5 (標準) を返します。
 */
export const getTermAccuracy = (subjectId, term) => {
    const stats = getStats();
    if (!stats[subjectId] || !stats[subjectId].terms[term]) {
        return 0.5; // 未回答の場合は基準値
    }

    const { totalAnswered, totalCorrect } = stats[subjectId].terms[term];
    if (totalAnswered < 3) return 0.5; // 十分なデータがない場合は極端な補正を避ける

    return totalCorrect / totalAnswered;
};
