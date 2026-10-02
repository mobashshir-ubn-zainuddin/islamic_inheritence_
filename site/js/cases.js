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
