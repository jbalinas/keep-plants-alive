/**
 * Core domain types for Keep Plants Alive.
 * All dates are stored as ISO-8601 strings for serialization safety.
 */

export type LightLevel = 'low' | 'medium' | 'bright' | 'direct';

export interface Plant {
  /** UUID v4 generated at creation */
  id: string;
  name: string;
  species?: string;
  location?: string;
  lightLevel?: LightLevel;
  /** How often the plant should be watered, in days */
  wateringEveryDays: number;
  /** ISO-8601 date string of last watering */
  lastWateredAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WateringEvent {
  id: string;
  plantId: string;
  /** ISO-8601 date-time string */
  wateredAt: string;
  note?: string;
}

/**
 * The full persisted app state written to localStorage.
 */
export interface AppState {
  /** Monotonically incrementing schema version for migrations */
  schemaVersion: number;
  plants: Plant[];
  wateringHistory: WateringEvent[];
}

/** Scheduling-enriched view of a plant for the Dashboard */
export interface PlantWithSchedule extends Plant {
  daysSinceWatered: number;
  daysUntilDue: number;
  /** true when daysUntilDue <= 0 */
  isDue: boolean;
  /** true when daysSinceWatered > wateringEveryDays */
  isOverdue: boolean;
}

export const LIGHT_LEVEL_LABELS: Record<LightLevel, string> = {
  low: 'Low light',
  medium: 'Medium light',
  bright: 'Bright indirect',
  direct: 'Direct sun',
};
