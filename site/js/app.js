(function () {
  'use strict';
  const { calculate, HEIRS, fr, label } = window.Faraid;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- language ---------- */
  let lang = 'en';
  try { const s = localStorage.getItem('lang'); if (s === 'ur' || s === 'en') lang = s; } catch (e) { /* storage blocked */ }
  const q = /[?&]lang=(ur|en)/.exec(location.search); if (q) lang = q[1];
  const T = (k, p) => window.I18N.t(lang, k, p);
  const heirName = (k, n) => label(k, n || 1, lang);
  const ltr = (s) => (lang === 'ur' ? '⁦' + s + '⁩' : s);

  /* ---------- tabs ---------- */
  function showTab(name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
    try { history.replaceState(null, '', '#' + name); } catch (e) { /* file:// */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));

  /* ---------- heir form ---------- */
  const MAX = { husband: 1, wife: 4, father: 1, mother: 1, grandfather: 1, paternalGrandmother: 3, maternalGrandmother: 3, emancipator: 1 };
  const GROUP_ORDER = ['Spouse', 'Descendants', 'Ascendants', 'Siblings', 'Wider male relatives'];
  let gender = 'male';
  const counts = {};
  Object.keys(HEIRS).forEach(k => counts[k] = 0);

  function buildForm() {
    const host = $('#heirForm'); host.innerHTML = '';
    GROUP_ORDER.forEach(g => {
      const keys = Object.keys(HEIRS).filter(k => HEIRS[k].group === g && !(g === 'Spouse' && ((k === 'husband') === (gender === 'male'))));
      if (!keys.length) return;
      const wrap = document.createElement('div'); wrap.className = 'group';
      wrap.innerHTML = `<h3>${esc(T('g.' + g))} <small style="font-weight:400;font-size:14px;color:var(--muted)">— ${esc(T('gn.' + g))}</small></h3><div class="heirs"></div>`;
      const grid = $('.heirs', wrap);
      keys.forEach(k => {
        const d = document.createElement('div'); d.className = 'heir' + (counts[k] ? ' has' : ''); d.dataset.k = k;
        const nm = heirName(k, 1);
        d.innerHTML = `<div class="nm"><b>${esc(nm)}</b><i lang="ar" dir="rtl">${HEIRS[k].ar}</i></div>
          <div class="stepper" dir="ltr"><button type="button" aria-label="${esc(T('btn.fewer'))} ${esc(nm)}">−</button><output>${counts[k]}</output><button type="button" aria-label="${esc(T('btn.more'))} ${esc(nm)}">+</button></div>`;
        const [minus, plus] = d.querySelectorAll('button'); const out = $('output', d);
        const set = (v) => { counts[k] = Math.max(0, Math.min(MAX[k] || 30, v)); out.textContent = counts[k]; d.classList.toggle('has', counts[k] > 0); };
        minus.addEventListener('click', () => set(counts[k] - 1));
        plus.addEventListener('click', () => set(counts[k] + 1));
        grid.appendChild(d);
      });
      host.appendChild(wrap);
    });
  }
  document.querySelectorAll('#gender button').forEach(b => b.addEventListener('click', () => {
    gender = b.dataset.g;
    document.querySelectorAll('#gender button').forEach(x => x.classList.toggle('on', x === b));
    if (gender === 'male') counts.husband = 0; else counts.wife = 0;
    buildForm();
  }));

  let lastCalc = null; // remembers what the result panel is showing so it can be re-rendered in the other language
  $('#resetBtn').addEventListener('click', () => {
    Object.keys(counts).forEach(k => counts[k] = 0); buildForm();
    ['estate', 'funeral', 'debts', 'wasiyyah'].forEach(i => $('#' + i).value = '');
    $('#result').innerHTML = ''; lastCalc = null;
  });

  /* ---------- rendering ---------- */
  const COLORS = ['#0f5247', '#c9a24b', '#2a8a78', '#8f6f24', '#3b6e9a', '#7a4fa0', '#9a3b3b', '#4d7c3f', '#b0702d', '#5b6c8f', '#1f8a9a', '#a14f7a'];
  const num = (id) => Math.max(0, parseFloat($('#' + id).value) || 0);
  const moneyRaw = (v, cur) => ltr((cur ? cur + ' ' : '') + v.toLocaleString('en-US', { maximumFractionDigits: 2 }));
  const money = (v, cur) => esc(moneyRaw(v, cur));

  function estateBlock() {
    const estate = num('estate'); if (!estate) return { html: '', dist: null };
    const cur = $('#cur').value.trim();
    const funeral = num('funeral'), debts = num('debts'), bequestIn = num('wasiyyah');
    const afterFuneral = Math.max(0, estate - funeral);
    const afterDebts = Math.max(0, afterFuneral - debts);
    const cap = afterDebts / 3; const bequest = Math.min(bequestIn, cap);
    const dist = afterDebts - bequest;
    const R = (v) => moneyRaw(v, cur);
    const lines = [
      esc(T('est.total', { v: '@@' })).replace('@@', '<b>' + money(estate, cur) + '</b>'),
      funeral ? esc(T('est.funeral', { a: R(funeral), b: R(afterFuneral) })) : '',
      debts ? esc(T('est.debts', { a: R(debts), b: R(afterDebts) })) : '',
      bequestIn ? (bequestIn > cap
        ? `<span class="excl">${esc(T('est.bequestCap', { a: R(bequest), in: R(bequestIn), cap: R(cap) }))}</span>`
        : esc(T('est.bequest', { a: R(bequest), cap: R(cap) }))) : '',
      '<b>' + esc(T('est.net', { v: R(dist) })) + '</b>',
    ].filter(Boolean);
    return { html: `<div class="estate-box"><b>${esc(T('est.step0'))}</b><br>${lines.join('<br>')}</div>`, dist, cur };
  }

  function gcdB(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
  function whyHtml(h) {
    if (!h.reasons.length) return '';
    return `<ul class="why">${h.reasons.map(r => `<li>${esc(r.text)}${r.ref ? ` <span class="ref">[${esc(r.ref)}]</span>` : ''} <b>${r.type === 'awal' || r.type === 'radd' || r.type === 'pool' ? '' : '= ' + r.amount}</b></li>`).join('')}</ul>`;
  }
  function stepHtml(s) {
    return `<div class="step ${s.kind}"><h4>${esc(s.title)}</h4><ul>${s.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>`;
  }

  function renderResult(res, target, opts) {
    opts = opts || {};
    const est = opts.estate || { html: '', dist: null };
    const parts = [];
    const f = res.flags;
    const badges = [];
    if (f.umar) badges.push('badge.umar'); if (f.awal) badges.push('badge.awal'); if (f.radd) badges.push('badge.radd');
    if (f.himariyya) badges.push('badge.himariyya'); if (f.grandfather) badges.push('badge.grandfather');
    if (f.akdariyya) badges.push('badge.akdariyya'); if (f.bayt) badges.push('badge.bayt');

    parts.push(`<div class="card summary"><h2>${esc(opts.title || T('res.title'))}</h2>`);
    if (badges.length) parts.push(`<div class="badges">${badges.map(b => `<span class="badge">${esc(T(b))}</span>`).join('')}</div>`);
    parts.push(est.html);
    if (res.heirs.length) {
      const L = res.heirs.reduce((a, h) => { const d = h.total.d; return a / gcdB(a, d) * d; }, 1n);
      const shown = res.heirs.filter(h => h.total.pos());
      parts.push(`<div class="bar" dir="ltr" role="img">${shown.map((h, i) => `<span style="width:${h.total.num() * 100}%;background:${COLORS[i % COLORS.length]}" title="${esc(h.label)} ${h.total}">${h.total.num() > .07 ? esc(h.total.toString()) : ''}</span>`).join('')}</div>`);
      parts.push(`<div class="legend">${shown.map((h, i) => `<span><i style="background:${COLORS[i % COLORS.length]}"></i>${esc(h.label)}</span>`).join('')}</div>`);
      parts.push(`<table class="res"><thead><tr><th>${esc(T('th.heir'))}</th><th>${esc(T('th.no'))}</th><th>${esc(T('th.share'))}</th><th>%</th><th>${esc(T('th.each'))}</th><th>${esc(T('th.parts', { L }))}</th>${est.dist != null ? `<th>${esc(T('th.amt'))}</th><th>${esc(T('th.amtEach'))}</th>` : ''}</tr></thead><tbody>`);
      res.heirs.forEach(h => {
        const zero = !h.total.pos();
        const parts_ = h.total.n * (L / h.total.d);
        const why = zero ? `<div class="excl">${h.blocked ? esc(T('blockedBy', { x: h.blocked.by.map(x => heirName(x, 1)).join(T('comma')) })) : esc(T('nothing'))}</div>` : '';
        parts.push(`<tr class="${zero ? 'zero' : ''}"><td><b>${esc(h.label)}</b> <span lang="ar" dir="rtl" style="font-family:Amiri;color:var(--gold-dark)">${HEIRS[h.key].ar}</span>${why}
          ${whyHtml(h)}</td><td class="num">${h.count}</td><td class="num frac">${h.total}</td><td class="num">${h.total.pct()}</td><td class="num">${h.count > 1 ? h.each : '—'}</td><td class="num">${parts_}</td>
          ${est.dist != null ? `<td class="num">${money(h.total.num() * est.dist, est.cur)}</td><td class="num">${money(h.each.num() * est.dist, est.cur)}</td>` : ''}</tr>`);
      });
      parts.push(`</tbody><tfoot><tr><td><b>${esc(T('th.total'))}</b></td><td></td><td class="num frac">${res.total}</td><td class="num">${res.total.pct()}</td><td></td><td class="num">${L}</td>${est.dist != null ? `<td class="num">${money(est.dist, est.cur)}</td><td></td>` : ''}</tr></tfoot></table>`);
      parts.push(`<p class="hint">${esc(T('parts.hint', { L }))}</p>`);
    }
    parts.push('</div>');
    parts.push(`<div class="card"><h2>${esc(T('res.how'))}</h2>${res.steps.map(stepHtml).join('')}
      <div class="actions"><button class="btn ghost small" onclick="window.print()">${esc(T('btn.print'))}</button></div>
      <p class="hint">${esc(T('disc'))} <a href="#ask" onclick="document.querySelector('[data-tab=ask]').click();return false;">${esc(T('nav.ask'))}</a> ${esc(T('disc.end'))}</p></div>`);
    target.innerHTML = parts.join('');
  }

  function showCalc(title) {
    lastCalc = { title };
    const res = calculate({ counts, lang });
    renderResult(res, $('#result'), { title: title ? title() : T('res.title'), estate: estateBlock() });
  }
  $('#calcBtn').addEventListener('click', () => { showCalc(null); $('#result').scrollIntoView({ behavior: 'smooth' }); });

  /* ---------- famous cases ---------- */
  const openCases = new Set();
  const caseText = (c) => (lang === 'ur' && window.FAMOUS_CASES_UR[c.id]) ? window.FAMOUS_CASES_UR[c.id] : c;
  function caseHtml(c) {
    const res = calculate({ counts: c.counts, lang });
    const x = caseText(c);
    const chips = Object.keys(c.counts).map(k => `<span class="chip">${c.counts[k]} × ${esc(heirName(k, 1))}</span>`).join('');
    const out = res.heirs.map(h => `<div><b>${esc(h.label)}</b>: ${h.total} <small>(${h.total.pct()})</small></div>`).join('');
    return `<div class="card case" id="case-${c.id}"><h2>${esc(x.title)}</h2><p class="meta">${esc(x.source)}</p><p>${esc(x.story)}</p>
      <div class="chips">${chips}</div><div class="out">${out}</div>
      <div class="actions"><button class="btn primary small" data-explain="${c.id}">${esc(T(openCases.has(c.id) ? 'btn.hide' : 'btn.explain'))}</button><button class="btn ghost small" data-load="${c.id}">${esc(T('btn.load'))}</button></div>
      <div class="detail" id="detail-${c.id}"></div></div>`;
  }
  function buildCases() {
    $('#caseList').innerHTML = window.FAMOUS_CASES.map(caseHtml).join('');
    openCases.forEach(id => { const c = window.FAMOUS_CASES.find(z => z.id === id); renderResult(calculate({ counts: c.counts, lang }), $('#detail-' + id), { title: T('working') }); });
  }
  $('#caseList').addEventListener('click', (ev) => {
    const b = ev.target.closest('button'); if (!b) return;
    if (b.dataset.explain) {
      const c = window.FAMOUS_CASES.find(x => x.id === b.dataset.explain); const d = $('#detail-' + c.id);
      if (openCases.has(c.id)) { openCases.delete(c.id); d.innerHTML = ''; b.textContent = T('btn.explain'); return; }
      openCases.add(c.id); renderResult(calculate({ counts: c.counts, lang }), d, { title: T('working') }); b.textContent = T('btn.hide');
    } else if (b.dataset.load) {
      const c = window.FAMOUS_CASES.find(x => x.id === b.dataset.load);
      Object.keys(counts).forEach(k => counts[k] = 0); Object.assign(counts, c.counts);
      gender = counts.husband ? 'female' : 'male';
      document.querySelectorAll('#gender button').forEach(x => x.classList.toggle('on', x.dataset.g === gender));
      buildForm(); showTab('calc');
      showCalc(() => caseText(c).title);
    }
  });

  /* ---------- validation ---------- */
  const V = window.ILMSUMMIT || [];
  const KNOWN = { 34: 'v.known34' };
  function runCase(c) {
    const res = calculate({ counts: c.heirs, lang });
    const got = {}; res.heirs.forEach(h => got[h.key] = h.total);
    const diffs = [];
    new Set([...Object.keys(got), ...Object.keys(c.expected)]).forEach(k => {
      const [n, d] = (c.expected[k] || '0/1').split('/'); const ex = fr(BigInt(n), BigInt(d || 1));
      const g = got[k] || fr(0);
      if (!ex.eq(g)) diffs.push({ k, ex, g });
    });
    return { diffs, got, res };
  }
  let valRan = false;
  function runValidation() {
    valRan = true;
    let pass = 0, known = 0, fail = 0; const rows = [];
    V.forEach(c => {
      const r = runCase(c); const ok = !r.diffs.length;
      const isKnown = !ok && KNOWN[c.id];
      if (ok) pass++; else if (isKnown) known++; else fail++;
      const status = ok ? `<span class="pass">${esc(T('v.pass'))}</span>` : isKnown ? `<span class="fail" style="color:#8f6f24">${esc(T('v.known'))}</span>` : `<span class="fail">${esc(T('v.fail'))}</span>`;
      const text = Object.keys(c.heirs).map(k => `${c.heirs[k]} ${heirName(k, c.heirs[k])}`).join(T('comma'));
      const cmp = `<table class="cmp"><tr><th>${esc(T('th.heir'))}</th><th>${esc(T('v.refsite'))}</th><th>${esc(T('v.this'))}</th></tr>${Array.from(new Set([...Object.keys(c.expected), ...r.res.heirs.map(h => h.key)])).map(k => {
        const g = r.got[k] || fr(0); const [n, d] = (c.expected[k] || '0/1').split('/'); const ex = fr(BigInt(n), BigInt(d || 1));
        return `<tr><td>${esc(heirName(k, 1))}</td><td>${ex}</td><td class="${ex.eq(g) ? '' : 'bad'}">${g}</td></tr>`;
      }).join('')}</table>`;
      rows.push(`<details class="v ${ok ? '' : 'bad'}"><summary>${esc(T('v.case', { id: c.id, text }))} — ${status}</summary>${cmp}${isKnown ? `<p class="hint">${esc(T(KNOWN[c.id]))}</p>` : ''}<p class="hint" dir="ltr" style="text-align:left"><b>${esc(T('v.reason'))}</b> ${c.steps.map(esc).join(' → ')}</p></details>`);
    });
    $('#valSummary').innerHTML = `<div class="vsum"><div><b>${V.length}</b>${esc(T('v.cases'))}</div><div><b class="pass">${pass}</b>${esc(T('v.exact'))}</div><div><b style="color:#8f6f24">${known}</b>${esc(T('v.knownd'))}</div><div><b class="fail">${fail}</b>${esc(T('v.mismatch'))}</div></div>`;
    $('#valList').innerHTML = `<div class="card">${rows.join('')}</div>`;
  }
  $('#runVal').addEventListener('click', runValidation);

  /* ---------- Ask a Mufti ---------- */
  const IFTA = [
    { url: 'https://darulifta-deoband.com/en', dom: 'darulifta-deoband.com/en', name: ['Darul Uloom Deoband', 'دارالعلوم دیوبند'], sub: ['Darul Ifta · English', 'دارالافتاء · انگریزی'], urdu: false },
    { url: 'https://darulifta-deoband.com/ur', dom: 'darulifta-deoband.com/ur', name: ['دارالعلوم دیوبند', 'دارالعلوم دیوبند'], sub: ['دارالافتاء · اردو', 'دارالافتاء · اردو'], urdu: true },
    { url: 'https://www.banuri.edu.pk/en', dom: 'banuri.edu.pk/en', name: ['Jamia Uloom-ul-Islamia, Banuri Town', 'جامعہ علوم اسلامیہ بنوری ٹاؤن'], sub: ['Darul Ifta · English', 'دارالافتاء · انگریزی'], urdu: false },
    { url: 'https://www.banuri.edu.pk/darulifta', dom: 'banuri.edu.pk/darulifta', name: ['جامعہ علوم اسلامیہ بنوری ٹاؤن', 'جامعہ علوم اسلامیہ بنوری ٹاؤن'], sub: ['دارالافتاء · اردو', 'دارالافتاء · اردو'], urdu: true },
    { url: 'https://onlinedarulifta.com/', dom: 'onlinedarulifta.com', name: ['دارالعلوم کراچی', 'دارالعلوم کراچی'], sub: ['دارالافتاء · اردو', 'دارالافتاء · اردو'], urdu: true },
    { url: 'https://almuftionline.com/', dom: 'almuftionline.com', name: ['جامعۃ الرشید', 'جامعۃ الرشید'], sub: ['دارالافتاء · اردو', 'دارالافتاء · اردو'], urdu: true },
  ];
  function buildIfta() {
    const i = lang === 'ur' ? 1 : 0;
    $('#iftaGrid').innerHTML = IFTA.map(f => {
      const ur = lang === 'ur' || f.urdu;
      return `<a class="ifta" href="${f.url}" target="_blank" rel="noopener">
        <span class="ifta-name${ur ? ' urdu' : ''}"${ur ? ' lang="ur" dir="rtl"' : ''}>${esc(f.name[i])}</span><span class="ifta-sub"${f.urdu || lang === 'ur' ? ' lang="ur"' : ''}>${esc(f.sub[i])}</span><span class="ifta-go" dir="ltr">${f.dom} ↗</span></a>`;
    }).join('');
  }

  /* ---------- rules text ---------- */
  function buildRules() {
    const src = lang === 'ur' ? window.RULES_TEXT_UR : window.RULES_TEXT;
    const t = (src || '').split(/\r?\n/);
    let html = `<h2>${esc(T('rules.h'))}</h2><p class="hint">${esc(T('rules.hint'))}</p>`;
    let last = 0, first = true;
    t.forEach(line => {
      if (!line.trim()) return;
      if (first) { first = false; return; } // document title
      const m = line.match(/^(\d+)\)\s*(.*)$/);
      if (m && +m[1] === last + 1) { last = +m[1]; html += `<h3><span class="rule-n">${m[1]}.</span> ${esc(m[2])}</h3>`; return; }
      const indent = (line.match(/^\s*/)[0].length >> 1);
      if (indent === 0 && !m) { html += `<h4 class="sect">${esc(line.trim())}</h4>`; return; }
      html += `<div style="margin-inline-start:${Math.min(indent, 4) * 14}px">${esc(line.trim())}</div>`;
    });
    $('#rulesBody').innerHTML = html;
  }

  /* ---------- apply language to the whole page ---------- */
  function applyLang() {
    const de = document.documentElement;
    de.lang = lang; de.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.title = T('page.title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = T(el.dataset.i18nPh); });
    $('#valIntro').innerHTML = T('val.p', { n: V.length });
    buildForm(); buildCases(); buildIfta(); buildRules();
    if (lastCalc) showCalc(lastCalc.title);
    if (valRan) runValidation();
  }
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'en' ? 'ur' : 'en';
    try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
    applyLang();
  });

  applyLang();
  const h = (location.hash || '').slice(1); if (['calc', 'cases', 'validate', 'ask', 'rules'].includes(h)) showTab(h);
})();
