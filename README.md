# Eisenhower Backend

## Description

The Eisenhower Backend is a RESTful API designed to manage tasks and user authentication for the Eisenhower productivity application. It provides endpoints for creating, retrieving, updating, and deleting tasks, as well as user session management.

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **TypeScript**
- **JWT (JSON Web Token)**

## Endpoints

### Task

| Route      | Method   | How it works                                            |
| ---------- | -------- | ------------------------------------------------------- |
| /tasks     | `GET`    | Retrieve all tasks for the authenticated user           |
| /tasks     | `POST`   | Create a new task for the authenticated user            |
| /tasks     | `DELETE` | Delete all tasks for the authenticated user             |
| /tasks/:id | `PATCH`  | Update a specific task by ID for the authenticated user |
| /tasks/:id | `DELETE` | Delete a specific task by ID for the authenticated user |

### Auth

| Route          | Method | How it works                                   |
| -------------- | ------ | ---------------------------------------------- |
| /auth/login    | `POST` | Authenticate a user and return a session token |
| /auth/logout   | `POST` | Log out the authenticated user                 |
| /auth/register | `POST` | Register a new user                            |
| /auth/validate | `POST` | Validate the session token                     |

## Data Models

### Task

```typescript
type Task = {
	title: string
	urgency: 'urgent' | 'not urgent' | null
	importance: 'important' | 'not important' | null
	userId: string
}
```

### User

```typescript
type User = {
	email: string
	password: string
}
```

### Session

```typescript
type Session = {
	sessionToken: string
	userId: string
}
```

### Status Enum

```typescript
enum Status {
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger',
}
```
