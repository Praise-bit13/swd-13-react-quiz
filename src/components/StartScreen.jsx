import styles from './StartScreen.module.css';

function StartScreen({ onStart, categories, categoryId, difficulty }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onStart({
      categoryId: Number(formData.get('category')),
      difficulty: formData.get('difficulty'),
    });
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
            <select
              className={styles.select}
              name="category"
              defaultValue={String(categoryId ?? categories[0].id)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.labelText}>Difficulty</span>
            <select className={styles.select} name="difficulty" defaultValue={difficulty}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>

        <div className={styles.questionCount}>
          <span className={styles.labelText}>Number of questions</span>
          <span className={styles.fixedCount}>10 questions</span>
        </div>

        <button className={styles.startButton} type="submit">
          Let&apos;s play <span aria-hidden="true">→</span>
        </button>
        <p className={styles.footnote}>
          <span aria-hidden="true">⚡</span> Takes about 3 minutes
        </p>
      </form>

      <div className={`${styles.decor} ${styles.decorTop}`} aria-hidden="true">✳</div>
      <div className={`${styles.decor} ${styles.decorSide}`} aria-hidden="true">✦</div>
    </section>
  );
}

export default StartScreen;
