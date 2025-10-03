# Collaborative Research Management System

A full‑stack web app for universities and academic institutions to manage research projects, collaborate with team members, assign tasks, track progress, and discuss in per‑project threads.

- Backend: Node.js, Express, MongoDB (Mongoose), JWT Auth
- Frontend: React + TypeScript, React Router, Context API, Tailwind CSS
- Roles: Admin, Research Lead, Team Member

---

## Features

- Authentication & Authorization
  - JWT-based login and register
  - Role-based access control (Admin, Research Lead, Team Member)
  - Protected routes on the backend; guarded UI per role

- Project Management
  - Research Leads/Admins: create projects
  - Add/remove team members
  - Set goals and description
  - Project progress virtual (computed from goals)

- Task Management
  - Leads/Admins: create tasks (title, description, deadline, status)
  - Team Members: update task status (pending, in_progress, completed)
  - Team Members: submit progress (hours/comments)

- Discussion (Comments)
  - Per‑project discussion thread
  - GET/POST comments for a project, DELETE comment (author/lead/admin)

- UI/UX
  - Responsive dashboards (Admin/Lead/Member)
  - Loading and error states
  - Role-based conditional rendering

---

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Frontend: React, TypeScript, React Router, Context API, Axios, Tailwind CSS
- Dev Tools: Postman (API testing)

---

## Project Structure

```
research-management-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── comments.js
│   ├── utils/
│   │   └── generateToken.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── dashboards/
        │   │   ├── AdminDashboard.tsx
        │   │   ├── ResearchLeadDashboard.tsx
        │   │   └── TeamMemberDashboard.tsx
        │   ├── projects/
        │   │   ├── ResearchLeadProjects.tsx
        │   │   ├── TeamMemberProjects.tsx
        │   │   └── ProjectComments.tsx
        │   ├── common/
        │   │   ├── LoadingSpinner.tsx
        │   │   └── ErrorAlert.tsx
        │   └── tasks/
        │       ├── ResearchLeadTasks.tsx
        │       └── TeamMemberTasks.tsx
        ├── context/
        │   └── AuthContext.tsx
        ├── pages/
        │   ├── Login.tsx
        │   ├── Register.tsx
        │   ├── Dashboard.tsx
        │   ├── Projects.tsx
        │   └── Tasks.tsx
        ├── services/
        │   └── api.ts
        └── App.tsx
```

---

## Environment Setup

Backend .env (backend/.env)
```
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Frontend environment: usually none required unless customizing base URL. The axios baseURL is set to http://localhost:5000/api in src/services/api.ts.

---

## Getting Started

Backend
1. cd backend
2. npm install
3. npm start
4. API runs at http://localhost:5000

Frontend
1. cd frontend
2. npm install (or yarn)
3. npm start (or yarn start)
4. App runs at http://localhost:3000

---

## Creating Users (Register with Role)

You can register via the UI (Register page) or via Postman:

POST http://localhost:5000/api/auth/register
Headers: Content-Type: application/json
Body:
{
  "name": "Admin User",
  "email": "admin@university.edu",
  "password": "password123",
  "role": "admin",
  "department": "Administration"
}

Login (UI or Postman)
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "admin@university.edu",
  "password": "password123"
}

Protected check
GET http://localhost:5000/api/auth/me
Header: Authorization: Bearer <token>

---

## API Quick Reference

Auth
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me

Projects
- GET    /api/projects                          // role-filtered
- GET    /api/projects/:id
- POST   /api/projects                          // lead/admin
- PUT    /api/projects/:id                      // lead/admin
- DELETE /api/projects/:id                      // lead/admin
- POST   /api/projects/:id/team                 // lead/admin (body: { userId })
- DELETE /api/projects/:id/team/:userId         // lead/admin

Tasks
- GET    /api/tasks                             // role-based scope
- GET    /api/tasks/:id
- POST   /api/tasks                             // lead/admin (title, project, description?, deadline?, status)
- PUT    /api/tasks/:id                         // assignee: { status, actualHours, comments }, lead/admin: all fields
- DELETE /api/tasks/:id                         // lead/admin

Comments (per project)
- GET    /api/projects/:projectId/comments
- POST   /api/projects/:projectId/comments      // body: { content }
- DELETE /api/comments/:commentId               // author/lead/admin

Roles Matrix (high-level)
- Admin: full access to projects, tasks, comments
- Research Lead: manage own projects (create, update, team, tasks), comments
- Team Member: view assigned projects/tasks, update own tasks, comment

---

## UI Notes

- Projects page shows a “Discussion” button on each project card (Lead/Member views).
  - Clicking it toggles a ProjectComments panel under the card
- Tasks page:
  - Lead/Admin can create tasks
  - Members can update status (pending/in_progress/completed) and submit progress (hours/comments)
- Dashboard page:
  - Renders Admin/Lead/Member dashboard based on role

---

## Common Troubleshooting

- 401 Unauthorized
  - Missing/expired token. Log in, then include Authorization: Bearer <token> in requests.

- “Request body must be JSON”
  - In Postman: Body → raw → JSON. Add Content-Type: application/json.

- “Server error” when fetching tasks
  - Ensure Project model goals default to [] and the progress virtual checks Array.isArray(goals).
  - We’ve already added this guard.

- 404 “Route not found”
  - Ensure server mounts routes, especially comments:
    app.use('/api', require('./routes/comments'));

- CORS errors
  - Verify server CORS origin matches http://localhost:3000 in backend/server.js.

---

## Scripts

Backend
- npm start — starts Express server

Frontend
- npm start — starts React dev server

---

## Demo Users (suggested)
Use Register page to create:
- Admin: admin@university.edu / admin123
- Lead: lead@university.edu / lead123
- Member: member@university.edu / member123

---
