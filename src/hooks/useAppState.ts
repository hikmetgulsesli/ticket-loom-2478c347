import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppActions, AppSettings, AppState, AppView, Ticket, TicketDraft, TicketStatus } from '../types/domain';
import { clearStoredState, loadStoredState, saveStoredState } from '../utils/storage';

const initialTickets: Ticket[] = [
  {
    id: 'TL-1042',
    title: 'Invoice export fails for finance queue',
    requester: 'Mira Chen',
    status: 'open',
    priority: 'high',
    assignee: 'Avery',
    updatedAt: '09:24',
    summary: 'CSV export returns a timeout when the filtered result set includes archived tickets.',
  },
  {
    id: 'TL-1041',
    title: 'New hire cannot access onboarding view',
    requester: 'Jon Bell',
    status: 'pending',
    priority: 'medium',
    assignee: 'Sam',
    updatedAt: '08:50',
    summary: 'Permissions look correct, but the saved onboarding view is hidden after sign-in.',
  },
  {
    id: 'TL-1037',
    title: 'Resolve duplicated Slack notifications',
    requester: 'Nora Patel',
    status: 'resolved',
    priority: 'low',
    assignee: 'Riley',
    updatedAt: 'Yesterday',
    summary: 'Automation sent duplicate alerts after the customer success workflow changed.',
  },
];

const defaultDraft: TicketDraft = {
  title: '',
  requester: '',
  summary: '',
  priority: 'medium',
};

const defaultSettings: AppSettings = {
  density: 'comfortable',
  theme: 'light',
  defaultAssignee: 'Avery',
};

export const defaultState: AppState = {
  activeView: 'dashboard',
  tickets: initialTickets,
  selectedTicketId: initialTickets[0]?.id ?? null,
  statusFilter: 'all',
  savedViews: [
    { id: 'open-priority', label: 'Open priority', status: 'open' },
    { id: 'waiting', label: 'Waiting on customer', status: 'pending' },
    { id: 'resolved-today', label: 'Resolved recently', status: 'resolved' },
  ],
  settings: defaultSettings,
  draft: defaultDraft,
  lastError: null,
  isPaused: false,
};

function createInitialState(): AppState {
  const storedState = loadStoredState();

  return {
    ...defaultState,
    ...storedState,
    draft: { ...defaultDraft, ...storedState?.draft },
    settings: { ...defaultSettings, ...storedState?.settings },
  };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(createInitialState);

  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  const navigate = useCallback((view: AppView) => {
    setState((current) => ({ ...current, activeView: view, lastError: null }));
  }, []);

  const selectTicket = useCallback((ticketId: string) => {
    setState((current) => ({ ...current, selectedTicketId: ticketId, activeView: 'detail', lastError: null }));
  }, []);

  const setStatusFilter = useCallback((status: TicketStatus | 'all') => {
    setState((current) => ({ ...current, statusFilter: status, activeView: 'dashboard' }));
  }, []);

  const updateDraft = useCallback((draft: Partial<TicketDraft>) => {
    setState((current) => ({ ...current, draft: { ...current.draft, ...draft } }));
  }, []);

  const createTicket = useCallback(() => {
    setState((current) => {
      if (!current.draft.title.trim() || !current.draft.requester.trim()) {
        return { ...current, activeView: 'error-state', lastError: 'A title and requester are required before a ticket can be created.' };
      }

      const nextTicket: Ticket = {
        id: `TL-${1043 + current.tickets.length}`,
        title: current.draft.title.trim(),
        requester: current.draft.requester.trim(),
        summary: current.draft.summary.trim() || 'No summary provided yet.',
        priority: current.draft.priority,
        status: 'open',
        assignee: current.settings.defaultAssignee,
        updatedAt: 'Now',
      };

      return {
        ...current,
        tickets: [nextTicket, ...current.tickets],
        selectedTicketId: nextTicket.id,
        draft: defaultDraft,
        activeView: 'detail',
        lastError: null,
      };
    });
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setState((current) => ({
      ...current,
      tickets: current.tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status, updatedAt: 'Now' } : ticket)),
    }));
  }, []);

  const pauseQueue = useCallback(() => {
    setState((current) => ({ ...current, isPaused: true }));
  }, []);

  const restartQueue = useCallback(() => {
    setState((current) => ({ ...defaultState, tickets: initialTickets, isPaused: false }));
    clearStoredState();
  }, []);

  const saveSettings = useCallback((settings?: Partial<AppSettings>) => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, ...settings },
      activeView: 'settings',
      lastError: null,
    }));
  }, []);

  const resetDefaults = useCallback(() => {
    setState((current) => ({ ...current, settings: defaultSettings }));
  }, []);

  const clearError = useCallback(() => {
    setState((current) => ({ ...current, lastError: null, activeView: 'dashboard' }));
  }, []);

  const actions: AppActions = useMemo(
    () => ({
      navigate,
      selectTicket,
      setStatusFilter,
      updateDraft,
      createTicket,
      updateTicketStatus,
      pauseQueue,
      restartQueue,
      saveSettings,
      resetDefaults,
      clearError,
    }),
    [clearError, createTicket, navigate, pauseQueue, resetDefaults, restartQueue, saveSettings, selectTicket, setStatusFilter, updateDraft, updateTicketStatus],
  );

  return { state, actions };
}
