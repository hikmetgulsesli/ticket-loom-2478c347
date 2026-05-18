export type TicketStatus = 'open' | 'pending' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high';
export type AppView = 'dashboard' | 'create-edit' | 'detail' | 'insights' | 'settings' | 'error-state' | 'empty-state';

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: string;
  updatedAt: string;
  summary: string;
}

export interface SavedView {
  id: string;
  label: string;
  status: TicketStatus | 'all';
}

export interface AppSettings {
  density: 'comfortable' | 'compact';
  theme: 'light' | 'system';
  defaultAssignee: string;
}

export interface TicketDraft {
  title: string;
  requester: string;
  summary: string;
  priority: TicketPriority;
}

export interface AppState {
  activeView: AppView;
  tickets: Ticket[];
  selectedTicketId: string | null;
  statusFilter: TicketStatus | 'all';
  savedViews: SavedView[];
  settings: AppSettings;
  draft: TicketDraft;
  lastError: string | null;
  isPaused: boolean;
}

export interface AppActions {
  navigate: (view: AppView) => void;
  selectTicket: (ticketId: string) => void;
  setStatusFilter: (status: TicketStatus | 'all') => void;
  updateDraft: (draft: Partial<TicketDraft>) => void;
  createTicket: () => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  pauseQueue: () => void;
  restartQueue: () => void;
  saveSettings: (settings?: Partial<AppSettings>) => void;
  resetDefaults: () => void;
  clearError: () => void;
}

export interface AppRuntimeBridge {
  state: AppState;
  actions: AppActions;
}

declare global {
  var app: AppRuntimeBridge | undefined;

  interface Window {
    app?: AppRuntimeBridge;
  }
}
