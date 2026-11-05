# Fifteen Puzzle website

A responsive landing page based on the FifteenPuzzleGame app and its concept artwork. Includes the App Store link, a playable sliding puzzle, four board sizes, and light, dark, and wood theme previews.

Run locally from this folder:

```sh
npm run dev
```

Open http://127.0.0.1:5173. Stop the server with Ctrl+C.

Requires Node.js/npm and Python 3. No dependency installation or build step is needed.

Website files are in `dist/`. The static Privacy Policy is at `dist/privacy.html`, linked from the home page footer. Preview it at http://127.0.0.1:5173/privacy.html after starting the local server.

Run `npm run check` and `npm test` to verify the JavaScript and puzzle rules. Tests independently check solvability for 400 generated boards.

The interactive board is a browser demonstration of the app. It uses legal random moves to generate solvable puzzles and keeps its state in memory. The app source remains in the separate FifteenPuzzleGame project.

The website was verified in Chromium at 320, 390, 768, 1024, and 1440 px: no horizontal overflow or browser errors. Checks covered the initial two-move win, shuffle, all four board sizes, all three themes, and every App Store link.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` checks the JavaScript, tests the puzzle rules, and publishes only `dist/` after pushes to `master`. It can also be run manually from the repository’s Actions tab. No dependency installation or build step is needed.

One-time setup: in [Settings → Pages](https://github.com/alexeyvax/fifteen-puzzle/settings/pages), set **Build and deployment → Source** to **GitHub Actions**. After enabling Pages, run the **Deploy website to GitHub Pages** workflow from the [Actions tab](https://github.com/alexeyvax/fifteen-puzzle/actions/workflows/pages.yml) if the first push happened before Pages was enabled.

After a successful deployment:

- Website: https://alexeyvax.github.io/fifteen-puzzle/
- Privacy Policy: https://alexeyvax.github.io/fifteen-puzzle/privacy.html

Local development still uses `npm run dev`.
