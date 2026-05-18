// AUTO-GENERATED from Stitch — DO NOT modify layout or CSS
// Screen: Detail
// 
// AGENT INSTRUCTIONS:
// 1. DO NOT change className values or layout structure
// 2. Add useState for dynamic values (replace hardcoded text)
// 3. Wire interactive controls through the typed actions prop
// 4. Replace placeholder data with props/state

import type { Ticket } from "../types/domain";

export type DetailActionId = "start-game-1" | "resume-2" | "open-settings-3" | "dashboard-1" | "create-edit-2" | "detail-3" | "insights-4" | "settings-5" | "error-state-6" | "empty-state-7";

export interface DetailProps {
  actions?: Partial<Record<DetailActionId, () => void>>;
  ticket?: Ticket | null;
}

export function Detail({ actions, ticket }: DetailProps) {
  return (
    <>
      <header>
          <div><div className="meta">Ticket Loom</div><h1>{ticket?.id ?? "No Ticket Selected"}</h1><p>{ticket ? ticket.title : "Choose a queue item to inspect its request details."}</p></div>
          <nav aria-label="Fallback design navigation"><a href="#fallback-dashboard" data-action-id="dashboard-1" onClick={actions?.["dashboard-1"]}>Dashboard</a><a href="#fallback-create-edit" data-action-id="create-edit-2" onClick={actions?.["create-edit-2"]}>Create Edit</a><a href="#fallback-detail" data-action-id="detail-3" onClick={actions?.["detail-3"]}>Detail</a><a href="#fallback-insights" data-action-id="insights-4" onClick={actions?.["insights-4"]}>Insights</a><a href="#fallback-settings" data-action-id="settings-5" onClick={actions?.["settings-5"]}>Settings</a><a href="#fallback-error-state" data-action-id="error-state-6" onClick={actions?.["error-state-6"]}>Error State</a><a href="#fallback-empty-state" data-action-id="empty-state-7" onClick={actions?.["empty-state-7"]}>Empty State</a></nav>
        </header>
        <main id="fallback-detail">
          <section className="command-panel">
            <p>{ticket ? ticket.summary : "The detail screen updates as tickets are selected from the queue."}</p>
            <div className="action-row"><button type="button" data-action-id="start-game-1" onClick={actions?.["start-game-1"]}>{ticket ? "Edit Ticket" : "Create Ticket"}</button><button type="button" data-action-id="resume-2" onClick={actions?.["resume-2"]} disabled={!ticket}>Mark Pending</button><button type="button" data-action-id="open-settings-3" onClick={actions?.["open-settings-3"]} disabled={!ticket}>Resolve</button></div>
            <div className="data-grid"><article><h2>Requester</h2><p>{ticket?.requester ?? "No requester selected"}</p><p>{ticket?.assignee ? `Assigned to ${ticket.assignee}` : "No assignee yet"}</p></article><article><h2>Status</h2><p>{ticket ? `${ticket.status} priority ${ticket.priority}` : "Waiting for selection"}</p><p>{ticket ? `Updated ${ticket.updatedAt}` : "Select a ticket to continue"}</p></article></div>
          </section></main>
    </>
  );
}
