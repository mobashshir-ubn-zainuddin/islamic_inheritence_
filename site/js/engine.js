/* Islamic Inheritance (Fara'id) engine.
 * Implements the rulings in rules_of_inheritence.txt. Exact rational arithmetic (BigInt),
 * every decision is recorded as a human-readable step so the UI can explain it.
 * Works in the browser (window.Faraid) and in Node (module.exports).
 */
(function (root) {
  'use strict';

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
  const lab = (k, n) => (n > 1 && HEIRS[k].plural) ? HEIRS[k].plural : HEIRS[k].label;
  const joinList = (a) => a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

  const REF = {
    spouse: "Qur’an, An-Nisa 4:12",
    child: "Qur’an, An-Nisa 4:11",
    kalalah: "Qur’an, An-Nisa 4:176",
  };

  /* ---------- blocking (hajb), Rule 13 ---------- */
  function computeBlocking(c) {
    const has = (k) => (c[k] || 0) > 0;
    const blk = {};
    const B = (targets, by, rule, note) => targets.forEach(t => { if (has(t) && !blk[t]) blk[t] = { by, rule, note }; });
    const offspring = has('son') || has('daughter') || has('grandson') || has('granddaughter');
    const femaleOffspringOnly = (has('daughter') || has('granddaughter')) && !has('son') && !has('grandson');

    if (has('son')) B(['grandson', 'granddaughter', ...SIBS, ...FAR, 'emancipator'], ['son'], '13a',
      'A son is a nearer residuary than anyone in this line');
    if (has('grandson') && !blk.grandson) B([...SIBS, ...FAR, 'emancipator'], ['grandson'], '13b',
      "A son's son stands in for a son, so he shuts out siblings and the wider relatives");
    if (offspring) B(['maternalBrother', 'maternalSister'],
      [has('son') ? 'son' : has('grandson') ? 'grandson' : has('daughter') ? 'daughter' : 'granddaughter'], '12',
      'Maternal siblings inherit only when the deceased leaves no children or grandchildren (Kalalah)');
    if (has('father')) B(['grandfather', 'paternalGrandmother', ...SIBS, ...FAR, 'emancipator'], ['father'], '13c, 34',
      'The father is the nearest male ascendant');
    if (has('mother')) B(['paternalGrandmother', 'maternalGrandmother'], ['mother'], '13d',
      'A mother shuts out both grandmothers');
    if (has('grandfather') && !blk.grandfather) {
      B(['maternalBrother', 'maternalSister'], ['grandfather'], '12',
        'Maternal siblings inherit only when there is no father or paternal grandfather');
      B([...FAR, 'emancipator'], ['grandfather'], '13e', 'The grandfather is nearer than nephews, uncles and cousins');
    }
    if (has('fullBrother') && !blk.fullBrother) B(['paternalBrother', 'paternalSister', ...FAR, 'emancipator'], ['fullBrother'], '13f',
      'A full brother is nearer than half-siblings and the wider relatives');
    if (has('fullSister') && !blk.fullSister && femaleOffspringOnly) B(['paternalBrother', 'paternalSister', ...FAR, 'emancipator'], ['fullSister'], '13g',
      'With a daughter present the full sister becomes a residuary (‘asabah ma‘a ghayrihi) and so shuts out the weaker line');
    if (has('paternalBrother') && !blk.paternalBrother) B([...FAR, 'emancipator'], ['paternalBrother'], '13h',
      'A paternal brother is nearer than nephews, uncles and cousins');
    if (has('paternalSister') && !blk.paternalSister) {
      const sisters = (blk.fullSister ? 0 : c.fullSister || 0) + c.paternalSister;
      if (femaleOffspringOnly || sisters >= 2) B([...FAR, 'emancipator'], ['paternalSister'], '13i',
        'The paternal sister takes the residue and so shuts out the wider relatives');
    }
    // the male residuary chain: nearer blocks farther (13j-t)
    const chain = [...FAR];
    for (let i = 0; i < chain.length; i++) {
      if (has(chain[i]) && !blk[chain[i]]) B([...chain.slice(i + 1), 'emancipator'], [chain[i]], '13j-t',
        'A nearer male relative in the residuary order shuts out all who are farther');
    }
    return blk;
  }

  /* ---------- main entry ---------- */
  function calculate(input) {
    const c = {};
    KEYS.forEach(k => { c[k] = Math.max(0, parseInt((input.counts || {})[k], 10) || 0); });
    const steps = [];
    const S = (title, lines, kind) => { const st = { title, lines: [], kind: kind || 'info' }; (lines || []).forEach(l => st.lines.push(l)); steps.push(st); return st; };
    const flags = { awal: false, radd: false, umar: false, himariyya: false, grandfather: false, akdariyya: false, bayt: false };

    const present = KEYS.filter(k => c[k] > 0);
    if (!present.length) {
      S('No heirs', ['No heir was selected. If the deceased has absolutely no relatives, the entire estate goes to the Islamic state / public treasury (Bayt al-Mal) — Rule 27.']);
      return { counts: c, heirs: [], steps, flags: { ...flags, bayt: true }, blocked: [], total: ZERO };
    }

    const heirsLine = present.map(k => `${c[k]} ${lab(k, c[k])}`);
    S('Step 1 – The heirs', [`The deceased left behind: ${joinList(heirsLine)}.`,
      'The estate is divided in three layers: (1) fixed Qur’anic shares (Ashab al-Furud), (2) the remainder to the nearest male-line relatives (‘Asabah / Ta’seeb), (3) if shares fall short or exceed the whole, Radd or ‘Awl.']);

    /* --- blocking --- */
    const blk = computeBlocking(c);
    const e = {};
    KEYS.forEach(k => { e[k] = blk[k] ? 0 : c[k]; });
    const blockedList = Object.keys(blk).map(k => ({ key: k, count: c[k], by: blk[k].by, rule: blk[k].rule, note: blk[k].note }));
    if (blockedList.length) {
      S('Step 2 – Who is blocked (Hajb)', blockedList.map(b =>
        `${b.count} ${lab(b.key, b.count)} receive nothing — blocked by ${joinList(b.by.map(x => HEIRS[x].label))}. ${b.note}. (Rule ${b.rule})`));
    } else {
      S('Step 2 – Who is blocked (Hajb)', ['Nobody is blocked; every heir present is entitled to inherit.']);
    }

    /* --- helpers --- */
    const share = {}; const why = {};
    KEYS.forEach(k => { share[k] = ZERO; why[k] = []; });
    const fixedStep = S('Step 3 – Fixed (prescribed) shares', [], 'fixed');
    const fixedKeys = new Set();
    const addFixed = (k, f, text, ref) => {
      share[k] = share[k].add(f); fixedKeys.add(k);
      why[k].push({ type: 'fixed', amount: f, text, ref });
      fixedStep.lines.push(`${lab(k, c[k])}${c[k] > 1 ? ' (' + c[k] + ')' : ''}: ${f} — ${text}${ref ? ' [' + ref + ']' : ''}`);
    };
    const addFixedGroup = (keys, f, text, ref) => { // equal split of f between listed keys by head
      const heads = keys.reduce((a, k) => a + e[k], 0);
      keys.forEach(k => { if (e[k] > 0) addFixed(k, f.mul(fr(e[k], heads)), text + (keys.filter(x => e[x] > 0).length > 1 || e[k] > 1 ? ` (total ${f} shared equally per head)` : ''), ref); });
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
      addFixed('husband', f, desc ? 'the deceased left children/grandchildren, so the husband gets 1/4' : 'the deceased left no children/grandchildren, so the husband gets 1/2', REF.spouse + ' (Rule 1)');
      spouseShare = f;
    }
    if (e.wife) {
      const f = desc ? fr(1, 8) : fr(1, 4);
      addFixed('wife', f, (desc ? 'the deceased left children/grandchildren, so the wife (or all wives together) get 1/8' : 'the deceased left no children/grandchildren, so the wife (or all wives together) get 1/4') + (e.wife > 1 ? `; shared equally by ${e.wife} wives = ${f.div(fr(e.wife))} each` : ''), REF.spouse + ' (Rule 2)');
      spouseShare = f;
    }

    /* descendants */
    if (e.son === 0) {
      if (c.daughter === 1) addFixed('daughter', fr(1, 2), 'a single daughter with no son gets 1/2', REF.child + ' (Rule 3a)');
      else if (c.daughter >= 2) addFixed('daughter', fr(2, 3), `${c.daughter} daughters with no son share 2/3 equally (${fr(2, 3).div(fr(c.daughter))} each)`, REF.child + ' (Rule 3b)');
    }
    let granddaughterExcluded = false;
    if (e.granddaughter > 0 && e.grandson === 0) {
      if (c.daughter === 0) {
        if (e.granddaughter === 1) addFixed('granddaughter', fr(1, 2), "a single son's daughter, with no child and no son's son, gets 1/2", 'Rule 4a');
        else addFixed('granddaughter', fr(2, 3), `${e.granddaughter} son's daughters, with no child and no son's son, share 2/3 equally`, 'Rule 4b');
      } else if (c.daughter === 1) {
        addFixed('granddaughter', fr(1, 6), "with exactly one daughter (who took 1/2), the son's daughter(s) complete the two-thirds with 1/6" + (e.granddaughter > 1 ? ' shared equally' : ''), 'Rule 4c, 30f');
      } else {
        granddaughterExcluded = true;
        fixedStep.lines.push(`${lab('granddaughter', c.granddaughter)}: nothing — the daughters already take the full 2/3 and there is no son's son to make the granddaughter a residuary (Rule 4).`);
      }
    }

    /* parents */
    const hearsGM = (e.paternalGrandmother + e.maternalGrandmother) > 0;
    if (e.mother) {
      if (spouses && e.father && !desc && sibCount < 2) {
        flags.umar = true;
        const rem = ONE.sub(spouseShare);
        const f = rem.div(fr(3));
        addFixed('mother', f, `Umar’s ruling (‘Umariyyatayn): with a spouse, both parents, no children and fewer than two siblings, the mother gets 1/3 of what is left after the spouse (1/3 × ${rem} = ${f}), and the father takes the rest`, 'Rule 21');
      } else if (desc) addFixed('mother', fr(1, 6), 'the deceased left children/grandchildren, so the mother gets 1/6', REF.child + ' (Rule 6b)');
      else if (sibCount >= 2) addFixed('mother', fr(1, 6), `the deceased left ${sibCount} brothers/sisters (two or more), which reduces the mother to 1/6`, REF.child + ' (Rule 6b, 32)');
      else addFixed('mother', fr(1, 3), 'no children and not more than one brother/sister, so the mother gets 1/3', REF.child + ' (Rule 6a)');
    }
    if (e.father && desc) addFixed('father', fr(1, 6), 'the deceased left children/grandchildren, so the father gets 1/6' + (maleDesc ? '' : ' (plus any remainder, as a residuary, if one is left)'), REF.child + ' (Rule 5)');
    if (e.grandfather && desc) addFixed('grandfather', fr(1, 6), 'with no father, the grandfather stands in for the father: 1/6 because there are children/grandchildren' + (maleDesc ? '' : ' (plus any remainder if no nearer residuary exists)'), 'Rule 7, 38');

    /* grandmothers */
    if (hearsGM) {
      const keys = ['paternalGrandmother', 'maternalGrandmother'].filter(k => e[k] > 0);
      addFixedGroup(keys, fr(1, 6), keys.length > 1
        ? 'the grandmothers (no mother present) share a total of 1/6 equally, i.e. 1/12 each'
        : 'a grandmother (no mother present) gets 1/6', 'Rules 8, 9');
    }

    /* maternal siblings */
    const mat = e.maternalBrother + e.maternalSister;
    let matShare = ZERO;
    if (mat > 0) {
      matShare = mat === 1 ? fr(1, 6) : fr(1, 3);
      addFixedGroup(['maternalBrother', 'maternalSister'], matShare,
        mat === 1 ? 'a single maternal half-sibling gets 1/6 (no children, no father or grandfather)' : `${mat} maternal half-siblings share 1/3 equally — males and females get the same, no 2:1 (Rule 33)`, REF.child.replace('4:11', '4:12') + ' (Rule 12)');
    }

    /* siblings: fixed shares, or the grandfather special case */
    const brothers = e.fullBrother + e.paternalBrother;
    const sibsActive = e.fullBrother + e.fullSister + e.paternalBrother + e.paternalSister;
    const gfSpecial = e.grandfather > 0 && !desc && sibsActive > 0;
    const prelimFixed = () => sum(KEYS.map(k => share[k]));
    let gfPool = null; // {members:[{key,units}], pool: Fr}

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
        addFixed('grandfather', fr(1, 6), 'with no father/children, the grandfather’s base share is 1/6', 'Rule 23a');
        if (e[sk] === 1) addFixed(sk, fr(1, 2), 'the sister’s nominal share is 1/2 (the sisters are first treated as a fixed-share heir)', REF.kalalah);
        else addFixed(sk, fr(2, 3), 'the sisters’ nominal share is 2/3', REF.kalalah);
        gfPool = { members: [{ key: 'grandfather', units: 2 }, { key: sk, units: e[sk] }] };
        fixedStep.lines.push('↳ This is the “Disturbing case” (Akdariyya): after ‘Awl, the grandfather and sister(s) pool their shares and re-divide them 2 : 1 (Rule 18a, 24).');
      } else {
        const A = fr(1, 6), Bv = R.div(fr(3)), C = R.mul(fr(2, 2 + units));
        const best = maxF(A, Bv, C);
        const gfs = best.cmp(R) > 0 ? R : best;
        fixedStep.lines.push(`Grandfather with brothers/sisters (Rule 23): remainder after other fixed shares R = 1 − ${F} = ${R}. Options: A = 1/6 of the estate = ${A}; B = 1/3 of R = ${Bv}; C = share as a brother (grandfather counts as 2 parts, brother 2, sister 1 — ${2}/${2 + units} of R) = ${C}. The grandfather takes the largest: ${gfs}.`);
        addFixed('grandfather', gfs, `the grandfather takes the best of A, B, C (Rule 23d) = ${gfs}`, 'Rule 23');
        const left = R.sub(gfs);
        if (left.isZero()) fixedStep.lines.push('Nothing remains for the brothers and sisters after the grandfather and the other fixed heirs.');
        else if (e.fullBrother > 0) {
          const members = [{ key: 'fullBrother', units: 2 * e.fullBrother }];
          if (e.fullSister) members.push({ key: 'fullSister', units: e.fullSister });
          const tu = members.reduce((a, m) => a + m.units, 0);
          members.forEach(m => addFixed(m.key, left.mul(fr(m.units, tu)), `the full brothers/sisters share the rest (${left}) in the ratio male : female = 2 : 1 (Rule 23c); half-siblings were counted against the grandfather but receive nothing`, REF.kalalah));
        } else if (e.fullSister > 0) {
          const cap = e.fullSister === 1 ? fr(1, 2) : fr(2, 3);
          const fsShare = left.cmp(cap) > 0 ? cap : left;
          addFixed('fullSister', fsShare, `the full sister(s) take the rest (${left}) but never more than their own fixed share ${cap}`, REF.kalalah);
          const rest = left.sub(fsShare);
          if (rest.pos() && (pb + ps) > 0) {
            const tu = pb * 2 + ps;
            if (pb) addFixed('paternalBrother', rest.mul(fr(pb * 2, tu)), `the paternal half-siblings share what is left (${rest}) 2 : 1 (Rules 15, 23d)`, REF.kalalah);
            if (ps) addFixed('paternalSister', rest.mul(fr(ps, tu)), `the paternal half-siblings share what is left (${rest}) 2 : 1 (Rules 15, 23d)`, REF.kalalah);
          }
        } else {
          const members = [];
          if (pb) members.push({ key: 'paternalBrother', units: 2 * pb });
          if (ps) members.push({ key: 'paternalSister', units: ps });
          const tu = members.reduce((a, m) => a + m.units, 0);
          members.forEach(m => addFixed(m.key, left.mul(fr(m.units, tu)), `the paternal half-siblings share the rest (${left}) in the ratio male : female = 2 : 1 (Rule 23c)`, REF.kalalah));
        }
      }
    } else {
      /* full sisters */
      if (e.fullSister > 0 && e.fullBrother === 0 && !(e.grandfather && desc)) {
        if (!desc && !e.grandfather) {
          if (e.fullSister === 1) addFixed('fullSister', fr(1, 2), 'a single full sister, with no children, no father/grandfather and no full brother, gets 1/2', REF.kalalah + ' (Rule 10a)');
          else addFixed('fullSister', fr(2, 3), `${e.fullSister} full sisters (no children, no male ancestor, no full brother) share 2/3 equally`, REF.kalalah + ' (Rule 10b)');
        } // with female descendants she is a residuary instead (see below)
      }
      /* paternal sisters */
      if (e.paternalSister > 0 && e.paternalBrother === 0 && !desc && !e.grandfather) {
        if (e.fullSister === 0) {
          if (e.paternalSister === 1) addFixed('paternalSister', fr(1, 2), 'a single paternal half-sister, with no full siblings, no paternal brother, no children and no male ancestor, gets 1/2', 'Rule 11a');
          else addFixed('paternalSister', fr(2, 3), `${e.paternalSister} paternal half-sisters share 2/3 equally`, 'Rule 11b');
        } else if (e.fullSister === 1) {
          addFixed('paternalSister', fr(1, 6), 'with exactly one full sister (who took 1/2), the paternal half-sister(s) complete the two-thirds with 1/6', 'Rule 11c, 30f');
        } else {
          fixedStep.lines.push(`${lab('paternalSister', c.paternalSister)}: nothing — the full sisters already take 2/3 and there is no paternal brother to make her a residuary (Rule 11).`);
        }
      }
    }

    if (!fixedStep.lines.length) fixedStep.lines.push('No heir here receives a fixed Qur’anic share — everything goes to the residuary heirs (‘Asabah).');

    /* --- totals --- */
    const T0 = prelimFixed();
    const fixedHolders = KEYS.filter(k => share[k].pos());
    if (fixedHolders.length) {
      let L = 1n; fixedHolders.forEach(k => { L = lcm(L, share[k].d); });
      const parts = fixedHolders.map(k => `${share[k]}`).join(' + ');
      const conv = fixedHolders.map(k => `${share[k].n * (L / share[k].d)}/${L}`).join(' + ');
      const tot = T0.n * (L / T0.d);
      S('Step 4 – Adding the fixed shares', [
        `${parts} = ${fixedHolders.length > 1 ? conv + ' = ' : ''}${tot}/${L}${T0.d === 1n ? '' : ' = ' + T0}`,
        T0.cmp(ONE) > 0 ? `The total ${T0} is MORE than 1 — this is a case of ‘Awl (shares must be scaled down).`
          : T0.cmp(ONE) < 0 ? `The total ${T0} is LESS than 1 — a remainder of ${ONE.sub(T0)} is left over.`
            : 'The total is exactly 1 — the estate is fully distributed.']);
    } else {
      S('Step 4 – Adding the fixed shares', ['There are no fixed shares, so the whole estate (1) is a remainder for the residuary heirs.']);
    }

    /* --- Awl --- */
    if (T0.cmp(ONE) > 0) {
      flags.awal = true;
      const lines = [`‘Awl: each share is multiplied by 1 ÷ ${T0} = ${ONE.div(T0)}, so that the total becomes exactly 1 and every heir loses in the same proportion (Rule 18).`];
      KEYS.forEach(k => {
        if (!share[k].pos()) return;
        const before = share[k]; share[k] = before.div(T0);
        why[k].push({ type: 'awal', amount: share[k], text: `‘Awl: ${before} ÷ ${T0} = ${share[k]}` });
        lines.push(`${lab(k, c[k])}: ${before} ÷ ${T0} = ${share[k]}`);
      });
      if (gfPool) {
        flags.grandfather = true;
        const pool = sum(gfPool.members.map(m => share[m.key]));
        const tu = gfPool.members.reduce((a, m) => a + m.units, 0);
        lines.push(`Grandfather & sister(s) pool their shares: ${pool}, and divide it 2 : 1 — the grandfather gets 2/${tu}, the sisters 1 part each (Rule 18a).`);
        gfPool.members.forEach(m => {
          const before = share[m.key]; share[m.key] = pool.mul(fr(m.units, tu));
          why[m.key].push({ type: 'pool', amount: share[m.key], text: `pooled ${pool} × ${m.units}/${tu} = ${share[m.key]}` });
          lines.push(`${lab(m.key, c[m.key])}: ${pool} × ${m.units}/${tu} = ${share[m.key]}`);
        });
      }
      S('Step 5 – ‘Awl (proportional reduction)', lines, 'awal');
    } else if (T0.cmp(ONE) < 0) {
      /* --- Hmariyya (Rule 22) --- */
      let remainder = ONE.sub(T0);
      /* residuary choice */
      const members = pickResiduary(e, femaleOnlyDesc);
      if (members && members.length) {
        const lines = [];
        const tu = members.reduce((a, m) => a + m.units, 0);
        const names = joinList(members.map(m => `${e[m.key]} ${lab(m.key, e[m.key])}`));
        lines.push(`Remainder = 1 − ${T0} = ${remainder}. It goes to the nearest residuary: ${names} (Rule 14).`);
        if (members.length > 1 || members[0].multiple) lines.push(`Males receive double a female's share (2 : 1, Rule 15), so the remainder is cut into ${tu} equal parts.`);
        members.forEach(m => {
          const f = remainder.mul(fr(m.units, tu));
          share[m.key] = share[m.key].add(f);
          const t = (members.length > 1 || m.units !== 1) ? `${m.units}/${tu} of the remainder ${remainder} = ${f}` : `the whole remainder ${remainder}`;
          why[m.key].push({ type: 'residue', amount: f, text: `residuary (‘asabah): ${t}`, ref: m.note });
          lines.push(`${lab(m.key, c[m.key])}: ${t}${e[m.key] > 1 ? ' for the group, i.e. ' + f.div(fr(e[m.key])) + ' each' : ''}${m.note ? ' — ' + m.note : ''}`);
        });
        S('Step 5 – Remainder to the residuary heirs (Ta’seeb)', lines, 'residue');
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
          lines.push(`Remainder = 1 − ${T0} = ${remainder} and there is no residuary heir, so it is returned (Radd) to the fixed-share heirs in proportion to their shares — except the spouse, whose share stays fixed (Rules 19, 36, 37).`);
          lines.push(`Non-spouse shares total ${so}; they now share ${room}, so each share is multiplied by ${room} ÷ ${so} = ${room.div(so)}.`);
          others.forEach(k => {
            const before = share[k]; share[k] = before.mul(room).div(so);
            why[k].push({ type: 'radd', amount: share[k], text: `Radd: ${before} × ${room.div(so)} = ${share[k]}` });
            lines.push(`${lab(k, c[k])}: ${before} × ${room}/${so} = ${share[k]}`);
          });
        } else if (spouses) {
          lines.push(`Remainder ${remainder} and no other heir at all, so as a last resort the remainder returns to the spouse (Rule 26). (No distant relatives — Dhawu al-Arham — were entered; if there are any, they take precedence over this Radd, Rules 25 & 37.)`);
          spouseKeys.forEach(k => {
            if (!share[k].pos()) return;
            const before = share[k]; share[k] = ONE; why[k].push({ type: 'radd', amount: ONE.sub(before), text: `last-resort Radd of ${remainder} (Rule 26)` });
            lines.push(`${lab(k, c[k])}: ${before} + ${remainder} = 1`);
          });
        } else {
          flags.bayt = true;
          lines.push('There is no one to inherit the remainder; it goes to the Islamic state / Bayt al-Mal (Rule 27).');
        }
        S('Step 5 – Remainder is returned (Radd)', lines, 'radd');
      }
    } else {
      /* total == 1: Hmariyya check */
      if (e.fullBrother > 0 && mat > 0) {
        flags.himariyya = true;
        const keys = ['maternalBrother', 'maternalSister', 'fullBrother', 'fullSister'];
        const heads = keys.reduce((a, k) => a + e[k], 0);
        const lines = [`Nothing is left for the full brother(s), yet they are closer than the maternal half-siblings (Rule 22: a full brother cannot receive less than a maternal brother). So the maternal share ${matShare} is shared EQUALLY, per head, among ${heads} persons: ${matShare} ÷ ${heads} = ${matShare.div(fr(heads))} each (the Himariyya / Mushtarakah case).`];
        keys.forEach(k => {
          if (!e[k]) return;
          const f = matShare.mul(fr(e[k], heads));
          const before = share[k]; share[k] = f;
          why[k].push({ type: 'special', amount: f, text: `shares the maternal 1/3 equally per head: ${matShare} × ${e[k]}/${heads} = ${f}`, ref: 'Rule 22' });
          lines.push(`${lab(k, c[k])}: ${f}`);
        });
        S('Step 5 – Special case: full brothers share with maternal siblings', lines, 'special');
      } else {
        S('Step 5 – Remainder', ['There is no remainder; nothing further to distribute.']);
      }
    }

    /* grandfather special explanation if not Awal-related */
    if (flags.grandfather && !flags.akdariyya) {
      S('Note – Grandfather with brothers & sisters', ['The grandfather is treated like a brother but never receives less than the better of 1/6 of the estate and 1/3 of the remainder (Rule 23). Full-sister and paternal-sister fixed shares are set aside in this situation (Rule 23g).'], 'special');
    }
    if (flags.umar) S('Note – Umar’s ruling', ['Applied because the heirs are exactly: a spouse, both parents, and no children or multiple siblings (Rule 21).'], 'special');

    /* --- final --- */
    const total = sum(KEYS.map(k => share[k]));
    const heirs = KEYS.filter(k => c[k] > 0).map(k => ({
      key: k, label: lab(k, c[k]), count: c[k], total: share[k],
      each: share[k].div(fr(c[k])), blocked: blk[k] || null, reasons: why[k],
      excluded: (k === 'granddaughter' && granddaughterExcluded) ||
        (k === 'paternalSister' && !share[k].pos() && !blk[k] && e.fullSister >= 2 && !desc && e.paternalBrother === 0),
    }));
    const fin = ['Final shares (as a part of the whole estate):'];
    heirs.forEach(h => fin.push(`${h.label}: ${h.total} (${h.total.pct()})${h.count > 1 ? ' → ' + h.each + ' each' : ''}`));
    fin.push(`Total = ${total}${total.eq(ONE) ? ' ✓' : ''}`);
    S('Final result', fin, 'final');

    return { counts: c, heirs, steps, flags, blocked: blockedList, total };
  }

  function pickResiduary(e, femaleOnlyDesc) {
    const pair = (m, f, note) => {
      const out = [];
      if (e[m]) out.push({ key: m, units: 2 * e[m], note });
      if (e[f]) out.push({ key: f, units: e[f], note });
      return out;
    };
    if (e.son) return pair('son', 'daughter', 'Rule 15 (Qur’an 4:11)');
    if (e.grandson) return pair('grandson', 'granddaughter', 'Rule 15');
    if (e.father) return [{ key: 'father', units: 1, note: 'Rule 14 (the father is a residuary)' }];
    if (e.fullBrother) return pair('fullBrother', 'fullSister', 'Rule 15 (Qur’an 4:176)');
    if (e.fullSister && femaleOnlyDesc) return [{ key: 'fullSister', units: e.fullSister, multiple: e.fullSister > 1, note: 'the sister becomes a residuary with the daughter(s), Rule 38' }];
    if (e.paternalBrother) return pair('paternalBrother', 'paternalSister', 'Rule 15');
    if (e.paternalSister && femaleOnlyDesc) return [{ key: 'paternalSister', units: e.paternalSister, multiple: e.paternalSister > 1, note: 'the sister becomes a residuary with the daughter(s), Rule 38' }];
    if (e.grandfather) return [{ key: 'grandfather', units: 1, note: 'Rule 14 (the grandfather stands in for the father)' }];
    for (const k of FAR) if (e[k]) return [{ key: k, units: e[k], multiple: e[k] > 1, note: 'Rule 14 (nearest male relative in the residuary order)' }];
    if (e.emancipator) return [{ key: 'emancipator', units: 1, note: 'Rule 14 (emancipator)' }];
    return null;
  }

  const api = { calculate, HEIRS, KEYS, Fr, fr, ONE, ZERO };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Faraid = api;
})(typeof window !== 'undefined' ? window : globalThis);
