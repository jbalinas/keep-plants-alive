import { Link } from 'react-router-dom';
import type { PlantWithSchedule } from '../../domain/types';
import { urgencyLabel } from '../../domain/scheduling';
import Badge from './Badge';
import WaterButton from './WaterButton';
import styles from './PlantCard.module.css';

interface Props {
  plant: PlantWithSchedule;
  onWater: (id: string) => void;
  showBadge?: boolean;
}

export default function PlantCard({ plant, onWater, showBadge = true }: Props) {
  const variant = plant.isOverdue ? 'overdue' : plant.isDue ? 'due' : 'ok';

  return (
    <article className={`${styles.card} ${styles[variant]}`} aria-label={`Plant: ${plant.name}`}>
      <div className={styles.body}>
        <div className={styles.meta}>
          {showBadge && <Badge variant={variant}>{urgencyLabel(plant)}</Badge>}
          {plant.location && <span className={styles.location}>{plant.location}</span>}
        </div>
        <h2 className={styles.name}>
          <Link to={`/plants/${plant.id}`}>{plant.name}</Link>
        </h2>
        {plant.species && <p className={styles.species}>{plant.species}</p>}
        <p className={styles.schedule}>
          Every {plant.wateringEveryDays} day{plant.wateringEveryDays === 1 ? '' : 's'}
        </p>
      </div>
      <div className={styles.actions}>
        <WaterButton onClick={() => onWater(plant.id)} />
        <Link to={`/plants/${plant.id}/edit`} className={styles.editLink} aria-label={`Edit ${plant.name}`}>
          Edit
        </Link>
      </div>
    </article>
  );
}
