const fs = require('fs');
let b = fs.readFileSync('src/data/notebookQuizData.js', 'utf8');

b = b.replace(/"notebook_japanese":\s*\{[\s\S]*?"imageUrl":\s*"[^"]*"/, match => match.replace(/"imageUrl":\s*"[^"]*"/, '"imageUrl": "/images/pokemon/hisuian_zorua.png"'));
b = b.replace(/"notebook_math":\s*\{[\s\S]*?"imageUrl":\s*"[^"]*"/, match => match.replace(/"imageUrl":\s*"[^"]*"/, '"imageUrl": "/images/pokemon/arceus.png"'));
b = b.replace(/"notebook_science":\s*\{[\s\S]*?"imageUrl":\s*"[^"]*"/, match => match.replace(/"imageUrl":\s*"[^"]*"/, '"imageUrl": "/images/pokemon/suicune.png"'));
b = b.replace(/"notebook_society":\s*\{[\s\S]*?"imageUrl":\s*"[^"]*"/, match => match.replace(/"imageUrl":\s*"[^"]*"/, '"imageUrl": "/images/pokemon/zamazenta.png"'));
b = b.replace(/"notebook_english":\s*\{[\s\S]*?"imageUrl":\s*"[^"]*"/, match => match.replace(/"imageUrl":\s*"[^"]*"/, '"imageUrl": "/images/pokemon/eevee.png"'));

fs.writeFileSync('src/data/notebookQuizData.js', b);
