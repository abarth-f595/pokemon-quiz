/**
 * gymBGM.js
 * Web Audio API で生成するポケモン風ジム戦BGM (8bitチップチューン)
 *
 * 構成
 *   - BPM 168, 8小節ループ (128ステップ = 16分音符単位)
 *   - Ch1 Lead Melody  : 方形波 (square)  — 主旋律
 *   - Ch2 Harmony      : 方形波 (square)  — コードアルペジオ
 *   - Ch3 Bass         : のこぎり波 (sawtooth) — ベースライン
 *   - Ch4 Drums        : ホワイトノイズ — キック/スネア/ハイハット
 */

// ============================================================
// 定数
// ============================================================
const BPM      = 168;
const S16      = (60 / BPM) / 4;       // 16分音符 = 約89.3ms
const LOOP_DUR = 128 * S16;            // 1ループ ≈ 11.43秒
const MASTER   = 0.45;                 // マスター音量

// ============================================================
// 音符テーブル (Hz)
// ============================================================
const N = {
  _: 0,
  A2: 110.00,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00,
  A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  Fs4: 369.99, G4: 392.00,
  A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25,
  E5: 659.25, F5: 698.46, G5: 783.99,
  A5: 880.00,
};

// ============================================================
// シーケンスデータ  [周波数Hz, 16分音符の長さ]
// ============================================================

/**
 * Ch1: Lead Melody
 * ポケモン風下降クロマチック＋上昇フレーズ 8小節
 */
const SEQ_MELODY = [
  // Bar 1 — 開幕: 下降クロマチックライン
  [N.E5,1],[N.Eb5,1],[N.D5,1],[N.C5,1],
  [N.B4,1],[N.Bb4,1],[N.A4,2],
  [N._,2],[N.A4,1],[N.B4,1],
  [N.C5,1],[N.D5,1],[N._,2],

  // Bar 2 — 応答フレーズ
  [N.E5,1],[N._,1],[N.D5,1],[N._,1],
  [N.C5,1],[N.B4,1],[N.Bb4,1],[N.A4,1],
  [N.G4,2],[N._,2],[N.A4,2],[N.A4,2],

  // Bar 3 — コードトーン動き
  [N.C5,1],[N.C5,1],[N.D5,2],
  [N.E5,2],[N.D5,2],
  [N.C5,1],[N.B4,1],[N.A4,4],[N._,2],

  // Bar 4 — 上昇→下降
  [N.G4,1],[N.A4,1],[N.B4,1],[N.C5,1],
  [N.D5,2],[N.E5,2],
  [N.F5,1],[N.E5,1],[N.D5,1],[N.C5,1],
  [N.B4,2],[N._,2],

  // Bar 5 — 高音域で盛り上がり
  [N.A5,2],[N._,2],[N.G5,2],[N.F5,2],
  [N.E5,1],[N.D5,1],[N.E5,1],[N.D5,1],
  [N.C5,2],[N.B4,2],

  // Bar 6 — 緊張感のある動き
  [N.Bb4,1],[N.C5,1],[N.D5,2],
  [N.E5,2],[N.F5,2],
  [N.E5,1],[N.D5,1],[N.C5,1],[N.Bb4,1],
  [N.A4,4],

  // Bar 7 — 加速フック (16分連符)
  [N.E5,1],[N.F5,1],[N.E5,1],[N.D5,1],
  [N.C5,1],[N.D5,1],[N.C5,1],[N.B4,1],
  [N.A4,1],[N.B4,1],[N.C5,1],[N.D5,1],
  [N.E5,4],

  // Bar 8 — ループ前締め (Bar1と同じ開幕ライン)
  [N.E5,1],[N.Eb5,1],[N.D5,1],[N.C5,1],
  [N.B4,1],[N.Bb4,1],[N.A4,2],
  [N._,1],[N.A4,1],[N.B4,1],[N.C5,1],
  [N.D5,2],[N._,2],
];

/**
 * Ch2: Harmony アルペジオ
 * Am → Am → Am → C → F → G → Am → Am
 * 各コードを8分音符のアルペジオで刻む
 */
const SEQ_HARMONY = [
  // bars 1-2: Am (A-C-E-C)
  ...(Array(4).fill([[N.A4,2],[N.C5,2],[N.E5,2],[N.C5,2]]).flat()),
  // bar 3: Am
  ...(Array(2).fill([[N.A4,2],[N.C5,2],[N.E5,2],[N.C5,2]]).flat()),
  // bar 4: C (C-E-G-E)
  ...(Array(2).fill([[N.C5,2],[N.E5,2],[N.G5,2],[N.E5,2]]).flat()),
  // bar 5: F (F-A-C-A)
  ...(Array(2).fill([[N.F4,2],[N.A4,2],[N.C5,2],[N.A4,2]]).flat()),
  // bar 6: G (G-B-D-B)
  ...(Array(2).fill([[N.G4,2],[N.B4,2],[N.D5,2],[N.B4,2]]).flat()),
  // bars 7-8: Am
  ...(Array(4).fill([[N.A4,2],[N.C5,2],[N.E5,2],[N.C5,2]]).flat()),
];

