# Project Management System

Mini multi-tenant Project Management System demonstrating Django + GraphQL + React + Apollo + Tailwind.

## Tech Stack
Backend: Django 4, Graphene-Django, PostgreSQL
Frontend: React 18, TypeScript, Apollo Client 3, Vite, TailwindCSS 3
Tooling: Virtualenv, npm, (future) Docker & GitHub Actions

## Implemented Scope (Current State)
Backend
* Data models: Organization, Project, Task, TaskComment (+ timestamp mixin)
* GraphQL Queries: projects(organizationSlug), tasks(projectId)
* GraphQL Mutations: createProject, updateProject, createTask, updateTask, addTaskComment
* Derived fields: taskCount, completedTasks, project stats (completion rate)

Frontend
* Apollo Client configured (HTTP link)
* Project Dashboard listing projects for an organization
* Create Project modal with optimistic cache update
* Tailwind basic styling and status badge component

## Multi‑Tenancy Strategy
* Organization provided via slug argument in queries/mutations
* All project/task queries filtered by organization/project foreign keys
* Future: enforce via custom middleware extracting org from header (X-Org-Slug) & central filter

## Setup

### Prerequisites
Python 3.11+
Node 18+
PostgreSQL 13+ running locally (or container)

### Backend Setup (Windows PowerShell)
```powershell
cd backend
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt

# Create database (adjust credentials if needed)
# psql -U postgres -c "CREATE DATABASE pm_db;"

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

python manage.py shell <<'PY'
from core.models import Organization
Organization.objects.get_or_create(name="Demo Org", slug="demo-org", contact_email="admin@example.com")
PY

python manage.py runserver
```
GraphQL Playground: http://localhost:8000/graphql/

### Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Dev server: http://localhost:5173

## Example GraphQL Operations
Query projects:
```graphql
query Projects($org: String!) {
	projects(organizationSlug: $org) {
		id name status taskCount completedTasks dueDate
	}
}
```
Create project:
```graphql
mutation AddProject($slug: String!, $name: String!) {
	createProject(organizationSlug: $slug, name: $name) { project { id name status } }
}
```

## Directory Layout
```
backend/
	core/           # Domain models, admin, GraphQL schema
	pm_system/      # Django project (settings/urls)
frontend/
	src/
		modules/projects/  # Project UI components & types
```

## Testing (Planned)
* Backend: pytest + graphene client (snapshot of queries & mutation results)
* Frontend: Vitest + React Testing Library for component + Apollo interactions

## Future Improvements
Short Term
* Input validation & custom errors
* Task list/board + edit & status transitions
* Comment UI + relative timestamps
* Central org context via header/middleware
* Pagination & ordering

Medium Term
* Auth (JWT) & per-user roles
* Subscriptions (channels / graphene-subscriptions) for comments & task updates
* Docker Compose (web, db) & Makefile scripts
* Filtering/search (text + status + due range)
* Basic unit & integration test coverage

Long Term / Nice-to-Have
* Drag-and-drop Kanban board
* Advanced analytics (burn-down chart, velocity)
* CI/CD pipeline (lint, test, build) GitHub Actions
* Sentry / OpenTelemetry instrumentation
* Accessibility pass (ARIA roles, focus states)
* Theming & dark mode

## License
MIT (adjust if needed)

## Author Notes
This repository is structured for incremental enhancement; each improvement area above can be implemented with minimal churn to existing code.