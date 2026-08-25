# TaskManager Pro - Full-Stack To-Do Application

A complete, production-ready full-stack **To-Do List Application** featuring token-based **JWT Authentication**, a responsive **React (Vite) Frontend Interface**, full **CRUD operations**, **State-Verified Deletion**, **Structured UI Loading Skeletons**, **Error Toast Notification Bars**, and **MongoDB persistence**.

Structured following the architecture of the reference repository ([`Hari597-devine/Hari_Add-Note-App`](https://github.com/Hari597-devine/Hari_Add-Note-App)).

---

## 📁 Repository Structure

```text
To-Do-List-App/
│
├── server/                               # Backend REST API Server
│   ├── middleware/
│   │   └── auth.js                       # JWT Bearer token authentication middleware
│   ├── models/
│   │   ├── User.js                       # User Mongoose schema & bcrypt password hashing
│   │   └── Task.js                       # User-associated Task Mongoose schema
│   ├── routes/
│   │   ├── AuthRoute.js                  # Register (/signup & /register), Login & Profile routes
│   │   └── TaskRoute.js                  # User-scoped task CRUD endpoints
│   ├── .env                              # Server environment variables
│   ├── index.js                          # Server entry point & database connection
│   └── package.json                      # Backend dependencies
│
├── frontend/                             # Client-Side React (Vite) SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   └── AuthModal.jsx         # Sign In & Create Account tabbed forms
│   │   │   ├── Dashboard/
│   │   │   │   ├── Header.jsx            # Header with search, profile badge & logout
│   │   │   │   └── Stats.jsx             # Metric counter cards & completion progress
│   │   │   ├── Tasks/
│   │   │   │   ├── TaskForm.jsx          # Entry form with char counter & date picker
│   │   │   │   ├── TaskCard.jsx          # Task element grid card with state-verified deletion
│   │   │   │   └── EditTaskModal.jsx     # Inline/modal task editing dialog
│   │   │   └── UI/
│   │   │       ├── SkeletonLoader.jsx    # Animated shimmer loading skeletons
│   │   │       └── NotificationBar.jsx   # Non-breaking error/success toast notifications
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global user state & JWT token persistence
│   │   ├── services/
│   │   │   └── api.js                    # Axios API client with authorization interceptors
│   │   ├── App.jsx                       # Main router & full CRUD state manager
│   │   └── index.css                     # Dark-mode glassmorphism design system & animations
│   ├── index.html                        # Entry HTML with meta description & SEO title
│   ├── vite.config.js                    # Vite configuration
│   └── package.json                      # Frontend dependencies
│
├── SETUP.md                              # Detailed database & setup configuration guide
├── To-Do-List-App.postman_collection.json # Ready-to-import Postman Collection
├── README.md                             # Project documentation
└── package.json                          # Unified root npm scripts
```

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`
- **Frontend**: React 19, Vite, React Router DOM v7, Axios, Lucide Icons, Modern Vanilla CSS (Glassmorphism, CSS Custom Tokens, CSS Grid/Flexbox)
- **Database**: MongoDB (`mongodb://localhost:27017/todo_db`)

---

## ⚡ Features

### 1. Authentication Layer (JWT)
- **Secure Sessions**: Sign In and Signup interfaces with input validation, eye password visibility toggle, and error alert banners.
- **Token Management**: Stores returned JWT in `localStorage` and automatically attaches `Authorization: Bearer <token>` to all HTTP requests.
- **Route Protection**: Restricts access to `/dashboard`; unauthenticated users automatically redirect back to `/login` or `/signup`.
- **Logout Action**: Clears JWT token and session state, taking the user back to the authentication screen.

### 2. Full CRUD Frontend Interface
- **Adding & Displaying Tasks**: Create tasks with title (max 100 chars, real-time char counter), optional description, and due date. Renders database-persisted title, description, and formatted due date (with overdue warnings).
- **Editing & Completing**: Toggle task completion status (`isCompleted`) directly on cards or edit task strings using the edit modal dialog.
- **State-Verified Deletion**: Drops the item from the local UI state array **only after** receiving a successful `200 OK` deletion response from the database server.
- **Search & Filtering**: Search bar filters tasks instantly by title or description. Filter tabs toggle between All, Pending, and Completed tasks.

### 3. Asynchronous UX & Interception
- **Loading Skeletons**: Displays animated shimmer cards during data fetching.
- **Notification Toast Bars**: Non-breaking floating notification bars gracefully notify users of API errors or successful actions.

---

## 🚀 Quick Start Guide

### 1. Configure Environment Variables

Inside `server/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/todo_db
MONGO_URL=mongodb://localhost:27017/todo_db
JWT_SECRET=super_secret_jwt_token_key_2026_todo_app
```

### 2. Install Dependencies

From root directory:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Start Backend & Frontend

Open two terminal tabs:

- **Terminal 1 (Backend Server)**:
  ```bash
  npm run server
  # Console: Successfully connected to MongoDB at mongodb://localhost:27017/todo_db
  # Console: Server is running on http://localhost:3000
  ```

- **Terminal 2 (Frontend Client)**:
  ```bash
  npm run frontend
  # Console: Local: http://localhost:5173/
  ```

---

## 📡 API Endpoints Reference

### Authentication Routes

| Method | Endpoint | Description | Payload Sample |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user & return JWT | `{ "name": "Mandip", "email": "user@example.com", "password": "password123" }` |
| `POST` | `/api/auth/register` | Register new user & return JWT | `{ "name": "Mandip", "email": "user@example.com", "password": "password123" }` |
| `POST` | `/api/auth/login` | Authenticate & return JWT | `{ "email": "user@example.com", "password": "password123" }` |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Header: `Authorization: Bearer <token>` |

### Task Routes (Protected by JWT)

All task endpoints require: `Authorization: Bearer <token>`

| Method | Endpoint | Description | Payload / Query |
|---|---|---|---|
| `POST` | `/api/tasks` | Create task | `{ "title": "Complete task", "description": "Notes", "dueDate": "2026-12-31" }` |
| `GET` | `/api/tasks` | Get all user tasks | Optional query: `?completed=true` or `?completed=false` |
| `GET` | `/api/tasks/:id` | Get task by ID | Requires valid MongoDB ObjectId |
| `PATCH` | `/api/tasks/:id` | Update task fields | `{ "title": "Updated", "isCompleted": true }` |
| `DELETE` | `/api/tasks/:id` | Delete task from DB | Returns `200 OK` `{ "message": "Task deleted successfully" }` |

---

## 📬 Postman Testing

Import the included Postman Collection file into Postman:
📁 **[`To-Do-List-App.postman_collection.json`](./To-Do-List-App.postman_collection.json)**

Includes ready-to-test requests for signup, login, profile fetch, task creation (`POST`), task fetching (`GET`), task updating (`PATCH`), and task deletion (`DELETE`).

---

## 📄 License

This project uses the **ISC License**.
