/* English / Urdu strings for the whole site (Arabic text is deliberately never translated).
 * Placeholders look like {name}. Works in the browser (window.I18N) and Node. */
(function (root) {
  'use strict';
  const D = {
    en: {}, ur: {},
  };
  const add = (key, en, ur) => { D.en[key] = en; D.ur[key] = ur; };

  /* ---------- heir names ---------- */
  const H = [
    ['husband', 'Husband', 'Husband', 'شوہر', 'شوہر'],
    ['wife', 'Wife', 'Wives', 'بیوی', 'بیویاں'],
    ['son', 'Son', 'Sons', 'بیٹا', 'بیٹے'],
    ['daughter', 'Daughter', 'Daughters', 'بیٹی', 'بیٹیاں'],
    ['grandson', "Son's Son (Grandson)", "Son's Sons", 'پوتا (بیٹے کا بیٹا)', 'پوتے'],
    ['granddaughter', "Son's Daughter (Granddaughter)", "Son's Daughters", 'پوتی (بیٹے کی بیٹی)', 'پوتیاں'],
    ['father', 'Father', 'Father', 'باپ', 'باپ'],
    ['mother', 'Mother', 'Mother', 'ماں', 'ماں'],
    ['grandfather', 'Paternal Grandfather', 'Paternal Grandfather', 'دادا (باپ کا باپ)', 'دادا'],
    ['paternalGrandmother', 'Paternal Grandmother', 'Paternal Grandmothers', 'دادی (باپ کی ماں)', 'دادیاں'],
    ['maternalGrandmother', 'Maternal Grandmother', 'Maternal Grandmothers', 'نانی (ماں کی ماں)', 'نانیاں'],
    ['fullBrother', 'Full Brother', 'Full Brothers', 'حقیقی بھائی', 'حقیقی بھائی'],
    ['fullSister', 'Full Sister', 'Full Sisters', 'حقیقی بہن', 'حقیقی بہنیں'],
    ['paternalBrother', 'Paternal Half-Brother', 'Paternal Half-Brothers', 'علاتی بھائی (باپ شریک)', 'علاتی بھائی'],
    ['paternalSister', 'Paternal Half-Sister', 'Paternal Half-Sisters', 'علاتی بہن (باپ شریک)', 'علاتی بہنیں'],
    ['maternalBrother', 'Maternal Half-Brother', 'Maternal Half-Brothers', 'اخیافی بھائی (ماں شریک)', 'اخیافی بھائی'],
    ['maternalSister', 'Maternal Half-Sister', 'Maternal Half-Sisters', 'اخیافی بہن (ماں شریک)', 'اخیافی بہنیں'],
    ['fullNephew', "Full Brother's Son", "Full Brother's Sons", 'حقیقی بھائی کا بیٹا (بھتیجا)', 'حقیقی بھتیجے'],
    ['paternalNephew', "Paternal Brother's Son", "Paternal Brother's Sons", 'علاتی بھائی کا بیٹا', 'علاتی بھائی کے بیٹے'],
    ['fullNephewSon', "Full Brother's Son's Son", "Full Brother's Son's Sons", 'حقیقی بھتیجے کا بیٹا', 'حقیقی بھتیجے کے بیٹے'],
    ['paternalNephewSon', "Paternal Brother's Son's Son", "Paternal Brother's Son's Sons", 'علاتی بھائی کے بیٹے کا بیٹا', 'علاتی بھائی کے بیٹے کے بیٹے'],
    ['fullUncle', "Father's Full Brother (Uncle)", "Father's Full Brothers", 'حقیقی چچا', 'حقیقی چچا'],
    ['paternalUncle', "Father's Paternal Brother (Uncle)", "Father's Paternal Brothers", 'علاتی چچا (باپ کا علاتی بھائی)', 'علاتی چچا'],
    ['fullCousin', "Full Uncle's Son (Cousin)", "Full Uncle's Sons", 'حقیقی چچا کا بیٹا (چچازاد)', 'حقیقی چچا کے بیٹے'],
    ['paternalCousin', "Paternal Uncle's Son (Cousin)", "Paternal Uncle's Sons", 'علاتی چچا کا بیٹا', 'علاتی چچا کے بیٹے'],
    ['fullCousinSon', "Full Cousin's Son", "Full Cousin's Sons", 'حقیقی چچازاد کا بیٹا', 'حقیقی چچازاد کے بیٹے'],
    ['paternalCousinSon', "Paternal Cousin's Son", "Paternal Cousin's Sons", 'علاتی چچازاد کا بیٹا', 'علاتی چچازاد کے بیٹے'],
    ['fullCousinSonSon', "Full Cousin's Son's Son", "Full Cousin's Son's Sons", 'حقیقی چچازاد کے بیٹے کا بیٹا', 'حقیقی چچازاد کے بیٹے کے بیٹے'],
    ['paternalCousinSonSon', "Paternal Cousin's Son's Son", "Paternal Cousin's Son's Sons", 'علاتی چچازاد کے بیٹے کا بیٹا', 'علاتی چچازاد کے بیٹے کے بیٹے'],
    ['emancipator', 'Emancipator (Mu‘tiq)', 'Emancipator (Mu‘tiq)', 'معتِق (آزاد کرنے والا)', 'معتِق (آزاد کرنے والا)'],
  ];
  H.forEach(([k, en, enp, ur, urp]) => { add('h.' + k, en, ur); add('hp.' + k, enp, urp); });

  /* ---------- engine: references ---------- */
  add('rule', 'Rule {n}', 'قاعدہ {n}');
  add('rules', 'Rules {n}', 'قواعد {n}');
  add('ref.spouse', 'Qur’an, An-Nisa 4:12', 'قرآن، سورۃ النساء 4:12');
  add('ref.child', 'Qur’an, An-Nisa 4:11', 'قرآن، سورۃ النساء 4:11');
  add('ref.kalalah', 'Qur’an, An-Nisa 4:176', 'قرآن، سورۃ النساء 4:176');
  add('ref.kalalah12', 'Qur’an, An-Nisa 4:12', 'قرآن، سورۃ النساء 4:12');
  add('and', ' and ', ' اور ');
  add('comma', ', ', '، ');

  /* ---------- engine: blocking notes ---------- */
  add('b.son', 'A son is a nearer residuary than anyone in this line', 'بیٹا اس سلسلے میں ہر کسی سے قریبی عصبہ ہے');
  add('b.grandson', "A son's son stands in for a son, so he shuts out siblings and the wider relatives", 'پوتا بیٹے کے قائم مقام ہے، اس لیے وہ بہن بھائیوں اور دور کے رشتہ داروں کو محروم کر دیتا ہے');
  add('b.offspring', 'Maternal siblings inherit only when the deceased leaves no children or grandchildren (Kalalah)', 'اخیافی بہن بھائی صرف اس وقت وارث ہوتے ہیں جب میت کی اولاد (بیٹا، بیٹی، پوتا، پوتی) نہ ہو (کلالہ)');
  add('b.father', 'The father is the nearest male ascendant', 'باپ سب سے قریبی مرد اصل ہے');
  add('b.mother', 'A mother shuts out both grandmothers', 'ماں دادی اور نانی دونوں کو محروم کر دیتی ہے');
  add('b.gf12', 'Maternal siblings inherit only when there is no father or paternal grandfather', 'اخیافی بہن بھائی اسی وقت وارث ہوتے ہیں جب باپ یا دادا نہ ہو');
  add('b.gf13', 'The grandfather is nearer than nephews, uncles and cousins', 'دادا بھتیجوں، چچاؤں اور چچازادوں سے قریب ہے');
  add('b.fb', 'A full brother is nearer than half-siblings and the wider relatives', 'حقیقی بھائی علاتی بہن بھائیوں اور دور کے رشتہ داروں سے قریب ہے');
  add('b.fs', 'With a daughter present the full sister becomes a residuary (‘asabah ma‘a ghayrihi) and so shuts out the weaker line', 'بیٹی کی موجودگی میں حقیقی بہن عصبہ مع غیرہ بن جاتی ہے، اس لیے وہ کمزور درجے والوں کو محروم کر دیتی ہے');
  add('b.pb', 'A paternal brother is nearer than nephews, uncles and cousins', 'علاتی بھائی بھتیجوں، چچاؤں اور چچازادوں سے قریب ہے');
  add('b.ps', 'The paternal sister takes the residue and so shuts out the wider relatives', 'علاتی بہن باقی مال لیتی ہے، اس لیے دور کے رشتہ داروں کو محروم کر دیتی ہے');
  add('b.chain', 'A nearer male relative in the residuary order shuts out all who are farther', 'عصبات کی ترتیب میں قریبی مرد رشتہ دار دور والوں کو محروم کر دیتا ہے');

  /* ---------- engine: steps ---------- */
  add('noheirs.title', 'No heirs', 'کوئی وارث نہیں');
  add('noheirs.text', 'No heir was selected. If the deceased has absolutely no relatives, the entire estate goes to the Islamic state / public treasury (Bayt al-Mal) — Rule 27.', 'کوئی وارث منتخب نہیں کیا گیا۔ اگر میت کا کوئی رشتہ دار بالکل نہ ہو تو پورا ترکہ اسلامی ریاست / بیت المال کو جاتا ہے — قاعدہ 27۔');
  add('s1.title', 'Step 1 – The heirs', 'مرحلہ 1 – ورثاء');
  add('s1.left', 'The deceased left behind: {list}.', 'میت نے پیچھے چھوڑا: {list}۔');
  add('s1.layers', 'The estate is divided in three layers: (1) fixed Qur’anic shares (Ashab al-Furud), (2) the remainder to the nearest male-line relatives (‘Asabah / Ta’seeb), (3) if shares fall short or exceed the whole, Radd or ‘Awl.', 'ترکہ تین مراحل میں تقسیم ہوتا ہے: (1) قرآن میں مقرر حصے (اصحاب الفروض)، (2) باقی مال قریب ترین مردانہ سلسلے کے رشتہ داروں کو (عصبہ / تعصیب)، (3) اگر حصے کم پڑیں تو رد اور اگر زیادہ ہو جائیں تو عول۔');
  add('s2.title', 'Step 2 – Who is blocked (Hajb)', 'مرحلہ 2 – کون محروم ہے (حجب)');
  add('s2.blocked', '{n} {name} receive nothing — blocked by {by}. {note}. (Rule {rule})', '{n} {name} کو کچھ نہیں ملے گا — {by} کی وجہ سے محروم۔ {note}۔ (قاعدہ {rule})');
  add('s2.none', 'Nobody is blocked; every heir present is entitled to inherit.', 'کوئی بھی محروم نہیں؛ موجود ہر وارث کو حصہ ملے گا۔');
  add('s3.title', 'Step 3 – Fixed (prescribed) shares', 'مرحلہ 3 – مقررہ حصے');
  add('grp.shared', ' (total {f} shared equally per head)', ' (کل {f} فی کس برابر تقسیم)');
  add('hus.desc', 'the deceased left children/grandchildren, so the husband gets 1/4', 'میت کی اولاد (یا پوتے پوتیاں) موجود ہے، اس لیے شوہر کو 1/4 ملے گا');
  add('hus.nodesc', 'the deceased left no children/grandchildren, so the husband gets 1/2', 'میت کی کوئی اولاد نہیں، اس لیے شوہر کو 1/2 ملے گا');
  add('wife.desc', 'the deceased left children/grandchildren, so the wife (or all wives together) get 1/8', 'اولاد موجود ہے، اس لیے بیوی (یا تمام بیویوں کو مجموعی طور پر) 1/8 ملے گا');
  add('wife.nodesc', 'the deceased left no children/grandchildren, so the wife (or all wives together) get 1/4', 'اولاد نہیں، اس لیے بیوی (یا تمام بیویوں کو مجموعی طور پر) 1/4 ملے گا');
  add('wife.each', '; shared equally by {n} wives = {each} each', '؛ {n} بیویوں میں برابر تقسیم = ہر ایک کو {each}');
  add('dau1', 'a single daughter with no son gets 1/2', 'اکیلی بیٹی کو، بیٹا نہ ہونے کی صورت میں، 1/2 ملے گا');
  add('dau2', '{n} daughters with no son share 2/3 equally ({each} each)', '{n} بیٹیاں، بیٹا نہ ہونے کی صورت میں، 2/3 میں برابر شریک ہیں (ہر ایک کو {each})');
  add('gd1', "a single son's daughter, with no child and no son's son, gets 1/2", 'اکیلی پوتی کو، جبکہ بیٹا، بیٹی اور پوتا نہ ہو، 1/2 ملے گا');
  add('gd2', "{n} son's daughters, with no child and no son's son, share 2/3 equally", '{n} پوتیاں، جبکہ بیٹا، بیٹی اور پوتا نہ ہو، 2/3 میں برابر شریک ہیں');
  add('gd3', "with exactly one daughter (who took 1/2), the son's daughter(s) complete the two-thirds with 1/6{shared}", 'جب صرف ایک بیٹی ہو (جس نے 1/2 لیا) تو پوتی (پوتیاں) 1/6 لے کر دو تہائی مکمل کرتی ہیں{shared}');
  add('gd3.shared', ' shared equally', ' (برابر تقسیم)');
  add('gd.excl', "{name}: nothing — the daughters already take the full 2/3 and there is no son's son to make the granddaughter a residuary (Rule 4).", '{name}: کچھ نہیں — بیٹیاں پورا 2/3 لے چکی ہیں اور پوتا موجود نہیں جو پوتی کو عصبہ بنائے (قاعدہ 4)۔');
  add('umar', 'Umar’s ruling (‘Umariyyatayn): with a spouse, both parents, no children and fewer than two siblings, the mother gets 1/3 of what is left after the spouse (1/3 × {rem} = {f}), and the father takes the rest', 'حضرت عمرؓ کا فیصلہ (عمریتین): جب شوہر/بیوی اور والدین ہوں، اولاد نہ ہو اور بہن بھائی دو سے کم ہوں تو ماں کو شوہر/بیوی کا حصہ نکال کر باقی کا 1/3 ملتا ہے (1/3 × {rem} = {f}) اور باقی باپ کو');
  add('mother.desc', 'the deceased left children/grandchildren, so the mother gets 1/6', 'اولاد موجود ہے، اس لیے ماں کو 1/6 ملے گا');
  add('mother.sib', 'the deceased left {n} brothers/sisters (two or more), which reduces the mother to 1/6', 'میت کے {n} بہن بھائی ہیں (دو یا زیادہ)، جس سے ماں کا حصہ گھٹ کر 1/6 رہ جاتا ہے');
  add('mother.third', 'no children and not more than one brother/sister, so the mother gets 1/3', 'اولاد نہیں اور ایک سے زیادہ بہن بھائی نہیں، اس لیے ماں کو 1/3 ملے گا');
  add('father.desc', 'the deceased left children/grandchildren, so the father gets 1/6{extra}', 'اولاد موجود ہے، اس لیے باپ کو 1/6 ملے گا{extra}');
  add('father.extra', ' (plus any remainder, as a residuary, if one is left)', ' (اور اگر کچھ باقی بچے تو عصبہ کی حیثیت سے وہ بھی ملے گا)');
  add('gf.desc', 'with no father, the grandfather stands in for the father: 1/6 because there are children/grandchildren{extra}', 'باپ نہ ہونے کی صورت میں دادا باپ کے قائم مقام ہے: اولاد کی موجودگی میں 1/6{extra}');
  add('gf.extra', ' (plus any remainder if no nearer residuary exists)', ' (اور اگر کوئی قریبی عصبہ نہ ہو تو باقی مال بھی)');
  add('gm.many', 'the grandmothers (no mother present) share a total of 1/6 equally, i.e. 1/12 each', 'دادی اور نانی (ماں موجود نہ ہو) مجموعی طور پر 1/6 میں برابر شریک ہیں، یعنی ہر ایک کو 1/12');
  add('gm.one', 'a grandmother (no mother present) gets 1/6', 'دادی/نانی کو (ماں نہ ہونے کی صورت میں) 1/6 ملے گا');
  add('mat.one', 'a single maternal half-sibling gets 1/6 (no children, no father or grandfather)', 'اکیلے اخیافی بہن/بھائی کو 1/6 ملے گا (اولاد، باپ اور دادا نہ ہوں)');
  add('mat.many', '{n} maternal half-siblings share 1/3 equally — males and females get the same, no 2:1 (Rule 33)', '{n} اخیافی بہن بھائی 1/3 میں برابر شریک ہیں — مرد و عورت کو یکساں حصہ، 2:1 نہیں (قاعدہ 33)');
  add('akd.gf', 'with no father/children, the grandfather’s base share is 1/6', 'باپ اور اولاد نہ ہونے کی صورت میں دادا کا بنیادی حصہ 1/6 ہے');
  add('akd.s1', 'the sister’s nominal share is 1/2 (the sisters are first treated as a fixed-share heir)', 'بہن کا ابتدائی حصہ 1/2 ہے (پہلے بہن کو صاحبِ فرض مانا جاتا ہے)');
  add('akd.s2', 'the sisters’ nominal share is 2/3', 'بہنوں کا ابتدائی حصہ 2/3 ہے');
  add('akd.note', '↳ This is the “Disturbing case” (Akdariyya): after ‘Awl, the grandfather and sister(s) pool their shares and re-divide them 2 : 1 (Rule 18a, 24).', '↳ یہ “اکدریہ” (پریشان کن مسئلہ) ہے: عول کے بعد دادا اور بہن (بہنیں) اپنے حصے جمع کر کے 2:1 کے تناسب سے دوبارہ تقسیم کرتے ہیں (قاعدہ 18a، 24)۔');
  add('gf.opts', 'Grandfather with brothers/sisters (Rule 23): remainder after other fixed shares R = 1 − {F} = {R}. Options: A = 1/6 of the estate = {A}; B = 1/3 of R = {B}; C = share as a brother (grandfather counts as 2 parts, brother 2, sister 1 — 2/{tot} of R) = {C}. The grandfather takes the largest: {gfs}.', 'دادا بہن بھائیوں کے ساتھ (قاعدہ 23): دوسرے مقررہ حصوں کے بعد باقی R = 1 − {F} = {R}۔ صورتیں: A = کل ترکے کا 1/6 = {A}؛ B = R کا 1/3 = {B}؛ C = بھائی کی طرح حصہ (دادا 2 حصے، بھائی 2، بہن 1 — R کا 2/{tot}) = {C}۔ دادا سب سے زیادہ لیتا ہے: {gfs}۔');
  add('gf.best', 'the grandfather takes the best of A, B, C (Rule 23d) = {gfs}', 'دادا A، B، C میں سے سب سے زیادہ لیتا ہے (قاعدہ 23d) = {gfs}');
  add('gf.none', 'Nothing remains for the brothers and sisters after the grandfather and the other fixed heirs.', 'دادا اور دیگر مقررہ حصہ داروں کے بعد بہن بھائیوں کے لیے کچھ نہیں بچتا۔');
  add('gf.fullb', 'the full brothers/sisters share the rest ({left}) in the ratio male : female = 2 : 1 (Rule 23c); half-siblings were counted against the grandfather but receive nothing', 'حقیقی بہن بھائی باقی ({left}) کو مرد : عورت = 2 : 1 کے تناسب سے تقسیم کرتے ہیں (قاعدہ 23c)؛ علاتی بہن بھائی دادا کے مقابلے میں شمار ہوئے مگر انہیں کچھ نہیں ملتا');
  add('gf.fulls', 'the full sister(s) take the rest ({left}) but never more than their own fixed share {cap}', 'حقیقی بہن (بہنیں) باقی ({left}) لیتی ہیں مگر اپنے مقررہ حصے {cap} سے زیادہ نہیں');
  add('gf.pat', 'the paternal half-siblings share what is left ({rest}) 2 : 1 (Rules 15, 23d)', 'علاتی بہن بھائی بچا ہوا ({rest}) 2 : 1 کے تناسب سے تقسیم کرتے ہیں (قواعد 15، 23d)');
  add('gf.pat2', 'the paternal half-siblings share the rest ({left}) in the ratio male : female = 2 : 1 (Rule 23c)', 'علاتی بہن بھائی باقی ({left}) کو مرد : عورت = 2 : 1 کے تناسب سے لیتے ہیں (قاعدہ 23c)');
  add('fs1', 'a single full sister, with no children, no father/grandfather and no full brother, gets 1/2', 'اکیلی حقیقی بہن کو، جبکہ اولاد، باپ/دادا اور حقیقی بھائی نہ ہو، 1/2 ملے گا');
  add('fs2', '{n} full sisters (no children, no male ancestor, no full brother) share 2/3 equally', '{n} حقیقی بہنیں (اولاد، مرد اصل اور حقیقی بھائی نہ ہو) 2/3 میں برابر شریک ہیں');
  add('ps1', 'a single paternal half-sister, with no full siblings, no paternal brother, no children and no male ancestor, gets 1/2', 'اکیلی علاتی بہن کو، جبکہ حقیقی بہن بھائی، علاتی بھائی، اولاد اور مرد اصل نہ ہوں، 1/2 ملے گا');
  add('ps2', '{n} paternal half-sisters share 2/3 equally', '{n} علاتی بہنیں 2/3 میں برابر شریک ہیں');
  add('ps3', 'with exactly one full sister (who took 1/2), the paternal half-sister(s) complete the two-thirds with 1/6', 'جب صرف ایک حقیقی بہن ہو (جس نے 1/2 لیا) تو علاتی بہن (بہنیں) 1/6 لے کر دو تہائی مکمل کرتی ہیں');
  add('ps.excl', '{name}: nothing — the full sisters already take 2/3 and there is no paternal brother to make her a residuary (Rule 11).', '{name}: کچھ نہیں — حقیقی بہنیں 2/3 لے چکی ہیں اور علاتی بھائی موجود نہیں جو اسے عصبہ بنائے (قاعدہ 11)۔');
  add('fixed.none', 'No heir here receives a fixed Qur’anic share — everything goes to the residuary heirs (‘Asabah).', 'یہاں کسی وارث کو قرآن کا مقررہ حصہ نہیں ملتا — سب کچھ عصبات کو جاتا ہے۔');
  add('s4.title', 'Step 4 – Adding the fixed shares', 'مرحلہ 4 – مقررہ حصوں کا مجموعہ');
  add('s4.more', 'The total {T} is MORE than 1 — this is a case of ‘Awl (shares must be scaled down).', 'مجموعہ {T} ایک سے زیادہ ہے — یہ عول کی صورت ہے (حصے متناسب طور پر کم کرنے ہوں گے)۔');
  add('s4.less', 'The total {T} is LESS than 1 — a remainder of {R} is left over.', 'مجموعہ {T} ایک سے کم ہے — {R} باقی بچتا ہے۔');
  add('s4.exact', 'The total is exactly 1 — the estate is fully distributed.', 'مجموعہ بالکل 1 ہے — ترکہ مکمل تقسیم ہو گیا۔');
  add('s4.nofixed', 'There are no fixed shares, so the whole estate (1) is a remainder for the residuary heirs.', 'کوئی مقررہ حصہ نہیں، اس لیے پورا ترکہ (1) عصبات کے لیے باقی ہے۔');
  add('s5awal.title', 'Step 5 – ‘Awl (proportional reduction)', 'مرحلہ 5 – عول (متناسب کمی)');
  add('awal.intro', '‘Awl: each share is multiplied by 1 ÷ {T} = {inv}, so that the total becomes exactly 1 and every heir loses in the same proportion (Rule 18).', 'عول: ہر حصے کو 1 ÷ {T} = {inv} سے ضرب دیا جاتا ہے تاکہ مجموعہ بالکل 1 ہو جائے اور ہر وارث کی کمی یکساں تناسب سے ہو (قاعدہ 18)۔');
  add('awal.why', '‘Awl: {expr}', 'عول: {expr}');
  add('pool.line', 'Grandfather & sister(s) pool their shares: {pool}, and divide it 2 : 1 — the grandfather gets 2/{tu}, the sisters 1 part each (Rule 18a).', 'دادا اور بہن (بہنیں) اپنے حصے جمع کرتے ہیں: {pool}، اور اسے 2 : 1 سے بانٹتے ہیں — دادا کو 2/{tu}، ہر بہن کو 1 حصہ (قاعدہ 18a)۔');
  add('pool.why', 'pooled {expr}', 'جمع شدہ {expr}');
  add('s5res.title', 'Step 5 – Remainder to the residuary heirs (Ta’seeb)', 'مرحلہ 5 – باقی مال عصبات کو (تعصیب)');
  add('res.line', 'Remainder = 1 − {T} = {R}. It goes to the nearest residuary: {names} (Rule 14).', 'باقی = 1 − {T} = {R}۔ یہ قریب ترین عصبہ کو ملتا ہے: {names} (قاعدہ 14)۔');
  add('res.ratio', "Males receive double a female's share (2 : 1, Rule 15), so the remainder is cut into {tu} equal parts.", 'مرد کو عورت سے دگنا حصہ ملتا ہے (2 : 1، قاعدہ 15)، اس لیے باقی مال {tu} برابر حصوں میں تقسیم ہوتا ہے۔');
  add('res.part', '{u}/{tu} of the remainder {R} = {f}', 'باقی {R} کا {u}/{tu} = {f}');
  add('res.whole', 'the whole remainder {R}', 'پورا باقی مال {R}');
  add('res.why', 'residuary (‘asabah): {t}', 'عصبہ: {t}');
  add('res.group', ' for the group, i.e. {each} each', ' پورے گروہ کے لیے، یعنی ہر ایک کو {each}');
  add('r.son', 'Rule 15 (Qur’an 4:11)', 'قاعدہ 15 (قرآن 4:11)');
  add('r.r15', 'Rule 15', 'قاعدہ 15');
  add('r.father', 'Rule 14 (the father is a residuary)', 'قاعدہ 14 (باپ عصبہ ہے)');
  add('r.fb', 'Rule 15 (Qur’an 4:176)', 'قاعدہ 15 (قرآن 4:176)');
  add('r.sister', 'the sister becomes a residuary with the daughter(s), Rule 38', 'بیٹی (بیٹیوں) کی موجودگی میں بہن عصبہ بن جاتی ہے، قاعدہ 38');
  add('r.gf', 'Rule 14 (the grandfather stands in for the father)', 'قاعدہ 14 (دادا باپ کے قائم مقام ہے)');
  add('r.far', 'Rule 14 (nearest male relative in the residuary order)', 'قاعدہ 14 (عصبات کی ترتیب میں قریب ترین مرد رشتہ دار)');
  add('r.eman', 'Rule 14 (emancipator)', 'قاعدہ 14 (معتِق)');
  add('s5radd.title', 'Step 5 – Remainder is returned (Radd)', 'مرحلہ 5 – باقی مال کی واپسی (رد)');
  add('radd.intro', 'Remainder = 1 − {T} = {R} and there is no residuary heir, so it is returned (Radd) to the fixed-share heirs in proportion to their shares — except the spouse, whose share stays fixed (Rules 19, 36, 37).', 'باقی = 1 − {T} = {R} اور کوئی عصبہ وارث نہیں، اس لیے یہ مقررہ حصہ داروں کو ان کے حصوں کے تناسب سے لوٹایا جاتا ہے (رد) — سوائے زوجین کے، جن کا حصہ مقررہ ہی رہتا ہے (قواعد 19، 36، 37)۔');
  add('radd.mult', 'Non-spouse shares total {so}; they now share {room}, so each share is multiplied by {room} ÷ {so} = {f}.', 'زوجین کے علاوہ دوسروں کے حصوں کا مجموعہ {so} ہے؛ اب وہ {room} میں شریک ہیں، اس لیے ہر حصے کو {room} ÷ {so} = {f} سے ضرب دیا جاتا ہے۔');
  add('radd.why', 'Radd: {expr}', 'رد: {expr}');
  add('radd.sp', 'Remainder {R} and no other heir at all, so as a last resort the remainder returns to the spouse (Rule 26). (No distant relatives — Dhawu al-Arham — were entered; if there are any, they take precedence over this Radd, Rules 25 & 37.)', 'باقی {R} ہے اور کوئی دوسرا وارث بالکل نہیں، اس لیے آخری چارۂ کار کے طور پر باقی مال زوجین کو لوٹایا جاتا ہے (قاعدہ 26)۔ (ذوی الارحام درج نہیں کیے گئے؛ اگر ہوں تو انہیں اس رد پر ترجیح ہوگی، قواعد 25 اور 37)۔');
  add('radd.spwhy', 'last-resort Radd of {R} (Rule 26)', 'آخری چارۂ کار رد {R} (قاعدہ 26)');
  add('bayt', 'There is no one to inherit the remainder; it goes to the Islamic state / Bayt al-Mal (Rule 27).', 'باقی مال کا کوئی وارث نہیں؛ وہ اسلامی ریاست / بیت المال کو جاتا ہے (قاعدہ 27)۔');
  add('him.title', 'Step 5 – Special case: full brothers share with maternal siblings', 'مرحلہ 5 – خاص صورت: حقیقی بھائی اخیافی بہن بھائیوں کے ساتھ شریک');
  add('him.line', 'Nothing is left for the full brother(s), yet they are closer than the maternal half-siblings (Rule 22: a full brother cannot receive less than a maternal brother). So the maternal share {m} is shared EQUALLY, per head, among {h} persons: {m} ÷ {h} = {each} each (the Himariyya / Mushtarakah case).', 'حقیقی بھائیوں کے لیے کچھ نہیں بچا، حالانکہ وہ اخیافی بہن بھائیوں سے زیادہ قریب ہیں (قاعدہ 22: حقیقی بھائی کو اخیافی بھائی سے کم نہیں ملنا چاہیے)۔ لہٰذا اخیافی حصہ {m} فی کس برابر {h} افراد میں بٹتا ہے: {m} ÷ {h} = ہر ایک کو {each} (مسئلۂ حماریہ / مشترکہ)۔');
  add('him.why', 'shares the maternal share equally per head: {expr}', 'اخیافی حصہ فی کس برابر بانٹتا ہے: {expr}');
  add('s5none.title', 'Step 5 – Remainder', 'مرحلہ 5 – باقی مال');
  add('s5none.text', 'There is no remainder; nothing further to distribute.', 'کوئی باقی مال نہیں؛ مزید تقسیم کچھ نہیں۔');
  add('note.gf.title', 'Note – Grandfather with brothers & sisters', 'نوٹ – دادا بہن بھائیوں کے ساتھ');
  add('note.gf.text', 'The grandfather is treated like a brother but never receives less than the better of 1/6 of the estate and 1/3 of the remainder (Rule 23). Full-sister and paternal-sister fixed shares are set aside in this situation (Rule 23g).', 'دادا کو بھائی کی طرح شمار کیا جاتا ہے مگر اسے کل ترکے کے 1/6 اور باقی کے 1/3 میں سے بہتر حصے سے کم نہیں ملتا (قاعدہ 23)۔ اس صورت میں حقیقی اور علاتی بہنوں کے مقررہ حصے الگ رکھے جاتے ہیں (قاعدہ 23g)۔');
  add('note.umar.title', 'Note – Umar’s ruling', 'نوٹ – حضرت عمرؓ کا فیصلہ');
  add('note.umar.text', 'Applied because the heirs are exactly: a spouse, both parents, and no children or multiple siblings (Rule 21).', 'یہ اس لیے لاگو ہوا کہ ورثاء بس یہی ہیں: زوجین میں سے ایک، دونوں والدین، اور نہ اولاد نہ ایک سے زیادہ بہن بھائی (قاعدہ 21)۔');
  add('final.title', 'Final result', 'حتمی نتیجہ');
  add('final.head', 'Final shares (as a part of the whole estate):', 'حتمی حصے (پورے ترکے کا حصہ):');
  add('final.each', ' → {each} each', ' → ہر ایک کو {each}');
  add('final.total', 'Total = {T}', 'میزان = {T}');

  /* ---------- UI ---------- */
  add('page.title', 'Islamic Inheritance Calculator – ʿIlm al-Farāʾiḍ', 'اسلامی وراثت کیلکولیٹر – علم الفرائض');
  add('nav.calc', 'Calculator', 'کیلکولیٹر');
  add('nav.cases', 'Famous Cases', 'مشہور مسائل');
  add('nav.validate', 'Test Suite', 'ٹیسٹ سوٹ');
  add('nav.ask', 'Ask a Mufti', 'مفتی سے پوچھیں');
  add('nav.rules', 'Rulings', 'احکام');
  add('lang.btn', 'اردو', 'English');
  add('hero.title', 'Islamic Inheritance Calculator', 'اسلامی وراثت کیلکولیٹر');
  add('hero.tag', 'Shares according to the Qurʼān & Sunnah — every figure explained, step by step', 'قرآن و سنت کے مطابق حصے — ہر حساب مرحلہ وار وضاحت کے ساتھ');
  add('calc.h1', '1 · The deceased & the estate', '1 · میت اور ترکہ');
  add('lbl.gender', 'The deceased was', 'میت');
  add('lbl.male', 'Male', 'مرد');
  add('lbl.female', 'Female', 'عورت');
  add('lbl.estate', 'Total estate', 'کل ترکہ');
  add('lbl.funeral', 'Funeral & burial costs', 'تجہیز و تکفین کے اخراجات');
  add('lbl.debts', 'Debts & unpaid mahr', 'قرضے اور غیر ادا شدہ مہر');
  add('lbl.wasiyyah', 'Bequest (wasiyyah)', 'وصیت');
  add('lbl.cur', 'Currency', 'کرنسی');
  add('ph.estate', 'e.g. 1000000', 'مثلاً 1000000');
  add('ph.cur', '₹ / PKR / $', '₹ / PKR / $');
  add('calc.hint1', 'Entering an amount is optional – without it you still get exact fractions. Funeral costs, then debts, are paid first; a bequest may not exceed ⅓ of what remains and may not go to an heir (Qurʼān 4:11–12).', 'رقم درج کرنا اختیاری ہے – اس کے بغیر بھی آپ کو درست کسریں ملیں گی۔ پہلے تجہیز و تکفین کے اخراجات، پھر قرضے ادا ہوتے ہیں؛ وصیت قرضوں کے بعد بچے ہوئے مال کے ایک تہائی سے زیادہ نہیں ہو سکتی اور کسی وارث کے لیے نہیں ہو سکتی (قرآن 4:11–12)۔');
  add('calc.h2', '2 · Who survived the deceased?', '2 · میت کے پسماندگان میں کون ہے؟');
  add('calc.hint2', 'Use + / − to enter how many of each relative are alive. Leave everything else at 0.', 'ہر رشتہ دار کی زندہ تعداد + / − سے درج کریں۔ باقی سب 0 رہنے دیں۔');
  add('btn.calc', 'Calculate shares', 'حصے معلوم کریں');
  add('btn.reset', 'Reset', 'دوبارہ ترتیب');
  add('btn.print', 'Print this result', 'یہ نتیجہ پرنٹ کریں');
  add('btn.fewer', 'fewer', 'کم');
  add('btn.more', 'more', 'زیادہ');
  add('g.Spouse', 'Spouse', 'زوجین');
  add('g.Descendants', 'Descendants', 'اولاد');
  add('g.Ascendants', 'Ascendants', 'والدین اور اجداد');
  add('g.Siblings', 'Siblings', 'بہن بھائی');
  add('g.Wider male relatives', 'Wider male relatives', 'دور کے مرد رشتہ دار');
  add('gn.Spouse', 'Husband or wife', 'شوہر یا بیوی');
  add('gn.Descendants', 'Children and grandchildren (through a son)', 'بیٹے بیٹیاں اور پوتے پوتیاں (بیٹے کی طرف سے)');
  add('gn.Ascendants', 'Parents and grandparents', 'والدین، دادا، دادی اور نانی');
  add('gn.Siblings', 'Brothers and sisters', 'بھائی اور بہنیں');
  add('gn.Wider male relatives', 'Nephews, uncles, cousins and the one who freed the deceased from slavery — residuary heirs only', 'بھتیجے، چچا، چچازاد اور آزاد کرنے والا — صرف عصبہ وارث');
  add('res.title', 'Distribution of the estate', 'ترکے کی تقسیم');
  add('res.how', 'How the shares were worked out', 'حصے کیسے نکالے گئے');
  add('th.heir', 'Heir', 'وارث');
  add('th.no', 'No.', 'تعداد');
  add('th.share', 'Share of estate', 'ترکے میں حصہ');
  add('th.each', 'Each person', 'فی کس');
  add('th.parts', 'Parts of {L}', '{L} میں سے حصے');
  add('th.amt', 'Amount (total)', 'رقم (کل)');
  add('th.amtEach', 'Amount (each)', 'رقم (فی کس)');
  add('th.total', 'Total', 'میزان');
  add('parts.hint', '“Parts of {L}”: if the estate is cut into {L} equal parts, this is how many parts each heir group receives.', '“{L} میں سے حصے”: اگر ترکہ {L} برابر حصوں میں تقسیم کیا جائے تو ہر وارث گروہ کو اتنے حصے ملتے ہیں۔');
  add('blockedBy', 'Blocked by {x}', 'محروم بسبب {x}');
  add('nothing', 'Receives nothing in this case', 'اس صورت میں کچھ نہیں ملتا');
  add('disc', 'This is a calculation aid, not a fatwa. For a binding ruling please contact a Darul Ifta (see the', 'یہ حساب میں مدد کا ذریعہ ہے، فتویٰ نہیں۔ حتمی شرعی حکم کے لیے براہِ کرم دارالافتاء سے رجوع کریں (دیکھیں');
  add('disc.end', 'tab).', 'ٹیب)۔');
  add('badge.umar', 'Umar’s ruling', 'حضرت عمرؓ کا فیصلہ');
  add('badge.awal', 'ʿAwl (shares reduced)', 'عول (حصے کم)');
  add('badge.radd', 'Radd (remainder returned)', 'رد (باقی مال کی واپسی)');
  add('badge.himariyya', 'Ḥimāriyyah / Mushtarakah', 'حماریہ / مشترکہ');
  add('badge.grandfather', 'Grandfather with siblings', 'دادا بہن بھائیوں کے ساتھ');
  add('badge.akdariyya', 'Akdariyyah', 'اکدریہ');
  add('badge.bayt', 'Bayt al-Māl', 'بیت المال');
  add('est.step0', 'Step 0 – Settle the estate first', 'مرحلہ 0 – پہلے ترکے کا حساب کریں');
  add('est.total', 'Total estate: {v}', 'کل ترکہ: {v}');
  add('est.funeral', '− funeral & burial: {a} → {b}', '− تجہیز و تکفین: {a} ← باقی {b}');
  add('est.debts', '− debts & unpaid mahr: {a} → {b}', '− قرضے اور مہر: {a} ← باقی {b}');
  add('est.bequest', '− bequest: {a} (within the ⅓ limit of {cap})', '− وصیت: {a} (ایک تہائی کی حد {cap} کے اندر)');
  add('est.bequestCap', '− bequest: {a} (you entered {in}, but a bequest is limited to ⅓ of the estate after debts = {cap})', '− وصیت: {a} (آپ نے {in} درج کیا، مگر وصیت قرضوں کے بعد ترکے کے ایک تہائی = {cap} تک محدود ہے)');
  add('est.net', 'Net estate to divide among the heirs: {v}', 'ورثاء میں تقسیم کے لیے خالص ترکہ: {v}');
  add('cases.h', 'Famous cases from the Sunnah & the Companions', 'سنت اور صحابہ کرامؓ کے مشہور مسائل');
  add('cases.hint', 'Each case is calculated live by the same engine. Press Explain step by step to see the full working, or Load in calculator to experiment.', 'ہر مسئلہ اسی انجن سے براہِ راست حل کیا جاتا ہے۔ مکمل حساب دیکھنے کے لیے “مرحلہ وار وضاحت” دبائیں، یا تجربہ کرنے کے لیے “کیلکولیٹر میں کھولیں”۔');
  add('btn.explain', 'Explain step by step', 'مرحلہ وار وضاحت');
  add('btn.hide', 'Hide working', 'وضاحت چھپائیں');
  add('btn.load', 'Load in calculator', 'کیلکولیٹر میں کھولیں');
  add('working', 'Working', 'حساب');
  add('val.h', 'Validation against the ʿIlm Summit test cases', 'علم سمٹ کے ٹیسٹ کیسز سے تصدیق');
  add('val.p', 'The calculator is checked against <span id="vTotal">{n}</span> reference cases published by the ʿIlm Summit inheritance project (<a href="http://inheritance.ilmsummit.org/projects/inheritance/testcasespage.aspx" target="_blank" rel="noopener">source</a>). The full set is also provided as an Excel workbook: <a href="data/Inheritance_TestCases_ilmsummit.xlsx" download>Inheritance_TestCases_ilmsummit.xlsx</a>.', 'اس کیلکولیٹر کو علم سمٹ وراثت منصوبے کے شائع کردہ <span id="vTotal">{n}</span> حوالہ کیسز سے جانچا گیا ہے (<a href="http://inheritance.ilmsummit.org/projects/inheritance/testcasespage.aspx" target="_blank" rel="noopener">ماخذ</a>)۔ پوری فہرست ایکسل فائل میں بھی موجود ہے: <a href="data/Inheritance_TestCases_ilmsummit.xlsx" download>Inheritance_TestCases_ilmsummit.xlsx</a>۔');
  add('btn.run', 'Run all test cases', 'تمام ٹیسٹ کیسز چلائیں');
  add('v.pass', '✔ pass', '✔ کامیاب');
  add('v.known', '≠ known difference', '≠ معلوم فرق');
  add('v.fail', '✘ FAIL', '✘ ناکام');
  add('v.cases', 'cases', 'کل کیسز');
  add('v.exact', 'exact match', 'مکمل مطابقت');
  add('v.knownd', 'known difference', 'معلوم فرق');
  add('v.mismatch', 'mismatch', 'عدم مطابقت');
  add('v.refsite', 'Reference site', 'حوالہ ویب سائٹ');
  add('v.this', 'This calculator', 'یہ کیلکولیٹر');
  add('v.reason', 'Reference reasoning (English, from the source site):', 'حوالہ ویب سائٹ کی وضاحت (انگریزی، ماخذ سے):');
  add('v.case', 'Case #{id}: {text}', 'مسئلہ نمبر {id}: {text}');
  add('v.known34', 'Known difference: the reference site lets maternal brothers inherit alongside two daughters. Under Qur’an 4:12 (Kalalah) maternal siblings inherit only when the deceased leaves no children or grandchildren and no father or paternal grandfather, so a daughter blocks them. This calculator follows the Qur’anic ruling (Rule 12 as corrected).', 'معلوم فرق: حوالہ ویب سائٹ اخیافی بھائیوں کو دو بیٹیوں کے ساتھ وارث بناتی ہے۔ قرآن 4:12 (کلالہ) کے مطابق اخیافی بہن بھائی صرف اس وقت وارث ہوتے ہیں جب میت کی اولاد یا پوتے پوتیاں نہ ہوں اور باپ یا دادا بھی نہ ہو، اس لیے بیٹی انہیں محروم کر دیتی ہے۔ یہ کیلکولیٹر قرآنی حکم کی پیروی کرتا ہے (قاعدہ 12، اصلاح شدہ)۔');
  add('ask.h', 'Ask a question to a Darul Ifta', 'دارالافتاء سے سوال پوچھیں');
  add('ask.p', 'This calculator applies fixed rules and cannot replace a qualified mufti. Real estates often involve details a form cannot capture – missing persons, adopted children, disputed wills, unborn children, differing school opinions, and more. For anything beyond the basic situations, please ask a scholar.', 'یہ کیلکولیٹر طے شدہ اصولوں پر چلتا ہے اور کسی مستند مفتی کا متبادل نہیں۔ حقیقی ترکوں میں ایسی تفصیلات ہوتی ہیں جو کوئی فارم نہیں پکڑ سکتا – مفقود الخبر، متبنیٰ، متنازع وصیت، حمل، فقہی مسالک کا اختلاف وغیرہ۔ بنیادی صورتوں سے آگے کسی بھی معاملے میں براہِ کرم کسی عالم سے پوچھیں۔');
  add('ask.tip', 'Tip: when you ask, mention exactly who is alive, who has died (and in what order), the estate details, and whether there is a will. You can print the calculator’s result page and attach it to your question.', 'مشورہ: سوال کرتے وقت واضح لکھیں کہ کون زندہ ہے، کس کا انتقال ہوا (اور کس ترتیب سے)، ترکے کی تفصیل کیا ہے اور وصیت ہے یا نہیں۔ آپ کیلکولیٹر کا نتیجہ پرنٹ کر کے سوال کے ساتھ لگا سکتے ہیں۔');
  add('rules.h', 'The rulings used by this calculator', 'اس کیلکولیٹر میں استعمال ہونے والے احکام');
  add('rules.hint', 'Reproduced from the supplied rulings document; rule numbers are quoted in every explanation.', 'فراہم کردہ احکام کی دستاویز سے نقل شدہ؛ ہر وضاحت میں قاعدہ نمبر حوالے کے طور پر دیے گئے ہیں۔');
  add('foot.p', 'This tool is an aid for learning and estimation, not a fatwa. Please confirm the final distribution with a qualified mufti.', 'یہ سیکھنے اور اندازے کا ذریعہ ہے، فتویٰ نہیں۔ حتمی تقسیم کی تصدیق کسی مستند مفتی سے کروائیں۔');

  /* ---------- helpers ---------- */
  const missing = new Set();
  function t(lang, key, p) {
    let s = D[lang] && D[lang][key];
    if (s === undefined) { missing.add(lang + ':' + key); s = D.en[key]; }
    if (s === undefined) return key;
    return p ? s.replace(/\{(\w+)\}/g, (m, k) => (p[k] === undefined ? m : p[k])) : s;
  }
  const api = { t, D, missing };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.I18N = api;
})(typeof window !== 'undefined' ? window : globalThis);
