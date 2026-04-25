import { notebookQuizData } from './notebookQuizData';
import { anzanQuizData } from './anzanQuizData';

export const baseQuizData = {
  japanese: {
    title: "国語 (光村図書 小5)",
    color: "#ff7675",
    characterName: "ヒスイゾロア",
    description: "いたずら好きなクイズマスター。漢字や文章のナゾ 🔍 を解き明かす。",
    imageUrl: "/images/pokemon/hisuian_zorua_v2.png",
    hasSubCategories: true,
    subCategories: [
      { id: "kanji", title: "漢字の読み書き" },
      { id: "text", title: "教科書の文章問題" }
    ],
    questions: [
      { id: "j_k1", term: 1, type: "kanji", question: "「変化」の正しい読み方は？", options: ["へんか", "へんげ", "かわり", "へんが"], correctOptionIndex: 0, explanation: "正解は「へんか」です！「へんげ」と読むと「妖怪変化（ようかいへんげ）」のような特別な「化けること」を意味してしまいます。「化」は「カ」「ケ」「ば（ける）」などの読みがあるので文脈で使い分けましょう。" },
      { id: "j_k2", term: 1, type: "kanji", question: "同音異義語「そうぞう」。正しい使い方はどれ？", options: ["未来の自分の姿を「想像」する", "新しい便利な機械を「想像」する", "素晴らしい芸術作品を「想像」する", "神様が今の世界を「想像」する"], correctOptionIndex: 0, explanation: "頭の中で思いえがくことは「想像」を使います！「新しい機械を作る」など、今までなかったものを生み出すことは「創造（そうぞう）」と書きます。同じ読み方でも意味が全く違うので要注意です！", isAdvanced: true },
      { id: "j_t1", term: 1, type: "text", question: "物語「大造じいさんとガン」。「ガン」とは何のこと？", options: ["大きな鳥のなかま", "じいさんが使う猟銃（りょうじゅう）", "じいさんの飼い犬の名前", "岩（がん）のように硬い石"], correctOptionIndex: 0, explanation: "正解は「大きな鳥のなかま」です！ガン（雁）は秋になると日本に渡ってくる渡り鳥で、V字型になって空を飛ぶのが特徴です。お話の中では「残雪（ざんせつ）」という名前の賢いガンが登場します。" },
      
      { id: "j_k3", term: 2, type: "kanji", question: "「固有種」の正しい読み方は？", options: ["こゆうしゅ", "こんゆうしゅ", "こあしゅ", "かたありしゅ"], correctOptionIndex: 0, explanation: "「こゆうしゅ」と読みます！「固（こ）」は「固定（こてい）」、「有（ゆう）」は「有名（ゆうめい）」などと同じ読み方ですね。その地域にしかいない特別な生き物のことを指します。" },
      { id: "j_k4", term: 2, type: "kanji", question: "「過失」の正しい読み方は？", options: ["かしつ", "すぎしつ", "かやしつ", "かあやまち"], correctOptionIndex: 0, explanation: "「かしつ」と読みます！不注意による失敗や間違いのことです。「過」は「通過（つうか）」「過去（かこ）」などと同じ音読みの「カ」を使います。", isAdvanced: true },
      { id: "j_t2", term: 2, type: "text", question: "物語「雪わたり」の作者は誰？", options: ["宮沢賢治", "新美南吉", "夏目漱石", "金子みすゞ"], correctOptionIndex: 0, explanation: "正解は「宮沢賢治（みやざわけんじ）」です！彼は「やまなし」や「注文の多い料理店」など、自然や動物が登場する不思議で美しいお話をたくさん書きました。キツネの幻燈会（げんとうかい）がとても印象的ですね。" },

      { id: "j_k5", term: 3, type: "kanji", question: "目上の人に使う「敬語（丁寧語）」。「行く」はどうなる？", options: ["行きます", "参るぞ", "行かれる", "行くでござる"], correctOptionIndex: 0, explanation: "「行きます」が丁寧語（ていねいご）です。ちなみに「行かれる」は尊敬語、「参る」は謙譲語と呼ばれる別種類の敬語です。相手によって使い分けられるとカッコいいですね！" },
      { id: "j_t3", term: 3, type: "text", question: "自分の意見を伝える文章を書くとき、一番最初に書くべきなのはどれ？", options: ["自分の主張（意見の結論）", "具体的な理由や証拠", "予想される反対意見", "全体のまとめ"], correctOptionIndex: 0, explanation: "文章を分かりやすく伝えるには「双括型（そうかつがた）」などが便利です。まずは最初に「自分の意見（主張）」をズバッと書き、その後に「理由」を続けると読む人に伝わりやすくなります！" },
      { id: "j_t4", term: 3, type: "text", question: "応用問題。文章の「事実」と「意見」を見わけるとき、自分の気持ちはどちら？", options: ["意見（いけん）", "事実（じじつ）", "推測（すいそく）", "証拠（しょうこ）"], correctOptionIndex: 0, explanation: "「おいしい」「楽しい」などの自分の気持ちや考えは「意見」です。対して、「昨日雨が降った」「気温が20度だった」のような誰が見ても変わらない本当のことが「事実」になります。", isAdvanced: true },

      { id: "j_rev1", term: "review", type: "kanji", question: "【ふりかえり】「大造」の読み方は？", options: ["だいぞう", "たいぞう", "たいつく", "だぞう"], correctOptionIndex: 0, explanation: "「だいぞう」と読みます。「大」は「だい」や「たい」と読みますが、この名前の場合は濁点（だくてん）がつくのがポイントです。" },
      { id: "j_adv1", term: "advanced", type: "text", question: "【オリジナル応用】もしピカチュウを主人公にして宮沢賢治風の物語を書くとしたら、どの言葉使いが一番似合う？", options: ["ピカチュウは、クラムボンのようにカプカプと笑いました。", "令和の時代、最新型の電気ねずみが街を走っています。", "そのポケモンは、まるで精密な機械のように動きました。", "ピカチュウ！10まんボルトだ！いけー！"], correctOptionIndex: 0, explanation: "宮沢賢治は自然の情景や、「カプカプ」「クラムボン」といった独特の『オノマトペ（擬音語・擬態語）』を用いたことで有名です。不思議で幻想的な雰囲気が特徴です。", isAdvanced: true }
    ]
  },
  math: {
    title: "算数 (教育出版 小5)",
    color: "#74b9ff",
    characterName: "アルセウス",
    description: "最強の相棒。威厳を持って計算バトル ⚔️ を挑んでくる。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png",
    questions: [
      { id: "m1_1", term: 1, question: "一辺が 5cm の立方体（サイコロ）の体積（たいせき）は？", options: ["125 立方cm", "25 立方cm", "150 立方cm", "15 立方cm"], correctOptionIndex: 0, explanation: "体積は「たて × よこ × 高さ」で求めます。サイコロはすべて同じ長さなので「5 × 5 × 5 ＝ 125立方cm」になります！ちなみに150は表面積（周りの面積）です。" },
      { id: "m1_2", term: 1, question: "体重6kgのピカチュウが、たくさん食べて重さが「1.5倍」になりました。いま何kg？", options: ["9 kg", "7.5 kg", "12 kg", "4.5 kg"], correctOptionIndex: 0, explanation: "かけ算を使います。「6 × 1.5」を計算しましょう。6×1＝6、6×0.5＝3なので、合わせて「9kg」になりますね！", isAdvanced: true },
      
      { id: "m2_1", term: 2, question: "「4の倍数」になっている数はどれ？", options: ["12", "14", "10", "6"], correctOptionIndex: 0, explanation: "「倍数」とは、その数に整数をかけてできる数のことです。4の段の九九を思い浮かべると「4 × 3 ＝ 12」なので、12が4の倍数になります。" },
      { id: "m2_2", term: 2, question: "分数のたし算。「1/5 ＋ 2/5」の正しい計算結果はどれ？", options: ["3/5", "3/10", "2/10", "2/25"], correctOptionIndex: 0, explanation: "分母（下の数字）が同じ分数のたし算は、「分子（上の数字）」だけをたします。「1 ＋ 2 ＝ 3」なので、分母の5はそのまま残して「3/5」が正解です！分母同士をたして10にしてしまうのはよくある間違いです。", isAdvanced: true },

      { id: "m3_1", term: 3, question: "お店で100円のモンスターボールが「20％引き」で売られています。いくら【安く】なった？", options: ["20円", "80円", "120円", "10円"], correctOptionIndex: 0, explanation: "「20%」は小数に直すと「0.2」です。100円の0.2倍なので「100 × 0.2 ＝ 20円」ですね！ちなみに「買うときの値段（値引き後）」は、80円になります。" },
      { id: "m3_2", term: 3, question: "円のまわりの長さ（円周）を求めるときに使う「円周率」。およそいくつ？", options: ["3.14", "3.00", "3.41", "4.14"], correctOptionIndex: 0, explanation: "円周率はおよそ「3.14」です。昔は3.14159265...と永遠に続く少数を、小学校では「3.14」として計算の公式『直径 × 3.14』に使います！", isAdvanced: true },

      { id: "m_rev1", term: "review", question: "【ふりかえり】2でわり切れない「奇数（きすう）」はどれ？", options: ["21", "24", "18", "10"], correctOptionIndex: 0, explanation: "正解は「21」です！一の位が「1, 3, 5, 7, 9」で終わる数字は、すべて2でわり切れない「奇数」になります。それ以外は「偶数（ぐうすう）」です。" },
      { id: "m_adv1", term: "advanced", question: "【オリジナル応用】サトシが毎日モンスターボールを「2個ずつ」買い集めています。「x日後（エックス にちご）」に増えたボールの数を式で表すと？", options: ["2 × x", "x ＋ 2", "x ÷ 2", "x × x"], correctOptionIndex: 0, explanation: "1日で2個、2日で4個（2×2）…と増えるので、「日数のx」に2をかける「2 × x」が正解です！文字を使った式は中学校の数学でも大活躍します。", isAdvanced: true }
    ]
  },
  science: {
    title: "理科 (大日本図書 小5)",
    color: "#55efc4",
    characterName: "スイクン",
    description: "好奇心旺盛な研究員。自然のふしぎ 🧪 を共に調査する。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png",
    questions: [
      { id: "s1_1", term: 1, question: "種が「発芽（芽を出ること）」するために、【絶対に必要ではない】ものはどれ？", options: ["土（つち）や肥料（ひりょう）", "水", "空気", "適度な温度"], correctOptionIndex: 0, explanation: "実は、タネの中には「発芽」に必要なたっぷりの栄養（デンプン）がすでに用意されています。なので、土や肥料がなくても「水・空気・適度な温度」の3つさえあれば芽は出るんです！" },
      { id: "s1_2", term: 1, question: "メダカのたまごを顕微鏡などで観察すると、たまごの中で【一番最初】にはっきりと目立つようになる部分はどこ？", options: ["黒い２つの目", "泳ぐためのしっぽ", "ヒレの模様", "心臓の動き"], correctOptionIndex: 0, explanation: "たまごの中の変化を観察すると、まず最初に２つの「黒い目」がポツンと目立つようになります。その後、血流や心臓の動きが見えるようになり、だんだんメダカの形になっていきます。", isAdvanced: true },
      
      { id: "s2_1", term: 2, question: "流れる水のはたらきで、川の斜面などの「地面をけずりとる」はたらきを何という？", options: ["しん食（浸食）", "うんぱん（運搬）", "たいせき（堆積）", "カサ増し"], correctOptionIndex: 0, explanation: "川の流れが土や石などをけずりとることを「しん食」といいます！けずられた土を運ぶのが「うんぱん」、川の底に積もるのが「たいせき」です。この３つの働きで川の形は変わっていきます。" },
      { id: "s2_2", term: 2, question: "日本の夏の終わりごろにやってくる「台風」。ふつう、どの方角からどの方角へ向かって進む？", options: ["南から北へ進む", "北から南へ進む", "東から西へ進む", "西から東へ進む"], correctOptionIndex: 0, explanation: "台風は、日本のずっと南にある暖かい海で発生し、風に乗って「南から北（日本の方角）」へ向かって進んでくるのが一般的です。日本の近くに来ると、偏西風に乗って北東に曲がることが多いです。", isAdvanced: true },

      { id: "s3_1", term: 3, question: "自分で作れる磁石「電磁石」のパワーを、【もっと強く】するにはどうすればいい？", options: ["乾電池を直列につなぐ", "乾電池を並列につなぐ", "中に入っている鉄芯をぬく", "コイルの巻き数を減らす"], correctOptionIndex: 0, explanation: "乾電池を「直列（ちょくれつ）」につなぐと、回路に流れる電流が大きくなり、電磁石の磁力（パワー）がぐんと強くなります！「並列」ではパワーは同じまま長持ちするだけです。また、コイルの巻き数を「増やす」ことでもパワーアップします。" },
      { id: "s3_2", term: 3, question: "ふりこが「１往復する時間（右に行って左に戻る時間）」を変えることができる条件はどれ？", options: ["ふりこの糸の長さ", "おもりの重さ", "ふり始める角度（ふりはば）", "おもりの色"], correctOptionIndex: 0, explanation: "これがふりこの不思議なところ！おもりの重さを変えても、大きく揺らしても、時間は「全く変わりません」。１往復する時間を変えられるのは『糸の長さ』だけなんです！（長さを長くすると、１往復の時間は遅くなります）", isAdvanced: true },

      { id: "s_rev1", term: "review", question: "【ふりかえり】一年の中で、昼の時間が一番長くなり、太陽が一番高い位置までのぼる日はどれ？", options: ["夏至（げし）", "冬至（とうじ）", "春分（しゅんぶん）", "秋分（しゅうぶん）"], correctOptionIndex: 0, explanation: "一年で一番昼が長い日を「夏至（げし）」と言います！逆に一番昼が短いのが「冬至（とうじ）」です。春分と秋分は、昼と夜の長さがほぼ同じになる日です。" },
      { id: "s_adv1", term: "advanced", question: "【オリジナル応用】ピカチュウが「10まんボルト」を放ったときの「雷（かみなり）」。雷が鳴るときに「ゴロゴロ！」と大きな音がする【本当の理由】は？", options: ["電気が流れた周りの空気が、激しく熱されて急激に膨らむから", "雲と雲がぶつかって、こすれる音がするから", "電気が地面にぶつかって爆発しているから", "雨つぶが空中で破裂（はれつ）しているから"], correctOptionIndex: 0, explanation: "雷は「超高温の電気の花火」のようなものです！電気が通った道の空気が、一瞬で「太陽の表面より熱く（約3万度）」熱されて大爆発のように膨張し、その空気の衝撃波が「ゴロゴロ」という雷鳴の正体なんです。", isAdvanced: true }
    ]
  },
  society: {
    title: "社会 (東京書籍 小5)",
    color: "#fdcb6e",
    characterName: "ザマゼンタ",
    description: "熱血な探検家。日本のひみつ 🗺️ を探す旅へ連れ出す。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/889.png",
    questions: [
      { id: "so1_1", term: 1, question: "日本の「都道府県（とどうふけん）」は、全部でいくつあるでしょうか？", options: ["47都道府県", "43都道府県", "50都道府県", "54都道府県"], correctOptionIndex: 0, explanation: "「1都（東京都）」「1道（北海道）」「2府（大阪府・京都府）」「43県」をぜんぶ足して、「47都道府県」になります！" },
      { id: "so1_2", term: 1, question: "日本の国土の中で、日本最大の「一番広い平野」はどこ？", options: ["関東平野（かんとうへいや）", "濃尾平野（のうびへいや）", "越後平野（えちごへいや）", "十勝平野（とかちへいや）"], correctOptionIndex: 0, explanation: "東京都や千葉・埼玉などをすっぽり覆う「関東平野」が日本で一番広い平野です！新潟の越後平野はお米作りで有名ですが、広さでは関東平野が圧倒的です。", isAdvanced: true },
      
      { id: "so2_1", term: 2, question: "日本で最も「米づくり」の収穫量（とれる量）が多い県はどこ？", options: ["新潟県（にいがた）", "沖縄県（おきなわ）", "東京都（とうきょう）", "宮崎県（みやざき）"], correctOptionIndex: 0, explanation: "米の生産量が最も多いのは「新潟県」や「北海道」です！雪どけのきれいで冷たい水と、広い平野（越後平野など）がお米作りにとても向いているためです。" },
      { id: "so2_2", term: 2, question: "愛知県の豊田市などを中心に、日本最大の自動車工場が集まっている工業エリアを何と呼ぶ？", options: ["中京工業地帯（ちゅうきょう）", "京浜工業地帯（けいひん）", "阪神工業地帯（はんしん）", "瀬戸内工業地域（せとうち）"], correctOptionIndex: 0, explanation: "愛知県を中心とする「中京工業地帯」です！日本で一番「自動車などを作る機械工業」が盛んな場所で、工業の生産額はずっと日本一を誇っています。", isAdvanced: true },

      { id: "so3_1", term: 3, question: "私たちが買い物をするときにお店で払う「消費税（しょうひぜい）」など、国や市に納めるお金のことをまとめて何という？", options: ["税金（ぜいきん）", "手数料（てすうりょう）", "寄付金（きふきん）", "利子（りし）"], correctOptionIndex: 0, explanation: "このようなお金を「税金」といいます。集められた税金は、警察や消防署、学校の教科書、信号機の整備など、みんなが安全で豊かに暮らすため公共のサービスに使われます。" },
      { id: "so3_2", term: 3, question: "スマートフォンやパソコンが普及し、知りたい情報がインターネットですぐに手に入る現代の世の中のことを何社会という？", options: ["情報化社会（じょうほうかしゃかい）", "工業化社会（こうぎょうかしゃかい）", "農業社会（のうぎょうしゃかい）", "超未来社会（ちょうみらいしゃかい）"], correctOptionIndex: 0, explanation: "情報を素早く手に入れ、世界中とやり取りができる今の社会を「情報化社会」と呼びます。とても便利ですが、ウソの情報にだまされないようにする力（情報モラル）も必要です。", isAdvanced: true },

      { id: "so_rev1", term: "review", question: "【ふりかえり】日本の南の海から太平洋側をあがってくる、「暖かくて黒っぽい色」をした海流（海の川）の名前は？", options: ["日本海流（黒潮・くろしお）", "千島海流（親潮・おやしお）", "リマン海流", "対馬海流（つしまかいりゅう）"], correctOptionIndex: 0, explanation: "南から北上してくる暖かい海流を「日本海流（別名：黒潮）」といいます。逆に、北からやってくる冷たい海流は「千島海流（別名：親潮）」と呼ばれ、この２つがぶつかる場所（潮目）では魚がよく獲れます！" },
      { id: "so_adv1", term: "advanced", question: "【オリジナル応用】もしポケモンの世界のように、貴重な自然や動物を開発（工事など）から守る場所を作るとしたら、日本のどんな法律が関わってくる？", options: ["自然環境保全法（しぜんかんきょうほぜんほう）", "道路交通法（どうろこうつうほう）", "教育基本法（きょういくきほんほう）", "消費者契約法（しょうひしゃけいやくほう）"], correctOptionIndex: 0, explanation: "「自然環境保全法」や「国立公園法」など、日本の美しい自然やそこに住む生き物を人間の工事などから守るための法律が実際に日本に存在します。道路のルールは道路交通法ですね！", isAdvanced: true }
    ]
  },
  english: {
    title: "外国語 (光村図書 小5)",
    color: "#a29bfe",
    characterName: "イーブイ",
    description: "元気な通訳。世界中のポケモンと友達 🤝 になるための英語を教える。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
    questions: [
      { id: "e1_1", term: 1, question: "相手にむかって「あなたは何が好きですか？」と英語で聞きたい時、正しい表現はどれ？", options: ["What do you like?", "Who are you?", "Where do you go?", "How are you?"], correctOptionIndex: 0, explanation: "「What 〜 ?」は「何？」、「do you like」は「あなたは好きですか？」という意味なので、組み合わせると「あなたは何が好きですか？」になります！" },
      { id: "e1_2", term: 1, question: "アルファベットの大文字「P」の小文字はどれ？", options: ["p", "q", "d", "b"], correctOptionIndex: 0, explanation: "大文字「P」の小文字は「p」です！「b」「d」「p」「q」の４つは形がすごく似ていて間違いやすいので、気をつけましょう！", isAdvanced: true },
      
      { id: "e2_1", term: 2, question: "「私はリンゴが好きです」と自分のことを英語で伝える時、正しいのはどれ？", options: ["I like apples.", "I have apples.", "You like apples.", "She likes apples."], correctOptionIndex: 0, explanation: "自分のことを話すときは「I（私）」を使います。そして好きなことを伝える「like」を続けて、「I like 〜」の形を作りましょう！「I have」だと「私は持っている」になってしまいます。" },
      { id: "e2_2", term: 2, question: "「何のスポーツが好きですか？」と、スポーツの種類を聞きたいときはどう言う？", options: ["What sport do you like?", "What color do you like?", "Where do you live?", "When is your birthday?"], correctOptionIndex: 0, explanation: "スポーツの種類を聞きたいので「What sport（何のスポーツ）」から始めます。「What color」だと「何色が好き？」という全く違う質問になってしまいますね！", isAdvanced: true },

      { id: "e3_1", term: 3, question: "いつも寝ているカビゴンに「あなたは何時に起きますか？」と尋ねたい。一番正しいのは？", options: ["What time do you get up?", "What time is it?", "How old are you?", "What do you do?"], correctOptionIndex: 0, explanation: "時刻を聞く時は「What time（何時）」を使います。さらに「get up（起きる）」を合わせて、「What time do you get up?」となるのが正解です。「What time is it?」だと「今何時ですか？」になります。" },
      { id: "e3_2", term: 3, question: "自分の特技として「私は速く走ることができます！」と伝えるときはどれ？", options: ["I can run fast.", "I like running.", "Can you run?", "I want to run."], correctOptionIndex: 0, explanation: "「〜することができる」と能力を伝える時は魔法の言葉「can（キャン）」を使います！「I can 〜」で「私は〜できる」という意味になります。", isAdvanced: true },

      { id: "e_rev1", term: "review", question: "【ふりかえり】人と会った時の基本のあいさつ。「こんにちは」と英語で言うと？", options: ["Hello.", "Goodbye.", "Thank you.", "Sorry."], correctOptionIndex: 0, explanation: "あいさつの基本中の基本は「Hello（こんにちは）」です！別れる時の「Goodbye」、お礼の「Thank you」も合わせて覚えておきましょう！" },
      { id: "e_adv1", term: "advanced", question: "【オリジナル応用】ピカチュウが「Pika!」と嬉しそうにしています。「彼はハッピーだ（幸せだ）」と英語で言うと？", options: ["He is happy.", "She is happy.", "I am happy.", "You are happy."], correctOptionIndex: 0, explanation: "男の子やオスの動物（彼）のことを話すときは「He（ヒー）」を使います。女の子やメスの場合は「She（シー）」、自分の場合は「I（アイ）」を使います！主語によって使い分けましょう！", isAdvanced: true }
    ]
  }
};

