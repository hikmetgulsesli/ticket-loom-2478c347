import type { Ticket } from "../types/domain";

// AUTO-GENERATED from Stitch — DO NOT modify layout or CSS
// Screen: Insights
// 
// AGENT INSTRUCTIONS:
// 1. DO NOT change className values or layout structure
// 2. Add useState for dynamic values (replace hardcoded text)
// 3. Wire interactive controls through the typed actions prop
// 4. Replace placeholder data with props/state


export type InsightsActionId = "start-game-1" | "resume-2" | "open-settings-3" | "dashboard-1" | "create-edit-2" | "detail-3" | "insights-4" | "settings-5" | "error-state-6" | "empty-state-7";

export interface InsightsProps {
  actions?: Partial<Record<InsightsActionId, () => void>>;
  tickets?: Ticket[];
}

export function Insights({ actions, tickets = [] }: InsightsProps) {
  const openCount = tickets.filter((ticket) => ticket.status === "open").length;
  const pendingCount = tickets.filter((ticket) => ticket.status === "pending").length;
  const resolvedCount = tickets.filter((ticket) => ticket.status === "resolved").length;
  const highPriorityCount = tickets.filter((ticket) => ticket.priority === "high").length;

  return (
    <>
      <header>
          <div><div className="meta">Ticket Loom</div><h1>Insights</h1><p>Useful summary metrics for the support queue.</p></div>
          <nav aria-label="Fallback design navigation"><a href="#fallback-dashboard" data-action-id="dashboard-1" onClick={actions?.["dashboard-1"]}>Dashboard</a><a href="#fallback-create-edit" data-action-id="create-edit-2" onClick={actions?.["create-edit-2"]}>Create Edit</a><a href="#fallback-detail" data-action-id="detail-3" onClick={actions?.["detail-3"]}>Detail</a><a href="#fallback-insights" data-action-id="insights-4" onClick={actions?.["insights-4"]}>Insights</a><a href="#fallback-settings" data-action-id="settings-5" onClick={actions?.["settings-5"]}>Settings</a><a href="#fallback-error-state" data-action-id="error-state-6" onClick={actions?.["error-state-6"]}>Error State</a><a href="#fallback-empty-state" data-action-id="empty-state-7" onClick={actions?.["empty-state-7"]}>Empty State</a></nav>
        </header>
        <main id="fallback-insights">
          <section className="command-panel">
            <p>{tickets.length} tickets tracked across active, waiting, and resolved support work.</p>
            <div className="action-row"><button type="button" data-action-id="start-game-1" onClick={actions?.["start-game-1"]}>Create Ticket</button><button type="button" data-action-id="resume-2" onClick={actions?.["resume-2"]}>Back to Dashboard</button><button type="button" data-action-id="open-settings-3" onClick={actions?.["open-settings-3"]}>Open Settings</button></div>
            <div className="data-grid"><article><h2>{openCount + pendingCount}</h2><p>Tickets still need team attention. {highPriorityCount} are marked high priority.</p></article><article><h2>{resolvedCount}</h2><p>Tickets resolved in the current workspace snapshot.</p></article></div>
          </section></main>
    </>
  );
}
