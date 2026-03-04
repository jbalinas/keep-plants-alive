/**
 * localStorage adapter with versioned schema + migrations.
 */
import type { AppState } from '../domain/types';
import { createInitialState, runMigrations, validateShape } from './migrations';

const STORAGE_KEY = 'keep-plants-alive:v1';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed: unknown = JSON.parse(raw);
    if (!validateShape(parsed)) {
      console.warn('[storage] Unrecognizable state shape; starting fresh.');
      return createInitialState();
    }
    return runMigrations(parsed);
  } catch (err) {
    console.error('[storage] Failed to load state:', err);
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[storage] Failed to save state:', err);
  }
}

export function exportJSON(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `keep-plants-alive-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed: unknown = JSON.parse(e.target?.result as string);
        if (!validateShape(parsed)) {
          reject(new Error('Invalid backup file format.'));
          return;
        }
        resolve(runMigrations(parsed));
      } catch {
        reject(new Error('Could not parse backup file.'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}
