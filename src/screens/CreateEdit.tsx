// AUTO-GENERATED from Stitch — DO NOT modify layout or CSS
// Screen: Create Edit
// 
// AGENT INSTRUCTIONS:
// 1. DO NOT change className values or layout structure
// 2. Add useState for dynamic values (replace hardcoded text)
// 3. Wire interactive controls through the typed actions prop
// 4. Replace placeholder data with props/state

import type { TicketDraft, TicketPriority } from "../types/domain";

export type CreateEditActionId = "start-game-1" | "resume-2" | "open-settings-3" | "dashboard-1" | "create-edit-2" | "detail-3" | "insights-4" | "settings-5" | "error-state-6" | "empty-state-7";

export interface CreateEditProps {
  actions?: Partial<Record<CreateEditActionId, () => void>>;
  draft?: TicketDraft;
  editingTicketId?: string | null;
  onDraftChange?: (draft: Partial<TicketDraft>) => void;
}

const emptyDraft: TicketDraft = {
  title: "",
  requester: "",
  summary: "",
  priority: "medium",
};

export function CreateEdit({ actions, draft = emptyDraft, editingTicketId = null, onDraftChange }: CreateEditProps) {
  const isEditing = Boolean(editingTicketId);
  const canSave = draft.title.trim().length > 0 && draft.requester.trim().length > 0;

  return (
    <>
      <header>
          <div><div className="meta">Ticket Loom</div><h1>{isEditing ? "Edit Ticket" : "Create Ticket"}</h1><p>{isEditing ? `Editing ${editingTicketId}` : "Capture the requester, priority, and issue summary before saving."}</p></div>
          <nav aria-label="Fallback design navigation"><a href="#fallback-dashboard" data-action-id="dashboard-1" onClick={actions?.["dashboard-1"]}>Dashboard</a><a href="#fallback-create-edit" data-action-id="create-edit-2" onClick={actions?.["create-edit-2"]}>Create Edit</a><a href="#fallback-detail" data-action-id="detail-3" onClick={actions?.["detail-3"]}>Detail</a><a href="#fallback-insights" data-action-id="insights-4" onClick={actions?.["insights-4"]}>Insights</a><a href="#fallback-settings" data-action-id="settings-5" onClick={actions?.["settings-5"]}>Settings</a><a href="#fallback-error-state" data-action-id="error-state-6" onClick={actions?.["error-state-6"]}>Error State</a><a href="#fallback-empty-state" data-action-id="empty-state-7" onClick={actions?.["empty-state-7"]}>Empty State</a></nav>
        </header>
        <main id="fallback-create-edit">
          <section className="command-panel">
            <p>{canSave ? "Ready to save this ticket." : "Title and requester are required before saving."}</p>
            <div className="action-row"><button type="button" data-action-id="start-game-1" onClick={actions?.["start-game-1"]}>{isEditing ? "Update Ticket" : "Save Ticket"}</button><button type="button" data-action-id="resume-2" onClick={actions?.["resume-2"]}>Cancel</button><button type="button" data-action-id="open-settings-3" onClick={actions?.["open-settings-3"]}>Open Settings</button></div>
            <div className="data-grid"><article><h2>Request</h2><label>Title<input value={draft.title} onChange={(event) => onDraftChange?.({ title: event.target.value })} /></label><label>Requester<input value={draft.requester} onChange={(event) => onDraftChange?.({ requester: event.target.value })} /></label></article><article><h2>Routing</h2><label>Priority<select value={draft.priority} onChange={(event) => onDraftChange?.({ priority: event.target.value as TicketPriority })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label>Summary<textarea value={draft.summary} onChange={(event) => onDraftChange?.({ summary: event.target.value })} /></label></article></div>
          </section></main>
    </>
  );
}
