/* 课程内容与台词 */
(function (global) {
  'use strict';

  // 章节引导台词：ch -> [台词, 表情]
  const GUIDE_LINES = {
    ch0: ['欢迎。这里教你五段动词，从最基础的开始，一步步来。', 'smile'],
    ch1: ['先记住一件事：日语动词放在句子最后。', 'talk'],
    ch2: ['五段动词的词尾，只有这九个假名，先混个脸熟。', 'smile'],
    ch3: ['叫五段，是因为词尾会在这五段之间换位置。', 'wonder'],
    ch4: ['第一个变形是ます形，把词尾挪到い段，再加ます。', 'talk'],
    ch5: ['多练几道，熟练了就顺了。', 'smile'],
    ch6: ['第二个是ない形，表示否定，词尾退到あ段。', 'talk'],
    ch7: ['注意，词尾是う的时候，要变成わ。', 'wonder'],
    ch8: ['接下来是て形，这块要分四组记，别急。', 'think'],
    ch9: ['第一组最简单，す变成して。', 'talk'],
    ch10: ['第二组，う、つ、る都变成促音って。', 'talk'],
    ch11: ['第三组，ぬ、ぶ、む都变成んで。行く是特例。', 'wonder'],
    ch12: ['现在四组混在一起，看看你还记得多少。', 'think'],
    ch13: ['た形就是て形换个尾巴，て变た，で变だ。', 'smile'],
    ch14: ['剩下的几个活用形，都从え段和お段变。', 'talk'],
    ch15: ['顺带提一段动词，规则简单，但有几个要小心。', 'wonder'],
    ch16: ['把学过的活用形放回句子里，看看它们怎么用。', 'talk'],
    ch17: ['到这，五段动词的活用就全过了一遍。', 'smile'],
  };

  const GUIDE_OK = ['对了。', '没错。', '答得漂亮。', '可以，记牢了。', '对，就这样。'];
  const GUIDE_NO = ['不对，再想想。', '差一点，回去看眼规则。', '别急，这一步确实容易错。', '没事，错题已经记下来了。', '再试一次，慢慢来。'];

  const CH_NAMES = {
    ch0: '第 0 关', ch1: '第 1 关', ch2: '第 2 关', ch3: '第 3 关', ch4: '第 4 关', ch5: '第 5 关',
    ch6: '第 6 关', ch7: '第 7 关', ch8: '第 8 关', ch9: '第 9 关', ch10: '第 10 关', ch11: '第 11 关',
    ch12: '第 12 关', ch13: '第 13 关', ch14: '第 14 关', ch15: '第 15 关', ch16: '第 16 关', ch17: '第 17 关',
  };

  function buildCells() {
    const cells = [];
    let n = 0;
    const md = (html, ch) => cells.push({ type: 'md', html, ch });
    const ex = (cfg) => cells.push({ type: 'ex', cfg });

    md(`
      <h2>第 0 关 · 先看语序</h2>
      <p>学动词之前，先确认一件事：你会读<b>平假名</b>就够了，不要求会别的。</p>
      <div class="note">日语句子的顺序是 <b>主语 + 宾语 + 动词</b>，动词在最后。<br>
      中文说「我写字」，日语说「<span class="ja">私が字を書く</span>」，也就是「我，字，写」。</div>
      <p>先习惯这个顺序，后面每句都这样。</p>
    `, 'ch0');

    ex({
      title: '关卡 0-1',
      qtype: 'qa',
      qlist: [
        { q: '下面哪个句子符合「主语 + 宾语 + 动词」？', options: ['本を読む私は。', '私は本を読む。', '読む私は本を。'], answer: 1, explain: '私は（主语）本を（宾语）読む（动词），动词在最后。' },
        { q: '日语「私が水を飲む」的正确语序理解是？', options: ['我喝水', '水喝我', '喝我水'], answer: 0, explain: '主语私、宾语水、动词喝：我喝水。' },
      ],
    });

    md(`
      <h2>第 1 关 · 认识动词</h2>
      <p>日语动词按变化方式分三类，我们这课只学数量最多的<b>五段动词</b>。</p>
      <table>
        <tr><th>类型</th><th>特征</th><th>例子</th></tr>
        <tr><td>五段动词</td><td>词尾在<b>う段</b></td><td class="ja">書く・読む・話す</td></tr>
        <tr><td>一段动词</td><td>以「る」结尾，る前是い/え段</td><td class="ja">食べる・見る</td></tr>
        <tr><td>サ变/カ变</td><td>就两个</td><td class="ja">する・来る</td></tr>
      </table>
    `, 'ch1');

    md(`
      <h2>第 2 关 · 词尾在う段</h2>
      <p>五段动词的词尾，只会是这九个假名：</p>
      <p class="ja"><span class="kana">う・く・ぐ・す・つ・ぬ・ぶ・む・る</span></p>
      <p>先混个脸熟，后面讲活用全看它。</p>
    `, 'ch2');

    ex({
      title: '关卡 2-1',
      q: '哪个动词的词尾在う段？',
      qtype: 'qa',
      options: ['食べる（る）', '書く（く）', 'する（サ变）'],
      answer: 1,
      explain: 'く 在う段。食べる 的る前是え段，是一段动词。',
    });

    md(`
      <h2>第 3 关 · 为什么叫「五段」</h2>
      <p>因为词尾会在 <b>あ・い・う・え・お</b> 这五段之间换位置。</p>
      <p>拿 <span class="ja">書く（かく）</span> 举例，词尾「く」变化时会这样走：</p>
      <table>
        <tr><th>段</th><th>あ</th><th>い</th><th>う</th><th>え</th><th>お</th></tr>
        <tr><td>書く的词尾</td><td>書<u>か</u></td><td>書<u>き</u></td><td>書<u>く</u></td><td>書<u>け</u></td><td>書<u>こ</u></td></tr>
      </table>
      <p>整个系列是 <span class="ja">かきくけこ</span>，记住这个顺序，后面就是套位置。</p>
    `, 'ch3');

    ex({
      title: '关卡 3-1',
      q: '「読む」的词尾「む」，它在い段的对应是？',
      qtype: 'qa',
      options: ['ま（あ段）', 'み（い段）', 'め（え段）'],
      answer: 1,
      explain: 'む 的系列是 まみむめも，い段是 み。所以 読みます。',
    });

    md(`
      <h2>第 4 关 · 第一个活用：ます形</h2>
      <p><b>规则：词尾从 う段 → い段，再加「ます」。</b></p>
      <table>
        <tr><th>动词</th><th>い段</th><th>ます形</th></tr>
        <tr><td class="ja">書く</td><td>き</td><td class="ja">書きます</td></tr>
        <tr><td class="ja">読む</td><td>み</td><td class="ja">読みます</td></tr>
        <tr><td class="ja">話す</td><td>し</td><td class="ja">話します</td></tr>
      </table>
      <p>ます形是礼貌体，对老师、对同事、对陌生人，都用它。</p>
    `, 'ch4');

    ex({
      title: '关卡 4-1',
      qtype: 'qa',
      qlist: [
        { q: '<span class="ja">買う（かう）</span> 的ます形是？', options: ['買います', '買あます', '買いのます'], answer: 0, explain: 'う 的い段是 い：買う → 買います。' },
        { q: '<span class="ja">泳ぐ（およぐ）</span> 的ます形是？', options: ['泳ぎます', '泳がます', '泳ぐます'], answer: 0, explain: 'ぐ → い段 ぎ：泳ぐ → 泳ぎます。' },
        { q: '<span class="ja">待つ（まつ）</span> 的ます形是？', options: ['待ちます', '待たます', '待つます'], answer: 0, explain: 'つ → い段 ち：待つ → 待ちます。' },
      ],
    });

    md(`
      <h2>第 5 关 · 练几道</h2>
      <p>刚讲完规则，趁热做几题。</p>
    `, 'ch5');

    ex({
      title: '关卡 5-1',
      qtype: 'fill',
      verbs: ['書く', '話す', '泳ぐ', '買う', '待つ', '飲む'],
      forms: ['ます形'],
      hint: '词尾到い段，再加ます',
    });

    md(`
      <h2>第 6 关 · 第二个活用：ない形</h2>
      <p><b>规则：词尾从 う段 → あ段，再加「ない」。</b>表示「不……」，也就是拒绝。</p>
      <table>
        <tr><th>动词</th><th>あ段</th><th>ない形</th></tr>
        <tr><td class="ja">書く</td><td>か</td><td class="ja">書かない</td></tr>
        <tr><td class="ja">読む</td><td>ま</td><td class="ja">読まない</td></tr>
        <tr><td class="ja">話す</td><td>さ</td><td class="ja">話さない</td></tr>
      </table>
    `, 'ch6');

    ex({
      title: '关卡 6-1',
      q: '<span class="ja">話す（はなす）</span> 的ない形是？',
      qtype: 'qa',
      options: ['話さない', '話しない', '話わない'],
      answer: 0,
      explain: 'す → あ段是 さ：話す → 話さない。',
    });

    md(`
      <h2>第 7 关 · 一个特例：う → わ</h2>
      <div class="note warn">词尾是「う」的时候，ない形不变成「あ」，而要变成<b>「わ」</b>。<br>
      <span class="ja">買う → 買わない</span>，不是「買あない」。</div>
      <p>这是五段动词第一个容易踩的坑，单独记一下。</p>
    `, 'ch7');

    ex({
      title: '关卡 7-1',
      qtype: 'qa',
      qlist: [
        { q: '<span class="ja">買う（かう）</span> 的ない形是？', options: ['買わない', '買あない', '買うない'], answer: 0, explain: 'う 段特例：变わ。買う → 買わない。' },
        { q: '<span class="ja">言う（いう）</span> 的ない形是？', options: ['言わない', '言あない', '言いない'], answer: 0, explain: 'う → わ：言う → 言わない。' },
      ],
    });

    md(`
      <h2>第 8 关 · 第三个活用：て形（一）</h2>
      <p>て形用来连接句子、表示「正在…」「请…」，很常用。但它有音便，也就是<b>不规则</b>。</p>
      <p>没关系，分四组记。先看<b>く 和 ぐ</b>：</p>
      <table>
        <tr><th>词尾</th><th>て形</th><th>例子</th></tr>
        <tr><td class="kana">く</td><td>いて</td><td class="ja">書く → 書いて</td></tr>
        <tr><td class="kana">ぐ</td><td>いで</td><td class="ja">泳ぐ → 泳いで</td></tr>
      </table>
    `, 'ch8');

    ex({
      title: '关卡 8-1',
      qtype: 'qa',
      qlist: [
        { q: '<span class="ja">書く（かく）</span> 的て形是？', options: ['書いて', '書って', '書んで'], answer: 0, explain: 'く → いて：書く → 書いて。' },
        { q: '<span class="ja">泳ぐ（およぐ）</span> 的て形是？', options: ['泳いで', '泳って', '泳いて'], answer: 0, explain: 'ぐ → いで：泳ぐ → 泳いで。' },
      ],
    });

    md(`
      <h2>第 9 关 · て形（二）：す</h2>
      <p><b>す → して</b>，这一组最简单。</p>
      <table><tr><th>词尾</th><th>て形</th><th>例子</th></tr>
      <tr><td class="kana">す</td><td>して</td><td class="ja">話す → 話して</td></tr></table>
    `, 'ch9');

    ex({
      title: '关卡 9-1',
      q: '<span class="ja">話す（はなす）</span> 的て形是？',
      qtype: 'qa',
      options: ['話して', '話いて', '話って'],
      answer: 0,
      explain: 'す → して：話す → 話して。',
    });

    md(`
      <h2>第 10 关 · て形（三）：う・つ・る</h2>
      <p><b>う・つ・る 都变成促音「って」。</b></p>
      <table>
        <tr><th>词尾</th><th>て形</th><th>例子</th></tr>
        <tr><td class="kana">う</td><td>って</td><td class="ja">買う → 買って</td></tr>
        <tr><td class="kana">つ</td><td>って</td><td class="ja">待つ → 待って</td></tr>
        <tr><td class="kana">る</td><td>って</td><td class="ja">帰る → 帰って</td></tr>
      </table>
    `, 'ch10');

    ex({
      title: '关卡 10-1',
      q: '<span class="ja">待つ（まつ）</span> 的て形是？',
      qtype: 'qa',
      options: ['待って', '待ちて', '待いて'],
      answer: 0,
      explain: 'つ → って：待つ → 待って。',
    });

    md(`
      <h2>第 11 关 · て形（四）：ぬ・ぶ・む</h2>
      <p><b>ぬ・ぶ・む 都变成「んで」。</b></p>
      <table>
        <tr><th>词尾</th><th>て形</th><th>例子</th></tr>
        <tr><td class="kana">む</td><td>んで</td><td class="ja">読む → 読んで</td></tr>
        <tr><td class="kana">ぶ</td><td>んで</td><td class="ja">遊ぶ → 遊んで</td></tr>
        <tr><td class="kana">ぬ</td><td>んで</td><td class="ja">死ぬ → 死んで</td></tr>
      </table>
      <div class="note warn">还有一个特例：<span class="ja">行く → 行って</span>，不是「行いて」。</div>
    `, 'ch11');

    ex({
      title: '关卡 11-1',
      q: '<span class="ja">行く（いく）</span> 的て形是？',
      qtype: 'qa',
      options: ['行って', '行いて', '行んで'],
      answer: 0,
      explain: '行く 是特例：→ 行って。',
    });

    md(`
      <h2>第 12 关 · 四组混练</h2>
      <p>四组都学完了，随机来一轮，看记得牢不牢。</p>
    `, 'ch12');

    ex({
      title: '关卡 12-1',
      qtype: 'fill',
      verbs: ['書く', '泳ぐ', '話す', '買う', '待つ', '帰る', '読む', '遊ぶ', '飲む', '行く'],
      forms: ['て形'],
      hint: 'く→いて / ぐ→いで / す→して / うつる→って / ぬぶむ→んで；行く→行って',
    });
    ex({
      title: '关卡 12-2',
      qtype: 'fill',
      verbs: ['書く', '話す', '買う', '待つ', '飲む', '行く'],
      forms: ['た形'],
      hint: 'て→た、で→だ',
    });

    md(`
      <h2>第 13 关 · 第四个活用：た形</h2>
      <p>た形表示过去，规则和て形一样，只是 <b>て→た、で→だ</b>。</p>
      <table>
        <tr><th>动词</th><th>て形</th><th>た形</th></tr>
        <tr><td class="ja">書く</td><td>書いて</td><td class="ja">書いた</td></tr>
        <tr><td class="ja">読む</td><td>読んで</td><td class="ja">読んだ</td></tr>
        <tr><td class="ja">話す</td><td>話して</td><td class="ja">話した</td></tr>
      </table>
      <p>会了て形，た形基本是白送的。</p>
    `, 'ch13');

    ex({
      title: '关卡 13-1',
      q: '<span class="ja">買う（かう）</span> 的た形是？',
      qtype: 'qa',
      options: ['買った', '買いた', '買わった'],
      answer: 0,
      explain: 'う → 促音 った：買う → 買った。',
    });

    md(`
      <h2>第 14 关 · 剩下的活用：え段 / お段</h2>
      <p>这几个活用形，规律很整齐，都用<b>え段</b>和<b>お段</b>：</p>
      <table>
        <tr><th>活用形</th><th>变化</th><th>書く</th><th>用途</th></tr>
        <tr><td>ば形</td><td>え段 + ば</td><td class="ja">書けば</td><td>「如果…」</td></tr>
        <tr><td>可能形</td><td>え段 + る</td><td class="ja">書ける</td><td>「能…」</td></tr>
        <tr><td>命令形</td><td>え段</td><td class="ja">書け</td><td>「写！」</td></tr>
        <tr><td>意志形</td><td>お段 + う</td><td class="ja">書こう</td><td>「一起写吧！」</td></tr>
      </table>
    `, 'ch14');

    ex({
      title: '关卡 14-1',
      q: '<span class="ja">読む（よむ）</span> 的可能形是？',
      qtype: 'qa',
      options: ['読める', '読まれる', '読むれる'],
      answer: 0,
      explain: 'え段 + る：読む → 読める（能读）。',
    });
    ex({
      title: '关卡 14-2',
      q: '<span class="ja">飲む（のむ）</span> 的意志形是？',
      qtype: 'qa',
      options: ['飲もう', '飲みよう', '飲めう'],
      answer: 0,
      explain: 'お段 + う：飲む → 飲もう。',
    });

    md(`
      <h2>第 15 关 · 顺带提一段动词</h2>
      <p>一段动词（る动词）简单很多：<b>直接去掉「る」，再加尾巴</b>，没有音便。</p>
      <table>
        <tr><th>动词</th><th>ます形</th><th>て形</th></tr>
        <tr><td class="ja">食べる</td><td>食べます</td><td class="ja">食べて</td></tr>
        <tr><td class="ja">見る</td><td>見ます</td><td class="ja">見て</td></tr>
      </table>
      <div class="note warn">注意，<b>帰る・切る・走る</b> 看着像一段，其实是五段动词。<br>
      判断方法：る 前面是い/え段，多半是一段；る 前面是あ/う/お段，一定是五段。<br>
      <span class="ja">帰る</span> 的 か 是あ段，所以是五段，て形是 <b>帰って</b>。</div>
    `, 'ch15');

    ex({
      title: '关卡 15-1',
      q: '下面哪个是「一段动词」？',
      qtype: 'qa',
      options: ['食べる（る前：べ え段）', '帰る（る前：か あ段）', '切る（五段）'],
      answer: 0,
      explain: '食べる 的 べ 是え段，是一段。帰る・切る 是五段。',
    });
    ex({
      title: '关卡 15-2',
      qtype: 'fill',
      verbs: ['食べる', '見る', '寝る', '教える', '起きる'],
      forms: ['て形', 'ます形'],
      hint: '一段动词：直接去る + 尾巴',
    });

    md(`
      <h2>第 16 关 · 放进句子里</h2>
      <p>把学过的活用形放回句子里，看看实际怎么用：</p>
      <table>
        <tr><th>句子</th><th>活用</th><th>意思</th></tr>
        <tr><td class="ja">私は本を書きます。</td><td>ます形</td><td>我写书。</td></tr>
        <tr><td class="ja">昨日、新聞を読みました。</td><td>ました</td><td>昨天读了报纸。</td></tr>
        <tr><td class="ja">日本語を話しています。</td><td>て形+いる</td><td>正在说日语。</td></tr>
        <tr><td class="ja">お茶を飲んでください。</td><td>て形</td><td>请喝茶。</td></tr>
        <tr><td class="ja">日本語が読めます。</td><td>可能形</td><td>会读日语。</td></tr>
      </table>
      <p>注意看，每个句子的动词都站在最后。</p>
    `, 'ch16');

    ex({
      title: '关卡 16-1',
      q: '「お茶を飲んでください」是什么意思？',
      qtype: 'qa',
      options: ['请喝茶。', '我在喝茶。', '我喝了茶。'],
      answer: 0,
      explain: 'て形 + ください = 请做某事：飲んでください = 请喝。',
    });
    ex({
      title: '关卡 16-2',
      qtype: 'fill',
      verbs: global.Conjugator.VERBS_GODAN.slice(0, 16),
      forms: ['ます形', 'て形', 'た形', 'ない形'],
      hint: '把前面几关的规则都用上',
    });

    md(`
      <h2>第 17 关 · 小结</h2>
      <ol>
        <li>五段动词词尾在 <b>う段</b>，沿 あいうえお 换位。</li>
        <li><b>ます形</b>：う→い + ます；<b>ない形</b>：う→あ + ない（う→わ）。</li>
        <li><b>て/た形</b>音便：く→いて、ぐ→いで、す→して、うつる→って、ぬぶむ→んで；行く→行って。</li>
        <li><b>ば/可能/命令</b>用え段，<b>意志形</b>用お段。</li>
        <li>帰る・切る・走る 是五段，别认错。</li>
      </ol>
      <div class="note">到这，五段动词的活用就学完了。之后见到动词，能直接变形的程度就够用了。</div>
    `, 'ch17');

    cells.push({ type: 'mis' });
    return cells;
  }

  global.Lessons = {
    GUIDE_LINES,
    GUIDE_OK,
    GUIDE_NO,
    CH_NAMES,
    buildCells,
  };
})(window);
