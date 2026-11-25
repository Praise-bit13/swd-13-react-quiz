import styles from './Timer.module.css';

function Timer({ seconds }) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;

  return (
    <section className={styles.timer} aria-label="Time remaining">
      <span className={styles.icon} aria-hidden="true">◷</span>
      <div>
        <p className={styles.label}>TIME LEFT</p>
        <p className={styles.value}>{formattedTime}</p>
      </div>
      <span className={styles.static}>STATIC</span>
    </section>
  );
}

export default Timer;
