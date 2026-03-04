import styles from './Badge.module.css';

type Variant = 'overdue' | 'due' | 'ok';

interface Props {
  variant: Variant;
  children: React.ReactNode;
}

export default function Badge({ variant, children }: Props) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}
