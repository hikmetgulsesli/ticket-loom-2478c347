import { createContext, useContext, type ReactNode } from 'react';
import type { AppActions, AppState } from '../types/domain';
import { useAppState } from '../hooks/useAppState';

interface AppContextValue {
  state: AppState;
  actions: AppActions;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const value = useAppState();

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return value;
}
