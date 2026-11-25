import { useEffect, useReducer } from 'react';
import StartScreen from './StartScreen.jsx';
import LoadingScreen from './LoadingScreen.jsx';
import ErrorScreen from './ErrorScreen.jsx';
import Question from './Question.jsx';
import ProgressBar from './ProgressBar.jsx';
import Timer from './Timer.jsx';
import ScoreBoard from './ScoreBoard.jsx';
import ResultScreen from './ResultScreen.jsx';
import styles from './App.module.css';

const QUESTION_SECONDS = 15;
const CATEGORY_URL = 'https://opentdb.com/api_category.php';
const QUESTION_URL = 'https://opentdb.com/api.php';

const initialState = {
  status: 'idle',
  questions: [],
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: QUESTION_SECONDS,
  highscore: 0,
  categories: [],
  categoriesStatus: 'loading',
  categoriesRequest: 0,
  categoriesError: '',
  questionRequest: 0,
  categoryId: null,
  difficulty: 'easy',
  errorMessage: '',
};

const responseMessages = {
  1: 'No questions are available for this category and difficulty.',
  2: 'The selected category or difficulty is invalid.',
  3: 'The trivia API could not find a session. Please try again.',
  4: 'The trivia API session has no questions left. Please try again.',
  5: 'The trivia service is busy. Wait a moment, then try again.',
};

function decodeHtmlEntities(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function normalizeQuestions(results) {
  return results.map((item) => {
    const answers = shuffle([
      { text: decodeHtmlEntities(item.correct_answer), correct: true },
      ...item.incorrect_answers.map((answer) => ({
        text: decodeHtmlEntities(answer),
        correct: false,
      })),
    ]);

    return {
      category: decodeHtmlEntities(item.category),
      difficulty: item.difficulty,
      text: decodeHtmlEntities(item.question),
      answers: answers.map((answer) => answer.text),
      correctAnswer: answers.findIndex((answer) => answer.correct),
    };
  });
}

function finishQuiz(state) {
  return {
    ...state,
    status: 'finished',
    highscore: Math.max(state.highscore, state.points),
  };
}

function quizReducer(state, action) {
  switch (action.type) {
    case 'start':
      if (state.status === 'ready') {
        return { ...state, status: 'active', secondsRemaining: QUESTION_SECONDS };
      }
      if (state.status === 'idle' || state.status === 'error') {
        return {
          ...state,
          status: 'loading',
          categoryId: action.categoryId ?? state.categoryId,
          difficulty: action.difficulty ?? state.difficulty,
          questionRequest: state.questionRequest + 1,
          errorMessage: '',
        };
      }
      return state;

    case 'dataReceived':
      if (
        state.status !== 'loading'
        || action.requestId !== state.questionRequest
      ) {
        return state;
      }
      if (!action.questions.length) {
        return {
          ...state,
          status: 'error',
          errorMessage: 'The trivia service returned no questions. Try another category.',
        };
      }
      return {
        ...state,
        status: 'ready',
        questions: action.questions,
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: QUESTION_SECONDS,
        errorMessage: '',
      };

    case 'dataFailed':
      return state.status === 'loading' && action.requestId === state.questionRequest
        ? { ...state, status: 'error', errorMessage: action.message }
        : state;

    case 'categoriesReceived':
      if (action.requestId !== state.categoriesRequest) return state;
      return {
        ...state,
        categories: action.categories,
        categoriesStatus: 'ready',
        categoriesError: '',
      };

    case 'categoriesFailed':
      return action.requestId === state.categoriesRequest
        ? {
          ...state,
          categoriesStatus: 'error',
          categoriesError: action.message,
        }
        : state;

    case 'retryCategories':
      return {
        ...state,
        categoriesStatus: 'loading',
        categoriesRequest: state.categoriesRequest + 1,
        categoriesError: '',
      };

    case 'newAnswer': {
      const question = state.questions[state.index];
      if (
        state.status !== 'active'
        || state.answer !== null
        || !question
        || !Number.isInteger(action.answer)
        || action.answer < 0
        || action.answer >= question.answers.length
      ) {
        return state;
      }
      return {
        ...state,
        answer: action.answer,
        points: state.points + Number(action.answer === question.correctAnswer),
      };
    }

    case 'nextQuestion':
      if (
        state.status !== 'active'
        || state.answer === null
        || state.index >= state.questions.length - 1
      ) {
        return state;
      }
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        secondsRemaining: QUESTION_SECONDS,
      };

    case 'finish':
      return state.status === 'active' ? finishQuiz(state) : state;

    case 'restart':
      return {
        ...state,
        status: 'idle',
        questions: [],
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: QUESTION_SECONDS,
        errorMessage: '',
      };

    case 'tick':
      if (state.status !== 'active' || state.answer !== null) return state;
      return state.secondsRemaining <= 1
        ? finishQuiz(state)
        : { ...state, secondsRemaining: state.secondsRemaining - 1 };

    default:
      return state;
  }
}

function getErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}