/**
 * Ch3: Bass  8分音符のオスティナートベース
 */
const SEQ_BASS = [
  // bars 1-2: A-E
  ...(Array(4).fill([[N.A3,2],[N.E3,2],[N.A3,2],[N.E3,2]]).flat()),
  // bar 3: A-E
  ...(Array(2).fill([[N.A3,2],[N.E3,2],[N.A3,2],[N.E3,2]]).flat()),
  // bar 4: C-G
  ...(Array(2).fill([[N.C4,2],[N.G3,2],[N.C4,2],[N.G3,2]]).flat()),
  // bar 5: low A-E（迫力UP）
  ...(Array(2).fill([[N.A2,2],[N.E3,2],[N.A2,2],[N.E3,2]]).flat()),
  // bar 6: D-A
  ...(Array(2).fill([[N.D3,2],[N.A3,2],[N.D3,2],[N.A3,2]]).flat()),
  // bars 7-8: A-E
  ...(Array(4).fill([[N.A3,2],[N.E3,2],[N.A3,2],[N.E3,2]]).flat()),
];

/**
 * Ch4: Drums  (1=kick, 2=snare, 3=hihat, 0=rest)
 * 128ステップ = 8小節
 */
const SEQ_DRUMS = [
  // bars 1-2: 標準パターン
  1,0,3,3, 2,0,3,0, 1,0,3,3, 2,0,3,0,
  1,0,3,3, 2,0,3,0, 1,0,3,3, 2,0,3,0,
  // bars 3-4
  1,0,3,3, 2,0,3,0, 1,0,3,3, 2,0,3,0,
  1,0,3,3, 2,0,3,0, 1,3,3,3, 2,0,3,0,
  // bars 5-6: ハイハット増加（テンション上昇）
  1,3,3,3, 2,3,3,0, 1,3,3,3, 2,3,3,0,
  1,3,3,3, 2,3,3,0, 1,3,3,3, 2,3,3,0,
  // bars 7-8: フルハット（クライマックス）
  1,3,3,3, 2,3,3,3, 1,3,3,3, 2,3,3,3,
  1,3,3,3, 2,3,3,3, 1,3,3,3, 2,0,0,0,
];

// ============================================================
// ノートリストへの変換
// ============================================================

/**
 * [freq, steps]ペアの配列を時刻付きノートリストに変換する
 * @param {Array} seqPairs - [[freq, steps], ...] 形式
 * @param {number} gateRatio - ゲート比率 (0〜1): 音符の鳴っている割合
 */
function buildNotes(seqPairs, gateRatio = 0.85) {
  const notes = [];
  let t = 0;
  for (const [freq, steps] of seqPairs) {
    if (freq > 0) {
      notes.push({ t, freq, dur: steps * S16 * gateRatio });
    }
    t += steps * S16;
  }
  return notes;
}

// 事前計算
const LEAD_NOTES    = buildNotes(SEQ_MELODY,  0.80);
const HARMONY_NOTES = buildNotes(SEQ_HARMONY, 0.70);
const BASS_NOTES    = buildNotes(SEQ_BASS,    0.65);

// ============================================================
// AudioContext & State
// ============================================================
let ctx        = null;
let masterGain = null;
let isPlaying  = false;
let loopTimer  = null;
let loopStart  = 0;
let userVolume = 1.0;  // ユーザー設定の音量 (0〜1)
let userMuted  = false; // ミュート状態

/** 現在の実効ゲイン値を計算 */
function effectiveGain() {
  return userMuted ? 0 : MASTER * userVolume;
}

/** AudioContextを遅延初期化する（ユーザー操作後に呼ぶ必要がある） */
function ensureCtx() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();

  // ダイナミクスコンプレッサー（クリッピング防止）
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -8;
  comp.knee.value      = 10;
  comp.ratio.value     = 4;
  comp.attack.value    = 0.003;
  comp.release.value   = 0.25;

  masterGain = ctx.createGain();
  masterGain.gain.value = effectiveGain();

  masterGain.connect(comp);
  comp.connect(ctx.destination);
}

// ============================================================
// 音符生成ヘルパー
// ============================================================

/** 方形波（またのこぎり波）でメロディ音符を鳴らす */
function playTone(freq, startTime, duration, gainVal, type = 'square') {
  if (!ctx || freq <= 0) return;

  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(gainVal, startTime);
  // 音符末尾のプチノイズ防止フェードアウト
  gain.gain.setValueAtTime(gainVal, startTime + duration - 0.008);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

/** キックドラム (サイン波の急速ピッチダウン) */
function playKick(startTime) {
  if (!ctx) return;
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, startTime);
  osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.12);

  gain.gain.setValueAtTime(0.75, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(startTime);
  osc.stop(startTime + 0.25);
}

