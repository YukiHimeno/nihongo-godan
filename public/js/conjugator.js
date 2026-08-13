/* 日语五段动词活用内核 */
(function (global) {
  'use strict';

  const GODAN = {
    'う': { i: 'い', a: 'わ', e: 'え', o: 'お', te: 'って', ta: 'った' },
    'く': { i: 'き', a: 'か', e: 'け', o: 'こ', te: 'いて', ta: 'いた' },
    'ぐ': { i: 'ぎ', a: 'が', e: 'げ', o: 'ご', te: 'いで', ta: 'いだ' },
    'す': { i: 'し', a: 'さ', e: 'せ', o: 'そ', te: 'して', ta: 'した' },
    'つ': { i: 'ち', a: 'た', e: 'て', o: 'と', te: 'って', ta: 'った' },
    'ぬ': { i: 'に', a: 'な', e: 'ね', o: 'の', te: 'んで', ta: 'んだ' },
    'ぶ': { i: 'び', a: 'ば', e: 'べ', o: 'ぼ', te: 'んで', ta: 'んだ' },
    'む': { i: 'み', a: 'ま', e: 'め', o: 'も', te: 'んで', ta: 'んだ' },
    'る': { i: 'り', a: 'ら', e: 'れ', o: 'ろ', te: 'って', ta: 'った' },
  };

  const ICHIDAN_EX = ['帰る', '切る', '走る', '入る', '要る', '知る', '滑る', '減る', '焦る'];
  const I_ROW = 'いきしちにひみりぎじぢびぴ';
  const E_ROW = 'えけせてねへめれげぜでべぺ';

  const READINGS = {
    '見る': 'みる', '食べる': 'たべる', '起きる': 'おきる', '帰る': 'かえる', '切る': 'きる', '走る': 'はしる',
    '入る': 'はいる', '要る': 'いる', '知る': 'しる', '滑る': 'すべる', '減る': 'へる', '焦る': 'あせる',
    '書く': 'かく', '読む': 'よむ', '話す': 'はなす', '泳ぐ': 'およぐ', '買う': 'かう', '待つ': 'まつ',
    '死ぬ': 'しぬ', '遊ぶ': 'あそぶ', '飲む': 'のむ', '作る': 'つくる', '売る': 'うる', '歌う': 'うたう',
    '行く': 'いく', '来る': 'くる', '聞く': 'きく', '働く': 'はたらく', '歩く': 'あるく', '会う': 'あう',
    '洗う': 'あらう', '言う': 'いう', '立つ': 'たつ', '飛ぶ': 'とぶ', '呼ぶ': 'よぶ', '住む': 'すむ',
    '進む': 'すすむ', '終わる': 'おわる', '座る': 'すわる', '分かる': 'わかる', '取る': 'とる', '送る': 'おくる',
    '寝る': 'ねる', '教える': 'おしえる', '開ける': 'あける', '閉める': 'しめる', '借りる': 'かりる',
  };

  const VERBS_GODAN = ['書く', '読む', '話す', '泳ぐ', '買う', '待つ', '死ぬ', '遊ぶ', '飲む', '帰る', '作る', '売る', '歌う', '行く', '聞く', '働く', '歩く', '会う', '言う', '立つ', '飛ぶ', '呼ぶ', '住む', '進む', '終わる', '座る', '分かる', '取る', '送る', '洗う'];
  const VERBS_ICHIDAN = ['食べる', '見る', '起きる', '寝る', '教える', '開ける', '閉める', '借りる'];
  const VERBS_ALL = VERBS_GODAN.concat(VERBS_ICHIDAN, ['する', '来る']);
  const FORMS = ['ます形', 'ない形', 'て形', 'た形', 'ば形', '可能形', '命令形', '意志形'];

  function readingOf(w) { return READINGS[w] || w; }

  function classifyVerb(w) {
    if (w === 'する') return 'sahen';
    if (w === '来る') return 'kahen';
    const rd = readingOf(w);
    const last = rd.slice(-1), prev = rd.slice(-2, -1);
    if (last === 'る' && !ICHIDAN_EX.includes(w) && (I_ROW.includes(prev) || E_ROW.includes(prev))) return 'ichidan';
    return GODAN[last] ? 'godan' : null;
  }

  function getFormValue(w, form) {
    const cls = classifyVerb(w);
    if (!cls) return null;
    let rows;
    if (cls === 'godan') {
      const r = GODAN[readingOf(w).slice(-1)];
      const s = w.slice(0, -1);
      const te = w === '行く' ? '行って' : s + r.te;
      const ta = w === '行く' ? '行った' : s + r.ta;
      rows = { 'ます形': s + r.i + 'ます', 'ない形': s + r.a + 'ない', 'て形': te, 'た形': ta, 'ば形': s + r.e + 'ば', '可能形': s + r.e + 'る', '命令形': s + r.e, '意志形': s + r.o + 'う' };
    } else if (cls === 'ichidan') {
      const s = w.slice(0, -1);
      rows = { 'ます形': s + 'ます', 'ない形': s + 'ない', 'て形': s + 'て', 'た形': s + 'た', 'ば形': s + 'れば', '可能形': s + 'られる', '命令形': s + 'ろ', '意志形': s + 'よう' };
    } else if (cls === 'sahen') {
      rows = { 'ます形': 'します', 'ない形': 'しない', 'て形': 'して', 'た形': 'した', 'ば形': 'すれば', '可能形': 'できる', '命令形': 'しろ', '意志形': 'しよう' };
    } else {
      rows = { 'ます形': '来ます', 'ない形': '来ない', 'て形': '来て', 'た形': '来た', 'ば形': '来れば', '可能形': '来られる', '命令形': '来い', '意志形': '来よう' };
    }
    return rows[form];
  }

  global.Conjugator = {
    GODAN,
    READINGS,
    VERBS_GODAN,
    VERBS_ICHIDAN,
    VERBS_ALL,
    FORMS,
    readingOf,
    classifyVerb,
    getFormValue,
  };
})(window);
