# Islamic Inheritance Calculator

## Link: https://islamicinheritence.netlify.app/
Language: the header button switches the whole site between English and Urdu.

Open `site/index.html` in any browser (no build, no server needed).

- `site/js/engine.js` – calculation engine (exact fractions, every step recorded with rule numbers)
- `site/js/cases.js` – famous cases (Sa'd ibn al-Rabi', Umariyyatan, Minbariyya, Mushtarakah, Akdariyya, ...)
- `site/data/ilmsummit.*` – 133 reference cases scraped from inheritance.ilmsummit.org
- `Inheritance_TestCases_ilmsummit.xlsx` – the same reference cases as Excel (sheets: Test Cases, By Individual)
- `tools/scrape.py` re-downloads the reference cases; `tools/build_data.py` rebuilds the site data;
  `node tools/validate.js` and `node tools/test_famous.js` run the tests from the command line.
Strings live in `site/js/i18n.js`, Urdu famous-case text in `site/js/cases.js`, the Urdu rulings in `tools/rules_ur.txt` (-> `site/data/rules_ur.js`).
`node tools/test_i18n.js` checks that the Urdu and English results are identical and no translation key is missing.
