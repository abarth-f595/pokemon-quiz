#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
"""
サンプルデータ投入スクリプト
quiz_tracker.py の動作確認用。初回だけ実行してください。
"""

import csv, os, random
from datetime import datetime, timedelta

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
DATA_DIR     = os.path.join(BASE_DIR, "quiz_data")
RESULTS_FILE = os.path.join(DATA_DIR, "results.csv")
CSV_HEADER   = ["date", "subject", "semester", "unit", "question_no", "correct", "memo"]

# 苦手傾向を擬似的に再現したサンプルデータ定義
# (subject, semester, unit, 正答率, 問題数, メモ候補)
SAMPLE_CONFIG = [
    # 国語
    ("国語", "一学期", "漢字の成り立ち",         80, 10, ["形声文字が紛らわしい", "部首の判別が難しい"]),
    ("国語", "二学期", "大造じいさんとガン（物語）", 60, 10, ["心情変化の説明が難しい", "情景描写の意味が取れない"]),
    ("国語", "三学期", "敬語（尊敬語・謙譲語・丁寧語）", 45, 12, ["謙譲語と尊敬語の区別が曖昧", "いただく・召し上がるの使い分け", "参るの用法を間違えた"]),
    # 算数
    ("算数", "一学期", "体積（直方体・立方体・複合図形）", 55, 12, ["L字型の複合図形で間違えた", "単位換算（m³とcm³）", "高さを求める逆算が苦手"]),
    ("算数", "一学期", "小数のわり算",              75, 10, ["あまりの小数点を忘れた", "÷小数のとき点の移動を間違えた"]),
    ("算数", "二学期", "整数の性質（偶奇・倍数・約数・素数）", 65, 12, ["最大公約数の計算ミス", "素数の判別ミス（1は素数でない）"]),
    ("算数", "三学期", "割合（%・歩合・3用法）",    50, 14, ["もとにする量を求める式を逆にした", "歩合と百分率の変換ミス", "割引計算で×0.8を使い忘れた", "3用法の使い分けが混乱"]),
    ("算数", "三学期", "速さ（距離・時間・単位換算）", 58, 12, ["km/時 → m/分の換算ミス", "時間の単位変換（1.5時間→90分）", "出会い問題で速さの和を使い忘れた"]),
    # 理科
    ("理科", "一学期", "植物の発芽と成長（対照実験）", 70, 10, ["対照実験の条件設定が不明確", "でんぷんの検出でヨウ素液の色を間違えた"]),
    ("理科", "三学期", "もののとけ方（溶解度・再結晶・ろ過）", 52, 12, ["溶解度の計算ミス", "食塩とミョウバンの違いを逆に覚えていた", "再結晶で取り出せる量の計算"]),
    ("理科", "三学期", "電磁石の性質（コイル・極・強さ）", 68, 10, ["電流の向きと極の関係が曖昧", "コイルの巻き数と電流の両方の影響"]),
    # 社会
    ("社会", "一学期", "国土の気候（6区分・雨温図）", 62, 10, ["雨温図から気候区分を見分けるのが難しい", "内陸と日本海側の違いが曖昧"]),
    ("社会", "三学期", "自動車をつくる工業（工程・JIT）", 72, 10, ["工程の順番を間違えた", "ジャスト・イン・タイムの説明"]),
    # 英語
    ("英語", "一学期", "Unit1 誕生日・月・序数",    78, 10, ["序数のスペル（third・twelfth）を間違えた"]),
    ("英語", "二学期", "Unit5 He/She can・人物紹介", 60, 12, ["三人称のcanの使い方", "be good at の後がing形", "She are → She isに修正できなかった"]),
    ("英語", "三学期", "Unit8 尊敬する人・将来の夢", 65, 10, ["because の使い方", "I want to be a/an の使い分け", "I'm interesting → I'm interested"]),
]

def generate_sample():
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(RESULTS_FILE):
        print(f"  ⚠️  {RESULTS_FILE} は既に存在します。上書きしますか？ (y/n)")
        if input("> ").strip().lower() != "y":
            print("  キャンセルしました。")
            return

    rows = []
    base_date = datetime.now() - timedelta(days=30)

    for subj, sem, unit, acc_pct, count, memos in SAMPLE_CONFIG:
        for q in range(1, count + 1):
            # 正答率に従って正誤を決める
            correct = 1 if random.randint(1, 100) <= acc_pct else 0
            # 問題ごとに日付をばらつかせる
            dt = base_date + timedelta(days=random.randint(0, 28), hours=random.randint(8, 20))
            memo = ""
            if correct == 0 and memos:
                memo = random.choice(memos)
            rows.append([
                dt.strftime("%Y-%m-%d %H:%M"),
                subj, sem, unit, str(q),
                str(correct), memo
            ])

    # 日付順に並べる
    rows.sort(key=lambda r: r[0])

    with open(RESULTS_FILE, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(CSV_HEADER)
        writer.writerows(rows)

    total = len(rows)
    correct_all = sum(1 for r in rows if r[5] == "1")
    print(f"\n  ✅ サンプルデータを生成しました。")
    print(f"  ファイル: {RESULTS_FILE}")
    print(f"  件数: {total} 問（正解 {correct_all} 問 / 正答率 {round(correct_all/total*100,1)}%）")
    print(f"\n  次のコマンドでツールを起動してください：")
    print(f"  python quiz_tracker.py")

if __name__ == "__main__":
    print("サンプルデータを生成します（初回動作確認用）")
    generate_sample()
