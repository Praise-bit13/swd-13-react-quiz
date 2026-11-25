# Quizzy

A playful, keyboard-friendly trivia quiz powered by the [Open Trivia Database](https://opentdb.com/).

## Features

- Choose a trivia category and difficulty; each quiz contains 10 multiple-choice questions.
- Question and answer text is decoded safely, and answer order is shuffled once when questions load.
- A 15-second timer runs for each unanswered question.
- Answer feedback, score, and quiz progress update as you play.
- High score and most recent settings persist in browser local storage.
- Keyboard controls: press **1–4** to select an answer and **Enter** to continue.
- Responsive layout, loading/error states, and screen-reader announcements.

## Run locally

```sh
npm install
npm run dev
```

## Build and preview

```sh
npm run build
npm run preview
```

Vite writes the production site to `dist/`. It contains the built `index.html` and optimized, hashed JavaScript and CSS assets under `dist/assets/`. This is the static output to deploy; it does not contain the source tree or `node_modules`.

## Screenshots

_Screenshot placeholders — add captures of the setup screen, an active question, and the results screen here._

## What I learned about hooks

- **`useReducer`** keeps related quiz transitions—answering, scoring, advancing, timing, and finishing—in one predictable state machine.
- **Custom hooks** let `useLocalStorageState` package persistence and reuse it for both the high score and last-used settings.
- **`useEffect`** synchronizes with external systems such as the Open Trivia Database, browser storage, timers, and keyboard events. Dependency arrays describe when an effect needs to re-run; cleanup aborts requests, clears intervals, and removes event listeners.
- Values such as progress and maximum points are derived from quiz state rather than duplicated, which avoids stale or inconsistent values.

## Deploy with Vercel

1. Push this repository to GitHub.
2. On [vercel.com](https://vercel.com/), choose **Add New → Project** and import the repository.
3. Vercel auto-detects Vite. Confirm the build command is `npm run build` and the output directory is `dist`, then select **Deploy**.
