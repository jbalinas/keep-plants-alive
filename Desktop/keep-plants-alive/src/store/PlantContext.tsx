import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState } from '../domain/types';
import { loadState, saveState } from '../storage/adapter';
import { reducer, Action } from './reducer';

interface PlantContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const PlantContext = createContext<PlantContextValue | null>(null);

export function PlantProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <PlantContext.Provider value={{ state, dispatch }}>
      {children}
    </PlantContext.Provider>
  );
}

export function usePlantStore(): PlantContextValue {
  const ctx = useContext(PlantContext);
  if (!ctx) throw new Error('usePlantStore must be used within PlantProvider');
  return ctx;
}
