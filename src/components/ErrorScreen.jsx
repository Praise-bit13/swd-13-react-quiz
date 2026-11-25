import styles from './StatusScreen.module.css';

function ErrorScreen({ message, onRetry }) {
  return (
    <section className={styles.panel} role="alert">
      <span className={`${styles.icon} ${styles.errorIcon}`} aria-hidden="true">!</span>
      <h1>We couldn&apos;t load your quiz.</h1>
      <p>{message}</p>
      <button className={styles.retryButton} type="button" onClick={onRetry}>
        Try again <span aria-hidden="true">↻</span>
      </button>
    </section>
  );
}

export default ErrorScreen;
