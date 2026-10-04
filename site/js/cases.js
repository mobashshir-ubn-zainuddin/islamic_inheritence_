/* Famous inheritance cases from the Sunnah and the Companions.
 * `expect` holds the textbook answer, which tools/test_famous.js checks against the engine. */
window.FAMOUS_CASES = [
  {
    id: 'saad', title: 'The widow of Saʿd ibn al-Rabīʿ',
    source: 'Hadith – Abu Dawud, Tirmidhi, Ibn Majah (the occasion of Qurʾān 4:11–12)',
    story: 'Saʿd ibn al-Rabīʿ (RA) was martyred at Uhud leaving a widow, two daughters and a brother. The brother took all the wealth. The widow came to the Messenger of Allah ﷺ, who ruled: the two daughters get two-thirds, the wife one-eighth, and what remains is for the brother.',
    counts: { wife: 1, daughter: 2, fullBrother: 1 },
    expect: { wife: '1/8', daughter: '2/3', fullBrother: '5/24' },
  },
  {
    id: 'umar1', title: 'ʿUmariyyatān (1) – Husband, father and mother',
    source: 'Ruling of ʿUmar ibn al-Khaṭṭāb (RA); followed by the Companions and the four schools',
    story: 'ʿUmar (RA) held that when only a spouse and both parents survive, the mother gets one-third of what is LEFT after the spouse, not one-third of the whole estate, so that she never receives more than twice what the father gets.',
    counts: { husband: 1, father: 1, mother: 1 },
    expect: { husband: '1/2', mother: '1/6', father: '1/3' },
  },
  {
    id: 'umar2', title: 'ʿUmariyyatān (2) – Wife, father and mother',
    source: 'Ruling of ʿUmar ibn al-Khaṭṭāb (RA)',
    story: 'The same principle with a wife: the wife takes 1/4, the mother takes one-third of the remaining 3/4 (= 1/4), and the father takes the rest (1/2).',
    counts: { wife: 1, father: 1, mother: 1 },
    expect: { wife: '1/4', mother: '1/4', father: '1/2' },
  },
  {
    id: 'minbariyya', title: 'Al-Minbariyyah – the case ʿAlī (RA) answered from the pulpit',
    source: 'Narrated of ʿAlī ibn Abī Ṭālib (RA); an example of ʿAwl',
    story: 'ʿAlī (RA) was asked on the minbar about a man who died leaving a wife, two daughters, a father and a mother. The fixed shares add up to 27/24 and he replied immediately: “Her eighth has become a ninth.” The wife’s 1/8 shrinks to 3/27 = 1/9.',
    counts: { wife: 1, daughter: 2, father: 1, mother: 1 },
    expect: { wife: '1/9', daughter: '16/27', father: '4/27', mother: '4/27' },
  },
  {
    id: 'mushtarakah', title: 'Al-Mushtarakah (Ḥimāriyyah) – the shared third',
    source: 'Ruling of ʿUmar (RA) and ʿUthmān (RA); Rule 22',
    story: 'A husband, a mother, two maternal half-brothers and two full brothers survive. The fixed shares (1/2 + 1/6 + 1/3) exhaust the estate and leave nothing for the full brothers. Told “suppose our father were a donkey”, ʿUmar (RA) ruled that the full brothers share the maternal third equally with the maternal brothers — they share the same mother.',
    counts: { husband: 1, mother: 1, maternalBrother: 2, fullBrother: 2 },
    expect: { husband: '1/2', mother: '1/6', maternalBrother: '1/6', fullBrother: '1/6' },
  },
  {
    id: 'akdariyyah', title: 'Al-Akdariyyah – the “disturbing” case',
    source: 'Ruling of Zayd ibn Thābit (RA); Rules 18a & 24',
    story: 'A husband, mother, grandfather and one full sister survive. The shares 1/2 + 1/3 + 1/6 + 1/2 total 3/2, so ʿAwl is applied (to 9). Afterwards the grandfather and the sister pool their portions and divide them 2 : 1, which gives the denominator 27.',
    counts: { husband: 1, mother: 1, grandfather: 1, fullSister: 1 },
    expect: { husband: '1/3', mother: '2/9', grandfather: '8/27', fullSister: '4/27' },
  },
  {
    id: 'ibnmasud', title: 'Daughter, son’s daughter and sister – the ruling of Ibn Masʿūd',
    source: 'Ṣaḥīḥ al-Bukhārī – Abū Mūsā & Ibn Masʿūd (RA)',
    story: 'Asked about a daughter, a son’s daughter and a full sister, Ibn Masʿūd (RA) said: “I will rule as the Prophet ﷺ ruled: half for the daughter, a sixth for the son’s daughter to complete two-thirds, and the rest for the sister.”',
    counts: { daughter: 1, granddaughter: 1, fullSister: 1 },
    expect: { daughter: '1/2', granddaughter: '1/6', fullSister: '1/3' },
  },
  {
    id: 'mubahalah', title: 'Husband, mother and two full sisters (ʿAwl)',
    source: 'The debate of Ibn ʿAbbās (RA) with the Companions on ʿAwl; ʿUmar (RA) first applied ʿAwl in this type of case',
    story: 'The shares 1/2 + 1/6 + 2/3 total 4/3. ʿUmar (RA) consulted the Companions and, as no one was to be preferred over another, every heir’s share was reduced proportionally (ʿAwl) – 6 becomes 8.',
    counts: { husband: 1, mother: 1, fullSister: 2 },
    expect: { husband: '3/8', mother: '1/8', fullSister: '1/2' },
  },
  {
    id: 'grandfather', title: 'Grandfather with a full brother',
    source: 'Ruling of Zayd ibn Thābit (RA); Rule 23',
    story: 'With no father or children, the grandfather and a brother are treated alike: the grandfather takes the best of 1/6, one third of the remainder, or an equal share with the brother — here half.',
    counts: { grandfather: 1, fullBrother: 1 },
    expect: { grandfather: '1/2', fullBrother: '1/2' },
  },
  {
    id: 'daughters-radd', title: 'Two daughters only (Radd – returning the remainder)',
    source: 'Qurʾān 4:11 and the principle of Radd; Rule 19',
    story: 'Two daughters get 2/3. No residuary exists, so the remaining 1/3 returns to them: the fixed shares are scaled up so the total is 1.',
    counts: { daughter: 2 },
    expect: { daughter: '1' },
  },
  {
    id: 'wife-daughter', title: 'Wife and daughter, nobody else',
    source: 'Qurʾān 4:11–12; Rules 19 & 37',
    story: 'The wife has 1/8 and the daughter 1/2. A remainder of 3/8 is left and there is no residuary. It is returned only to the daughter — the spouse’s share is never increased (Rule 36–37).',
    counts: { wife: 1, daughter: 1 },
    expect: { wife: '1/8', daughter: '7/8' },
  },
  {
    id: 'kalalah', title: 'Kalālah – maternal siblings and a full brother',
    source: 'Qurʾān 4:12 and 4:176',
    story: 'A man dies leaving neither parents nor children (kalālah), but a mother’s son, a mother’s daughter and a full brother. The two maternal siblings share a third equally (no 2 : 1), and the full brother takes the remaining two-thirds as a residuary.',
    counts: { maternalBrother: 1, maternalSister: 1, fullBrother: 1 },
    expect: { maternalBrother: '1/6', maternalSister: '1/6', fullBrother: '2/3' },
  },
  {
    id: 'son-daughter', title: 'Son and daughter with a wife and both parents',
    source: 'Qurʾān 4:11–12',
    story: 'Wife 1/8, father 1/6, mother 1/6. The remainder (13/24) is divided between the son and daughter in the ratio 2 : 1 (“to the male, the share of two females”).',
    counts: { wife: 1, father: 1, mother: 1, son: 1, daughter: 1 },
    expect: { wife: '1/8', father: '1/6', mother: '1/6', son: '13/36', daughter: '13/72' },
  },
];

