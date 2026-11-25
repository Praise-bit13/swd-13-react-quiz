import styles from './StartScreen.module.css';

const categories = ['General knowledge', 'Science', 'Nature', 'History', 'Movies'];

function StartScreen({ onStart }) {
  function handleSubmit(event) {
    event.preventDefault();
    onStart();
  }

  return (
    <section className={styles.start} aria-labelledby="welcome-title">
      <div className={styles.hero}>
        <div className={styles.eyebrow}>
          <span aria-hidden="true">✦</span> YOUR DAILY DOSE OF FUN
        </div>
        <h1 id="welcome-title">
          Ready to give
          <br />
          your brain a <span>workout?</span>
        </h1>
        <p className={styles.intro}>
          Pick a topic, trust your gut, and see what you know.
          <br className={styles.desktopBreak} /> No pressure — just good questions.
        </p>
      </div>

      <form className={styles.setupCard} onSubmit={handleSubmit}>
        <div className={styles.cardHeading}>
          <div>
            <h2>Set up your quiz</h2>
            <p>Make it your kind of challenge</p>
          </div>
          <span className={styles.cardEmoji} aria-hidden="true">🧠</span>
        </div>

        <div className={styles.fields}>
          <label className={styles.field}>
            <span className={styles.labelText}>Category</span>
            <select className={styles.select} defaultValue="Nature">
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.labelText}>Difficulty</span>
            <select className={styles.select} defaultValue="Easy">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
        </div>

        <fieldset className={styles.questionCount}>
          <legend className={styles.labelText}>Number of questions</legend>
          <div className={styles.countOptions}>
            {[5, 10, 15].map((count, index) => (
              <label className={styles.countOption} key={count}>
                <input
                  type="radio"
                  name="question-count"
                  value={count}
                  defaultChecked={index === 0}
                />
                <span>{count}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button className={styles.startButton} type="submit">
          Let&apos;s play <span aria-hidden="true">→</span>
        </button>
        <p className={styles.footnote}>
          <span aria-hidden="true">⚡</span> Takes about 2 minutes
        </p>
      </form>

      <div className={`${styles.decor} ${styles.decorTop}`} aria-hidden="true">✳</div>
      <div className={`${styles.decor} ${styles.decorSide}`} aria-hidden="true">✦</div>
    </section>
  );
}

export default StartScreen;
