import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePlantStore } from '../store/PlantContext';
import { enrichPlant, urgencyLabel } from '../domain/scheduling';
import { exportJSON, importJSON } from '../storage/adapter';
import EmptyState from '../ui/components/EmptyState';
import Badge from '../ui/components/Badge';
import styles from './PlantList.module.css';

export default function PlantList() {
  const { state, dispatch } = usePlantStore();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importJSON(file);
      if (window.confirm(`Import will replace all current data (${imported.plants.length} plants). Continue?`)) {
        dispatch({ type: 'IMPORT_STATE', payload: imported });
      }
    } catch (err) {
      alert((err as Error).message);
    }
    e.target.value = '';
  }

  const enriched = state.plants.map((p) => enrichPlant(p));

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>All plants</h1>
        <div className={styles.toolbar}>
          <button className={styles.btnOutline} onClick={() => exportJSON(state)} type="button">
            ↓ Export
          </button>
          <button className={styles.btnOutline} onClick={() => fileRef.current?.click()} type="button">
            ↑ Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="visually-hidden"
            aria-label="Import JSON backup"
            onChange={handleImport}
          />
          <Link to="/add" className={styles.btnPrimary}>+ Add plant</Link>
        </div>
      </div>

      {enriched.length === 0 ? (
        <EmptyState message="Your plant collection is empty." ctaLabel="Add your first plant" ctaTo="/add" />
      ) : (
        <ul className={styles.list} role="list">
          {enriched.map((p) => {
            const variant = p.isOverdue ? 'overdue' : p.isDue ? 'due' : 'ok';
            return (
              <li key={p.id} className={styles.row}>
                <div className={styles.info}>
                  <Link to={`/plants/${p.id}`} className={styles.name}>{p.name}</Link>
                  {p.species && <span className={styles.species}>{p.species}</span>}
                </div>
                <Badge variant={variant}>{urgencyLabel(p)}</Badge>
                <div>
                  <Link to={`/plants/${p.id}/edit`} className={styles.editLink}>Edit</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
