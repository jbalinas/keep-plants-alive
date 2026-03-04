import type { AppState, Plant, WateringEvent } from '../domain/types';

function generateId(): string {
  return crypto.randomUUID();
}

export type Action =
  | { type: 'ADD_PLANT'; payload: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_PLANT'; payload: { id: string } & Partial<Plant> }
  | { type: 'DELETE_PLANT'; payload: { id: string } }
  | { type: 'WATER_PLANT'; payload: { id: string; note?: string } }
  | { type: 'IMPORT_STATE'; payload: AppState };

export function reducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'ADD_PLANT': {
      const plant: Plant = {
        ...action.payload,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, plants: [...state.plants, plant] };
    }

    case 'UPDATE_PLANT': {
      return {
        ...state,
        plants: state.plants.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload, updatedAt: now } : p
        ),
      };
    }

    case 'DELETE_PLANT': {
      return {
        ...state,
        plants: state.plants.filter((p) => p.id !== action.payload.id),
        wateringHistory: state.wateringHistory.filter((e) => e.plantId !== action.payload.id),
      };
    }

    case 'WATER_PLANT': {
      const event: WateringEvent = {
        id: generateId(),
        plantId: action.payload.id,
        wateredAt: now,
        note: action.payload.note,
      };
      return {
        ...state,
        plants: state.plants.map((p) =>
          p.id === action.payload.id ? { ...p, lastWateredAt: now, updatedAt: now } : p
        ),
        wateringHistory: [...state.wateringHistory, event],
      };
    }

    case 'IMPORT_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
}