// ベースのデータに対してNotebookデータをマージする
export const quizData = { ...baseQuizData };

const mergeSubject = (baseKey, notebookKey) => {
  if (notebookQuizData[notebookKey] && notebookQuizData[notebookKey].questions) {
    const newQs = notebookQuizData[notebookKey].questions.map((q, i) => {
      // 既存の国語のサブカテゴリに対応させるためのダミー処理
      let type = baseKey === 'japanese' ? (i % 2 === 0 ? 'kanji' : 'text') : undefined;
      // notebooksの問題にterm（学期）がない場合、自動的に1〜3学期へ均等に分散させる
      let term = q.term || ((i % 3) + 1);
      return { ...q, type, term };
    });
    quizData[baseKey].questions = [
      ...quizData[baseKey].questions,
      ...newQs
    ];
  }
};

mergeSubject('japanese', 'notebook_japanese');
mergeSubject('math', 'notebook_math');
mergeSubject('science', 'notebook_science');
mergeSubject('society', 'notebook_society');
mergeSubject('english', 'notebook_english');

// 掛け算暗算ジム（独立した科目として追加）
if (anzanQuizData.anzan_math && anzanQuizData.anzan_math.questions) {
  quizData.anzan = {
    title: "掛け算暗算ジム",
    color: "#fd79a8",
    characterName: "メタモン",
    description: "変身の達人！a×b×c の3つのかけ算 🔥 を頭の中でマスターしよう。",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
    hasSubCategories: false,
    questions: [...anzanQuizData.anzan_math.questions],
  };
}

// 計算ドリル（自動生成問題・タイムアタック）
quizData.calcDrill = {
  title: "計算ドリル",
  color: "#6c5ce7",
  characterName: "フーディン",
  description: "自動生成の計算問題 ⚡ 問題タイムを計測してスピードを磨こう！",
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png",
  hasSubCategories: false,
  isCalcDrill: true, // App.jsx で特別ルーティングに使うフラグ
  questions: [],     // 動的生成なので空
};


