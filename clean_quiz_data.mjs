/**
 * generatedQuizData.js から「類似問題（_inflated_）」を除去し
 * オリジナルの高品質問題だけを残すクリーンアップスクリプト。
 *
 * 使い方: node clean_quiz_data.mjs
 */

import { generatedSubjects } from './src/data/generatedQuizData.js';
import fs from 'fs';

const cleaned = generatedSubjects.map(subject => {
  const original = subject.questions.filter(q => !q.id.includes('_inflated_'));
  return { ...subject, questions: original };
});

const counts = cleaned.map(s => `  ${s.id}: ${s.questions.length}問`).join('\n');
console.log('クリーンアップ後の問題数:');
console.log(counts);
console.log(`合計: ${cleaned.reduce((n, s) => n + s.questions.length, 0)}問`);

const output = `// クリーンアップ済み: clean_quiz_data.mjs
// 「類似問題」を除去したオリジナル問題のみ

export const generatedSubjects = ${JSON.stringify(cleaned, null, 2)};
`;

fs.writeFileSync('./src/data/generatedQuizData.js', output, 'utf-8');
console.log('\n✅ src/data/generatedQuizData.js を更新しました。');
