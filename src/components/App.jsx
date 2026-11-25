import { useState } from 'react';
import StartScreen from './StartScreen.jsx';
import Question from './Question.jsx';
import ProgressBar from './ProgressBar.jsx';
import Timer from './Timer.jsx';
import ScoreBoard from './ScoreBoard.jsx';
import ResultScreen from './ResultScreen.jsx';
import styles from './App.module.css';

const sampleQuestion = {
  category: 'Nature',
  difficulty: 'Easy',
  text: 'Which of these animals is the largest mammal on Earth?',
  answers: ['African elephant', 'Blue whale', 'Giraffe', 'Hippopotamus'],
};

function App() {
  const [screen, setScreen] = useState('start');

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <a
          className={styles.brand}
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            setScreen('start');
          }}
          aria-label="Quizzy home"
        >
          <span className={styles.brandIcon} aria-hidden="true">✦</span>
          quizzy
        </a>
        <span className={styles.headerNote}>A little brain boost</span>
      </header>

      {screen === 'start' && (
        <StartScreen onStart={() => setScreen('quiz')} />
      )}

      {screen === 'quiz' && (
        <section className={styles.quizLayout} aria-label="Quiz">
          <div className={styles.quizMain}>
            <div className={styles.quizTopline}>
              <span className={styles.categoryPill}>
                <span aria-hidden="true">🌿</span> {sampleQuestion.category}
              </span>
              <span className={styles.difficulty}>
                {sampleQuestion.difficulty} mode
              </span>
            </div>
            <ProgressBar current={1} total={5} />
            <Question
              question={sampleQuestion.text}
              answers={sampleQuestion.answers}
            />
            <div className={styles.quizFooter}>
              <span className={styles.keyboardHint}>Pick your best answer</span>
              <button
                className={styles.nextButton}
                type="button"
                onClick={() => setScreen('results')}
              >
                Finish quiz <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <aside className={styles.quizSidebar} aria-label="Quiz details">
            <Timer seconds={20} />
            <ScoreBoard score={0} correct={0} />
            <div className={styles.sidebarNote}>
              <span aria-hidden="true">💡</span>
              <p>Take your time. You&apos;ve got this!</p>
            </div>
          </aside>
        </section>
      )}

      {screen === 'results' && (
        <ResultScreen
          score={0}
          total={5}
          onRestart={() => setScreen('start')}
        />
      )}

      <footer className={styles.pageFooter}>
        Made for curious minds <span aria-hidden="true">♥</span>
      </footer>
    </main>
  );
}

export default App;
