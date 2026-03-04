/**
 * Pure scheduling functions — no side effects, fully testable.
 */
import { differenceInCalendarDays, parseISO, startOfToday } from 'date-fns';
import type { Plant, PlantWithSchedule } from './types';

/**
 * Returns how many calendar days have elapsed since `lastWateredAt`.
 * Uses calendar days (not 24h periods) so "watered yesterday" is always 1.
 */
export function daysSinceWatered(lastWateredAt: string, today = startOfToday()): number {
  return differenceInCalendarDays(today, parseISO(lastWateredAt));
}

/**
 * Returns the number of days until the plant is due to be watered.
 * Negative value = overdue by that many days.
 */
export function daysUntilDue(plant: Pick<Plant, 'wateringEveryDays' | 'lastWateredAt'>, today = startOfToday()): number {
  const elapsed = daysSinceWatered(plant.lastWateredAt, today);
  return plant.wateringEveryDays - elapsed;
}

/**
 * Enriches a plant with scheduling metadata.
 */
export function enrichPlant(plant: Plant, today = startOfToday()): PlantWithSchedule {
  const elapsed = daysSinceWatered(plant.lastWateredAt, today);
  const until = plant.wateringEveryDays - elapsed;
  return {
    ...plant,
    daysSinceWatered: elapsed,
    daysUntilDue: until,
    isDue: until <= 0,
    isOverdue: elapsed > plant.wateringEveryDays,
  };
}

/**
 * Returns plants sorted for the dashboard:
 * 1. Overdue (most overdue first)
 * 2. Due today
 * 3. Upcoming (soonest first)
 */
export function sortByUrgency(plants: PlantWithSchedule[]): PlantWithSchedule[] {
  return [...plants].sort((a, b) => {
    if (a.isDue && b.isDue) return a.daysUntilDue - b.daysUntilDue;
    if (a.isDue) return -1;
    if (b.isDue) return 1;
    return a.daysUntilDue - b.daysUntilDue;
  });
}

/**
 * Human-readable urgency label for a plant.
 */
export function urgencyLabel(plant: PlantWithSchedule): string {
  if (plant.daysUntilDue < 0) {
    const n = Math.abs(plant.daysUntilDue);
    return `Overdue by ${n} day${n === 1 ? '' : 's'}`;
  }
  if (plant.daysUntilDue === 0) return 'Due today';
  if (plant.daysUntilDue === 1) return 'Due tomorrow';
  return `In ${plant.daysUntilDue} days`;
}
