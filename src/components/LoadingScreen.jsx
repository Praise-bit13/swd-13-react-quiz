import styles from './StatusScreen.module.css';

function LoadingScreen({ message }) {
  return (
    <section className={styles.panel} aria-live="polite">
      <span className={styles.icon} aria-hidden="true">✦</span>
      <h1>Getting your quiz ready...</h1>
      <p>{message}</p>
      <span className={styles.spinner} aria-label="Loading" />
    </section>
  );
}

export default LoadingScreen;
