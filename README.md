# Task Manager API

## Overview
Task Manager API is a simple Express.js backend for managing tasks using a JSON file as storage.

Key features:
- CRUD operations for tasks
- Filtering by completion status (`?completed=true|false`)
- Filtering by priority (`low`, `medium`, `high`)
- Default sorting by `createdDate` in descending order
- Task fields include:
  - `id`
  - `title`
  - `description`
  - `completed`
  - `createdDate` (`DD-MM-YYYY`)
  - `priority` (`low | medium | high`)

## Tech Stack
- Node.js (>=18)
- Express
- TAP + Supertest for tests

## Setup Instructions
1. Clone the repository.
2. Open terminal in the project folder.
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
node app.js
```

Server runs at:

```text
http://localhost:3000
```

## Run Tests
```bash
npm test
```

## API Endpoints
Base URL: `http://localhost:3000`

### 1. Get all tasks
- Method: `GET`
- Endpoint: `/tasks`
- Behavior: Returns all tasks ordered by `createdDate` descending
- Optional query: `completed=true|false`

Example:
```bash
curl "http://localhost:3000/tasks"
```

Filter by completion:
```bash
curl "http://localhost:3000/tasks?completed=true"
```

### 2. Get task by ID
- Method: `GET`
- Endpoint: `/tasks/:id`

Example:
```bash
curl "http://localhost:3000/tasks/1"
```

### 3. Get tasks by priority
- Method: `GET`
- Endpoint: `/tasks/priority/:level`
- Valid `level`: `low`, `medium`, `high`

Example:
```bash
curl "http://localhost:3000/tasks/priority/high"
```

### 4. Create task
- Method: `POST`
- Endpoint: `/tasks`
- Required body fields:
  - `title` (string)
  - `description` (string)
- Optional body fields:
  - `completed` (boolean, default `false`)
  - `priority` (`low | medium | high`, default `medium`)
- Auto-generated fields:
  - `id`
  - `createdDate` in `DD-MM-YYYY`

Example:
```bash
curl -X POST "http://localhost:3000/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write README",
    "description": "Document project APIs",
    "completed": false,
    "priority": "high"
  }'
```

### 5. Update task
- Method: `PUT`
- Endpoint: `/tasks/:id`
- Required body fields:
  - `title` (string)
  - `description` (string)
- Optional body fields:
  - `completed` (boolean)
  - `priority` (`low | medium | high`)

Example:
```bash
curl -X PUT "http://localhost:3000/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "description": "Updated description",
    "completed": true,
    "priority": "medium"
  }'
```

### 6. Delete task
- Method: `DELETE`
- Endpoint: `/tasks/:id`

Example:
```bash
curl -X DELETE "http://localhost:3000/tasks/1"
```

## Error Responses
Common error patterns:
- `400 Bad Request`
  - Missing required fields
  - Invalid `completed` type
  - Invalid `priority` value
- `404 Not Found`
  - Task ID not found

## Notes
- Data is stored in `task.json`.
- This project uses in-memory array updates and writes back to the JSON file after create, update, and delete operations.
