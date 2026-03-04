import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { usePlantStore } from '../store/PlantContext';
import { enrichPlant, urgencyLabel } from '../domain/scheduling';
import { LIGHT_LEVEL_LABELS } from '../domain/types';
import Badge from '../ui/components/Badge';
import WaterButton from '../ui/components/WaterButton';
import styles from './PlantDetail.module.css';

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = usePlantStore();
  const navigate = useNavigate();

  const plant = state.plants.find((p) => p.id === id);
  if (!plant) return <p style={{ padding: '2rem' }}>Plant not found. <Link to="/plants">Back to list</Link></p>;

  const enriched = enrichPlant(plant);
  const history = state.wateringHistory
    .filter((e) => e.plantId === id)
    .sort((a, b) => b.wateredAt.localeCompare(a.wateredAt));

  const variant = enriched.isOverdue ? 'overdue' : enriched.isDue ? 'due' : 'ok';

  function handleDelete() {
    if (window.confirm(`Delete "${plant.name}"? This cannot be undone.`)) {
      dispatch({ type: 'DELETE_PLANT', payload: { id: plant.id } });
      navigate('/plants');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/plants" className={styles.back}>← All plants</Link>
        <div className={styles.topActions}>
          <Link to={`/plants/${id}/edit`} className={styles.btnEdit}>Edit</Link>
          <button className={styles.btnDelete} onClick={handleDelete} type="button">Delete</button>
        </div>
      </div>

      <header className={styles.header}>
        <div>
          <Badge variant={variant}>{urgencyLabel(enriched)}</Badge>
          <h1 className={styles.name}>{plant.name}</h1>
          {plant.species && <p className={styles.species}>{plant.species}</p>}
        </div>
        <WaterButton onClick={() => dispatch({ type: 'WATER_PLANT', payload: { id: plant.id } })} />
      </header>

      <section aria-label="Plant details" className={styles.details}>
        {plant.location && (
          <div className={styles.detail}><span className={styles.detailLabel}>Location</span><span>{plant.location}</span></div>
        )}
        {plant.lightLevel && (
          <div className={styles.detail}><span className={styles.detailLabel}>Light</span><span>{LIGHT_LEVEL_LABELS[plant.lightLevel]}</span></div>
        )}
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Watering</span>
          <span>Every {plant.wateringEveryDays} day{plant.wateringEveryDays === 1 ? '' : 's'}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Last watered</span>
          <span>{format(parseISO(plant.lastWateredAt), 'MMMM d, yyyy')}</span>
        </div>
        {plant.notes && (
          <div className={styles.detail}><span className={styles.detailLabel}>Notes</span><span className={styles.notes}>{plant.notes}</span></div>
        )}
      </section>

      <section aria-labelledby="history-heading" className={styles.historySection}>
        <h2 id="history-heading" className={styles.historyHeading}>Watering history</h2>
        {history.length === 0 ? (
          <p className={styles.noHistory}>No watering events recorded yet.</p>
        ) : (
          <ol className={styles.historyList} aria-label="Watering events, most recent first">
            {history.map((event) => (
              <li key={event.id} className={styles.historyItem}>
                <span className={styles.historyDot} aria-hidden="true">💧</span>
                <span>{format(parseISO(event.wateredAt), 'MMMM d, yyyy — h:mm a')}</span>
                {event.note && <span className={styles.historyNote}>{event.note}</span>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
