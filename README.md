# LLM Kanban

Kanban-board for orchestrating tasks across LLM agents — Claude Code, Codex CLI, Gemini CLI and custom pipelines.

---

## Quick Start

**Requirements:** Node.js 18+

```bash
git clone https://github.com/xlurr/llm-kanban
cd llm-kanban/frontend
npm install && npm run dev
```

[http://localhost:5173](http://localhost:5173)

| Email                   | Password   | Role      |
| ----------------------- | ---------- | --------- |
| `admin@llmkanban.ru`    | `admin123` | Admin     |
| `a.kozlov@llmkanban.ru` | `dev123`   | Developer |

---

## Features

### Board

- Drag-and-drop columns via `@dnd-kit`
- Configurable transition rules — state machine prevents invalid status moves
- WIP limits per column (default: Executing → 3)
- Column management via Board Settings

### Tasks

- Prompt-first workflow — each task carries a prompt passed to the assigned agent
- Subtask checklist with progress tracking
- CI/CD pipeline visualization with DAG stage dependencies
- Execution logs (info / success / warning / error)
- Code review scoring (1–10) with comments
- File and link attachments

### Epics

- Task grouping with deadlines and completion progress
- Column distribution breakdown per epic

### Agents

- Supported types: `claude-code`, `codex`, `gemini-cli`, `custom`
- Per-agent metrics: tasks completed, success rate, avg execution time, avg review score

### DB Diagram

- Interactive schema viewer built on `@xyflow/react`
- Two depth modes: table groups overview and full field-level detail
- Hover highlights related tables; field-level search

---

## Task Pipeline

```
Backlog → Prompt Ready → Agent Assigned → Executing → Review → Done
                                   ↑            ↓
                                Rework ←────────┘
                                   ↓
                                Failed → Backlog
```

All transitions are configurable in **Board Settings → Transitions**.

---

## Stack

| Layer       | Technology                       |
| ----------- | -------------------------------- |
| UI          | React 19, Vite 6, TypeScript 5.7 |
| Styling     | Tailwind CSS 3, shadcn/ui        |
| State       | Zustand 5 + localStorage         |
| Routing     | React Router v7                  |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| Diagrams    | @xyflow/react 12, Recharts 3     |

---

## Project Structure

```
llm-kanban/
├── class-diagram.html       # Standalone DB diagram (D3.js)
├── frontend/
│   └── src/
│       ├── app.tsx          # Routing + ProtectedRoute
│       ├── components/
│       │   ├── kanban-column.tsx
│       │   ├── task-card.tsx
│       │   ├── pipeline-stages.tsx
│       │   ├── transition-graph.tsx
│       │   └── ui/
│       ├── pages/
│       │   ├── board.tsx
│       │   ├── board-settings.tsx
│       │   ├── dashboard.tsx
│       │   ├── tasks.tsx / task-detail.tsx / task-create.tsx
│       │   ├── epics.tsx / epic-detail.tsx / epic-create.tsx
│       │   ├── agent-profile.tsx
│       │   └── db-diagram.tsx
│       ├── stores/
│       │   ├── tasks-store.ts
│       │   ├── agents-store.ts
│       │   ├── board-store.ts
│       │   ├── epics-store.ts
│       │   ├── users-store.ts
│       │   └── auth-store.ts
│       └── lib/
│           ├── types.ts
│           ├── mock-data.ts
│           └── utils.ts
└── resume/
```

---

## Data Schema

Full interactive schema available at `/diagrams` or open `class-diagram.html` directly.

| Group         | Tables                                                                |
| ------------- | --------------------------------------------------------------------- |
| Core          | `tasks`, `epics`, `task_dependencies`                                 |
| Actors        | `users`, `agents`, `teams`, `team_members`                            |
| Config        | `columns`, `transitions`, `automation_rules`, `prompt_templates`      |
| Related       | `task_logs`, `subtasks`, `comments`, `reviews`, `tags`, `attachments` |
| Analytics     | `agent_metrics`, `task_events`, `cost_ledger`, `dashboard_snapshots`  |
| Security      | `api_keys`, `sessions`, `audit_log`                                   |
| Integration   | `webhooks`, `webhook_deliveries`, `notifications`                     |
| Cache / Queue | `kafka_outbox`, `job_queue`, `cache_entries`                          |

---

## Roadmap

- [ ] Go-бэкенд (микросервисы) + PostgreSQL
- [ ] Real-time обновления доски через WebSocket
- [ ] Пайплайн выполнения задач агентами (Claude / OpenAI API)
- [ ] Аутентификация (JWT) + роли Admin / Manager / Developer / Viewer
- [ ] Аналитический дашборд (cycle time, lead time, throughput)
- [ ] Cost tracking — учёт токенов и стоимости по задаче и агенту
- [ ] Automation rules — триггеры на события (auto-assign, auto-move)
- [ ] Kubernetes deployment manifests