function isAbortError(error) {
  return error instanceof DOMException && error.name === 'AbortError';
}

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const currentQuestion = state.questions[state.index];
  const maxPoints = state.questions.length;

  useEffect(() => {
    const controller = new AbortController();
    const requestId = state.categoriesRequest;

    async function loadCategories() {
      try {
        const response = await fetch(CATEGORY_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Category request failed (${response.status}).`);
        }
        const data = await response.json();
        if (!Array.isArray(data.trivia_categories) || !data.trivia_categories.length) {
          throw new Error('The trivia service returned no categories.');
        }
        dispatch({
          type: 'categoriesReceived',
          categories: data.trivia_categories,
          requestId,
        });
      } catch (error) {
        if (isAbortError(error)) return;
        dispatch({
          type: 'categoriesFailed',
          message: getErrorMessage(error, 'Could not load trivia categories.'),
          requestId,
        });
      }
    }

    loadCategories();
    return () => controller.abort();
  }, [state.categoriesRequest]);

  useEffect(() => {
    if (state.status !== 'loading') return undefined;

    const controller = new AbortController();
    const requestId = state.questionRequest;

    async function loadQuestions() {
      try {
        const params = new URLSearchParams({
          amount: '10',
          category: String(state.categoryId),
          difficulty: state.difficulty,
          type: 'multiple',
        });
        const response = await fetch(`${QUESTION_URL}?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Question request failed (${response.status}).`);
        }

        const data = await response.json();
        if (!Number.isInteger(data.response_code)) {
          throw new Error('The trivia service returned an invalid response.');
        }
        if (data.response_code !== 0) {
          throw new Error(
            responseMessages[data.response_code]
            ?? `The trivia service returned error ${data.response_code}.`,
          );
        }
        if (!Array.isArray(data.results)) {
          throw new Error('The trivia service returned an invalid question list.');
        }

        dispatch({
          type: 'dataReceived',
          questions: normalizeQuestions(data.results),
          requestId,
        });
      } catch (error) {
        if (isAbortError(error)) return;
        dispatch({
          type: 'dataFailed',
          message: getErrorMessage(error, 'Could not load questions. Please try again.'),
          requestId,
        });
      }
    }

    loadQuestions();
    return () => controller.abort();
  }, [state.status, state.questionRequest, state.categoryId, state.difficulty]);

  useEffect(() => {
    if (state.status !== 'active' || state.answer !== null) return undefined;
    const intervalId = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(intervalId);
  }, [state.status, state.answer, state.index]);

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <a
          className={styles.brand}
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            dispatch({ type: 'restart' });
          }}
          aria-label="Quizzy home"
        >
          <span className={styles.brandIcon} aria-hidden="true">✦</span>
          quizzy
        </a>
        <span className={styles.headerNote}>A little brain boost</span>
      </header>

      {state.status === 'idle' && state.categoriesStatus === 'loading' && (
        <LoadingScreen message="Loading quiz categories..." />
      )}

      {state.status === 'idle' && state.categoriesStatus === 'ready' && (
        <StartScreen
          categories={state.categories}
          categoryId={state.categoryId}
          onStart={(settings) => dispatch({ type: 'start', ...settings })}
        />
      )}

      {state.status === 'idle' && state.categoriesStatus === 'error' && (
        <ErrorScreen
          message={state.categoriesError}
          onRetry={() => dispatch({ type: 'retryCategories' })}
        />
      )}

      {state.status === 'loading' && (
        <LoadingScreen message="Fetching questions for your quiz..." />
      )}

      {state.status === 'ready' && (
        <section className={styles.statusPanel} aria-labelledby="ready-title">
          <span className={styles.statusIcon} aria-hidden="true">🧠</span>
          <h1 id="ready-title">Your quiz is ready!</h1>
          <p>{state.questions.length} questions, one little brain boost.</p>
          <button
            className={styles.nextButton}
            type="button"
            onClick={() => dispatch({ type: 'start' })}
          >
            Start quiz <span aria-hidden="true">→</span>
          </button>
        </section>
      )}

      {state.status === 'active' && currentQuestion && (
        <section className={styles.quizLayout} aria-label="Quiz">
          <div className={styles.quizMain}>
            <div className={styles.quizTopline}>
              <span className={styles.categoryPill}>
                <span aria-hidden="true">🌿</span> {currentQuestion.category}
              </span>
              <span className={styles.difficulty}>
                {currentQuestion.difficulty} mode
              </span>
            </div>
            <ProgressBar current={state.index + 1} total={state.questions.length} />
            <Question
              question={currentQuestion.text}
              questionNumber={state.index + 1}
              totalQuestions={state.questions.length}
              answers={currentQuestion.answers}
              correctAnswer={currentQuestion.correctAnswer}
              answer={state.answer}
              onAnswer={(answer) => dispatch({ type: 'newAnswer', answer })}
            />
            <div className={styles.quizFooter}>
              <span className={styles.keyboardHint}>
                {state.answer === null ? 'Pick your best answer' : 'Nice work!'}
              </span>
              {state.answer !== null && (
                <button
                  className={styles.nextButton}
                  type="button"
                  onClick={() => {
                    if (state.index === state.questions.length - 1) {
                      dispatch({ type: 'finish' });
                    } else {
                      dispatch({ type: 'nextQuestion' });
                    }
                  }}
                >
                  {state.index === state.questions.length - 1 ? 'See results' : 'Next question'}
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </div>
          <aside className={styles.quizSidebar} aria-label="Quiz details">
            <Timer seconds={state.secondsRemaining} />
            <ScoreBoard score={state.points} correct={state.points} highscore={state.highscore} />
            <div className={styles.sidebarNote}>
              <span aria-hidden="true">💡</span>
              <p>Take your time. You&apos;ve got this!</p>
            </div>
          </aside>
        </section>
      )}

      {state.status === 'finished' && (
        <ResultScreen
          score={state.points}
          maxPoints={maxPoints}
          totalQuestions={state.questions.length}
          highscore={state.highscore}
          onRestart={() => dispatch({ type: 'restart' })}
        />
      )}

      {state.status === 'error' && (
        <ErrorScreen
          message={state.errorMessage}
          onRetry={() => dispatch({ type: 'start' })}
        />
      )}

      <footer className={styles.pageFooter}>
        Made for curious minds <span aria-hidden="true">♥</span>
      </footer>
    </main>
  );
}

export default App;
