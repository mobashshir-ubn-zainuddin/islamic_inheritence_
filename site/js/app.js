(function () {
  'use strict';
  const { calculate, HEIRS, Fr, fr } = window.Faraid;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
  const GROUP_NOTE = {
    Spouse: 'Husband or wife', Descendants: 'Children and grandchildren (through a son)',
    Ascendants: 'Parents and grandparents', Siblings: 'Brothers and sisters',
    'Wider male relatives': 'Nephews, uncles, cousins and the one who freed the deceased from slavery — residuary heirs only',
  };
  let gender = 'male';
  const counts = {};
  Object.keys(HEIRS).forEach(k => counts[k] = 0);

  function buildForm() {
    const host = $('#heirForm'); host.innerHTML = '';
    GROUP_ORDER.forEach(g => {
      const keys = Object.keys(HEIRS).filter(k => HEIRS[k].group === g && !(g === 'Spouse' && ((k === 'husband') === (gender === 'male'))));
      if (!keys.length) return;
      const wrap = document.createElement('div'); wrap.className = 'group';
      wrap.innerHTML = `<h3>${esc(g)} <small style="font-weight:400;font-size:14px;color:var(--muted)">— ${esc(GROUP_NOTE[g])}</small></h3><div class="heirs"></div>`;
      const grid = $('.heirs', wrap);
      keys.forEach(k => {
        const d = document.createElement('div'); d.className = 'heir' + (counts[k] ? ' has' : ''); d.dataset.k = k;
        d.innerHTML = `<div class="nm"><b>${esc(HEIRS[k].label)}</b><i lang="ar" dir="rtl">${HEIRS[k].ar}</i></div>
          <div class="stepper"><button type="button" aria-label="fewer ${esc(HEIRS[k].label)}">−</button><output>${counts[k]}</output><button type="button" aria-label="more ${esc(HEIRS[k].label)}">+</button></div>`;
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
  buildForm();

  $('#resetBtn').addEventListener('click', () => {
    Object.keys(counts).forEach(k => counts[k] = 0); buildForm();
    ['estate', 'funeral', 'debts', 'wasiyyah'].forEach(i => $('#' + i).value = '');
    $('#result').innerHTML = '';
  });

  /* ---------- rendering ---------- */
  const COLORS = ['#0f5247', '#c9a24b', '#2a8a78', '#8f6f24', '#3b6e9a', '#7a4fa0', '#9a3b3b', '#4d7c3f', '#b0702d', '#5b6c8f', '#1f8a9a', '#a14f7a'];
  const num = (id) => Math.max(0, parseFloat($('#' + id).value) || 0);
  const money = (v, cur) => (cur ? cur + ' ' : '') + v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const toFrac = (x) => { // exact fraction from user number (up to 6 decimals)
    const s = Math.round(x * 1e6); return fr(BigInt(s), 1000000n);
  };

  function estateBlock(res) {
    const estate = num('estate'); if (!estate) return { html: '', dist: null };
    const cur = $('#cur').value.trim();
    const funeral = num('funeral'), debts = num('debts'), bequestIn = num('wasiyyah');
    const afterFuneral = Math.max(0, estate - funeral);
    const afterDebts = Math.max(0, afterFuneral - debts);
    const cap = afterDebts / 3; const bequest = Math.min(bequestIn, cap);
    const dist = afterDebts - bequest;
    const lines = [
      `Total estate: <b>${money(estate, cur)}</b>`,
      funeral ? `− funeral &amp; burial: ${money(funeral, cur)} → ${money(afterFuneral, cur)}` : '',
      debts ? `− debts &amp; unpaid mahr: ${money(debts, cur)} → ${money(afterDebts, cur)}` : '',
      bequestIn ? `− bequest: ${money(bequest, cur)}${bequestIn > cap ? ` <span class="excl">(you entered ${money(bequestIn, cur)}, but a bequest is limited to ⅓ of the estate after debts = ${money(cap, cur)})</span>` : ` (within the ⅓ limit of ${money(cap, cur)})`}` : '',
      `<b>Net estate to divide among the heirs: ${money(dist, cur)}</b>`,
    ].filter(Boolean);
    return { html: `<div class="estate-box"><b>Step 0 – Settle the estate first</b><br>${lines.join('<br>')}</div>`, dist, cur };
  }

  function renderResult(res, target, opts) {
    opts = opts || {};
    const est = opts.estate || { html: '', dist: null };
    const parts = [];
    const f = res.flags;
    const badges = [];
    if (f.umar) badges.push('Umar’s ruling'); if (f.awal) badges.push('ʿAwl (shares reduced)'); if (f.radd) badges.push('Radd (remainder returned)');
    if (f.himariyya) badges.push('Ḥimāriyyah / Mushtarakah'); if (f.grandfather) badges.push('Grandfather with siblings');
    if (f.akdariyya) badges.push('Akdariyyah'); if (f.bayt) badges.push('Bayt al-Māl');

    parts.push(`<div class="card summary"><h2>${opts.title || 'Result'}</h2>`);
    if (badges.length) parts.push(`<div class="badges">${badges.map(b => `<span class="badge">${b}</span>`).join('')}</div>`);
    parts.push(est.html);
    if (res.heirs.length) {
      const L = res.heirs.reduce((a, h) => { const d = h.total.d; return a / gcdB(a, d) * d; }, 1n);
      // bar
      const shown = res.heirs.filter(h => h.total.pos());
      parts.push(`<div class="bar" role="img" aria-label="Share distribution">${shown.map((h, i) => `<span style="width:${h.total.num() * 100}%;background:${COLORS[i % COLORS.length]}" title="${esc(h.label)} ${h.total}">${h.total.num() > .07 ? esc(h.total.toString()) : ''}</span>`).join('')}</div>`);
      parts.push(`<div class="legend">${shown.map((h, i) => `<span><i style="background:${COLORS[i % COLORS.length]}"></i>${esc(h.label)}</span>`).join('')}</div>`);
      parts.push(`<table class="res"><thead><tr><th>Heir</th><th>No.</th><th>Share of estate</th><th>%</th><th>Each person</th><th>Parts of ${L}</th>${est.dist != null ? '<th>Amount (total)</th><th>Amount (each)</th>' : ''}</tr></thead><tbody>`);
      res.heirs.forEach(h => {
        const zero = !h.total.pos();
        const parts_ = h.total.n * (L / h.total.d);
        parts.push(`<tr class="${zero ? 'zero' : ''}"><td><b>${esc(h.label)}</b>${HEIRS[h.key].ar ? ` <span lang="ar" dir="rtl" style="font-family:Amiri;color:var(--gold-dark)">${HEIRS[h.key].ar}</span>` : ''}${zero ? `<div class="excl">${h.blocked ? 'Blocked by ' + esc(h.blocked.by.map(x => HEIRS[x].label).join(', ')) : 'Receives nothing in this case'}</div>` : ''}
          ${whyHtml(h)}</td><td class="num">${h.count}</td><td class="num frac">${h.total}</td><td class="num">${h.total.pct()}</td><td class="num">${h.count > 1 ? h.each : '—'}</td><td class="num">${parts_}</td>
          ${est.dist != null ? `<td class="num">${money(h.total.num() * est.dist, est.cur)}</td><td class="num">${money(h.each.num() * est.dist, est.cur)}</td>` : ''}</tr>`);
      });
      parts.push(`</tbody><tfoot><tr><td><b>Total</b></td><td></td><td class="num frac">${res.total}</td><td class="num">${res.total.pct()}</td><td></td><td class="num">${L}</td>${est.dist != null ? `<td class="num">${money(est.dist, est.cur)}</td><td></td>` : ''}</tr></tfoot></table>`);
      parts.push(`<p class="hint">“Parts of ${L}”: if the estate is cut into ${L} equal parts, this is how many parts each heir group receives.</p>`);
    }
    parts.push('</div>');
    parts.push(`<div class="card"><h2>How the shares were worked out</h2>${res.steps.map(stepHtml).join('')}
      <div class="actions"><button class="btn ghost small" onclick="window.print()">Print this result</button></div>
      <p class="hint">This is a calculation aid, not a fatwa. For a binding ruling please contact a Darul Ifta (see the <a href="#ask" onclick="document.querySelector('[data-tab=ask]').click();return false;">Ask a Mufti</a> tab).</p></div>`);
    target.innerHTML = parts.join('');
  }
  function gcdB(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
  function whyHtml(h) {
    if (!h.reasons.length) return '';
    return `<ul class="why">${h.reasons.map(r => `<li>${esc(r.text)}${r.ref ? ` <span class="ref">[${esc(r.ref)}]</span>` : ''} <b>${r.type === 'awal' || r.type === 'radd' || r.type === 'pool' ? '' : '= ' + r.amount}</b></li>`).join('')}</ul>`;
  }
  function stepHtml(s) {
    const lis = s.lines.map(l => `<li>${esc(l)}</li>`).join('');
    return `<div class="step ${s.kind}"><h4>${esc(s.title)}</h4><ul>${lis}</ul></div>`;
  }

  $('#calcBtn').addEventListener('click', () => {
    const res = calculate({ counts });
    renderResult(res, $('#result'), { title: 'Distribution of the estate', estate: estateBlock(res) });
    $('#result').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- famous cases ---------- */
  function caseHtml(c) {
    const res = calculate({ counts: c.counts });
    const chips = Object.keys(c.counts).map(k => `<span class="chip">${c.counts[k]} × ${esc(HEIRS[k].label)}</span>`).join('');
    const out = res.heirs.map(h => `<div><b>${esc(h.label)}</b>: ${h.total} <small>(${h.total.pct()})</small></div>`).join('');
    return `<div class="card case" id="case-${c.id}"><h2>${esc(c.title)}</h2><p class="meta">${esc(c.source)}</p><p>${esc(c.story)}</p>
      <div class="chips">${chips}</div><div class="out">${out}</div>
      <div class="actions"><button class="btn primary small" data-explain="${c.id}">Explain step by step</button><button class="btn ghost small" data-load="${c.id}">Load in calculator</button></div>
      <div class="detail" id="detail-${c.id}"></div></div>`;
  }
  $('#caseList').innerHTML = window.FAMOUS_CASES.map(caseHtml).join('');
  $('#caseList').addEventListener('click', (ev) => {
    const b = ev.target.closest('button'); if (!b) return;
    if (b.dataset.explain) {
      const c = window.FAMOUS_CASES.find(x => x.id === b.dataset.explain); const d = $('#detail-' + c.id);
      if (d.innerHTML) { d.innerHTML = ''; b.textContent = 'Explain step by step'; return; }
      renderResult(calculate({ counts: c.counts }), d, { title: 'Working' }); b.textContent = 'Hide working';
    } else if (b.dataset.load) {
      const c = window.FAMOUS_CASES.find(x => x.id === b.dataset.load);
      Object.keys(counts).forEach(k => counts[k] = 0); Object.assign(counts, c.counts);
      gender = counts.husband ? 'female' : 'male';
      document.querySelectorAll('#gender button').forEach(x => x.classList.toggle('on', x.dataset.g === gender));
      buildForm(); showTab('calc');
      renderResult(calculate({ counts }), $('#result'), { title: c.title, estate: estateBlock() });
    }
  });

  /* ---------- validation ---------- */
  const V = window.ILMSUMMIT || [];
  $('#vTotal').textContent = V.length;
  const KNOWN = {
    34: 'Known difference: the reference site lets maternal brothers inherit alongside two daughters. Under Qur’an 4:12 (Kalalah) maternal siblings inherit only when the deceased leaves no children or grandchildren and no father or paternal grandfather, so a daughter blocks them. This calculator follows the Qur’anic ruling (Rule 12 as corrected).',
  };
  function runCase(c) {
    const res = calculate({ counts: c.heirs });
    const got = {}; res.heirs.forEach(h => got[h.key] = h.total);
    const diffs = [];
    new Set([...Object.keys(got), ...Object.keys(c.expected)]).forEach(k => {
      const [n, d] = (c.expected[k] || '0/1').split('/'); const ex = fr(BigInt(n), BigInt(d || 1));
      const g = got[k] || fr(0);
      if (!ex.eq(g)) diffs.push({ k, ex, g });
    });
    return { diffs, got, res };
  }
  $('#runVal').addEventListener('click', () => {
    let pass = 0, known = 0, fail = 0; const rows = [];
    V.forEach(c => {
      const r = runCase(c); const ok = !r.diffs.length;
      const isKnown = !ok && KNOWN[c.id];
      if (ok) pass++; else if (isKnown) known++; else fail++;
      const status = ok ? '<span class="pass">✔ pass</span>' : isKnown ? '<span class="fail" style="color:#8f6f24">≠ known difference</span>' : '<span class="fail">✘ FAIL</span>';
      const cmp = `<table class="cmp"><tr><th>Heir</th><th>Reference site</th><th>This calculator</th></tr>${Array.from(new Set([...Object.keys(c.expected), ...r.res.heirs.map(h => h.key)])).map(k => {
        const g = r.got[k] || fr(0); const [n, d] = (c.expected[k] || '0/1').split('/'); const ex = fr(BigInt(n), BigInt(d || 1));
        return `<tr><td>${esc(HEIRS[k].label)}</td><td>${ex}</td><td class="${ex.eq(g) ? '' : 'bad'}">${g}</td></tr>`;
      }).join('')}</table>`;
      rows.push(`<details class="v ${ok ? '' : 'bad'}"><summary>Case #${c.id}: ${esc(c.text)} — ${status}</summary>${cmp}${isKnown ? `<p class="hint">${esc(KNOWN[c.id])}</p>` : ''}<p class="hint"><b>Reference reasoning:</b> ${c.steps.map(esc).join(' → ')}</p></details>`);
    });
    $('#valSummary').innerHTML = `<div class="vsum"><div><b>${V.length}</b>cases</div><div><b class="pass">${pass}</b>exact match</div><div><b style="color:#8f6f24">${known}</b>known difference</div><div><b class="fail">${fail}</b>mismatch</div></div>`;
    $('#valList').innerHTML = `<div class="card">${rows.join('')}</div>`;
  });

  /* ---------- rules text ---------- */
  (function () {
    const t = (window.RULES_TEXT || '').split(/\r?\n/);
    let html = '<h2>The rulings used by this calculator</h2><p class="hint">Reproduced from the supplied rulings document; rule numbers are quoted in every explanation.</p>', open = false;
    t.forEach(line => {
      if (!line.trim()) return;
      const m = line.match(/^(\d+)\)\s*(.*)$/);
      if (m) { html += `<h3><span class="rule-n">${m[1]}.</span> ${esc(m[2].slice(0, 160))}</h3>`; return; }
      if (/^(Rules of Inheritance|Prescribed Shares)$/.test(line.trim())) return;
      const indent = (line.match(/^\s*/)[0].length >> 1);
      html += `<div style="margin-left:${Math.min(indent, 4) * 14}px">${esc(line.trim())}</div>`;
    });
    $('#rulesBody').innerHTML = html;
  })();

  const h = (location.hash || '').slice(1); if (['calc', 'cases', 'validate', 'ask', 'rules'].includes(h)) showTab(h);
})();