/* The full text of the rulings, presented on the "Rulings" tab. */
window.RULES_HTML = null;

/* Urdu text for the famous cases (keyed by case id). */
window.FAMOUS_CASES_UR = {
  saad: {
    title: 'حضرت سعد بن ربیعؓ کی بیوہ',
    source: 'حدیث – ابو داؤد، ترمذی، ابن ماجہ (آیاتِ میراث 4:11–12 کا شانِ نزول)',
    story: 'حضرت سعد بن ربیعؓ احد میں شہید ہوئے اور پیچھے بیوہ، دو بیٹیاں اور ایک بھائی چھوڑا۔ بھائی نے سارا مال لے لیا۔ بیوہ رسول اللہ ﷺ کی خدمت میں آئیں تو آپ ﷺ نے فیصلہ فرمایا: دونوں بیٹیوں کو دو تہائی، بیوی کو آٹھواں حصہ، اور جو بچے وہ بھائی کا ہے۔',
  },
  umar1: {
    title: 'عمریتین (1) – شوہر، باپ اور ماں',
    source: 'حضرت عمر بن خطابؓ کا فیصلہ؛ صحابہؓ اور چاروں مسالک کا عمل',
    story: 'حضرت عمرؓ کا فیصلہ ہے کہ جب صرف زوجین میں سے ایک اور دونوں والدین ہوں تو ماں کو پورے ترکے کا تہائی نہیں بلکہ زوج/زوجہ کا حصہ نکالنے کے بعد باقی کا تہائی ملتا ہے، تاکہ ماں کو کبھی باپ سے دگنا نہ ملے۔',
    },
  umar2: {
    title: 'عمریتین (2) – بیوی، باپ اور ماں',
    source: 'حضرت عمر بن خطابؓ کا فیصلہ',
    story: 'یہی اصول بیوی کے ساتھ: بیوی کو 1/4، ماں کو باقی 3/4 کا تہائی (= 1/4)، اور باپ کو باقی (1/2)۔',
  },
  minbariyya: {
    title: 'منبریہ – وہ مسئلہ جس کا جواب حضرت علیؓ نے منبر پر دیا',
    source: 'حضرت علی بن ابی طالبؓ سے منقول؛ عول کی مثال',
    story: 'حضرت علیؓ سے منبر پر اس شخص کے بارے میں پوچھا گیا جو بیوی، دو بیٹیاں، باپ اور ماں چھوڑ کر فوت ہوا۔ مقررہ حصوں کا مجموعہ 27/24 بنتا ہے۔ آپؓ نے فوراً فرمایا: “اس کا آٹھواں حصہ نواں بن گیا۔” یعنی بیوی کا 1/8 گھٹ کر 3/27 = 1/9 رہ گیا۔',
  },
  mushtarakah: {
    title: 'مشترکہ (حماریہ) – مشترک تہائی',
    source: 'حضرت عمرؓ اور حضرت عثمانؓ کا فیصلہ؛ قاعدہ 22',
    story: 'شوہر، ماں، دو اخیافی بھائی اور دو حقیقی بھائی وارث ہیں۔ مقررہ حصے (1/2 + 1/6 + 1/3) پورا ترکہ لے جاتے ہیں اور حقیقی بھائیوں کے لیے کچھ نہیں بچتا۔ جب انہوں نے کہا “فرض کیجیے ہمارا باپ گدھا تھا”، تو حضرت عمرؓ نے فیصلہ فرمایا کہ حقیقی بھائی اخیافی بھائیوں کے ساتھ تہائی میں برابر شریک ہوں گے — کیونکہ ماں تو ایک ہی ہے۔',
  },
  akdariyyah: {
    title: 'اکدریہ – “پریشان کن” مسئلہ',
    source: 'حضرت زید بن ثابتؓ کا فیصلہ؛ قواعد 18a اور 24',
    story: 'شوہر، ماں، دادا اور ایک حقیقی بہن وارث ہیں۔ حصے 1/2 + 1/3 + 1/6 + 1/2 مل کر 3/2 بنتے ہیں، اس لیے عول لگتا ہے (9 تک)۔ اس کے بعد دادا اور بہن اپنے حصے جمع کر کے 2 : 1 سے بانٹتے ہیں، جس سے مخرج 27 بنتا ہے۔',
  },
  ibnmasud: {
    title: 'بیٹی، پوتی اور بہن – حضرت ابن مسعودؓ کا فیصلہ',
    source: 'صحیح بخاری – حضرت ابو موسیٰؓ اور حضرت ابن مسعودؓ',
    story: 'بیٹی، پوتی اور حقیقی بہن کے بارے میں پوچھا گیا تو حضرت ابن مسعودؓ نے فرمایا: “میں وہی فیصلہ کروں گا جو نبی ﷺ نے کیا: بیٹی کو آدھا، پوتی کو چھٹا حصہ تاکہ دو تہائی پورے ہوں، اور باقی بہن کو۔”',
  },
  mubahalah: {
    title: 'شوہر، ماں اور دو حقیقی بہنیں (عول)',
    source: 'حضرت ابن عباسؓ کا صحابہؓ سے مباحثۂ عول؛ حضرت عمرؓ نے اسی طرح کے مسئلے میں پہلی بار عول لگایا',
    story: 'حصے 1/2 + 1/6 + 2/3 مل کر 4/3 بنتے ہیں۔ حضرت عمرؓ نے صحابہؓ سے مشورہ کیا اور چونکہ کسی کو کسی پر ترجیح نہ تھی، اس لیے سب کے حصے متناسب طور پر کم کر دیے گئے (عول) – 6 بڑھ کر 8 ہو گیا۔',
  },
  grandfather: {
    title: 'دادا اور حقیقی بھائی',
    source: 'حضرت زید بن ثابتؓ کا فیصلہ؛ قاعدہ 23',
    story: 'باپ اور اولاد نہ ہو تو دادا اور بھائی کو برابر شمار کیا جاتا ہے: دادا 1/6، باقی کے تہائی، یا بھائی کے ساتھ برابر حصے میں سے جو سب سے زیادہ ہو وہ لیتا ہے — یہاں آدھا۔',
  },
  'daughters-radd': {
    title: 'صرف دو بیٹیاں (رد – بچا ہوا مال لوٹانا)',
    source: 'قرآن 4:11 اور اصولِ رد؛ قاعدہ 19',
    story: 'دو بیٹیوں کو 2/3 ملتا ہے۔ کوئی عصبہ نہیں، اس لیے بچا ہوا 1/3 انہی کو لوٹا دیا جاتا ہے: مقررہ حصے اتنے بڑھا دیے جاتے ہیں کہ مجموعہ 1 ہو جائے۔',
  },
  'wife-daughter': {
    title: 'بیوی اور بیٹی، کوئی اور نہیں',
    source: 'قرآن 4:11–12؛ قواعد 19 اور 37',
    story: 'بیوی کا 1/8 اور بیٹی کا 1/2 ہے۔ 3/8 بچتا ہے اور کوئی عصبہ نہیں؛ یہ صرف بیٹی کو لوٹایا جاتا ہے — زوجین کا حصہ کبھی نہیں بڑھتا (قاعدہ 36–37)۔',
  },
  kalalah: {
    title: 'کلالہ – اخیافی بہن بھائی اور حقیقی بھائی',
    source: 'قرآن 4:12 اور 4:176',
    story: 'ایک شخص فوت ہوا، نہ والدین ہیں نہ اولاد (کلالہ)، مگر ماں کا بیٹا، ماں کی بیٹی اور ایک حقیقی بھائی ہیں۔ دونوں اخیافی بہن بھائی تہائی میں برابر شریک ہیں (2:1 نہیں) اور حقیقی بھائی باقی دو تہائی بطور عصبہ لیتا ہے۔',
  },
  'son-daughter': {
    title: 'بیٹا اور بیٹی، بیوی اور والدین کے ساتھ',
    source: 'قرآن 4:11–12',
    story: 'بیوی 1/8، باپ 1/6، ماں 1/6۔ باقی (13/24) بیٹے اور بیٹی میں 2 : 1 کے تناسب سے بٹتا ہے (“مرد کو دو عورتوں کے برابر حصہ”)۔',
  },
};
