#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
"""
小学5年生 苦手分析・復習プリント生成ツール
使い方: python quiz_tracker.py
"""

import csv
import os
import re
import sys
from datetime import datetime
from collections import defaultdict

# ── パス設定 ──────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
DATA_DIR   = os.path.join(BASE_DIR, "quiz_data")
RESULTS_FILE = os.path.join(DATA_DIR, "results.csv")
REPORTS_DIR  = os.path.join(BASE_DIR, "reports")

CSV_HEADER = ["date", "subject", "semester", "unit", "question_no", "correct", "memo"]

# ── 単元マスター ──────────────────────────────────
UNITS = {
    "国語": {
        "一学期": [
            "詩の表現技法",
            "漢字の成り立ち",
            "なまえつけてよ（物語）",
            "インタビュー",
            "見立てる（説明文）",
            "言葉の意味が分かること（説明文）",
            "季節の言葉1・俳句",
            "一学期の漢字",
        ],
        "二学期": [
            "夏の季語・俳句",
            "古典（枕草子・竹取物語）",
            "討論・話し合い",
            "グラフを用いた作文",
            "大造じいさんとガン（物語）",
            "固有種が教えてくれること（説明文）",
            "おくのほそ道・古典",
            "二学期の漢字",
        ],
        "三学期": [
            "秋冬の季語・俳句",
            "敬語（尊敬語・謙譲語・丁寧語）",
            "方言と共通語",
            "わらぐつの中の神様（物語）",
            "想像力のスイッチ（説明文）",
            "複合語",
            "提案文・調査文",
            "三学期の漢字",
        ],
    },
    "算数": {
        "一学期": [
            "整数と小数（位取り・10倍÷10）",
            "体積（直方体・立方体・複合図形）",
            "比例（比例の式・グラフ）",
            "小数のかけ算",
            "小数のわり算",
        ],
        "二学期": [
            "合同な図形（合同条件・作図）",
            "整数の性質（偶奇・倍数・約数・素数）",
            "分数と小数の関係（約分・通分）",
            "分数のたし算・ひき算",
            "平均",
        ],
        "三学期": [
            "単位量あたりの大きさ（人口密度）",
            "割合（%・歩合・3用法）",
            "帯グラフと円グラフ",
            "正多角形と円（円周・面積）",
            "角柱と円柱（展開図）",
            "速さ（距離・時間・単位換算）",
        ],
    },
    "理科": {
        "一学期": [
            "天気の変化（雲・前線・台風）",
            "植物の発芽と成長（対照実験）",
            "メダカのたんじょう（受精・観察）",
        ],
        "二学期": [
            "花から実へ（受粉・結実）",
            "流水の働き（侵食・運搬・堆積）",
            "人のたんじょう（胎児・胎盤）",
        ],
        "三学期": [
            "もののとけ方（溶解度・再結晶・ろ過）",
            "ふりこのきまり（周期・条件実験）",
            "電磁石の性質（コイル・極・強さ）",
        ],
    },
    "社会": {
        "一学期": [
            "国土の地形（山脈・平野・川・EEZ）",
            "国土の気候（6区分・雨温図）",
            "低い土地・高い土地のくらし",
            "あたたかい土地・寒い土地のくらし",
        ],
        "二学期": [
            "米づくり（庄内平野・稲作・農業機械）",
            "水産業（漁業の種類・漁港・流通）",
            "これからの食料生産（自給率・地産地消）",
        ],
        "三学期": [
            "工業地帯・地域（種類・分布）",
            "自動車をつくる工業（工程・JIT）",
            "運輸・貿易・情報（輸出入・コンテナ）",
            "これからの工業（公害・環境・SDGs）",
        ],
    },
    "英語": {
        "一学期": [
            "Unit0 アルファベット・基本表現復習",
            "Unit1 誕生日・月・序数",
            "Unit2 教科・曜日・時間割",
            "Unit3 can / want to（できること）",
        ],
        "二学期": [
            "Unit4 行きたい国・理由（because）",
            "Unit5 He/She can・人物紹介",
            "Unit6 注文・Would you like・産地",
        ],
        "三学期": [
            "Unit7 日本文化・行事の紹介",
            "Unit8 尊敬する人・将来の夢",
            "まとめ・My Treasure 発表",
        ],
    },
}

