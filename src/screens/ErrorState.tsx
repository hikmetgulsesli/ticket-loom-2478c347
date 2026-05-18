import type { StorageStatus } from "../types/domain";

// AUTO-GENERATED from Stitch — DO NOT modify layout or CSS
// Screen: Error State
// 
// AGENT INSTRUCTIONS:
// 1. DO NOT change className values or layout structure
// 2. Add useState for dynamic values (replace hardcoded text)
// 3. Wire interactive controls through the typed actions prop
// 4. Replace placeholder data with props/state


export type ErrorStateActionId = "start-game-1" | "resume-2" | "open-settings-3" | "dashboard-1" | "create-edit-2" | "detail-3" | "insights-4" | "settings-5" | "error-state-6" | "empty-state-7";

export interface ErrorStateProps {
  actions?: Partial<Record<ErrorStateActionId, () => void>>;
  errorMessage?: string | null;
  storageStatus?: StorageStatus;
}

export function ErrorState({ actions, errorMessage = null, storageStatus }: ErrorStateProps) {
  const message = errorMessage ?? storageStatus?.message ?? "Ticket Loom needs attention before continuing.";
  const statusKind = storageStatus?.kind ?? "idle";

  return (
    <>
      <header>
          <div><div className="meta">Ticket Loom</div><h1>Error State</h1><p>Retry and clear actions for storage or ticket validation errors.</p></div>
          <nav aria-label="Fallback design navigation"><a href="#fallback-dashboard" data-action-id="dashboard-1" onClick={actions?.["dashboard-1"]}>Dashboard</a><a href="#fallback-create-edit" data-action-id="create-edit-2" onClick={actions?.["create-edit-2"]}>Create Edit</a><a href="#fallback-detail" data-action-id="detail-3" onClick={actions?.["detail-3"]}>Detail</a><a href="#fallback-insights" data-action-id="insights-4" onClick={actions?.["insights-4"]}>Insights</a><a href="#fallback-settings" data-action-id="settings-5" onClick={actions?.["settings-5"]}>Settings</a><a href="#fallback-error-state" data-action-id="error-state-6" onClick={actions?.["error-state-6"]}>Error State</a><a href="#fallback-empty-state" data-action-id="empty-state-7" onClick={actions?.["empty-state-7"]}>Empty State</a></nav>
        </header>
        <main id="fallback-error-state">
          <section className="command-panel">
            <p>{message}</p>
            <div className="action-row"><button type="button" data-action-id="start-game-1" onClick={actions?.["start-game-1"]}>Try Save Again</button><button type="button" data-action-id="resume-2" onClick={actions?.["resume-2"]}>Back to Dashboard</button><button type="button" data-action-id="open-settings-3" onClick={actions?.["open-settings-3"]}>Open Settings</button></div>
            <div className="data-grid"><article><h2>{statusKind}</h2><p>Current browser storage state for this workspace.</p></article><article><h2>Recovery</h2><p>Retry the action, return to the queue, or adjust workspace defaults.</p></article></div>
          </section></main>
    </>
  );
}
