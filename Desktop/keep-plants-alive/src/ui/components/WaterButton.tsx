import styles from './WaterButton.module.css';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export default function WaterButton({ onClick, disabled }: Props) {
  return (
    <button
      className={styles.btn}
      onClick={onClick}
      disabled={disabled}
      aria-label="Mark as watered today"
      type="button"
    >
      💧 Watered today
    </button>
  );
}
