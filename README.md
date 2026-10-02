# Islamic Inheritance Calculator

Open `site/index.html` in any browser (no build, no server needed).

- `site/js/engine.js` – calculation engine (exact fractions, every step recorded with rule numbers)
- `site/js/cases.js` – famous cases (Sa'd ibn al-Rabi', Umariyyatan, Minbariyya, Mushtarakah, Akdariyya, ...)
- `site/data/ilmsummit.*` – 133 reference cases scraped from inheritance.ilmsummit.org
- `Inheritance_TestCases_ilmsummit.xlsx` – the same reference cases as Excel (sheets: Test Cases, By Individual)
- `tools/scrape.py` re-downloads the reference cases; `tools/build_data.py` rebuilds the site data;
  `node tools/validate.js` and `node tools/test_famous.js` run the tests from the command line.