SOURCE_FILES = {
    "一学期": os.path.join(BASE_DIR, "5nen_1gakki_kanzen.md"),
    "二学期": os.path.join(BASE_DIR, "5nen_2gakki_kanzen.md"),
    "三学期": os.path.join(BASE_DIR, "5nen_3gakki_kanzen.md"),
}

WEAK_THRESHOLD = 70  # 正答率70%未満を「苦手」と判定

# ── ユーティリティ ────────────────────────────────
def ensure_dirs():
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(REPORTS_DIR, exist_ok=True)

def init_csv():
    if not os.path.exists(RESULTS_FILE):
        with open(RESULTS_FILE, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow(CSV_HEADER)

def load_results():
    if not os.path.exists(RESULTS_FILE):
        return []
    rows = []
    with open(RESULTS_FILE, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows

def save_result(subject, semester, unit, question_no, correct, memo=""):
    with open(RESULTS_FILE, "a", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M"),
            subject, semester, unit, question_no,
            "1" if correct else "0",
            memo,
        ])

def choose(prompt, options):
    """番号でメニューを選択させる。0で戻る。"""
    while True:
        print(f"\n{prompt}")
        for i, opt in enumerate(options, 1):
            print(f"  {i}. {opt}")
        print("  0. 戻る")
        val = input("> ").strip()
        if val == "0":
            return None
        if val.isdigit() and 1 <= int(val) <= len(options):
            return options[int(val) - 1]
        print("  ※ 番号を入力してください。")

# ── 集計ロジック ──────────────────────────────────
def calc_stats(rows):
    """
    Returns:
        subject_stats  : { subject: {total, correct, acc} }
        unit_stats     : { (subject, semester, unit): {total, correct, acc, dates} }
        date_stats     : { date_str: {total, correct} }
    """
    sub   = defaultdict(lambda: {"total": 0, "correct": 0})
    unit  = defaultdict(lambda: {"total": 0, "correct": 0, "dates": []})
    dated = defaultdict(lambda: {"total": 0, "correct": 0})

    for r in rows:
        s  = r["subject"]
        sm = r["semester"]
        u  = r["unit"]
        c  = int(r["correct"])
        d  = r["date"][:10]

        sub[s]["total"] += 1
        sub[s]["correct"] += c

        key = (s, sm, u)
        unit[key]["total"] += 1
        unit[key]["correct"] += c
        if d not in unit[key]["dates"]:
            unit[key]["dates"].append(d)

        dated[d]["total"] += 1
        dated[d]["correct"] += c

    # 正答率を付加
    for v in sub.values():
        v["acc"] = round(v["correct"] / v["total"] * 100, 1) if v["total"] else 0
    for v in unit.values():
        v["acc"] = round(v["correct"] / v["total"] * 100, 1) if v["total"] else 0
    for v in dated.values():
        v["acc"] = round(v["correct"] / v["total"] * 100, 1) if v["total"] else 0

    return sub, unit, dated

def get_weak_units(unit_stats, threshold=WEAK_THRESHOLD):
    """正答率 < threshold の単元を正答率昇順で返す"""
    weak = [(k, v) for k, v in unit_stats.items() if v["acc"] < threshold]
    weak.sort(key=lambda x: x[1]["acc"])
    return weak

# ── モード1：記録 ─────────────────────────────────
def mode_record():
    print("\n" + "="*40)
    print("  ✏️  問題記録モード")
    print("="*40)

    subjects = list(UNITS.keys())
    subject = choose("教科を選んでください", subjects)
    if not subject:
        return

    semesters = list(UNITS[subject].keys())
    semester = choose("学期を選んでください", semesters)
    if not semester:
        return

    units = UNITS[subject][semester]
    unit = choose("単元を選んでください", units)
    if not unit:
        return

    print("\n問題番号を入力してください（例: 1, 2-3, 応用5 など）")
    q_no = input("> ").strip()
    if not q_no:
        print("  ※ キャンセルしました。")
        return

    while True:
        ans = input("結果: 1=正解  0=不正解  > ").strip()
        if ans in ("0", "1"):
            correct = ans == "1"
            break
        print("  ※ 0 か 1 を入力してください。")

    memo = input("メモ（苦手ポイントなど、空欄でもOK）: ").strip()

    save_result(subject, semester, unit, q_no, correct, memo)
    mark = "✅ 正解" if correct else "❌ 不正解"
    print(f"\n  {mark} を記録しました。")
    print(f"  [{subject}] {semester} ／ {unit} ／ 問{q_no}")

# ── モード2：統計を見る ───────────────────────────
def mode_stats():
    rows = load_results()
    if not rows:
        print("\n  ※ まだデータがありません。先に記録してください。")
        return

    sub_stats, unit_stats, date_stats = calc_stats(rows)

    print("\n" + "="*40)
    print("  📊  教科別 正答率")
    print("="*40)
    print(f"  {'教科':<8} {'問題数':>6} {'正解数':>6} {'正答率':>7}")
    print("  " + "-"*34)
    for subj in ["国語", "算数", "理科", "社会", "英語"]:
        if subj in sub_stats:
            v = sub_stats[subj]
            bar = _bar(v["acc"])
            print(f"  {subj:<8} {v['total']:>6} {v['correct']:>6} {v['acc']:>6.1f}%  {bar}")

    print("\n" + "="*40)
    print(f"  ⚠️  苦手単元（正答率 {WEAK_THRESHOLD}% 未満）")
    print("="*40)
    weak = get_weak_units(unit_stats)
    if not weak:
        print(f"  🎉 苦手単元はありません！（全単元 {WEAK_THRESHOLD}% 以上）")
    else:
        print(f"  {'単元':<28} {'問題数':>5} {'正答率':>7}")
        print("  " + "-"*44)
        for (subj, sem, unit), v in weak:
            bar = _bar(v["acc"])
            label = f"[{subj}/{sem}] {unit}"
            print(f"  {label:<36} {v['total']:>5} {v['acc']:>6.1f}%  {bar}")

    print("\n" + "="*40)
    print("  📅  直近10日間の推移")
    print("="*40)
    dates = sorted(date_stats.keys())[-10:]
    for d in dates:
        v = date_stats[d]
        bar = _bar(v["acc"])
        print(f"  {d}  {v['correct']:>3}/{v['total']:>3}問  {v['acc']:>5.1f}%  {bar}")

def _bar(acc, width=15):
    filled = int(acc / 100 * width)
    return "█" * filled + "░" * (width - filled)

# ── モード3：NotebookLM用 弱点レポート出力 ─────────
def mode_export_report():
    rows = load_results()
    if not rows:
        print("\n  ※ データがありません。")
        return

    sub_stats, unit_stats, date_stats = calc_stats(rows)
    weak = get_weak_units(unit_stats)
    today = datetime.now().strftime("%Y-%m-%d")
    out_path = os.path.join(REPORTS_DIR, f"weakness_report_{today}.md")

    lines = []
    lines.append(f"# 苦手傾向分析レポート（{today}）")
    lines.append(f"## 対象：小学5年生 札幌市準拠教科書\n")
    lines.append(f"総問題数：{sum(v['total'] for v in sub_stats.values())} 問\n")

    # 教科別サマリー
    lines.append("## 教科別 正答率サマリー\n")
    lines.append("| 教科 | 問題数 | 正答率 | 評価 |")
    lines.append("|------|--------|--------|------|")
    for subj in ["国語", "算数", "理科", "社会", "英語"]:
        if subj in sub_stats:
            v = sub_stats[subj]
            mark = "✅ 良好" if v["acc"] >= 80 else ("⚠️ 要注意" if v["acc"] >= 60 else "❌ 苦手")
            lines.append(f"| {subj} | {v['total']} | {v['acc']}% | {mark} |")
    lines.append("")

    # 苦手単元ランキング
    lines.append(f"## 苦手単元ランキング（正答率 {WEAK_THRESHOLD}% 未満）\n")
    if not weak:
        lines.append(f"現時点で苦手単元はありません。全単元 {WEAK_THRESHOLD}% 以上を達成しています。\n")
    else:
        lines.append("| 順位 | 教科 | 学期 | 単元 | 問題数 | 正答率 | 優先度 |")
        lines.append("|------|------|------|------|--------|--------|--------|")
        for rank, ((subj, sem, unit), v) in enumerate(weak, 1):
            priority = "🔴 最優先" if v["acc"] < 50 else ("🟡 優先" if v["acc"] < 65 else "🟢 要確認")
            lines.append(f"| {rank} | {subj} | {sem} | {unit} | {v['total']} | {v['acc']}% | {priority} |")
        lines.append("")

    # 苦手単元の詳細（メモ付き）
    lines.append("## 苦手単元の詳細・記録メモ\n")
    for (subj, sem, unit), v in weak:
        lines.append(f"### [{subj}・{sem}] {unit}  —  正答率 {v['acc']}%\n")
        # この単元の誤答メモを抽出
        memos = [
            r["memo"] for r in rows
            if r["subject"] == subj and r["semester"] == sem
            and r["unit"] == unit and r["correct"] == "0" and r["memo"].strip()
        ]
        if memos:
            lines.append("**間違えたときのメモ：**\n")
            for m in memos:
                lines.append(f"- {m}")
            lines.append("")
        lines.append(f"→ この単元のポイントを重点的に復習してください。\n")

    # 日別推移
    lines.append("## 日別 正答率の推移\n")
    lines.append("| 日付 | 問題数 | 正答率 |")
    lines.append("|------|--------|--------|")
    for d in sorted(date_stats.keys()):
        v = date_stats[d]
        lines.append(f"| {d} | {v['total']} | {v['acc']}% |")
    lines.append("")

    # NotebookLM向けの指示文
    lines.append("## NotebookLM への指示文（コピーして使用）\n")
    lines.append("```")
    lines.append("以下の苦手単元について：")
    for (subj, sem, unit), v in weak[:5]:
        lines.append(f"- [{subj}・{sem}] {unit}（正答率{v['acc']}%）")
    lines.append("")
    lines.append("1. この単元で特に重要な公式・概念をまとめてください。")
    lines.append("2. 典型的な間違いパターンと注意点を教えてください。")
    lines.append("3. 段階的な練習問題を3問（基本→応用→発展）作ってください。")
    lines.append("```\n")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"\n  ✅ レポートを出力しました：")
    print(f"  {out_path}")
    print(f"\n  NotebookLM に以下3ファイルをまとめてアップロードしてください：")
    print(f"  ・5nen_1gakki_kanzen.md")
    print(f"  ・5nen_2gakki_kanzen.md")
    print(f"  ・5nen_3gakki_kanzen.md")
    print(f"  ・weakness_report_{today}.md  ← 今回生成したファイル")

