import type { AppState } from '../types/domain';

const STORAGE_KEY = 'ticket-loom-state-v1';

export function loadStoredState(): Partial<AppState> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Partial<AppState>) : null;
  } catch {
    return null;
  }
}

export function saveStoredState(state: AppState) {
  if (typeof window === 'undefined') {
    return;
  }

  const snapshot: AppState = {
    ...state,
    activeView: state.activeView,
    lastError: null,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearStoredState() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
