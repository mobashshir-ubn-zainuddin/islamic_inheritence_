/* Islamic Inheritance (Fara'id) engine.
 * Implements the rulings in rules_of_inheritence.txt. Exact rational arithmetic (BigInt),
 * every decision is recorded as a human-readable step so the UI can explain it.
 * Works in the browser (window.Faraid) and in Node (module.exports).
 */
(function (root) {
  'use strict';
  const I18N = (typeof module !== 'undefined' && module.exports) ? require('./i18n.js') : root.I18N;

  /* ---------- exact fractions ---------- */
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; };
  class Fr {
    constructor(n, d = 1n) {
      n = BigInt(n); d = BigInt(d);
      if (d < 0n) { n = -n; d = -d; }
      const g = gcd(n, d) || 1n;
      this.n = n / g; this.d = d / g;
    }
    add(o) { return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { return new Fr(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { return new Fr(this.n * o.n, this.d * o.d); }
    div(o) { return new Fr(this.n * o.d, this.d * o.n); }
    cmp(o) { const l = this.n * o.d, r = o.n * this.d; return l < r ? -1 : l > r ? 1 : 0; }
    eq(o) { return this.cmp(o) === 0; }
    isZero() { return this.n === 0n; }
    pos() { return this.n > 0n; }
    toString() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }
    pct() { const v = Number(this.n * 100000n / this.d) / 1000; return (Math.round(v * 100) / 100).toString().replace(/\.0+$/, '') + '%'; }
    num() { return Number(this.n) / Number(this.d); }
  }
  const fr = (n, d = 1) => new Fr(n, d);
  const ZERO = fr(0), ONE = fr(1);
  const sum = (arr) => arr.reduce((a, b) => a.add(b), ZERO);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const maxF = (...a) => a.reduce((m, x) => (x.cmp(m) > 0 ? x : m));

  /* ---------- heir catalogue ---------- */
  const HEIRS = {
    husband: { label: 'Husband', ar: 'زوج', group: 'Spouse' },
    wife: { label: 'Wife', plural: 'Wives', ar: 'زوجة', group: 'Spouse' },
    son: { label: 'Son', plural: 'Sons', ar: 'ابن', group: 'Descendants' },
    daughter: { label: 'Daughter', plural: 'Daughters', ar: 'بنت', group: 'Descendants' },
    grandson: { label: "Son's Son (Grandson)", plural: "Son's Sons", ar: 'ابن الابن', group: 'Descendants' },
    granddaughter: { label: "Son's Daughter (Granddaughter)", plural: "Son's Daughters", ar: 'بنت الابن', group: 'Descendants' },
    father: { label: 'Father', ar: 'أب', group: 'Ascendants' },
    mother: { label: 'Mother', ar: 'أم', group: 'Ascendants' },
    grandfather: { label: 'Paternal Grandfather', ar: 'جد', group: 'Ascendants' },
    paternalGrandmother: { label: 'Paternal Grandmother', ar: 'جدة لأب', group: 'Ascendants' },
    maternalGrandmother: { label: 'Maternal Grandmother', ar: 'جدة لأم', group: 'Ascendants' },
    fullBrother: { label: 'Full Brother', plural: 'Full Brothers', ar: 'أخ شقيق', group: 'Siblings' },
    fullSister: { label: 'Full Sister', plural: 'Full Sisters', ar: 'أخت شقيقة', group: 'Siblings' },
    paternalBrother: { label: 'Paternal Half-Brother', plural: 'Paternal Half-Brothers', ar: 'أخ لأب', group: 'Siblings' },
    paternalSister: { label: 'Paternal Half-Sister', plural: 'Paternal Half-Sisters', ar: 'أخت لأب', group: 'Siblings' },
    maternalBrother: { label: 'Maternal Half-Brother', plural: 'Maternal Half-Brothers', ar: 'أخ لأم', group: 'Siblings' },
    maternalSister: { label: 'Maternal Half-Sister', plural: 'Maternal Half-Sisters', ar: 'أخت لأم', group: 'Siblings' },
    fullNephew: { label: "Full Brother's Son", plural: "Full Brother's Sons", ar: 'ابن الأخ الشقيق', group: 'Wider male relatives' },
    paternalNephew: { label: "Paternal Brother's Son", plural: "Paternal Brother's Sons", ar: 'ابن الأخ لأب', group: 'Wider male relatives' },
    fullNephewSon: { label: "Full Brother's Son's Son", plural: "Full Brother's Son's Sons", ar: 'ابن ابن الأخ الشقيق', group: 'Wider male relatives' },
    paternalNephewSon: { label: "Paternal Brother's Son's Son", plural: "Paternal Brother's Son's Sons", ar: 'ابن ابن الأخ لأب', group: 'Wider male relatives' },
    fullUncle: { label: "Father's Full Brother (Uncle)", plural: "Father's Full Brothers", ar: 'عم شقيق', group: 'Wider male relatives' },
    paternalUncle: { label: "Father's Paternal Brother (Uncle)", plural: "Father's Paternal Brothers", ar: 'عم لأب', group: 'Wider male relatives' },
    fullCousin: { label: "Full Uncle's Son (Cousin)", plural: "Full Uncle's Sons", ar: 'ابن العم الشقيق', group: 'Wider male relatives' },
    paternalCousin: { label: "Paternal Uncle's Son (Cousin)", plural: "Paternal Uncle's Sons", ar: 'ابن العم لأب', group: 'Wider male relatives' },
    fullCousinSon: { label: "Full Cousin's Son", plural: "Full Cousin's Sons", ar: 'ابن ابن العم الشقيق', group: 'Wider male relatives' },
    paternalCousinSon: { label: "Paternal Cousin's Son", plural: "Paternal Cousin's Sons", ar: 'ابن ابن العم لأب', group: 'Wider male relatives' },
    fullCousinSonSon: { label: "Full Cousin's Son's Son", plural: "Full Cousin's Son's Sons", ar: 'ابن ابن ابن العم الشقيق', group: 'Wider male relatives' },
    paternalCousinSonSon: { label: "Paternal Cousin's Son's Son", plural: "Paternal Cousin's Son's Sons", ar: 'ابن ابن ابن العم لأب', group: 'Wider male relatives' },
    emancipator: { label: 'Emancipator (Mu‘tiq)', ar: 'معتق', group: 'Wider male relatives' },
  };
  const KEYS = Object.keys(HEIRS);
  const SIBS = ['fullBrother', 'fullSister', 'paternalBrother', 'paternalSister', 'maternalBrother', 'maternalSister'];
  const FAR = ['fullNephew', 'paternalNephew', 'fullNephewSon', 'paternalNephewSon', 'fullUncle', 'paternalUncle',
    'fullCousin', 'paternalCousin', 'fullCousinSon', 'paternalCousinSon', 'fullCousinSonSon', 'paternalCousinSonSon'];
  const lab = (k, n, lang) => (n > 1) ? I18N.t(lang || 'en', 'hp.' + k) : I18N.t(lang || 'en', 'h.' + k);
  const joinList = (a, lang) => a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(I18N.t(lang || 'en', 'comma')) + I18N.t(lang || 'en', 'and') + a[a.length - 1];


  /* ---------- blocking (hajb), Rule 13 ---------- */
  function computeBlocking(c, tr) {
    const has = (k) => (c[k] || 0) > 0;
    const blk = {};
    const B = (targets, by, rule, noteKey) => targets.forEach(t => { if (has(t) && !blk[t]) blk[t] = { by, rule, note: tr(noteKey) }; });
    const offspring = has('son') || has('daughter') || has('grandson') || has('granddaughter');
    const femaleOffspringOnly = (has('daughter') || has('granddaughter')) && !has('son') && !has('grandson');

    if (has('son')) B(['grandson', 'granddaughter', ...SIBS, ...FAR, 'emancipator'], ['son'], '13a', 'b.son');
    if (has('grandson') && !blk.grandson) B([...SIBS, ...FAR, 'emancipator'], ['grandson'], '13b', 'b.grandson');
    if (offspring) B(['maternalBrother', 'maternalSister'],
      [has('son') ? 'son' : has('grandson') ? 'grandson' : has('daughter') ? 'daughter' : 'granddaughter'], '12', 'b.offspring');
    if (has('father')) B(['grandfather', 'paternalGrandmother', ...SIBS, ...FAR, 'emancipator'], ['father'], '13c, 34', 'b.father');
    if (has('mother')) B(['paternalGrandmother', 'maternalGrandmother'], ['mother'], '13d', 'b.mother');
    if (has('grandfather') && !blk.grandfather) {
      B(['maternalBrother', 'maternalSister'], ['grandfather'], '12', 'b.gf12');
      B([...FAR, 'emancipator'], ['grandfather'], '13e', 'b.gf13');
    }
    if (has('fullBrother') && !blk.fullBrother) B(['paternalBrother', 'paternalSister', ...FAR, 'emancipator'], ['fullBrother'], '13f', 'b.fb');
    if (has('fullSister') && !blk.fullSister && femaleOffspringOnly) B(['paternalBrother', 'paternalSister', ...FAR, 'emancipator'], ['fullSister'], '13g', 'b.fs');
    if (has('paternalBrother') && !blk.paternalBrother) B([...FAR, 'emancipator'], ['paternalBrother'], '13h', 'b.pb');
    if (has('paternalSister') && !blk.paternalSister) {
      const sisters = (blk.fullSister ? 0 : c.fullSister || 0) + c.paternalSister;
      if (femaleOffspringOnly || sisters >= 2) B([...FAR, 'emancipator'], ['paternalSister'], '13i', 'b.ps');
    }
    // the male residuary chain: nearer blocks farther (13j-t)
    const chain = [...FAR];
    for (let i = 0; i < chain.length; i++) {
      if (has(chain[i]) && !blk[chain[i]]) B([...chain.slice(i + 1), 'emancipator'], [chain[i]], '13j-t', 'b.chain');
    }
    return blk;
  }

  /* ---------- main entry ---------- */
  function calculate(input) {
    const lang = input.lang === 'ur' ? 'ur' : 'en';
    const tr = (k, p) => I18N.t(lang, k, p);
    const L = (k, n) => lab(k, n, lang);
    const ltr = (s) => (lang === 'ur' ? '⁦' + s + '⁩' : s); // keep arithmetic left-to-right inside Urdu text
    const list = (a) => joinList(a, lang);
    const rf = (ref, rule) => tr(ref) + (rule ? ' (' + tr('rule', { n: rule }) + ')' : '');
    const rn = (n) => tr('rule', { n });

    const c = {};
    KEYS.forEach(k => { c[k] = Math.max(0, parseInt((input.counts || {})[k], 10) || 0); });
    const steps = [];
    const S = (title, lines, kind) => { const st = { title, lines: [], kind: kind || 'info' }; (lines || []).forEach(l => st.lines.push(l)); steps.push(st); return st; };
    const flags = { awal: false, radd: false, umar: false, himariyya: false, grandfather: false, akdariyya: false, bayt: false };

    const present = KEYS.filter(k => c[k] > 0);
    if (!present.length) {
      S(tr('noheirs.title'), [tr('noheirs.text')]);
      return { counts: c, heirs: [], steps, flags: { ...flags, bayt: true }, blocked: [], total: ZERO };
    }

    S(tr('s1.title'), [tr('s1.left', { list: list(present.map(k => `${c[k]} ${L(k, c[k])}`)) }), tr('s1.layers')]);

    /* --- blocking --- */
    const blk = computeBlocking(c, tr);
    const e = {};
    KEYS.forEach(k => { e[k] = blk[k] ? 0 : c[k]; });
    const blockedList = Object.keys(blk).map(k => ({ key: k, count: c[k], by: blk[k].by, rule: blk[k].rule, note: blk[k].note }));
    if (blockedList.length) {
      S(tr('s2.title'), blockedList.map(b => tr('s2.blocked', { n: b.count, name: L(b.key, b.count), by: list(b.by.map(x => L(x, 1))), note: b.note, rule: b.rule })));
    } else {
      S(tr('s2.title'), [tr('s2.none')]);
    }

    /* --- helpers --- */
    const share = {}; const why = {};
    KEYS.forEach(k => { share[k] = ZERO; why[k] = []; });
    const fixedStep = S(tr('s3.title'), [], 'fixed');
    const addFixed = (k, f, text, ref) => {
      share[k] = share[k].add(f);
      why[k].push({ type: 'fixed', amount: f, text, ref });
      fixedStep.lines.push(`${L(k, c[k])}${c[k] > 1 ? ' (' + c[k] + ')' : ''}: ${f} — ${text}${ref ? ' [' + ref + ']' : ''}`);
    };
    const addFixedGroup = (keys, f, text, ref) => { // equal split of f between listed keys by head
      const heads = keys.reduce((a, k) => a + e[k], 0);
      keys.forEach(k => { if (e[k] > 0) addFixed(k, f.mul(fr(e[k], heads)), text + (keys.filter(x => e[x] > 0).length > 1 || e[k] > 1 ? tr('grp.shared', { f }) : ''), ref); });
    };

    const desc = c.son + c.daughter + c.grandson + c.granddaughter > 0;
    const maleDesc = c.son + c.grandson > 0;
    const femaleOnlyDesc = desc && !maleDesc;
    const sibCount = SIBS.reduce((a, k) => a + c[k], 0);
    const spouses = e.husband + e.wife;

    /* spouses */
    let spouseShare = ZERO;
    if (e.husband) {
      const f = desc ? fr(1, 4) : fr(1, 2);
      addFixed('husband', f, tr(desc ? 'hus.desc' : 'hus.nodesc'), rf('ref.spouse', '1'));
      spouseShare = f;
    }
    if (e.wife) {
      const f = desc ? fr(1, 8) : fr(1, 4);
      addFixed('wife', f, tr(desc ? 'wife.desc' : 'wife.nodesc') + (e.wife > 1 ? tr('wife.each', { n: e.wife, each: f.div(fr(e.wife)) }) : ''), rf('ref.spouse', '2'));
      spouseShare = f;
    }

    /* descendants */
    if (e.son === 0) {
      if (c.daughter === 1) addFixed('daughter', fr(1, 2), tr('dau1'), rf('ref.child', '3a'));
      else if (c.daughter >= 2) addFixed('daughter', fr(2, 3), tr('dau2', { n: c.daughter, each: fr(2, 3).div(fr(c.daughter)) }), rf('ref.child', '3b'));
    }
    let granddaughterExcluded = false;
    if (e.granddaughter > 0 && e.grandson === 0) {
      if (c.daughter === 0) {
        if (e.granddaughter === 1) addFixed('granddaughter', fr(1, 2), tr('gd1'), rn('4a'));
        else addFixed('granddaughter', fr(2, 3), tr('gd2', { n: e.granddaughter }), rn('4b'));
      } else if (c.daughter === 1) {
        addFixed('granddaughter', fr(1, 6), tr('gd3', { shared: e.granddaughter > 1 ? tr('gd3.shared') : '' }), tr('rules', { n: '4c, 30f' }));
      } else {
        granddaughterExcluded = true;
        fixedStep.lines.push(tr('gd.excl', { name: L('granddaughter', c.granddaughter) }));
      }
    }

    /* parents */
    const hearsGM = (e.paternalGrandmother + e.maternalGrandmother) > 0;
    if (e.mother) {
      if (spouses && e.father && !desc && sibCount < 2) {
        flags.umar = true;
        const rem = ONE.sub(spouseShare);
        const f = rem.div(fr(3));
        addFixed('mother', f, tr('umar', { rem, f }), rn('21'));
      } else if (desc) addFixed('mother', fr(1, 6), tr('mother.desc'), rf('ref.child', '6b'));
      else if (sibCount >= 2) addFixed('mother', fr(1, 6), tr('mother.sib', { n: sibCount }), rf('ref.child', '6b, 32'));
      else addFixed('mother', fr(1, 3), tr('mother.third'), rf('ref.child', '6a'));
    }
    if (e.father && desc) addFixed('father', fr(1, 6), tr('father.desc', { extra: maleDesc ? '' : tr('father.extra') }), rf('ref.child', '5'));
    if (e.grandfather && desc) addFixed('grandfather', fr(1, 6), tr('gf.desc', { extra: maleDesc ? '' : tr('gf.extra') }), tr('rules', { n: '7, 38' }));

    /* grandmothers */
    if (hearsGM) {
      const keys = ['paternalGrandmother', 'maternalGrandmother'].filter(k => e[k] > 0);
      addFixedGroup(keys, fr(1, 6), tr(keys.length > 1 ? 'gm.many' : 'gm.one'), tr('rules', { n: '8, 9' }));
    }

    /* maternal siblings */
    const mat = e.maternalBrother + e.maternalSister;
    let matShare = ZERO;
    if (mat > 0) {
      matShare = mat === 1 ? fr(1, 6) : fr(1, 3);
      addFixedGroup(['maternalBrother', 'maternalSister'], matShare, mat === 1 ? tr('mat.one') : tr('mat.many', { n: mat }), rf('ref.kalalah12', '12'));
    }

    /* siblings: fixed shares, or the grandfather special case */
    const brothers = e.fullBrother + e.paternalBrother;
    const sibsActive = e.fullBrother + e.fullSister + e.paternalBrother + e.paternalSister;
    const gfSpecial = e.grandfather > 0 && !desc && sibsActive > 0;
    const prelimFixed = () => sum(KEYS.map(k => share[k]));
    let gfPool = null; // {members:[{key,units}]}
    const kal = tr('ref.kalalah');

    if (gfSpecial) {
      flags.grandfather = true;
      const F = prelimFixed();
      const R = ONE.sub(F);
      // Paternal siblings are still counted against the grandfather even when a full sibling shuts them out
      // of the final distribution (Zayd's "mu'addah" principle); their portion goes to the full siblings.
      const pb = c.paternalBrother, ps = c.paternalSister;
      const units = e.fullBrother * 2 + e.fullSister + pb * 2 + ps;
      const sisterKeys = e.fullSister + e.fullBrother > 0 ? ['fullSister'] : ['paternalSister'];
      if (brothers === 0 && F.add(fr(1, 6)).cmp(ONE) >= 0) {
        // Akdariyya: the grandfather and the sisters pool their shares after 'Awl
        flags.akdariyya = true;
        const sk = sisterKeys[0];
        addFixed('grandfather', fr(1, 6), tr('akd.gf'), rn('23a'));
        if (e[sk] === 1) addFixed(sk, fr(1, 2), tr('akd.s1'), kal);
        else addFixed(sk, fr(2, 3), tr('akd.s2'), kal);
        gfPool = { members: [{ key: 'grandfather', units: 2 }, { key: sk, units: e[sk] }] };
        fixedStep.lines.push(tr('akd.note'));
      } else {
        const A = fr(1, 6), Bv = R.div(fr(3)), C = R.mul(fr(2, 2 + units));
        const best = maxF(A, Bv, C);
        const gfs = best.cmp(R) > 0 ? R : best;
        fixedStep.lines.push(tr('gf.opts', { F, R, A, B: Bv, C, tot: 2 + units, gfs }));
        addFixed('grandfather', gfs, tr('gf.best', { gfs }), rn('23'));
        const left = R.sub(gfs);
        if (left.isZero()) fixedStep.lines.push(tr('gf.none'));
        else if (e.fullBrother > 0) {
          const members = [{ key: 'fullBrother', units: 2 * e.fullBrother }];
          if (e.fullSister) members.push({ key: 'fullSister', units: e.fullSister });
          const tu = members.reduce((a, m) => a + m.units, 0);
          members.forEach(m => addFixed(m.key, left.mul(fr(m.units, tu)), tr('gf.fullb', { left }), kal));
        } else if (e.fullSister > 0) {
          const cap = e.fullSister === 1 ? fr(1, 2) : fr(2, 3);
          const fsShare = left.cmp(cap) > 0 ? cap : left;
          addFixed('fullSister', fsShare, tr('gf.fulls', { left, cap }), kal);
          const rest = left.sub(fsShare);
          if (rest.pos() && (pb + ps) > 0) {
            const tu = pb * 2 + ps;
            if (pb) addFixed('paternalBrother', rest.mul(fr(pb * 2, tu)), tr('gf.pat', { rest }), kal);
            if (ps) addFixed('paternalSister', rest.mul(fr(ps, tu)), tr('gf.pat', { rest }), kal);
          }
        } else {
          const members = [];
          if (pb) members.push({ key: 'paternalBrother', units: 2 * pb });
          if (ps) members.push({ key: 'paternalSister', units: ps });
          const tu = members.reduce((a, m) => a + m.units, 0);
          members.forEach(m => addFixed(m.key, left.mul(fr(m.units, tu)), tr('gf.pat2', { left }), kal));
        }
      }
    } else {
      /* full sisters */
      if (e.fullSister > 0 && e.fullBrother === 0 && !(e.grandfather && desc)) {
        if (!desc && !e.grandfather) {
          if (e.fullSister === 1) addFixed('fullSister', fr(1, 2), tr('fs1'), rf('ref.kalalah', '10a'));
          else addFixed('fullSister', fr(2, 3), tr('fs2', { n: e.fullSister }), rf('ref.kalalah', '10b'));
        } // with female descendants she is a residuary instead (see below)
      }
      /* paternal sisters */
      if (e.paternalSister > 0 && e.paternalBrother === 0 && !desc && !e.grandfather) {
        if (e.fullSister === 0) {
          if (e.paternalSister === 1) addFixed('paternalSister', fr(1, 2), tr('ps1'), rn('11a'));
          else addFixed('paternalSister', fr(2, 3), tr('ps2', { n: e.paternalSister }), rn('11b'));
        } else if (e.fullSister === 1) {
          addFixed('paternalSister', fr(1, 6), tr('ps3'), tr('rules', { n: '11c, 30f' }));
        } else {
          fixedStep.lines.push(tr('ps.excl', { name: L('paternalSister', c.paternalSister) }));
        }
      }
    }

    if (!fixedStep.lines.length) fixedStep.lines.push(tr('fixed.none'));

    /* --- totals --- */
    const T0 = prelimFixed();
    const fixedHolders = KEYS.filter(k => share[k].pos());
    if (fixedHolders.length) {
      let LD = 1n; fixedHolders.forEach(k => { LD = lcm(LD, share[k].d); });
      const parts = fixedHolders.map(k => `${share[k]}`).join(' + ');
      const conv = fixedHolders.map(k => `${share[k].n * (LD / share[k].d)}/${LD}`).join(' + ');
      const tot = T0.n * (LD / T0.d);
      S(tr('s4.title'), [
        ltr(`${parts} = ${fixedHolders.length > 1 ? conv + ' = ' : ''}${tot}/${LD}${T0.d === 1n ? '' : ' = ' + T0}`),
        T0.cmp(ONE) > 0 ? tr('s4.more', { T: T0 }) : T0.cmp(ONE) < 0 ? tr('s4.less', { T: T0, R: ONE.sub(T0) }) : tr('s4.exact')]);
    } else {
      S(tr('s4.title'), [tr('s4.nofixed')]);
    }

    /* --- Awl --- */
    if (T0.cmp(ONE) > 0) {
      flags.awal = true;
      const lines = [tr('awal.intro', { T: T0, inv: ONE.div(T0) })];
      KEYS.forEach(k => {
        if (!share[k].pos()) return;
        const before = share[k]; share[k] = before.div(T0);
        const expr = ltr(`${before} ÷ ${T0} = ${share[k]}`);
        why[k].push({ type: 'awal', amount: share[k], text: tr('awal.why', { expr }) });
        lines.push(`${L(k, c[k])}: ${expr}`);
      });
      if (gfPool) {
        const pool = sum(gfPool.members.map(m => share[m.key]));
        const tu = gfPool.members.reduce((a, m) => a + m.units, 0);
        lines.push(tr('pool.line', { pool, tu }));
        gfPool.members.forEach(m => {
          share[m.key] = pool.mul(fr(m.units, tu));
          const expr = ltr(`${pool} × ${m.units}/${tu} = ${share[m.key]}`);
          why[m.key].push({ type: 'pool', amount: share[m.key], text: tr('pool.why', { expr }) });
          lines.push(`${L(m.key, c[m.key])}: ${expr}`);
        });
      }
      S(tr('s5awal.title'), lines, 'awal');
    } else if (T0.cmp(ONE) < 0) {
      const remainder = ONE.sub(T0);
      const members = pickResiduary(e, femaleOnlyDesc);
      if (members && members.length) {
        const lines = [];
        const tu = members.reduce((a, m) => a + m.units, 0);
        const names = list(members.map(m => `${e[m.key]} ${L(m.key, e[m.key])}`));
        lines.push(tr('res.line', { T: T0, R: remainder, names }));
        if (members.length > 1 || members[0].multiple) lines.push(tr('res.ratio', { tu }));
        members.forEach(m => {
          const f = remainder.mul(fr(m.units, tu));
          share[m.key] = share[m.key].add(f);
          const t = (members.length > 1 || m.units !== 1) ? tr('res.part', { u: m.units, tu, R: remainder, f }) : tr('res.whole', { R: remainder });
          const note = tr(m.note);
          why[m.key].push({ type: 'residue', amount: f, text: tr('res.why', { t }), ref: note });
          lines.push(`${L(m.key, c[m.key])}: ${t}${e[m.key] > 1 ? tr('res.group', { each: f.div(fr(e[m.key])) }) : ''} — ${note}`);
        });
        S(tr('s5res.title'), lines, 'residue');
      } else {
        /* no residuary: radd */
        flags.radd = true;
        const spouseKeys = ['husband', 'wife'];
        const others = KEYS.filter(k => !spouseKeys.includes(k) && share[k].pos());
        const sp = sum(spouseKeys.map(k => share[k]));
        const so = sum(others.map(k => share[k]));
        const lines = [];
        if (others.length) {
          const room = ONE.sub(sp);
          lines.push(tr('radd.intro', { T: T0, R: remainder }));
          lines.push(tr('radd.mult', { so, room, f: room.div(so) }));
          others.forEach(k => {
            const before = share[k]; share[k] = before.mul(room).div(so);
            const expr = ltr(`${before} × ${room}/${so} = ${share[k]}`);
            why[k].push({ type: 'radd', amount: share[k], text: tr('radd.why', { expr }) });
            lines.push(`${L(k, c[k])}: ${expr}`);
          });
        } else if (spouses) {
          lines.push(tr('radd.sp', { R: remainder }));
          spouseKeys.forEach(k => {
            if (!share[k].pos()) return;
            const before = share[k]; share[k] = ONE;
            why[k].push({ type: 'radd', amount: ONE.sub(before), text: tr('radd.spwhy', { R: remainder }) });
            lines.push(`${L(k, c[k])}: ${ltr(`${before} + ${remainder} = 1`)}`);
          });
        } else {
          flags.bayt = true;
          lines.push(tr('bayt'));
        }
        S(tr('s5radd.title'), lines, 'radd');
      }
    } else {
      /* total == 1: Himariyya check */
      if (e.fullBrother > 0 && mat > 0) {
        flags.himariyya = true;
        const keys = ['maternalBrother', 'maternalSister', 'fullBrother', 'fullSister'];
        const heads = keys.reduce((a, k) => a + e[k], 0);
        const lines = [tr('him.line', { m: matShare, h: heads, each: matShare.div(fr(heads)) })];
        keys.forEach(k => {
          if (!e[k]) return;
          const f = matShare.mul(fr(e[k], heads));
          share[k] = f;
          const expr = ltr(`${matShare} × ${e[k]}/${heads} = ${f}`);
          why[k].push({ type: 'special', amount: f, text: tr('him.why', { expr }), ref: rn('22') });
          lines.push(`${L(k, c[k])}: ${f}`);
        });
        S(tr('him.title'), lines, 'special');
      } else {
        S(tr('s5none.title'), [tr('s5none.text')]);
      }
    }

    if (flags.grandfather && !flags.akdariyya) S(tr('note.gf.title'), [tr('note.gf.text')], 'special');
    if (flags.umar) S(tr('note.umar.title'), [tr('note.umar.text')], 'special');

    /* --- final --- */
    const total = sum(KEYS.map(k => share[k]));
    const heirs = KEYS.filter(k => c[k] > 0).map(k => ({
      key: k, label: L(k, c[k]), count: c[k], total: share[k],
      each: share[k].div(fr(c[k])), blocked: blk[k] || null, reasons: why[k],
      excluded: (k === 'granddaughter' && granddaughterExcluded) ||
        (k === 'paternalSister' && !share[k].pos() && !blk[k] && e.fullSister >= 2 && !desc && e.paternalBrother === 0),
    }));
    const fin = [tr('final.head')];
    heirs.forEach(h => fin.push(`${h.label}: ${h.total} (${h.total.pct()})${h.count > 1 ? tr('final.each', { each: h.each }) : ''}`));
    fin.push(tr('final.total', { T: total }) + (total.eq(ONE) ? ' ✓' : ''));
    S(tr('final.title'), fin, 'final');

    return { counts: c, heirs, steps, flags, blocked: blockedList, total, lang };
  }

  function pickResiduary(e, femaleOnlyDesc) {
    const pair = (m, f, note) => {
      const out = [];
      if (e[m]) out.push({ key: m, units: 2 * e[m], note });
      if (e[f]) out.push({ key: f, units: e[f], note });
      return out;
    };
    if (e.son) return pair('son', 'daughter', 'r.son');
    if (e.grandson) return pair('grandson', 'granddaughter', 'r.r15');
    if (e.father) return [{ key: 'father', units: 1, note: 'r.father' }];
    if (e.fullBrother) return pair('fullBrother', 'fullSister', 'r.fb');
    if (e.fullSister && femaleOnlyDesc) return [{ key: 'fullSister', units: e.fullSister, multiple: e.fullSister > 1, note: 'r.sister' }];
    if (e.paternalBrother) return pair('paternalBrother', 'paternalSister', 'r.r15');
    if (e.paternalSister && femaleOnlyDesc) return [{ key: 'paternalSister', units: e.paternalSister, multiple: e.paternalSister > 1, note: 'r.sister' }];
    if (e.grandfather) return [{ key: 'grandfather', units: 1, note: 'r.gf' }];
    for (const k of FAR) if (e[k]) return [{ key: k, units: e[k], multiple: e[k] > 1, note: 'r.far' }];
    if (e.emancipator) return [{ key: 'emancipator', units: 1, note: 'r.eman' }];
    return null;
  }

  const api = { calculate, HEIRS, KEYS, Fr, fr, ONE, ZERO, label: lab };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Faraid = api;
})(typeof window !== 'undefined' ? window : globalThis);
