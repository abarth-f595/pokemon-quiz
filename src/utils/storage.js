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
