/* 应用主逻辑：渲染、练习、对话、错题、进度 */
(function () {
  'use strict';

  const C = window.Conjugator;
  const L = window.Lessons;

  /* ---------- 状态 ---------- */
  let stat = loadStat();
  let cellCounter = 1;
  const notebookCells = L.buildCells().map((c) => Object.assign({}, c, { id: 'cell-' + (cellCounter++) }));

  /* ---------- DOM 引用 ---------- */
  const nbEl = document.getElementById('nb');
  const dlText = document.getElementById('dl-text');
  const dlName = document.getElementById('dl-name');
  const dlBox = document.getElementById('dialogue');
  const expToast = document.getElementById('exp-toast');
  const l2dFallback = document.getElementById('l2d-fallback');
  const hdCh = document.getElementById('hd-ch');
  const hdScore = document.getElementById('hd-score');
  const hdPct = document.getElementById('hd-pct');
  const hdMis = document.getElementById('hd-mis');

  /* ---------- 持久化 ---------- */
  function loadStat() {
    try {
      const s = JSON.parse(localStorage.getItem('godan_stat') || '{"c":0,"t":0}');
      if (typeof s.c === 'number' && typeof s.t === 'number') return s;
    } catch (e) {}
    return { c: 0, t: 0 };
  }
  function saveStat() { try { localStorage.setItem('godan_stat', JSON.stringify(stat)); } catch (e) {} }
  function loadMis() {
    try { const a = JSON.parse(localStorage.getItem('godan_mis') || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function saveMis(a) { try { localStorage.setItem('godan_mis', JSON.stringify(a)); } catch (e) {} }
  const misRefreshCallbacks = [];
  function addMis(v, f) {
    const a = loadMis();
    if (!a.some(m => m.v === v && m.f === f)) a.push({ v, f });
    saveMis(a);
    misRefreshCallbacks.forEach(fn => fn());
  }
  function rmMis(v, f) { saveMis(loadMis().filter(m => !(m.v === v && m.f === f))); misRefreshCallbacks.forEach(fn => fn()); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------- 对话（立绘台词） ---------- */
  let typeTimer = null;
  let queue = [];
  function say(text, expr, skipQueue) {
    if (!skipQueue && queue.length) { queue.push({ text, expr }); return; }
    renderSay(text, expr);
  }
  function renderSay(text, expr) {
    dlName.textContent = '橘雪莉';
    if (window.Sherry && window.Sherry.expr) window.Sherry.expr(expr || 'talk');
    clearTimeout(typeTimer);
    dlText.classList.add('typing');
    let i = 0;
    (function type() {
      if (i <= text.length) {
        dlText.textContent = text.slice(0, i++);
        typeTimer = setTimeout(type, 15);
      } else {
        dlText.classList.remove('typing');
        if (queue.length) { const n = queue.shift(); renderSay(n.text, n.expr); }
      }
    })();
  }
  function guideForChapter(ch) {
    const g = L.GUIDE_LINES[ch];
    if (g) say(g[0], g[1]);
  }

  function gainExp() {
    expToast.classList.remove('show');
    void expToast.offsetWidth;
    expToast.classList.add('show');
  }

  /* ---------- 顶栏进度 ---------- */
  function refreshHeader() {
    const pct = stat.t ? Math.round(stat.c / stat.t * 100) : 0;
    hdScore.textContent = '答题 ' + stat.c + ' / ' + stat.t;
    hdPct.textContent = pct + '%';
    hdMis.textContent = '错题 ' + loadMis().length;
  }

  /* ---------- 单元格渲染 ---------- */
  function renderCell(cell) {
    const div = document.createElement('div');
    div.className = 'cell ' + (cell.type === 'md' ? 'md-cell' : '');
    div.id = cell.id;
    if (cell.type === 'md') div.innerHTML = cell.html;
    else if (cell.type === 'ex') renderExercise(div, cell);
    else if (cell.type === 'mis') renderMis(div);
    return div;
  }

  function renderNotebook() {
    nbEl.innerHTML = '';
    notebookCells.forEach(c => nbEl.appendChild(renderCell(c)));
  }

  /* ---------- 练习 ---------- */
  function renderExercise(div, cell) {
    const cfg = cell.cfg;
    const box = document.createElement('div');
    box.className = 'ex-box';
    const qTitle = document.createElement('div');
    qTitle.className = 'ex-title';
    qTitle.textContent = cfg.title || '练习题';
    box.appendChild(qTitle);
    div.appendChild(box);
    if (cfg.qtype === 'qa') renderQA(box, cfg);
    else if (cfg.qtype === 'fill') renderFill(box, cfg);
  }

  function setQuestion(cfg, state) {
    if (cfg.qtype === 'qa') {
      if (cfg.qlist) {
        const q = cfg.qlist[Math.floor(Math.random() * cfg.qlist.length)];
        state.q = q.q;
        state.opts = q.options;
        state.answer = q.answer;
        state.explain = q.explain;
      } else {
        state.q = cfg.q;
        state.opts = cfg.options;
        state.answer = cfg.answer;
        state.explain = cfg.explain;
      }
    } else {
      state.verb = pick(cfg.verbs);
      state.form = pick(cfg.forms);
      state.answer = C.getFormValue(state.verb, state.form);
      state.q = '「<span class="ja">' + state.verb + '</span>」的 ' + state.form + ' 是？';
    }
  }

  function renderQA(box, cfg) {
    const state = {};
    const qEl = document.createElement('div');
    qEl.className = 'ex-q';
    const optsEl = document.createElement('div');
    optsEl.className = 'ex-opts';
    const fb = document.createElement('div');
    fb.className = 'ex-fb';
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;margin-top:10px;';

    function fresh() {
      setQuestion(cfg, state);
      qEl.innerHTML = state.q;
      optsEl.innerHTML = '';
      fb.className = 'ex-fb';
      fb.innerHTML = '';
      state.opts.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'ex-opt';
        b.innerHTML = '<span class="key">' + 'ABCD'[i] + '</span><span>' + o + '</span>';
        b.addEventListener('click', () => choose(b, i));
        optsEl.appendChild(b);
      });
      state.locked = false;
    }
    function choose(btn, idx) {
      if (state.locked) return;
      state.locked = true;
      const ok = idx === state.answer;
      stat.t += 1;
      if (ok) stat.c += 1;
      if (!ok && cfg.forms) addMis(state.verb, state.form);
      saveStat(); refreshHeader();
      if (ok) {
        btn.classList.add('correct');
        fb.className = 'ex-fb ok';
        fb.textContent = '✔ ' + pick(L.GUIDE_OK);
        say(pick(L.GUIDE_OK), 'smile');
        gainExp();
      } else {
        btn.classList.add('wrong-sel');
        optsEl.children[state.answer].classList.add('correct');
        fb.className = 'ex-fb no';
        fb.textContent = '✘ ' + pick(L.GUIDE_NO) + '（正确答案：' + optsEl.children[state.answer].textContent.trim().slice(1) + '）';
        say(pick(L.GUIDE_NO), 'think');
      }
      if (state.explain) fb.textContent += '　' + state.explain;
      optsEl.querySelectorAll('.ex-opt').forEach(b => b.disabled = true);
      next.disabled = false;
    }
    const next = document.createElement('button');
    next.className = 'ex-btn ghost';
    next.textContent = '再来一题';
    next.disabled = true;
    next.addEventListener('click', () => { fresh(); next.disabled = true; });
    if (cfg.qlist) btnRow.appendChild(next);
    box.appendChild(qEl);
    box.appendChild(optsEl);
    box.appendChild(btnRow);
    box.appendChild(fb);
    fresh();
  }

  function renderFill(box, cfg) {
    const state = {};
    const qEl = document.createElement('div');
    qEl.className = 'ex-q';
    const row = document.createElement('div');
    row.className = 'ex-input-row';
    const input = document.createElement('input');
    input.className = 'ex-input';
    input.placeholder = '输入假名答案';
    const check = document.createElement('button');
    check.className = 'ex-btn';
    check.textContent = '检查';
    const reveal = document.createElement('button');
    reveal.className = 'ex-btn ghost';
    reveal.textContent = '看答案';
    row.appendChild(input); row.appendChild(check); row.appendChild(reveal);
    const next = document.createElement('button');
    next.className = 'ex-btn ghost';
    next.textContent = '下一题';
    const fb = document.createElement('div');
    fb.className = 'ex-fb';
    box.appendChild(qEl);
    box.appendChild(row);
    box.appendChild(next);
    box.appendChild(fb);

    function fresh() {
      setQuestion(cfg, state);
      qEl.innerHTML = state.q + ' <span class="ruby">(' + C.readingOf(state.verb) + ')</span>';
      input.value = '';
      input.disabled = false;
      check.disabled = false;
      fb.className = 'ex-fb';
      fb.innerHTML = '';
      next.disabled = true;
      input.focus();
    }
    function doCheck() {
      const guess = input.value.trim();
      if (!guess) { fb.className = 'ex-fb no'; fb.textContent = '先填个答案呀～'; return; }
      input.disabled = true;
      check.disabled = true;
      const ok = guess === state.answer;
      stat.t += 1;
      if (ok) stat.c += 1;
      if (!ok) addMis(state.verb, state.form);
      saveStat(); refreshHeader();
      if (ok) {
        fb.className = 'ex-fb ok';
        fb.textContent = '✔ ' + state.verb + ' → ' + state.answer + '。' + pick(L.GUIDE_OK);
        say(pick(L.GUIDE_OK), 'smile');
        gainExp();
      } else {
        fb.className = 'ex-fb no';
        fb.textContent = '✘ 你填「' + guess + '」，正确答案：' + state.answer + '。' + pick(L.GUIDE_NO);
        say(pick(L.GUIDE_NO), 'think');
      }
      next.disabled = false;
    }
    check.addEventListener('click', doCheck);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doCheck(); });
    reveal.addEventListener('click', () => {
      input.disabled = true; check.disabled = true;
      fb.className = 'ex-fb ok';
      fb.textContent = '答案：' + state.answer + '（' + state.form + '）';
      next.disabled = false;
    });
    next.addEventListener('click', fresh);
    fresh();
  }

  /* ---------- 错题本 ---------- */
  function exportMis() {
    const arr = loadMis();
    if (!arr.length) return;
    const lines = arr.map(m => {
      return m.v + '\t' + C.readingOf(m.v) + '\t' + m.f + '\t' + C.getFormValue(m.v, m.f);
    });
    const text = ['动词\t读音\t活用形\t答案'].concat(lines).join('\n');
    const blob = new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '错题本.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  function renderMis(div) {
    const box = document.createElement('div');
    box.className = 'ex-box';
    box.innerHTML = '<div class="ex-title">错题本</div>';
    const list = document.createElement('div');
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;';
    const clear = document.createElement('button');
    clear.className = 'ex-btn ghost';
    clear.textContent = '清空错题';
    const exportBtn = document.createElement('button');
    exportBtn.className = 'ex-btn ghost';
    exportBtn.textContent = '导出 CSV';
    const ref = document.createElement('button');
    ref.className = 'ex-btn ghost';
    ref.textContent = '刷新';
    btnRow.appendChild(exportBtn);
    btnRow.appendChild(clear);
    btnRow.appendChild(ref);
    box.appendChild(list);
    box.appendChild(btnRow);
    div.appendChild(box);

    function render() {
      const arr = loadMis();
      if (!arr.length) {
        list.innerHTML = '<p style="color:#9aa0a6;margin:0;">还没有错题，继续吧～</p>';
        return;
      }
      list.innerHTML = '';
      arr.forEach(m => {
        const row = document.createElement('div');
        row.className = 'mis-row';
        const rd = C.readingOf(m.v);
        row.innerHTML = '<span class="ja">' + m.v + '</span> <span style="color:#9aa0a6;">(' + rd + ')</span> 的 ' + m.f + '：<b>' + C.getFormValue(m.v, m.f) + '</b>' +
          '<button class="mis-del">删除</button>';
        row.querySelector('.mis-del').addEventListener('click', () => { rmMis(m.v, m.f); render(); refreshHeader(); });
        list.appendChild(row);
      });
    }
    clear.addEventListener('click', () => { saveMis([]); render(); refreshHeader(); });
    exportBtn.addEventListener('click', exportMis);
    ref.addEventListener('click', render);
    render();
    misRefreshCallbacks.push(render);
  }

  /* ---------- 滚动章节引导 ---------- */
  const contentEl = document.getElementById('content');
  let lastCh = null;
  const chCells = notebookCells.filter(c => c.type === 'md' && c.ch);
  function onScroll() {
    const mid = contentEl.scrollTop + contentEl.clientHeight * 0.25;
    let cur = null;
    for (const c of chCells) {
      const el = document.getElementById(c.id);
      if (el && el.offsetTop <= mid) cur = c.ch;
    }
    if (cur && cur !== lastCh) {
      lastCh = cur;
      hdCh.textContent = L.CH_NAMES[cur] || '';
      guideForChapter(cur);
    }
  }
  contentEl.addEventListener('scroll', onScroll);

  /* ---------- 启动 ---------- */
  refreshHeader();
  renderNotebook();
  onScroll();

  if (window.Sherry && window.Sherry.init) {
    window.Sherry.init(document.getElementById('l2d-canvas')).then((ok) => {
      l2dFallback.textContent = ok ? '' : 'Live2D 加载失败，先看看课程吧。';
      if (ok) {
        window.Sherry.breath();
        say('模型加载好了，我们开始吧。', 'smile', true);
      }
    });
  }
})();
