/**
 * Schema versioning and migration system for localStorage.
 *
 * To add a migration:
 * 1. Increment CURRENT_SCHEMA_VERSION
 * 2. Add a case to the switch in `runMigrations`
 * 3. Add a corresponding test
 */
import type { AppState } from '../domain/types';

export const CURRENT_SCHEMA_VERSION = 1;

export function createInitialState(): AppState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    plants: [],
    wateringHistory: [],
  };
}

/**
 * Validates that a parsed JSON blob has the minimum shape of AppState.
 */
export function validateShape(raw: unknown): raw is AppState {
  if (typeof raw !== 'object' || raw === null) return false;
  const obj = raw as Record<string, unknown>;
  return (
    typeof obj['schemaVersion'] === 'number' &&
    Array.isArray(obj['plants']) &&
    Array.isArray(obj['wateringHistory'])
  );
}

interface Plant_v0 {
  updatedAt?: string;
  createdAt?: string;
}

/**
 * Runs all necessary migrations to bring `state` up to CURRENT_SCHEMA_VERSION.
 */
export function runMigrations(state: AppState): AppState {
  let current = { ...state };

  while (current.schemaVersion < CURRENT_SCHEMA_VERSION) {
    switch (current.schemaVersion) {
      case 0:
        // v0 → v1: Added `updatedAt` field to plants (backfill with createdAt)
        current = {
          ...current,
          schemaVersion: 1,
          plants: current.plants.map((p) => ({
            ...p,
            updatedAt: (p as unknown as Plant_v0).updatedAt ?? (p as unknown as Plant_v0).createdAt ?? new Date().toISOString(),
          })),
        };
        break;
      default:
        throw new Error(`Unknown schema version: ${current.schemaVersion}`);
    }
  }

  return current;
}
