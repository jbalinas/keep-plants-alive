import { describe, it, expect } from 'vitest';
import { validateShape, runMigrations, createInitialState, CURRENT_SCHEMA_VERSION } from './migrations';
import type { AppState } from '../domain/types';

describe('validateShape', () => {
  it('accepts a valid AppState', () => {
    expect(validateShape(createInitialState())).toBe(true);
  });

  it('rejects null', () => {
    expect(validateShape(null)).toBe(false);
  });

  it('rejects missing plants array', () => {
    expect(validateShape({ schemaVersion: 1, wateringHistory: [] })).toBe(false);
  });

  it('rejects non-object', () => {
    expect(validateShape('string')).toBe(false);
    expect(validateShape(42)).toBe(false);
  });
});

describe('runMigrations', () => {
  it('returns same state when already at current version', () => {
    const state = createInitialState();
    const migrated = runMigrations(state);
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  });

  it('migrates v0 -> v1: backfills updatedAt', () => {
    const v0State: AppState = {
      schemaVersion: 0,
      plants: [
        {
          id: '1',
          name: 'Fern',
          wateringEveryDays: 3,
          lastWateredAt: '2024-01-01T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '',
        },
      ],
      wateringHistory: [],
    };

    const migrated = runMigrations(v0State);
    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.plants[0].updatedAt).toBeTruthy();
  });

  it('throws on unknown schema version', () => {
    const badState: AppState = { schemaVersion: 999, plants: [], wateringHistory: [] };
    expect(() => runMigrations(badState)).toThrow('Unknown schema version');
  });
});