# ── モード4：苦手復習プリント生成 ────────────────
def mode_review_sheet():
    rows = load_results()
    if not rows:
        print("\n  ※ データがありません。")
        return

    _, unit_stats, _ = calc_stats(rows)
    weak = get_weak_units(unit_stats)

    if not weak:
        print(f"\n  🎉 苦手単元がありません！（全単元 {WEAK_THRESHOLD}% 以上）")
        return

    # 上位何単元を対象にするか選ぶ
    print(f"\n苦手単元が {len(weak)} 件あります。")
    print("何単元分の復習プリントを作りますか？（1〜5、推奨: 3）")
    val = input("> ").strip()
    count = int(val) if val.isdigit() and 1 <= int(val) <= len(weak) else 3
    target = weak[:count]

    today = datetime.now().strftime("%Y-%m-%d")
    out_path = os.path.join(REPORTS_DIR, f"review_sheet_{today}.md")

    lines = []
    lines.append(f"# 苦手単元 集中復習プリント（{today}）")
    lines.append(f"> 正答率が低い上位{count}単元を抽出しました。\n")

    for rank, ((subj, sem, unit_name), v) in enumerate(target, 1):
        lines.append(f"---\n")
        lines.append(f"## 第{rank}位：[{subj}・{sem}] {unit_name}")
        lines.append(f"> 現在の正答率：**{v['acc']}%**（{v['correct']}/{v['total']}問正解）\n")

        # ソースファイルからその単元のセクションを抽出
        section = _extract_section(SOURCE_FILES.get(sem, ""), subj, unit_name)
        if section:
            lines.append(section)
        else:
            lines.append(f"（{sem}の教科書ファイルが見つかりません。別途テキストを参照してください）\n")

        # 誤答メモを追記
        memos = [
            r for r in rows
            if r["subject"] == subj and r["semester"] == sem
            and r["unit"] == unit_name and r["correct"] == "0"
        ]
        if memos:
            lines.append("\n### 📝 あなたの過去の間違いメモ\n")
            for r in memos:
                note = r["memo"] if r["memo"].strip() else "（メモなし）"
                lines.append(f"- {r['date'][:10]}  問{r['question_no']}  → {note}")
            lines.append("")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"\n  ✅ 復習プリントを生成しました：")
    print(f"  {out_path}")
    print(f"\n  対象単元：")
    for rank, ((subj, sem, unit_name), v) in enumerate(target, 1):
        print(f"  {rank}. [{subj}・{sem}] {unit_name}  正答率{v['acc']}%")

