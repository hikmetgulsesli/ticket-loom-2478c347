import type { AppState, StorageStatus } from '../types/domain';

const STORAGE_KEY = 'ticket-loom-state-v1';

export interface StoredStateResult {
  state: Partial<AppState> | null;
  status: StorageStatus;
}

export const idleStorageStatus: StorageStatus = {
  kind: 'idle',
  message: 'Storage is ready.',
};

export function loadStoredState(): StoredStateResult {
  if (typeof window === 'undefined') {
    return { state: null, status: idleStorageStatus };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return {
      state: stored ? (JSON.parse(stored) as Partial<AppState>) : null,
      status: stored
        ? { kind: 'saved', message: 'Saved workspace restored from this browser.' }
        : { kind: 'idle', message: 'No saved workspace yet.' },
    };
  } catch {
    return {
      state: null,
      status: {
        kind: 'corrupted',
        message: 'Saved workspace data is corrupted. Retry saving or clear browser data.',
      },
    };
  }
}

export function saveStoredState(state: AppState): StorageStatus {
  if (typeof window === 'undefined') {
    return idleStorageStatus;
  }

  const snapshot: AppState = {
    ...state,
    activeView: state.activeView,
    activePanel: 'none',
    editingTicketId: null,
    itemCount: state.tickets.length,
    lastError: null,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    return { kind: 'saved', message: `Saved ${state.tickets.length} tickets to this browser.` };
  } catch {
    return { kind: 'error', message: 'Browser storage failed. Retry saving or clear data.' };
  }
}

export function clearStoredState(): StorageStatus {
  if (typeof window === 'undefined') {
    return { kind: 'cleared', message: 'Local data cleared.' };
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return { kind: 'cleared', message: 'Local data cleared.' };
  } catch {
    return { kind: 'error', message: 'Could not clear local data.' };
  }
}
