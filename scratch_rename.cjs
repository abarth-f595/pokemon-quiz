const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'ポケモン');
const mDir = path.join(__dirname, 'モンスターボール');
const bgDir = path.join(__dirname, '壁紙');

const outP = path.join(__dirname, 'public', 'images', 'pokemon');
const outM = path.join(__dirname, 'public', 'images', 'items');
const outBg = path.join(__dirname, 'public', 'images', 'backgrounds');

// Ensure output directories exist
[outP, outM, outBg].forEach(d => {
    if (!fs.existsSync(d)) {
        fs.mkdirSync(d, { recursive: true });
    }
});

const pokemonMap = {
    'アルセウス': 'arceus',
    'イーブイ': 'eevee',
    'エンテイ': 'entei',
    'エーフィ': 'espeon',
    'キルリア': 'kirlia',
    'グレイシア': 'glaceon',
    'コイキング': 'magikarp',
    'サンダース': 'jolteon',
    'サーナイト': 'gardevoir',
    'ザシアン': 'zacian',
    'ザシアン1': 'zacian1',
    'ザマゼンタ': 'zamazenta',
    'ザマゼンタ1': 'zamazenta1',
    'スイクン': 'suicune',
    'ゾロア': 'zorua',
    'ゾロアーク': 'zoroark',
    'ニャース': 'meowth',
    'ニンフィアpng': 'sylveon',
    'ヒスイゾロア': 'hisuian_zorua',
    'ヒスイゾロアーク': 'hisuian_zoroark',
    'ピカチュウ': 'pikachu',
    'ブラッキー': 'umbreon',
    'ブースター': 'flareon',
    'ミュウ': 'mew',
    'ミュウツー': 'mewtwo',
    'ライコウ': 'raikou',
    'ラティアス': 'latias',
    'ラティオス': 'latios',
    'ラルトス': 'ralts',
    'リオル': 'riolu',
    'リーフィア': 'leafeon',
    'ルカリオ': 'lucario',
    '0kabegami': 'bg',
    '壁紙': 'bg2'
};

// 1. Move and rename Pokemon mapping
if (fs.existsSync(pDir)) {
    const files = fs.readdirSync(pDir);
    files.forEach(f => {
        const ext = path.extname(f);
        const name = path.basename(f, ext);
        const newName = pokemonMap[name] || name; // Fallback to original if not mapped
        fs.copyFileSync(path.join(pDir, f), path.join(outP, `${newName}${ext}`));
    });
    console.log(`Copied ${files.length} files from Pokemon folder.`);
}

// 2. Move items
if (fs.existsSync(mDir)) {
    const files = fs.readdirSync(mDir);
    files.forEach(f => {
        fs.copyFileSync(path.join(mDir, f), path.join(outM, f));
    });
    console.log(`Copied ${files.length} files from Items folder.`);
}

// 3. Move backgrounds
if (fs.existsSync(bgDir)) {
    const files = fs.readdirSync(bgDir);
    let counter = 1;
    files.forEach(f => {
        const ext = path.extname(f);
        // Clean up weird Gemini strings or just keep if they are safe. We will make them url safe.
        // Easiest is just background_1.png, background_2.png if it has Japanese or complex names
        let safeName = f;
        if (f.includes('応用問題全問正解')) {
            safeName = 'result_clear' + ext;
        } else if (f.includes('kabegami')) {
            safeName = f;
        } else {
            safeName = `bg_generated_${counter}${ext}`;
            counter++;
        }
        fs.copyFileSync(path.join(bgDir, f), path.join(outBg, safeName));
    });
    console.log(`Copied ${files.length} files from Background folder.`);
}

console.log("Renaming and copying complete!");
