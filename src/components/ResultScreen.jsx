import styles from './ResultScreen.module.css';

function ResultScreen({ score, maxPoints, totalQuestions, highscore, onRestart }) {
  return (
    <section className={styles.result} aria-labelledby="result-title">
      <div className={styles.confetti} aria-hidden="true">✦　✧　✦</div>
      <div className={styles.medal} aria-hidden="true">🏆</div>
      <p className={styles.eyebrow}>QUIZ COMPLETE</p>
      <h1 id="result-title">Look at you go!</h1>
      <p className={styles.message}>You showed up, gave it a go, and learned something along the way.</p>
      <div className={styles.scoreCard}>
        <span className={styles.scoreLabel}>YOUR SCORE</span>
        <span className={styles.score}>{score}<small> / {maxPoints}</small></span>
        <span className={styles.scoreCaption}>
          correct answers · best {highscore} · {totalQuestions} questions
        </span>
      </div>
      <button className={styles.restartButton} type="button" onClick={onRestart}>
        Play again <span aria-hidden="true">↻</span>
      </button>
    </section>
  );
}

export default ResultScreen;
