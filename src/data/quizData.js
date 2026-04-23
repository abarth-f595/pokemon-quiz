import { notebookQuizData } from './notebookQuizData';

export const baseQuizData = {
  japanese: {
    title: "国語 (光村図書 小5)",
    color: "#ff7675",
    characterName: "ヒスイゾロア",
    description: "いたずら好きなクイズマスター。漢字や文章のナゾ 🔍 を解き明かす。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10240.png",
    hasSubCategories: true,
    subCategories: [
      { id: "kanji", title: "漢字の読み書き" },
      { id: "text", title: "教科書の文章問題" }
    ],
    questions: [
      { id: "j_k1", term: 1, type: "kanji", question: "「変化」の正しい読み方は？", options: ["へんか", "へんげ", "かわり", "かわか"], correctOptionIndex: 0, explanation: "「へんか」と読みます。" },
      { id: "j_k2", term: 1, type: "kanji", question: "小学5年生で習う「想像」。正しい使い方は？", options: ["未来のポケモンを想像する", "重い荷物を想像する"], correctOptionIndex: 0, explanation: "頭の中で思いえがくことです。", isAdvanced: true },
      { id: "j_t1", term: 1, type: "text", question: "物語「大造じいさんとガン」。「ガン」とは何のこと？", options: ["鳥のなかま", "銃", "めがね", "わざ"], correctOptionIndex: 0, explanation: "「ガン（雁）」は大きな鳥のなかまです！" },
      
      { id: "j_k3", term: 2, type: "kanji", question: "「固有種」の正しい読み方は？", options: ["こゆうしゅ", "こあしゅ", "こくゆうしゅ"], correctOptionIndex: 0, explanation: "「こゆうしゅ」と読みます。" },
      { id: "j_k4", term: 2, type: "kanji", question: "「過失」の正しい読み方は？", options: ["かしつ", "すぎしつ", "かやしつ"], correctOptionIndex: 0, explanation: "「かしつ」と読みます。", isAdvanced: true },
      { id: "j_t2", term: 2, type: "text", question: "物語「雪わたり」の作者は誰？", options: ["宮沢賢治", "新美南吉", "夏目漱石"], correctOptionIndex: 0, explanation: "宮沢賢治です。" },

      { id: "j_k5", term: 3, type: "kanji", question: "「敬語」を丁寧（ていねい）に言うと「行く」はどうなる？", options: ["行きます", "行くぞ", "行こう"], correctOptionIndex: 0, explanation: "「行きます」が丁寧語です。" },
      { id: "j_t3", term: 3, type: "text", question: "自分の意見を伝える文章を書くとき、一番最初に書くべきなのはどれ？", options: ["自分の主張（意見）", "関係ない話", "まとめ"], correctOptionIndex: 0, explanation: "まずは「自分の意見（主張）」を書きましょう！" },
      { id: "j_t4", term: 3, type: "text", question: "応用問題。文章の「事実」と「意見」を見わけるとき、自分の気持ちはどちら？", options: ["意見", "事実", "どちらでもない"], correctOptionIndex: 0, explanation: "自分の気持ちや考えは「意見」です。", isAdvanced: true },

      { id: "j_rev1", term: "review", type: "kanji", question: "【ふりかえり】「大造」の読み方は？", options: ["だいぞう", "たいぞう", "おおづくり"], correctOptionIndex: 0, explanation: "「だいぞう」と読みます。" },
      { id: "j_adv1", term: "advanced", type: "text", question: "【オリジナル応用】もしピカチュウを主人公にして宮沢賢治風の物語を書くとしたら、どの言葉使いが一番似合う？", options: ["クラムボンのように笑う", "令和の電気ねずみ", "機械のように動く"], correctOptionIndex: 0, explanation: "宮沢賢治は自然やオノマトペを独特の表現で用いました。", isAdvanced: true }
    ]
  },
  math: {
    title: "算数 (教育出版 小5)",
    color: "#74b9ff",
    characterName: "アルセウス",
    description: "最強の相棒。威厳を持って計算バトル ⚔️ を挑んでくる。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png",
    questions: [
      { id: "m1_1", term: 1, question: "一辺が 5cm のサイコロの体積（たいせき）は？（5×5×5）", options: ["125 立方cm", "25 立方cm", "15 立方cm"], correctOptionIndex: 0, explanation: "5 × 5 × 5 ＝ 125立方cm です。" },
      { id: "m1_2", term: 1, question: "6kg のピカチュウが 1.5倍に重くなったら何kg？", options: ["9 kg", "7.5 kg", "12 kg"], correctOptionIndex: 0, explanation: "6 × 1.5 ＝ 9 なので、9kgになります。", isAdvanced: true },
      
      { id: "m2_1", term: 2, question: "手持ちポケモンが 4匹。「4の倍数」になっている数はどれ？", options: ["12", "6", "10"], correctOptionIndex: 0, explanation: "4 × 3 ＝ 12 なので、12は4の倍数です。" },
      { id: "m2_2", term: 2, question: "分数のたし算。「1/5 ＋ 2/5」の答えは？", options: ["3/5", "3/10", "1/5"], correctOptionIndex: 0, explanation: "分子だけをたします（1+2=3）。", isAdvanced: true },

      { id: "m3_1", term: 3, question: "100円のモンスターボールが「20％引き」です。いくら安くなる？", options: ["20円", "80円", "100円"], correctOptionIndex: 0, explanation: "100円の20%（0.2）は20円です！" },
      { id: "m3_2", term: 3, question: "円周率は、およそいくつ？", options: ["3.14", "3.00", "4.14"], correctOptionIndex: 0, explanation: "およそ「3.14」として計算します！", isAdvanced: true },

      { id: "m_rev1", term: "review", question: "【ふりかえり】奇数（きすう）はどれ？", options: ["3", "4", "6"], correctOptionIndex: 0, explanation: "2でわり切れない数が奇数です。" },
      { id: "m_adv1", term: "advanced", question: "【オリジナル応用】サトシの冒険で、毎日モンスターボールを2個ずつ増やした場合、x日後のボールの数を式で表すと？", options: ["もとの数 + 2 × x", "2 × x", "x ÷ 2"], correctOptionIndex: 0, explanation: "1日で2ずつ増えるので、増やした分は「2×x」になります。", isAdvanced: true }
    ]
  },
  science: {
    title: "理科 (大日本図書 小5)",
    color: "#55efc4",
    characterName: "スイクン",
    description: "好奇心旺盛な研究員。自然のふしぎ 🧪 を共に調査する。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png",
    questions: [
      { id: "s1_1", term: 1, question: "種が「発芽」するために絶対に必要【ではない】ものはどれ？", options: ["土（つち）", "水", "空気", "適度な温度"], correctOptionIndex: 0, explanation: "土や肥料がなくても水・空気・温度があれば芽は出ます！" },
      { id: "s1_2", term: 1, question: "メダカのたまごを虫眼鏡で見ると、最初に目立って見えるのは？", options: ["黒い目", "しっぽ", "ひれ"], correctOptionIndex: 0, explanation: "まず最初に２つの「黒い目」が見えるようになります。", isAdvanced: true },
      
      { id: "s2_1", term: 2, question: "水が地面をけずるはたらきを何という？", options: ["しん食", "うんぱん", "たいせき"], correctOptionIndex: 0, explanation: "けずるはたらきを「しん食（浸食）」と呼びます。" },
      { id: "s2_2", term: 2, question: "台風は、ふつうどの方角に向かって進む？", options: ["南から北", "北から南", "東から西"], correctOptionIndex: 0, explanation: "台風は日本の南で発生し、北へ向かって進んできます。", isAdvanced: true },

      { id: "s3_1", term: 3, question: "電磁石を「もっと強く」するにはどうすればいい？", options: ["乾電池を直列につなぐ", "乾電池を並列につなぐ", "鉄芯をぬく"], correctOptionIndex: 0, explanation: "乾電池を「直列」につなぐとパワーが強くなります！" },
      { id: "s3_2", term: 3, question: "ふりこが揺れる時間を変えることができるのはどれ？", options: ["ふりこの長さ", "おもりの重さ", "ふりはば"], correctOptionIndex: 0, explanation: "ふりこが揺れる時間は「長さ」を変えたときだけ変化します。", isAdvanced: true },

      { id: "s_rev1", term: "review", question: "【ふりかえり】夏に一番高くまで登る太陽の動きはどれ？", options: ["夏至（げし）", "冬至（とうじ）", "春分（しゅんぶん）"], correctOptionIndex: 0, explanation: "一年で一番昼が長い「夏至」の日です。" },
      { id: "s_adv1", term: "advanced", question: "【オリジナル応用】コイル（でんきタイプ）が「ほうでん」を使いました。雷と同じ仕組みですが、電気が流れるとき周りの空気はどうなる？", options: ["熱くなって膨らむ", "冷たくなって縮む", "変わらない"], correctOptionIndex: 0, explanation: "電気が流れるとき空気が非常に熱くなって膨張し、それが「ゴロゴロ」という雷の音の正体になります。", isAdvanced: true }
    ]
  },
  society: {
    title: "社会 (東京書籍 小5)",
    color: "#fdcb6e",
    characterName: "ザマゼンタ",
    description: "熱血な探検家。日本のひみつ 🗺️ を探す旅へ連れ出す。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/889.png",
    questions: [
      { id: "so1_1", term: 1, question: "日本の「都道府県」の数はいくつ？", options: ["47", "50", "43"], correctOptionIndex: 0, explanation: "1都1道2府43県で「47」です！" },
      { id: "so1_2", term: 1, question: "日本で「一番広い平野」は？", options: ["関東平野", "濃尾平野", "越後平野"], correctOptionIndex: 0, explanation: "関東地方に広がる関東平野です。", isAdvanced: true },
      
      { id: "so2_1", term: 2, question: "日本で一番「米づくり」がさかんな県はどこ？", options: ["新潟県", "沖縄県", "東京都"], correctOptionIndex: 0, explanation: "新潟県や北海道など、水がきれいな場所でさかんです。" },
      { id: "so2_2", term: 2, question: "愛知県を中心に自動車工場が集まっている地域を何という？", options: ["中京工業地帯", "京浜工業地帯", "阪神工業地帯"], correctOptionIndex: 0, explanation: "愛知県を中心とする「中京工業地帯」が車づくりで有名です。", isAdvanced: true },

      { id: "so3_1", term: 3, question: "国や市に払う「消費税」などのお金を何という？", options: ["税金", "おこづかい", "貯金"], correctOptionIndex: 0, explanation: "みんなが安全に暮らすためのお金を「税金」といいます。" },
      { id: "so3_2", term: 3, question: "色々な情報がすぐ手に入る世の中を何社会という？", options: ["情報化社会", "農業社会", "未来社会"], correctOptionIndex: 0, explanation: "インターネットなどの発達で「情報化社会」と呼ばれます。", isAdvanced: true },

      { id: "so_rev1", term: "review", question: "【ふりかえり】日本の周りにある暖かい海流を何という？", options: ["日本海流（黒潮）", "千島海流（親潮）", "リマン海流"], correctOptionIndex: 0, explanation: "南からやってくる暖かい海流を日本海流（黒潮）といいます。" },
      { id: "so_adv1", term: "advanced", question: "【オリジナル応用】もしポケモンの世界のように人が少ない自然保護区を作るとしたら、日本のどんな法律が関わってくる？", options: ["自然環境保全法", "道路交通法", "教育基本法"], correctOptionIndex: 0, explanation: "日本の豊かな自然を守るためのルールとして自然環境保全法などがあります。", isAdvanced: true }
    ]
  },
  english: {
    title: "外国語 (光村図書 小5)",
    color: "#a29bfe",
    characterName: "イーブイ",
    description: "元気な通訳。世界中のポケモンと友達 🤝 になるための英語を教える。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
    questions: [
      { id: "e1_1", term: 1, question: "英語で「あなたは何が好きですか？」と聞く時は？", options: ["What do you like?", "Who are you?", "Where do you go?"], correctOptionIndex: 0, explanation: "「What do you like?」を使います！" },
      { id: "e1_2", term: 1, question: "大文字「P」の小文字はどれ？", options: ["p", "q", "d"], correctOptionIndex: 0, explanation: "大文字「P」の小文字は「p」です！", isAdvanced: true },
      
      { id: "e2_1", term: 2, question: "「私はリンゴが好きです」と英語で言うと？", options: ["I like apples.", "I have apples.", "You like apples."], correctOptionIndex: 0, explanation: "「自分がい好き」と言う時は「I like ~」を使います。" },
      { id: "e2_2", term: 2, question: "「何のスポーツが好きですか？」と聞くときは？", options: ["What sport do you like?", "What color do you like?", "Who are you?"], correctOptionIndex: 0, explanation: "スポーツの種類を聞くので「What sport」を使います。", isAdvanced: true },

      { id: "e3_1", term: 3, question: "カビゴンに「あなたは何時に起きますか？」と聞きたい。正しいのは？", options: ["What time do you get up?", "What time is it?", "How are you?"], correctOptionIndex: 0, explanation: "起きる時間を聞く時は「What time do you get up?」です。" },
      { id: "e3_2", term: 3, question: "「私は速く走ることができます」と伝えるときは？", options: ["I can run fast.", "I like running.", "Can you run?"], correctOptionIndex: 0, explanation: "できることは「can（キャン）」を使います。", isAdvanced: true },

      { id: "e_rev1", term: "review", question: "【ふりかえり】「こんにちは」と英語で言うと？", options: ["Hello.", "Goodbye.", "Yes."], correctOptionIndex: 0, explanation: "挨拶の基本は「Hello」です。" },
      { id: "e_adv1", term: "advanced", question: "【オリジナル応用】ピカチュウが「Pika!」と嬉しそうにしています。「彼はハッピーだ」と英語で言うと？", options: ["He is happy.", "She is happy.", "I am happy."], correctOptionIndex: 0, explanation: "男の子（彼）の話をするときは「He is ~」を使います。", isAdvanced: true }
    ]
  }
};

export const quizData = {
  ...baseQuizData,
  ...notebookQuizData
};
