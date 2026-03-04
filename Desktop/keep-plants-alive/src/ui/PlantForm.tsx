import { useState } from 'react';
import type { Plant, LightLevel } from '../domain/types';
import { LIGHT_LEVEL_LABELS } from '../domain/types';
import styles from './PlantForm.module.css';

type FormData = Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>;

interface Props {
  initialValues?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const LIGHT_LEVELS: LightLevel[] = ['low', 'medium', 'bright', 'direct'];

export default function PlantForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }: Props) {
  const [form, setForm] = useState<FormData>({
    name: initialValues?.name ?? '',
    species: initialValues?.species ?? '',
    location: initialValues?.location ?? '',
    lightLevel: initialValues?.lightLevel ?? undefined,
    wateringEveryDays: initialValues?.wateringEveryDays ?? 7,
    lastWateredAt: initialValues?.lastWateredAt ?? new Date().toISOString().slice(0, 10),
    notes: initialValues?.notes ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (form.wateringEveryDays < 1) next.wateringEveryDays = 'Must be at least 1 day';
    if (!form.lastWateredAt) next.lastWateredAt = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      lastWateredAt: new Date(form.lastWateredAt).toISOString(),
    });
  }

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form} aria-label="Plant details form">
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name <span aria-hidden="true" className={styles.required}>*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          aria-required="true"
          aria-describedby={errors.name ? 'name-error' : undefined}
          autoFocus
        />
        {errors.name && <p id="name-error" role="alert" className={styles.error}>{errors.name}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="species" className={styles.label}>Species</label>
        <input
          id="species"
          type="text"
          value={form.species ?? ''}
          onChange={(e) => set('species', e.target.value)}
          className={styles.input}
          placeholder="e.g. Monstera deliciosa"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="location" className={styles.label}>Location</label>
        <input
          id="location"
          type="text"
          value={form.location ?? ''}
          onChange={(e) => set('location', e.target.value)}
          className={styles.input}
          placeholder="e.g. Living room windowsill"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="lightLevel" className={styles.label}>Light level</label>
        <select
          id="lightLevel"
          value={form.lightLevel ?? ''}
          onChange={(e) => set('lightLevel', (e.target.value as LightLevel) || undefined)}
          className={styles.input}
        >
          <option value="">— Select —</option>
          {LIGHT_LEVELS.map((l) => (
            <option key={l} value={l}>{LIGHT_LEVEL_LABELS[l]}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="wateringEveryDays" className={styles.label}>
          Water every <span aria-hidden="true" className={styles.required}>*</span>
        </label>
        <div className={styles.inlineInput}>
          <input
            id="wateringEveryDays"
            type="number"
            min={1}
            max={365}
            value={form.wateringEveryDays}
            onChange={(e) => set('wateringEveryDays', parseInt(e.target.value, 10) || 1)}
            className={`${styles.input} ${styles.inputNarrow} ${errors.wateringEveryDays ? styles.inputError : ''}`}
            aria-required="true"
          />
          <span className={styles.unit}>days</span>
        </div>
        {errors.wateringEveryDays && <p role="alert" className={styles.error}>{errors.wateringEveryDays}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="lastWateredAt" className={styles.label}>
          Last watered <span aria-hidden="true" className={styles.required}>*</span>
        </label>
        <input
          id="lastWateredAt"
          type="date"
          value={form.lastWateredAt.slice(0, 10)}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => set('lastWateredAt', e.target.value)}
          className={`${styles.input} ${styles.inputNarrow} ${errors.lastWateredAt ? styles.inputError : ''}`}
          aria-required="true"
        />
        {errors.lastWateredAt && <p role="alert" className={styles.error}>{errors.lastWateredAt}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="notes" className={styles.label}>Notes</label>
        <textarea
          id="notes"
          value={form.notes ?? ''}
          onChange={(e) => set('notes', e.target.value)}
          className={styles.textarea}
          rows={3}
          placeholder="Care tips, quirks, reminders..."
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary}>{submitLabel}</button>
        <button type="button" className={styles.btnSecondary} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
