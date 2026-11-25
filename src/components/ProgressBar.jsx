import styles from './ProgressBar.module.css';

function ProgressBar({ current, total }) {
  const progress = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div
      className={styles.progress}
      role="progressbar"
      aria-label="Quiz progress"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
      <span className={styles.label}>{current} <span>/ {total}</span></span>
    </div>
  );
}

export default ProgressBar;
