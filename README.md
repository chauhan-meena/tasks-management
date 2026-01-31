# Express MySQL Tasks API

A RESTful API for Task management with authentication built using Express.js, TypeScript, MySQL, and Sequelize.

## Features

- User authentication (Signup/Login) with JWT
- CRUD operations for Tasks
- Pagination support
- Soft delete
- Request validation
- Swagger API documentation

## Tech Stack

- Express.js
- TypeScript
- MySQL
- Sequelize ORM
- JWT Authentication
- Swagger UI

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tasks_db

SECRET_KEY=your_secret_key

LOG_FORMAT=dev
LOG_DIR=../logs

ORIGIN=*
CREDENTIALS=true
```

## Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE tasks_db;
```

## Running the App

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Documentation

Swagger UI: `http://localhost:3000/api-docs`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get profile (protected) |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get task by ID |
| POST | /api/tasks | Create task |
| PATCH | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task (soft) |
