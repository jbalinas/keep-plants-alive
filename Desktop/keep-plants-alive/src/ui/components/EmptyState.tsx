import { Link } from 'react-router-dom';

interface Props {
  message: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export default function EmptyState({ message, ctaLabel, ctaTo }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#9ca3af' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
      <p style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#6b7280' }}>
        {message}
      </p>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          style={{
            display: 'inline-block',
            background: 'var(--color-leaf)',
            color: 'var(--color-cream)',
            padding: '0.5rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