/** スネアドラム (バンドパスフィルタ付きホワイトノイズ) */
function playSnare(startTime) {
  if (!ctx) return;
  const bufLen = Math.floor(ctx.sampleRate * 0.12);
  const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data   = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const src    = ctx.createBufferSource();
  src.buffer   = buf;

  const bpf    = ctx.createBiquadFilter();
  bpf.type     = 'bandpass';
  bpf.frequency.value = 1100;
  bpf.Q.value  = 0.8;

  const gain   = ctx.createGain();
  gain.gain.setValueAtTime(0.28, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

  src.connect(bpf);
  bpf.connect(gain);
  gain.connect(masterGain);
  src.start(startTime);
  src.stop(startTime + 0.14);
}

/** ハイハット (ハイパスフィルタ付きホワイトノイズ) */
function playHat(startTime) {
  if (!ctx) return;
  const bufLen = Math.floor(ctx.sampleRate * 0.045);
  const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data   = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const src    = ctx.createBufferSource();
  src.buffer   = buf;

  const hpf    = ctx.createBiquadFilter();
  hpf.type     = 'highpass';
  hpf.frequency.value = 6500;

  const gain   = ctx.createGain();
  gain.gain.setValueAtTime(0.10, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

  src.connect(hpf);
  hpf.connect(gain);
  gain.connect(masterGain);
  src.start(startTime);
  src.stop(startTime + 0.06);
}

// ============================================================
// ループスケジューラ
// ============================================================

/** 1ループ分（128ステップ）の全音符をAudio APIでスケジュールする */
function scheduleLoop(startAt) {
  // Ch1: リードメロディ
  for (const { t, freq, dur } of LEAD_NOTES) {
    playTone(freq, startAt + t, dur, 0.28, 'square');
  }
  // Ch2: ハーモニー (少し弱め)
  for (const { t, freq, dur } of HARMONY_NOTES) {
    playTone(freq, startAt + t, dur, 0.10, 'square');
  }
  // Ch3: ベース (のこぎり波で存在感)
  for (const { t, freq, dur } of BASS_NOTES) {
    playTone(freq, startAt + t, dur, 0.22, 'sawtooth');
  }
  // Ch4: ドラム
  SEQ_DRUMS.forEach((type, i) => {
    const t = startAt + i * S16;
    if      (type === 1) playKick(t);
    else if (type === 2) playSnare(t);
    else if (type === 3) playHat(t);
  });
}

// ============================================================
// Public API
// ============================================================

/**
 * BGMを開始する（クイズ画面に移ったとき呼ぶ）
 * ユーザーの操作（クリック等）後に呼ぶこと
 */
export function startBGM() {
  if (isPlaying) return;
  ensureCtx();

  // ブラウザがAutoplay制限で一時停止していた場合に再開
  if (ctx.state === 'suspended') ctx.resume();

  // マスターゲインを確実にONにする
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.setValueAtTime(effectiveGain(), ctx.currentTime);

  isPlaying = true;
  loopStart = ctx.currentTime + 0.05; // わずかに遅らせて開始

  const tick = () => {
    if (!isPlaying) return;
    scheduleLoop(loopStart);
    loopStart += LOOP_DUR;
    // 次ループを0.5秒前にスケジュール（シームレスループ）
    loopTimer = setTimeout(tick, Math.max(0, (LOOP_DUR - 0.5) * 1000));
  };

  tick();
}

/**
 * BGMをフェードアウトして停止する（ホーム・結果画面に戻るとき呼ぶ）
 * @param {number} fadeOut - フェードアウトの秒数
 */
export function stopBGM(fadeOut = 0.6) {
  if (!isPlaying) return;
  isPlaying = false;

  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }

  if (masterGain && ctx) {
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeOut);

    // フェードアウト後にマスター音量をリセット（次回再生用）
    setTimeout(() => {
      if (!isPlaying && masterGain) {
        masterGain.gain.value = effectiveGain();
      }
    }, (fadeOut + 0.1) * 1000);
  }
}

/** 現在BGMが再生中かどうかを返す */
export function isBGMPlaying() {
  return isPlaying;
}

/**
 * ユーザー音量を設定する (0〜1)
 * BGM再生中でもリアルタイムに反映される
 */
export function setVolume(value) {
  userVolume = Math.max(0, Math.min(1, value));
  if (masterGain && ctx && isPlaying) {
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(effectiveGain(), ctx.currentTime);
  }
}

/** ミュート状態を設定する */
export function setMuted(muted) {
  userMuted = muted;
  if (masterGain && ctx && isPlaying) {
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(effectiveGain(), ctx.currentTime);
  }
}

/** 現在のユーザー音量を返す (0〜1) */
export function getVolume() {
  return userVolume;
}

/** 現在のミュート状態を返す */
export function getMuted() {
  return userMuted;
}
