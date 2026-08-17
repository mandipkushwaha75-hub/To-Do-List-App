# To-Do List REST API

A simple backend **To-Do List application** built with **Node.js, Express.js, MongoDB, and Mongoose**. The API allows users to create, view, update, filter, and delete tasks. Task data is stored in MongoDB, so it remains available after the server restarts.

## Features

- Create a new task
- View all tasks
- View a single task by ID
- Filter tasks by completion status
- Update an existing task
- Delete a task
- MongoDB database persistence using Mongoose
- Input validation for task titles and MongoDB IDs
- Global 404 and error handling
- Automatic `createdAt` and `updatedAt` timestamps

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- Postman for API testing

## Project Structure

```text
To-Do-List-App/
│
├── Server/
│   ├── models/
│   │   └── task.js
│   ├── routes/
│   │   └── TaskRoute.js
│   ├── .env
│   └── index.js
│
├── package.json
├── package-lock.json
└── README.md
```

## Task Data Model

Each task contains the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated | Unique MongoDB task ID |
| `title` | String | Yes | Task title, trimmed and limited to 100 characters |
| `description` | String | No | Additional information about the task |
| `isCompleted` | Boolean | No | Completion status; default is `false` |
| `dueDate` | Date | No | Optional task due date |
| `createdAt` | Date | Auto-generated | Date and time when the task was created |
| `updatedAt` | Date | Auto-generated | Date and time when the task was last updated |

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/mandipkushwaha75-hub/To-Do-List-App.git
cd To-Do-List-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Inside the `Server` folder, create or update the `.env` file:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
```

Example for a local MongoDB database:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/todo-list-app
```

> Do not upload your real MongoDB username, password, or connection string to a public GitHub repository.

### 4. Start the server

Because the current `.env` file is loaded from the `Server` directory, run the application from inside that folder:

```bash
cd Server
node index.js
```

When the connection is successful, the terminal should display messages similar to:

```text
Successfully connected to MongoDB
Server is running on http://localhost:3000
```

## Base URL

```text
http://localhost:3000
```

Task API base route:

```text
http://localhost:3000/api/tasks
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Check whether the API server is running |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks?completed=true` | Get completed tasks |
| `GET` | `/api/tasks?completed=false` | Get incomplete tasks |
| `GET` | `/api/tasks/:id` | Get one task by ID |
| `PATCH` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

## Postman Request Examples

### Create a Task

**POST**

```text
http://localhost:3000/api/tasks
```

Body → raw → JSON:

```json
{
  "title": "Complete REST API assignment",
  "description": "Finish the To-Do List backend project",
  "dueDate": "2026-12-12",
  "isCompleted": false
}
```

Successful response status:

```text
201 Created
```

### Get All Tasks

**GET**

```text
http://localhost:3000/api/tasks
```

Successful response status:

```text
200 OK
```

### Filter Completed Tasks

**GET**

```text
http://localhost:3000/api/tasks?completed=true
```

For incomplete tasks:

```text
http://localhost:3000/api/tasks?completed=false
```

### Get One Task

**GET**

```text
http://localhost:3000/api/tasks/TASK_ID
```

Replace `TASK_ID` with a real MongoDB ObjectId, for example:

```text
http://localhost:3000/api/tasks/689abcdef1234567890abcd
```

### Update a Task

**PATCH**

```text
http://localhost:3000/api/tasks/TASK_ID
```

Example JSON body:

```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "isCompleted": true,
  "dueDate": "2026-12-20"
}
```

You can update only the field or fields that need to change. For example:

```json
{
  "isCompleted": true
}
```

### Delete a Task

**DELETE**

```text
http://localhost:3000/api/tasks/TASK_ID
```

Successful response:

```json
{
  "message": "Task deleted successfully"
}
```

## Validation and Status Codes

The API uses standard HTTP status codes to explain the result of each request.

| Status Code | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | A new task was created successfully |
| `400 Bad Request` | Invalid input, invalid query value, or invalid task ID in the GET-by-ID route |
| `404 Not Found` | Route or task could not be found |
| `500 Internal Server Error` | Unexpected server-side error |

Examples of validation messages include:

```json
{
  "message": "Title is required"
}
```

```json
{
  "message": "Title cannot be more than 100 characters"
}
```

```json
{
  "message": "completed query must be true or false"
}
```

```json
{
  "message": "Invalid task ID"
}
```

## Home Route

Open:

```text
http://localhost:3000/
```

Response:

```json
{
  "message": "Task REST API is running"
}
```

## Testing with Postman

1. Start MongoDB.
2. Start the Node.js server.
3. Open Postman.
4. Select the required HTTP method such as `POST`, `GET`, `PATCH`, or `DELETE`.
5. Enter the correct API URL.
6. For `POST` and `PATCH`, select **Body → raw → JSON**.
7. Enter the JSON data and click **Send**.
8. Check the HTTP status code and JSON response.

## Repository

GitHub repository:

https://github.com/mandipkushwaha75-hub/To-Do-List-App

## Author

**Mandip Kushwaha**

## License

This project uses the **ISC License** as defined in `package.json`.