def _extract_section(filepath, subject, unit_name):
    """mdファイルから該当教科・単元のセクションを抽出する"""
    if not os.path.exists(filepath):
        return None

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 教科ブロックを見つける
    subj_pattern = rf"(# 【{re.escape(subject)}】.*?)(?=\n# 【|\Z)"
    subj_match = re.search(subj_pattern, content, re.DOTALL)
    if not subj_match:
        return None
    subj_block = subj_match.group(1)

    # 単元名でセクションを見つける（部分一致）
    key = re.sub(r"[（）【】「」\(\)・]", ".", unit_name)
    key_short = unit_name[:6]  # 先頭6文字で検索
    unit_pattern = rf"(## ■.*?{re.escape(key_short)}.*?\n.*?)(?=\n## ■|\n# |\Z)"
    unit_match = re.search(unit_pattern, subj_block, re.DOTALL)

    if not unit_match:
        return None

    section = unit_match.group(1).strip()
    # 長すぎる場合は学習内容と応用問題の見出しまでに制限
    lines = section.split("\n")
    # 最大200行
    if len(lines) > 200:
        lines = lines[:200]
        lines.append("\n（続きは教科書ファイルを参照）")
    return "\n".join(lines)

# ── モード5：全データ表示 ─────────────────────────
def mode_show_all():
    rows = load_results()
    if not rows:
        print("\n  ※ データがありません。")
        return
    print(f"\n  総記録数：{len(rows)} 件\n")
    print(f"  {'日付':<17} {'教科':<6} {'学期':<6} {'単元':<28} {'問':<6} {'結果'}")
    print("  " + "-"*80)
    for r in rows[-30:]:  # 直近30件
        mark = "✅" if r["correct"] == "1" else "❌"
        unit_short = r["unit"][:14] + "…" if len(r["unit"]) > 15 else r["unit"]
        print(f"  {r['date']:<17} {r['subject']:<6} {r['semester']:<6} {unit_short:<16} {r['question_no']:<6} {mark} {r['memo'][:20]}")

