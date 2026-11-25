import styles from './ScoreBoard.module.css';

function ScoreBoard({ score, correct, highscore }) {
  return (
    <section className={styles.scoreBoard} aria-label="Current score">
      <p className={styles.heading}>YOUR SCORE</p>
      <p className={styles.score}>{score}<span> pts</span></p>
      <div className={styles.divider} />
      <p className={styles.correct}>
        <span aria-hidden="true">✓</span> {correct} correct so far
      </p>
      <p className={styles.highscore}>Best: {highscore}</p>
    </section>
  );
}

export default ScoreBoard;
