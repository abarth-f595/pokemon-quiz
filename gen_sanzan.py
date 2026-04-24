#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys, io, random, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

random.seed(42)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(BASE_DIR, "anzan_200.md")

def gen_problems():
    problems = []
    # レベル1：2〜6 × 2〜6 × 2〜6  50問
    for _ in range(50):
        a,b,c = random.randint(2,6), random.randint(2,6), random.randint(2,6)
        problems.append((a,b,c,"1"))
    # レベル2：2〜9 × 2〜9 × 2〜9  80問
    for _ in range(80):
        a,b,c = random.randint(2,9), random.randint(2,9), random.randint(2,9)
        problems.append((a,b,c,"2"))
    # レベル3：大きい数（11〜15）が1つ入る  70問
    for _ in range(70):
        nums = [random.randint(2,9), random.randint(2,9), random.randint(11,15)]
        random.shuffle(nums)
        problems.append((nums[0],nums[1],nums[2],"3"))
    return problems

problems = gen_problems()

lines = []
lines.append("# 暗算練習プリント　a x b x c =")
lines.append("## 小学5年生 | 全200問\n")
lines.append("> やり方：頭の中で左から順に計算しよう。")
lines.append("> 例) 3 x 4 x 5  ->  まず 3x4=12  ->  12x5=60\n")
lines.append("---\n")

sections = [
    ("1", "Level 1 (やさしい)  2〜6 の3つかけ算  50問"),
    ("2", "Level 2 (ふつう)   2〜9 の3つかけ算  80問"),
    ("3", "Level 3 (応用)    大きい数が入る   70問"),
]

for level, title in sections:
    lvl = [(a,b,c) for a,b,c,l in problems if l == level]
    lines.append(f"## {title}\n")
    pair = []
    for i, (a,b,c) in enumerate(lvl, 1):
        entry = f"{i:3d}. {a} x {b} x {c} = ________"
        pair.append(entry)
        if len(pair) == 2:
            lines.append(f"  {pair[0]}    {pair[1]}")
            pair = []
            if i % 10 == 0:
                lines.append("")
    if pair:
        lines.append(f"  {pair[0]}")
    lines.append("")

# 解答
lines.append("---\n")
lines.append("## 解答\n")
for level, title in sections:
    lvl = [(a,b,c) for a,b,c,l in problems if l == level]
    lines.append(f"### {title}\n")
    row = []
    for i, (a,b,c) in enumerate(lvl, 1):
        ans = a * b * c
        row.append(f"{i:3d}. {a}x{b}x{c}={ans}")
        if len(row) == 5:
            lines.append("  " + "   ".join(row))
            row = []
    if row:
        lines.append("  " + "   ".join(row))
    lines.append("")

with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"生成完了: {OUT_PATH}")
print(f"総問題数: {len(problems)} 問")