# ── メインメニュー ────────────────────────────────
def main():
    ensure_dirs()
    init_csv()

    MENU = {
        "1": ("✏️  問題を記録する",          mode_record),
        "2": ("📊  統計・苦手を確認する",      mode_stats),
        "3": ("📄  弱点レポートを出力（NotebookLM用）", mode_export_report),
        "4": ("📋  苦手復習プリントを生成する", mode_review_sheet),
        "5": ("🗒️  全記録を表示する（直近30件）", mode_show_all),
        "0": ("🚪  終了",                    None),
    }

    while True:
        rows = load_results()
        total = len(rows)
        correct_all = sum(1 for r in rows if r["correct"] == "1")
        acc_all = round(correct_all / total * 100, 1) if total else 0

        print("\n" + "="*44)
        print("  📚 5年生 苦手分析ツール")
        print(f"  累計：{total}問　全体正答率：{acc_all}%")
        print("="*44)
        for k, (label, _) in MENU.items():
            print(f"  {k}. {label}")
        print()

        choice = input("> ").strip()
        if choice == "0":
            print("\n  終了します。お疲れ様でした！\n")
            break
        if choice in MENU and MENU[choice][1]:
            try:
                MENU[choice][1]()
            except Exception as e:
                print(f"\n  ⚠️  エラーが発生しました: {e}")
        else:
            print("  ※ 0〜5 を入力してください。")

if __name__ == "__main__":
    main()
