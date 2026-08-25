# To-Do List REST API (Server)

A robust backend REST API built with **Node.js, Express.js, MongoDB, Mongoose, and JWT Authentication**. The API supports user signup, login, profile validation, and full user-scoped CRUD operations for task management.

---

## 📁 Server Directory Structure

```text
server/
├── middleware/
│   └── auth.js           # JWT Bearer token verification middleware
├── models/
│   ├── User.js           # User schema & bcrypt password hashing
│   └── Task.js           # Task schema (associated with User ObjectId)
├── routes/
│   ├── AuthRoute.js      # Signup (/signup & /register), Login, & Profile routes
│   └── TaskRoute.js      # User-scoped Task CRUD endpoints
├── .env                  # Environment variables
├── index.js              # Server entry point & MongoDB connection
├── package.json          # Server dependencies
└── README.md             # Server documentation
```

---

## 🛠️ Data Models

### 1. User Model (`server/models/User.js`)

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Unique User MongoDB ID |
| `name` | String | Yes | User display name / username |
| `email` | String | Yes | Unique lowercase email address |
| `password` | String | Yes | Bcrypt hashed password string (`select: false`) |
| `createdAt` | Date | Auto | Creation timestamp |

### 2. Task Model (`server/models/Task.js`)

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Unique Task MongoDB ID |
| `user` | ObjectId | Yes | Reference to owner `User._id` |
| `title` | String | Yes | Task title (max 100 chars, trimmed) |
| `description` | String | No | Detailed notes or links |
| `isCompleted` | Boolean | No | Completion status marker (default `false`) |
| `dueDate` | Date | No | Optional due date |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

---

## ⚙️ Environment Configuration

In `server/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/todo_db
MONGO_URL=mongodb://localhost:27017/todo_db
JWT_SECRET=super_secret_jwt_token_key_2026_todo_app
```

---

## 🚀 How to Run Server

```bash
# Navigate to server folder (if not in root)
cd server

# Install dependencies
npm install

# Start the server
node index.js
```

Confirmation output:

```text
Successfully connected to MongoDB at mongodb://localhost:27017/todo_db
Server is running on http://localhost:3000
```

---

## 📡 API Endpoints & Headers

### Auth Endpoints

| Method | Endpoint | Purpose | Request Body / Header |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register user & get token | `{ "name": "User", "email": "user@example.com", "password": "password123" }` |
| `POST` | `/api/auth/register` | Register user & get token | `{ "name": "User", "email": "user@example.com", "password": "password123" }` |
| `POST` | `/api/auth/login` | Login user & get token | `{ "email": "user@example.com", "password": "password123" }` |
| `GET` | `/api/auth/me` | Get current profile | Header: `Authorization: Bearer <token>` |

### Protected Task Endpoints

All task routes require header: `Authorization: Bearer <token>`

| Method | Endpoint | Purpose | Query / Payload |
|---|---|---|---|
| `POST` | `/api/tasks` | Create task | `{ "title": "New Task", "description": "Details", "dueDate": "2026-12-31" }` |
| `GET` | `/api/tasks` | Get user's tasks | Optional: `?completed=true` or `?completed=false` |
| `GET` | `/api/tasks/:id` | Get task by ID | Requires valid MongoDB ObjectId |
| `PATCH` | `/api/tasks/:id` | Update task fields | `{ "title": "Updated", "isCompleted": true }` |
| `DELETE` | `/api/tasks/:id` | Delete task | Returns `200 OK` `{ "message": "Task deleted successfully" }` |

---

## 📜 License

ISC License
