import type { Ticket } from "../types/domain";

// AUTO-GENERATED from Stitch — DO NOT modify layout or CSS
// Screen: Dashboard
// 
// AGENT INSTRUCTIONS:
// 1. DO NOT change className values or layout structure
// 2. Add useState for dynamic values (replace hardcoded text)
// 3. Wire interactive controls through the typed actions prop
// 4. Replace placeholder data with props/state


export type DashboardActionId = "pause-1" | "restart-2" | "dashboard-1" | "create-edit-2" | "detail-3" | "insights-4" | "settings-5" | "error-state-6" | "empty-state-7";

export interface DashboardProps {
  actions?: Partial<Record<DashboardActionId, () => void>>;
  tickets?: Ticket[];
  selectedTicketId?: string | null;
  isPaused?: boolean;
}

export function Dashboard({ actions, tickets = [], selectedTicketId = null, isPaused = false }: DashboardProps) {
  const { openCount, pendingCount, resolvedCount } = tickets.reduce(
    (acc, ticket) => {
      if (ticket.status === "open") acc.openCount++;
      else if (ticket.status === "pending") acc.pendingCount++;
      else if (ticket.status === "resolved") acc.resolvedCount++;

      return acc;
    },
    { openCount: 0, pendingCount: 0, resolvedCount: 0 }
  );
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0];
  const activeIndices = new Set(tickets.map((ticket, index) => (ticket.status === "open" || ticket.id === selectedTicket?.id ? index : -1)));

  return (
    <>
      <header>
          <div><div className="meta">Ticket Loom</div><h1>Dashboard</h1><p>{isPaused ? "Queue intake is paused while the team catches up." : "Live service desk queue with current workload and priority signals."}</p></div>
          <nav aria-label="Fallback design navigation"><a href="#fallback-dashboard" data-action-id="dashboard-1" onClick={actions?.["dashboard-1"]}>Dashboard</a><a href="#fallback-create-edit" data-action-id="create-edit-2" onClick={actions?.["create-edit-2"]}>Create Edit</a><a href="#fallback-detail" data-action-id="detail-3" onClick={actions?.["detail-3"]}>Detail</a><a href="#fallback-insights" data-action-id="insights-4" onClick={actions?.["insights-4"]}>Insights</a><a href="#fallback-settings" data-action-id="settings-5" onClick={actions?.["settings-5"]}>Settings</a><a href="#fallback-error-state" data-action-id="error-state-6" onClick={actions?.["error-state-6"]}>Error State</a><a href="#fallback-empty-state" data-action-id="empty-state-7" onClick={actions?.["empty-state-7"]}>Empty State</a></nav>
        </header>
        <main id="fallback-dashboard">
            <section className="game-layout" aria-label="Playable board reference">
              <div className="board" role="grid" aria-label="Ticket queue activity">{Array.from({ length: 96 }, (_, index) => <div key={index} className={tickets.length > 0 && activeIndices.has(index % tickets.length) ? "cell active" : "cell"} aria-hidden={true}></div>)}</div>
              <aside className="side-panel">
                <h2>{selectedTicket?.id ?? "No tickets"}</h2>
                <div className="mini-grid" aria-label="Ticket status preview"><span className={openCount ? "active" : ""}></span><span className={pendingCount ? "active" : ""}></span><span className={resolvedCount ? "active" : ""}></span><span className={isPaused ? "active" : ""}></span><span className=""></span><span className="active"></span><span className=""></span><span className=""></span><span className=""></span><span className=""></span><span className="active"></span><span className=""></span><span className=""></span><span className=""></span><span className=""></span><span className="active"></span></div>
                <dl><dt>Open</dt><dd>{openCount}</dd><dt>Pending</dt><dd>{pendingCount}</dd><dt>Resolved</dt><dd>{resolvedCount}</dd></dl>
                <button type="button" data-action-id="pause-1" onClick={actions?.["pause-1"]}>Pause</button><button type="button" data-action-id="restart-2" onClick={actions?.["restart-2"]}>Restart</button>
              </aside>
            </section></main>
    </>
  );
}
