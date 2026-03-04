import { useMemo } from 'react';
import { startOfToday } from 'date-fns';
import { usePlantStore } from '../store/PlantContext';
import { enrichPlant, sortByUrgency } from '../domain/scheduling';
import PlantCard from '../ui/components/PlantCard';
import EmptyState from '../ui/components/EmptyState';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { state, dispatch } = usePlantStore();
  const today = startOfToday();

  const enriched = useMemo(
    () => sortByUrgency(state.plants.map((p) => enrichPlant(p, today))),
    [state.plants, today]
  );

  const due = enriched.filter((p) => p.isDue);
  const upcoming = enriched.filter((p) => !p.isDue);

  function handleWater(id: string) {
    dispatch({ type: 'WATER_PLANT', payload: { id } });
  }

  return (
    <div>
      <h1 className={styles.heading}>Today</h1>
      <p className={styles.sub}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      {state.plants.length === 0 && (
        <EmptyState
          message="No plants yet. Add your first one to get started."
          ctaLabel="Add a plant"
          ctaTo="/add"
        />
      )}

      {due.length > 0 && (
        <section aria-labelledby="due-heading" className={styles.section}>
          <h2 id="due-heading" className={styles.sectionHeading}>
            Needs water
            <span className={styles.count} aria-label={`${due.length} plants`}>{due.length}</span>
          </h2>
          <ul className={styles.list} role="list">
            {due.map((p) => (
              <li key={p.id}>
                <PlantCard plant={p} onWater={handleWater} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-heading" className={styles.section}>
          <h2 id="upcoming-heading" className={styles.sectionHeading}>Upcoming</h2>
          <ul className={styles.list} role="list">
            {upcoming.map((p) => (
              <li key={p.id}>
                <PlantCard plant={p} onWater={handleWater} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
