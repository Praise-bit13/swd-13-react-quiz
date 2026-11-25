import styles from './Question.module.css';

function Question({
  question,
  questionNumber,
  totalQuestions,
  answers,
  correctAnswer,
  answer,
  onAnswer,
}) {
  return (
    <section className={styles.question} aria-labelledby="question-title">
      <p className={styles.kicker}>
        QUESTION {String(questionNumber).padStart(2, '0')}
        <span> / {String(totalQuestions).padStart(2, '0')}</span>
      </p>
      <h1 className={styles.title} id="question-title">{question}</h1>
      <div className={styles.answers} role="group" aria-label="Choose an answer">
        {answers.map((option, index) => {
          const isCorrect = answer !== null && index === correctAnswer;
          const isIncorrect = answer === index && index !== correctAnswer;
          const answerClass = [
            styles.answer,
            isCorrect && styles.answerCorrect,
            isIncorrect && styles.answerIncorrect,
          ].filter(Boolean).join(' ');
          const letter = String.fromCharCode(65 + index);
          const feedback = isCorrect
            ? ', correct answer'
            : isIncorrect
              ? ', incorrect answer'
              : '';

          return (
            <button
              className={answerClass}
              key={option}
              type="button"
              onClick={() => onAnswer(index)}
              disabled={answer !== null}
              aria-pressed={answer === index}
              aria-label={`${letter} ${option}${feedback}`}
            >
              <span className={styles.letter}>{letter}</span>
              <span className={styles.answerText}>{option}</span>
              <span className={styles.indicator} aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <span className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
        {answer === null
          ? ''
          : answer === correctAnswer
            ? 'Correct!'
            : `Incorrect. The correct answer is ${answers[correctAnswer]}.`}
      </span>
    </section>
  );
}

export default Question;
