import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppActions, AppSettings, AppState, AppView, Ticket, TicketDraft, TicketStatus } from '../types/domain';
import { clearStoredState, idleStorageStatus, loadStoredState, saveStoredState } from '../utils/storage';

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
  startLevel: 'level-1',
  assistHints: 'on',
  controls: 'Arrow keys',
};

function getNextTicketId(tickets: Ticket[]) {
  const highestTicketNumber = tickets.reduce((highest, ticket) => {
    const match = /^TL-(\d+)$/.exec(ticket.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 1042);

  return `TL-${highestTicketNumber + 1}`;
}

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
  storageStatus: idleStorageStatus,
  activePanel: 'none',
  itemCount: initialTickets.length,
  isPaused: false,
};

function createInitialState(): AppState {
  const storedState = loadStoredState();
  const tickets = storedState.state?.tickets ?? defaultState.tickets;

  return {
    ...defaultState,
    ...storedState.state,
    tickets,
    draft: { ...defaultDraft, ...storedState.state?.draft },
    settings: { ...defaultSettings, ...storedState.state?.settings },
    storageStatus: storedState.status,
    activePanel: 'none',
    itemCount: tickets.length,
  };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(createInitialState);
  const skipNextSave = useRef(false);

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    if (state.storageStatus.kind === 'corrupted') {
      return;
    }

    const storageStatus = saveStoredState(state);
    setState((current) =>
      current.storageStatus.kind === storageStatus.kind && current.storageStatus.message === storageStatus.message
        ? current
        : { ...current, storageStatus },
    );
  }, [state]);

  const navigate = useCallback((view: AppView) => {
    setState((current) => ({ ...current, activeView: view, activePanel: 'none', lastError: null }));
  }, []);

  const selectTicket = useCallback((ticketId: string) => {
    setState((current) => ({ ...current, selectedTicketId: ticketId, activeView: 'detail', activePanel: 'none', lastError: null }));
  }, []);

  const setStatusFilter = useCallback((status: TicketStatus | 'all') => {
    setState((current) => ({ ...current, statusFilter: status, activeView: 'dashboard', activePanel: 'none' }));
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
        id: getNextTicketId(current.tickets),
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
        activePanel: 'none',
        itemCount: current.tickets.length + 1,
        lastError: null,
      };
    });
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setState((current) => ({
      ...current,
      tickets: current.tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status, updatedAt: 'Now' } : ticket)),
      itemCount: current.tickets.length,
    }));
  }, []);

  const pauseQueue = useCallback(() => {
    setState((current) => ({ ...current, isPaused: true }));
  }, []);

  const restartQueue = useCallback(() => {
    const storageStatus = clearStoredState();
    skipNextSave.current = true;
    setState((current) => ({ ...defaultState, tickets: initialTickets, itemCount: initialTickets.length, storageStatus, isPaused: false }));
  }, []);

  const saveSettings = useCallback((settings?: Partial<AppSettings>) => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, ...settings },
      activeView: 'settings',
      activePanel: 'none',
      lastError: null,
    }));
  }, []);

  const resetDefaults = useCallback(() => {
    setState((current) => ({ ...current, settings: defaultSettings }));
  }, []);

  const clearError = useCallback(() => {
    setState((current) => ({ ...current, lastError: null, activeView: 'dashboard' }));
  }, []);

  const openAccountPanel = useCallback(() => {
    setState((current) => ({ ...current, activePanel: 'account' }));
  }, []);

  const closePanel = useCallback(() => {
    setState((current) => ({ ...current, activePanel: 'none' }));
  }, []);

  const retryStorage = useCallback(() => {
    setState((current) => ({
      ...current,
      storageStatus: { kind: 'retrying', message: 'Retrying browser storage sync.' },
      lastError: null,
    }));
  }, []);

  const clearData = useCallback(() => {
    const storageStatus = clearStoredState();
    skipNextSave.current = true;
    setState(() => ({
      ...defaultState,
      tickets: initialTickets,
      itemCount: initialTickets.length,
      storageStatus,
      activePanel: 'none',
      isPaused: false,
    }));
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
      openAccountPanel,
      closePanel,
      retryStorage,
      clearData,
    }),
    [
      clearData,
      clearError,
      closePanel,
      createTicket,
      navigate,
      openAccountPanel,
      pauseQueue,
      resetDefaults,
      restartQueue,
      retryStorage,
      saveSettings,
      selectTicket,
      setStatusFilter,
      updateDraft,
      updateTicketStatus,
    ],
  );

  return { state, actions };
}
