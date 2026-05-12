// ローカル統計トラッキング（外部APIキー不要・localStorage使用）
const STORAGE_KEY = 'pokemon_quiz_analytics';

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const save = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ストレージ容量超過時は無視
  }
};

export const initGA = () => {
  // 外部APIなし。初回アクセス日時を記録するのみ。
  const data = load();
  if (!data.firstVisit) {
    data.firstVisit = new Date().toISOString();
  }
  data.lastVisit = new Date().toISOString();
  data.visitCount = (data.visitCount || 0) + 1;
  save(data);
};

export const trackEvent = (eventName, params = {}) => {
  const data = load();
  if (!data.events) data.events = {};
  if (!data.events[eventName]) data.events[eventName] = [];

  data.events[eventName].push({
    ...params,
    ts: Date.now(),
  });

  // 各イベント最大200件まで保持（容量対策）
  if (data.events[eventName].length > 200) {
    data.events[eventName] = data.events[eventName].slice(-200);
  }

  save(data);
};

export const trackPage = () => {
  // ローカルのみ。外部送信なし。
};

/** 統計サマリーを返す（デバッグ・成績表示に使用可） */
export const getAnalyticsSummary = () => {
  const data = load();
  const events = data.events || {};
  const completed = events['quiz_completed'] || [];

  const bySubject = {};
  for (const e of completed) {
    if (!bySubject[e.subject]) bySubject[e.subject] = { sessions: 0, totalAccuracy: 0 };
    bySubject[e.subject].sessions++;
    bySubject[e.subject].totalAccuracy += e.accuracy || 0;
  }

  return {
    visitCount: data.visitCount || 0,
    firstVisit: data.firstVisit,
    lastVisit: data.lastVisit,
    totalSessions: completed.length,
    bySubject,
  };
};
