import styles from './Question.module.css';

function Question({ question, answers }) {
  return (
    <section className={styles.question} aria-labelledby="question-title">
      <p className={styles.kicker}>QUESTION 01 <span> / 05</span></p>
      <h1 className={styles.title} id="question-title">{question}</h1>
      <fieldset className={styles.answers}>
        <legend className={styles.srOnly}>Choose an answer</legend>
        {answers.map((answer, index) => (
          <label className={styles.answer} key={answer}>
            <input type="radio" name="answer" value={answer} />
            <span className={styles.letter}>{String.fromCharCode(65 + index)}</span>
            <span className={styles.answerText}>{answer}</span>
            <span className={styles.indicator} aria-hidden="true" />
          </label>
        ))}
      </fieldset>
    </section>
  );
}

export default Question;
