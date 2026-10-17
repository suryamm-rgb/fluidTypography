# Contributing

Thanks for helping. This page covers setup, commits, code style and pull requests. Test details are in [TESTING.md](TESTING.md). The code layout is in [ARCHITECTURE.md](ARCHITECTURE.md).

- [Setup](#setup)
- [Commit rules](#commit-rules)
- [Code style](#code-style)
- [Pull request steps](#pull-request-steps)

## Setup

You need Node 22 or newer.

```bash
git clone <your repository url>
cd fluidTypography
npm install
npm run dev
```

Open `http://localhost:3000/fluid-typography`.

The build downloads Inter and JetBrains Mono from Google Fonts once, so it needs a network connection the first time.

## Commit rules

- One logical change per commit.
- Use a short prefix: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`.
- Write the subject in the imperative, under about 70 characters: `fix(export): remove duplicate variable`.
- Do not mix formatting changes with logic changes.
- Do not change the math in `CalculateClamp.js` without a test and an update to [FORMULA.md](FORMULA.md).

## Code style

- ESLint rules come from `eslint-config-next`. Run `npm run lint`.
- Styling: use tokens from `tokens.css`. No raw colors, no fixed pixel widths. Add new rules to `app.css` under `.ft`.
- Touch targets must be at least `var(--tap)`.
- Every new control needs a label, a visible focus state and keyboard support.
- Keep React-free logic in `src/lib` so it can be tested.
- Docs: simple English, short sentences, code blocks. Every example value must come from running the real code (`node scripts/gen-doc-examples.mjs`).
- Add a runtime dependency only after discussing it in the pull request.

## Pull request steps

1. Branch from `main`.
2. Make small commits.
3. Run `npm run lint && npm test && npm run build`.
4. For UI changes, run `node scripts/audit.mjs` and look at screenshots in light and dark at 375, 768 and 1440px.
5. Update the docs that your change touches, and add a line to [CHANGELOG.md](../CHANGELOG.md).
6. Open the pull request. Say what changed, why, and how you tested it. Add screenshots for UI changes.
