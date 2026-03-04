import { describe, it, expect } from 'vitest';
import { startOfToday, subDays } from 'date-fns';
import {
  daysSinceWatered,
  daysUntilDue,
  enrichPlant,
  sortByUrgency,
  urgencyLabel,
} from './scheduling';
import type { Plant } from './types';

function makePlant(overrides: Partial<Plant> = {}): Plant {
  return {
    id: 'test-1',
    name: 'Test Plant',
    wateringEveryDays: 7,
    lastWateredAt: subDays(startOfToday(), 3).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('daysSinceWatered', () => {
  it('returns 0 when watered today', () => {
    const today = startOfToday();
    expect(daysSinceWatered(today.toISOString(), today)).toBe(0);
  });

  it('returns 1 when watered yesterday', () => {
    const today = startOfToday();
    const yesterday = subDays(today, 1);
    expect(daysSinceWatered(yesterday.toISOString(), today)).toBe(1);
  });

  it('returns correct count for N days ago', () => {
    const today = startOfToday();
    expect(daysSinceWatered(subDays(today, 5).toISOString(), today)).toBe(5);
  });
});

describe('daysUntilDue', () => {
  it('returns positive when not yet due', () => {
    const today = startOfToday();
    const plant = makePlant({ wateringEveryDays: 7, lastWateredAt: subDays(today, 3).toISOString() });
    expect(daysUntilDue(plant, today)).toBe(4);
  });

  it('returns 0 when due today', () => {
    const today = startOfToday();
    const plant = makePlant({ wateringEveryDays: 7, lastWateredAt: subDays(today, 7).toISOString() });
    expect(daysUntilDue(plant, today)).toBe(0);
  });

  it('returns negative when overdue', () => {
    const today = startOfToday();
    const plant = makePlant({ wateringEveryDays: 7, lastWateredAt: subDays(today, 10).toISOString() });
    expect(daysUntilDue(plant, today)).toBe(-3);
  });
});

describe('enrichPlant', () => {
  it('marks plant as overdue', () => {
    const today = startOfToday();
    const plant = makePlant({ wateringEveryDays: 5, lastWateredAt: subDays(today, 8).toISOString() });
    const enriched = enrichPlant(plant, today);
    expect(enriched.isOverdue).toBe(true);
    expect(enriched.isDue).toBe(true);
    expect(enriched.daysUntilDue).toBe(-3);
  });

  it('marks plant as due today', () => {
    const today = startOfToday();
    const plant = makePlant({ wateringEveryDays: 7, lastWateredAt: subDays(today, 7).toISOString() });
    const enriched = enrichPlant(plant, today);
    expect(enriched.isDue).toBe(true);
    expect(enriched.isOverdue).toBe(false);
    expect(enriched.daysUntilDue).toBe(0);
  });

  it('marks plant as not due', () => {
    const today = startOfToday();
    const plant = makePlant({ wateringEveryDays: 10, lastWateredAt: subDays(today, 2).toISOString() });
    const enriched = enrichPlant(plant, today);
    expect(enriched.isDue).toBe(false);
    expect(enriched.isOverdue).toBe(false);
    expect(enriched.daysUntilDue).toBe(8);
  });
});

describe('sortByUrgency', () => {
  it('places overdue plants before upcoming', () => {
    const today = startOfToday();
    const upcoming = enrichPlant(makePlant({ id: 'a', wateringEveryDays: 7, lastWateredAt: subDays(today, 1).toISOString() }), today);
    const overdue = enrichPlant(makePlant({ id: 'b', wateringEveryDays: 3, lastWateredAt: subDays(today, 6).toISOString() }), today);
    const sorted = sortByUrgency([upcoming, overdue]);
    expect(sorted[0].id).toBe('b');
  });

  it('sorts most overdue first', () => {
    const today = startOfToday();
    const a = enrichPlant(makePlant({ id: 'a', wateringEveryDays: 7, lastWateredAt: subDays(today, 9).toISOString() }), today);
    const b = enrichPlant(makePlant({ id: 'b', wateringEveryDays: 7, lastWateredAt: subDays(today, 14).toISOString() }), today);
    const sorted = sortByUrgency([a, b]);
    expect(sorted[0].id).toBe('b');
  });
});

describe('urgencyLabel', () => {
  const today = startOfToday();

  it('returns overdue label', () => {
    const p = enrichPlant(makePlant({ wateringEveryDays: 3, lastWateredAt: subDays(today, 6).toISOString() }), today);
    expect(urgencyLabel(p)).toBe('Overdue by 3 days');
  });

  it('returns singular overdue label', () => {
    const p = enrichPlant(makePlant({ wateringEveryDays: 3, lastWateredAt: subDays(today, 4).toISOString() }), today);
    expect(urgencyLabel(p)).toBe('Overdue by 1 day');
  });

  it('returns due today', () => {
    const p = enrichPlant(makePlant({ wateringEveryDays: 7, lastWateredAt: subDays(today, 7).toISOString() }), today);
    expect(urgencyLabel(p)).toBe('Due today');
  });

  it('returns due tomorrow', () => {
    const p = enrichPlant(makePlant({ wateringEveryDays: 7, lastWateredAt: subDays(today, 6).toISOString() }), today);
    expect(urgencyLabel(p)).toBe('Due tomorrow');
  });

  it('returns in N days', () => {
    const p = enrichPlant(makePlant({ wateringEveryDays: 14, lastWateredAt: subDays(today, 2).toISOString() }), today);
    expect(urgencyLabel(p)).toBe('In 12 days');
  });
});
