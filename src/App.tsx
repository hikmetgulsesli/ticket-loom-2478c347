import { useEffect } from 'react';
import { RotateCcw, Trash2, UserCircle, X } from 'lucide-react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import type { AppView, TicketStatus } from './types/domain';
import {
  CreateEdit,
  Dashboard,
  Detail,
  EmptyState,
  ErrorState,
  Insights,
  Settings,
  type CreateEditActionId,
  type DashboardActionId,
  type DetailActionId,
  type EmptyStateActionId,
  type ErrorStateActionId,
  type InsightsActionId,
  type SettingsActionId,
} from './screens';
import './App.css';

const viewLabels: Record<AppView, string> = {
  dashboard: 'Dashboard',
  'create-edit': 'Create',
  detail: 'Detail',
  insights: 'Insights',
  settings: 'Settings',
  'error-state': 'Error',
  'empty-state': 'Empty',
};

const navActionMap: Record<string, AppView> = {
  'dashboard-1': 'dashboard',
  'create-edit-2': 'create-edit',
  'detail-3': 'detail',
  'insights-4': 'insights',
  'settings-5': 'settings',
  'error-state-6': 'error-state',
  'empty-state-7': 'empty-state',
};

function AppShell() {
  const { state, actions } = useAppContext();
  const selectedTicket = state.tickets.find((ticket) => ticket.id === state.selectedTicketId) ?? state.tickets[0] ?? null;
  const visibleTickets = state.statusFilter === 'all' ? state.tickets : state.tickets.filter((ticket) => ticket.status === state.statusFilter);
  const openCount = state.tickets.filter((ticket) => ticket.status === 'open').length;
  const pendingCount = state.tickets.filter((ticket) => ticket.status === 'pending').length;
  const resolvedCount = state.tickets.filter((ticket) => ticket.status === 'resolved').length;
  const storageTone = state.storageStatus.kind === 'error' || state.storageStatus.kind === 'corrupted' ? 'attention' : state.storageStatus.kind;

  useEffect(() => {
    window.app = { state, actions };
    globalThis.app = { state, actions };
  }, [actions, state]);

  const navigateFromGenerated = (actionId: string) => {
    const nextView = navActionMap[actionId];
    if (nextView) {
      actions.navigate(nextView);
    }
  };

  const dashboardActions: Partial<Record<DashboardActionId, () => void>> = {
    'pause-1': actions.pauseQueue,
    'restart-2': actions.restartQueue,
    'dashboard-1': () => navigateFromGenerated('dashboard-1'),
    'create-edit-2': () => navigateFromGenerated('create-edit-2'),
    'detail-3': () => navigateFromGenerated('detail-3'),
    'insights-4': () => navigateFromGenerated('insights-4'),
    'settings-5': () => navigateFromGenerated('settings-5'),
    'error-state-6': () => navigateFromGenerated('error-state-6'),
    'empty-state-7': () => navigateFromGenerated('empty-state-7'),
  };

  const workflowActions: Partial<Record<CreateEditActionId | DetailActionId | InsightsActionId | ErrorStateActionId | EmptyStateActionId, () => void>> = {
    'start-game-1': actions.createTicket,
    'resume-2': () => actions.navigate('dashboard'),
    'open-settings-3': () => actions.navigate('settings'),
    'dashboard-1': () => navigateFromGenerated('dashboard-1'),
    'create-edit-2': () => navigateFromGenerated('create-edit-2'),
    'detail-3': () => navigateFromGenerated('detail-3'),
    'insights-4': () => navigateFromGenerated('insights-4'),
    'settings-5': () => navigateFromGenerated('settings-5'),
    'error-state-6': () => navigateFromGenerated('error-state-6'),
    'empty-state-7': () => navigateFromGenerated('empty-state-7'),
  };

  const settingsActions: Partial<Record<SettingsActionId, () => void>> = {
    'save-settings-1': () => actions.saveSettings(),
    'reset-defaults-2': actions.resetDefaults,
    'dashboard-1': () => navigateFromGenerated('dashboard-1'),
    'create-edit-2': () => navigateFromGenerated('create-edit-2'),
    'detail-3': () => navigateFromGenerated('detail-3'),
    'insights-4': () => navigateFromGenerated('insights-4'),
    'settings-5': () => navigateFromGenerated('settings-5'),
    'error-state-6': () => navigateFromGenerated('error-state-6'),
    'empty-state-7': () => navigateFromGenerated('empty-state-7'),
  };

  const renderGeneratedScreen = () => {
    switch (state.activeView) {
      case 'create-edit':
        return <CreateEdit actions={workflowActions} />;
      case 'detail':
        return <Detail actions={workflowActions} />;
      case 'insights':
        return <Insights actions={workflowActions} />;
      case 'settings':
        return <Settings actions={settingsActions} />;
      case 'error-state':
        return <ErrorState actions={workflowActions} />;
      case 'empty-state':
        return <EmptyState actions={workflowActions} />;
      case 'dashboard':
      default:
        return <Dashboard actions={dashboardActions} />;
    }
  };

  return (
    <div data-setfarm-root="ticket-loom" className="app-shell">
      <aside className="sidebar" aria-label="Ticket Loom navigation">
        <div>
          <p className="eyebrow">Ticket Loom</p>
          <h1>Service desk</h1>
        </div>
        <nav className="nav-list">
          {(Object.keys(viewLabels) as AppView[]).map((view) => (
            <button
              key={view}
              type="button"
              className={state.activeView === view ? 'active' : ''}
              onClick={() => actions.navigate(view)}
            >
              {viewLabels[view]}
            </button>
          ))}
        </nav>
        <div className="saved-views">
          <p className="section-label">Saved views</p>
          {state.savedViews.map((savedView) => (
            <button key={savedView.id} type="button" onClick={() => actions.setStatusFilter(savedView.status)}>
              {savedView.label}
            </button>
          ))}
        </div>
      </aside>

      <section className="workspace" aria-label="Ticket workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{state.isPaused ? 'Queue paused' : 'Live queue'}</p>
            <h2>{viewLabels[state.activeView]}</h2>
          </div>
          <div className="topbar-actions">
            <div className="status-filters" aria-label="Status filters">
              {(['all', 'open', 'pending', 'resolved'] as Array<TicketStatus | 'all'>).map((status) => (
                <button
                  key={status}
                  type="button"
                  className={state.statusFilter === status ? 'active' : ''}
                  onClick={() => actions.setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Open account panel"
              title="Open account panel"
              onClick={actions.openAccountPanel}
            >
              <UserCircle size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        <section className={`storage-status ${storageTone}`} aria-live="polite">
          <div>
            <p className="section-label">Browser storage</p>
            <span>{state.storageStatus.message}</span>
          </div>
          <div className="button-row">
            <button type="button" onClick={actions.retryStorage}>
              <RotateCcw size={16} aria-hidden="true" />
              Retry
            </button>
            <button type="button" onClick={actions.clearData}>
              <Trash2 size={16} aria-hidden="true" />
              Clear data
            </button>
          </div>
        </section>

        <section className="metrics" aria-label="Queue metrics">
          <article>
            <span>Open</span>
            <strong>{openCount}</strong>
          </article>
          <article>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </article>
          <article>
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </article>
        </section>

        <section className="content-grid">
          <div className="ticket-list" aria-label="Tickets">
            {visibleTickets.length === 0 ? (
              <div className="empty-panel">
                <h3>No tickets in this view</h3>
                <button type="button" onClick={() => actions.navigate('create-edit')}>
                  Create ticket
                </button>
              </div>
            ) : (
              visibleTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  className={ticket.id === state.selectedTicketId ? 'ticket-row selected' : 'ticket-row'}
                  onClick={() => actions.selectTicket(ticket.id)}
                >
                  <span>
                    <strong>{ticket.id}</strong>
                    {ticket.title}
                  </span>
                  <small>{ticket.status}</small>
                </button>
              ))
            )}
          </div>

          <div className="detail-panel" aria-label="Ticket detail">
            {selectedTicket ? (
              <>
                <div>
                  <p className="eyebrow">{selectedTicket.requester}</p>
                  <h3>{selectedTicket.title}</h3>
                  <p>{selectedTicket.summary}</p>
                </div>
                <dl>
                  <div>
                    <dt>Priority</dt>
                    <dd>{selectedTicket.priority}</dd>
                  </div>
                  <div>
                    <dt>Assignee</dt>
                    <dd>{selectedTicket.assignee}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{selectedTicket.updatedAt}</dd>
                  </div>
                </dl>
                <div className="button-row">
                  <button type="button" onClick={() => actions.updateTicketStatus(selectedTicket.id, 'pending')}>
                    Mark pending
                  </button>
                  <button type="button" onClick={() => actions.updateTicketStatus(selectedTicket.id, 'resolved')}>
                    Resolve
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-panel">
                <h3>Select a ticket</h3>
                <button type="button" onClick={() => actions.navigate('create-edit')}>
                  Create ticket
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="form-panel" aria-label="Create ticket">
          <label>
            Title
            <input value={state.draft.title} onChange={(event) => actions.updateDraft({ title: event.target.value })} />
          </label>
          <label>
            Requester
            <input value={state.draft.requester} onChange={(event) => actions.updateDraft({ requester: event.target.value })} />
          </label>
          <label>
            Priority
            <select value={state.draft.priority} onChange={(event) => actions.updateDraft({ priority: event.target.value as 'low' | 'medium' | 'high' })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            Summary
            <textarea value={state.draft.summary} onChange={(event) => actions.updateDraft({ summary: event.target.value })} />
          </label>
          <button type="button" onClick={actions.createTicket}>
            Save ticket
          </button>
        </section>

        {state.lastError ? (
          <section className="error-banner" role="alert">
            <span>{state.lastError}</span>
            <button type="button" onClick={actions.clearError}>
              Dismiss
            </button>
          </section>
        ) : null}

        {state.activePanel === 'account' ? (
          <aside className="account-panel" aria-label="Account panel">
            <div>
              <p className="eyebrow">Account</p>
              <h3>Avery Rivera</h3>
              <p>Default assignee for new Ticket Loom workspaces.</p>
            </div>
            <dl>
              <div>
                <dt>Active screen</dt>
                <dd>{viewLabels[state.activeView]}</dd>
              </div>
              <div>
                <dt>Selected item</dt>
                <dd>{state.selectedTicketId ?? 'None'}</dd>
              </div>
              <div>
                <dt>Item count</dt>
                <dd>{state.itemCount}</dd>
              </div>
            </dl>
            <button type="button" className="icon-button close-button" aria-label="Close account panel" title="Close account panel" onClick={actions.closePanel}>
              <X size={20} aria-hidden="true" />
            </button>
          </aside>
        ) : null}

        <section className="generated-screen" aria-label={`${viewLabels[state.activeView]} screen`}>
          {renderGeneratedScreen()}
        </section>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
