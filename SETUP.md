# TaskManager Pro - Database & Connection Configuration Guide

This guide details the database initialization, environment variable configuration, and execution instructions for running the full-stack TaskManager application.

---

## 1. Project Architecture

The project matches the directory structure of the reference repository:

```text
To-Do-List-App/
├── server/                   # REST API server & MongoDB models
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── User.js           # User schema with bcrypt password hashing
│   │   └── Task.js           # User-associated Task schema
│   ├── routes/
│   │   ├── AuthRoute.js      # Register/Signup, Login, & Profile endpoints
│   │   └── TaskRoute.js      # User-scoped task CRUD endpoints
│   ├── .env                  # Server environment variables
│   └── index.js              # Express app entry point & DB connection
│
├── frontend/                 # Client-side React + Vite dashboard
│   ├── src/
│   │   ├── components/       # Auth, Dashboard, Tasks & UI components
│   │   ├── context/          # AuthContext & JWT state persistence
│   │   ├── services/         # Axios API client & interceptors
│   │   ├── App.jsx           # Main router & state manager
│   │   └── index.css         # Modern dark-mode glassmorphism styling
│   ├── index.html            # Entry HTML with meta description & title
│   └── vite.config.js
│
├── SETUP.md                  # Database & connection guide
├── README.md                 # Project README
└── package.json              # Unified root scripts
```

---

## 2. Environment Variables Configuration

In the `server/` directory, create or update the `.env` file containing your database URI and token validation secret:

```env
# Server Port
PORT=3000

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/todo_db
MONGO_URL=mongodb://localhost:27017/todo_db

# JWT Token Validation Secret Key
JWT_SECRET=super_secret_jwt_token_key_2026_todo_app
```

---

## 3. Database Connection (`mongodb://localhost:27017/todo_db`)

### Local MongoDB Setup

1. Ensure **MongoDB Server** is running locally:
   ```bash
   brew services start mongodb-community
   # Or directly:
   mongod --dbpath /data/db
   ```

2. When the server boots, Mongoose connects to `mongodb://localhost:27017/todo_db` and initializes the required collections (`users` and `tasks`).

### Connection Proof Log

When starting the server (`npm run server`), look for the connection confirmation output:

```text
Successfully connected to MongoDB at mongodb://localhost:27017/todo_db
Server is running on http://localhost:3000
```

---

## 4. Booting Up the Application

### Option A: From Project Root

1. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Start the Backend REST API:**
   ```bash
   npm run server
   ```

3. **Start the Frontend Client (in a separate terminal):**
   ```bash
   npm run frontend
   ```

### Option B: Separate Terminal Tabs

- **Terminal 1 (Server):**
  ```bash
  cd server
  node index.js
  ```

- **Terminal 2 (Frontend):**
  ```bash
  cd frontend
  npm run dev
  ```

Access the frontend dashboard at **`http://localhost:5173`**.

---

## 5. API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user & return JWT | `{ "name": "User", "email": "user@example.com", "password": "password123" }` |
| `POST` | `/api/auth/register` | Register new user & return JWT | `{ "name": "User", "email": "user@example.com", "password": "password123" }` |
| `POST` | `/api/auth/login` | Login user & return JWT | `{ "email": "user@example.com", "password": "password123" }` |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Header: `Authorization: Bearer <token>` |

### Task Endpoints (Protected by JWT)

All task endpoints require the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

| Method | Endpoint | Description | Query / Payload |
|---|---|---|---|
| `POST` | `/api/tasks` | Create task | `{ "title": "Complete task", "description": "Details", "dueDate": "2026-12-31" }` |
| `GET` | `/api/tasks` | Get user's tasks | Optional: `?completed=true` or `?completed=false` |
| `GET` | `/api/tasks/:id` | Get task by ID | Requires valid MongoDB ObjectId |
| `PATCH` | `/api/tasks/:id` | Update task fields | `{ "title": "Updated", "isCompleted": true }` |
| `DELETE` | `/api/tasks/:id` | Delete task from DB | Returns `200 OK` `{ "message": "Task deleted successfully" }` |
