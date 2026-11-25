import { useEffect, useReducer } from 'react';
import StartScreen from './StartScreen.jsx';
import Question from './Question.jsx';
import ProgressBar from './ProgressBar.jsx';
import Timer from './Timer.jsx';
import ScoreBoard from './ScoreBoard.jsx';
import ResultScreen from './ResultScreen.jsx';
import styles from './App.module.css';

const QUESTION_SECONDS = 20;

const sampleQuestions = [
  {
    category: 'Nature',
    difficulty: 'Easy',
    text: 'Which of these animals is the largest mammal on Earth?',
    answers: ['African elephant', 'Blue whale', 'Giraffe', 'Hippopotamus'],
    correctAnswer: 1,
  },
  {
    category: 'Nature',
    difficulty: 'Easy',
    text: 'Which gas do plants absorb from the atmosphere?',
    answers: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'],
    correctAnswer: 1,
  },
  {
    category: 'Nature',
    difficulty: 'Easy',
    text: 'What is the largest ocean on Earth?',
    answers: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    correctAnswer: 2,
  },
  {
    category: 'Nature',
    difficulty: 'Easy',
    text: 'How many legs does an adult insect have?',
    answers: ['Four', 'Six', 'Eight', 'Ten'],
    correctAnswer: 1,
  },
  {
    category: 'Nature',
    difficulty: 'Easy',
    text: 'About how long does Earth take to orbit the Sun?',
    answers: ['One day', 'One month', 'One year', 'Ten years'],
    correctAnswer: 2,
  },
];

const initialState = {
  status: 'idle',
  questions: [],
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: QUESTION_SECONDS,
  highscore: 0,
};

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
        return { ...state, status: 'loading' };
      }
      return state;

    case 'dataReceived':
      if (state.status !== 'loading') return state;
      if (!action.questions.length) return { ...state, status: 'error' };
      return {
        ...state,
        status: 'ready',
        questions: action.questions,
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: QUESTION_SECONDS,
      };

    case 'dataFailed':
      return state.status === 'loading' ? { ...state, status: 'error' } : state;

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
      return { ...initialState, highscore: state.highscore };

    case 'tick':
      if (state.status !== 'active' || state.answer !== null) return state;
      return state.secondsRemaining <= 1
        ? finishQuiz(state)
        : { ...state, secondsRemaining: state.secondsRemaining - 1 };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const currentQuestion = state.questions[state.index];
  const maxPoints = state.questions.length;

  useEffect(() => {
    if (state.status === 'loading') {
      dispatch({ type: 'dataReceived', questions: sampleQuestions });
    }
  }, [state.status]);

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

      {state.status === 'idle' && (
        <StartScreen onStart={() => dispatch({ type: 'start' })} />
      )}

      {state.status === 'loading' && (
        <section className={styles.statusPanel} aria-live="polite">
          <span className={styles.statusIcon} aria-hidden="true">✦</span>
          <h1>Getting your quiz ready...</h1>
          <p>Just a moment while we pick your questions.</p>
        </section>
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
        <section className={styles.statusPanel} role="alert">
          <span className={styles.statusIcon} aria-hidden="true">!</span>
          <h1>We couldn&apos;t load your quiz.</h1>
          <p>Please try again in a moment.</p>
          <button
            className={styles.nextButton}
            type="button"
            onClick={() => dispatch({ type: 'start' })}
          >
            Try again <span aria-hidden="true">↻</span>
          </button>
        </section>
      )}

      <footer className={styles.pageFooter}>
        Made for curious minds <span aria-hidden="true">♥</span>
      </footer>
    </main>
  );
}

export default App;
