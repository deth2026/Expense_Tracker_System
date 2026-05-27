# Expend Tracker API

Backend API for an expense tracking system built with TypeScript, Express, JWT authentication, and TypeORM.

## Features

- User registration and login
- Admin login
- JWT-based authentication
- TypeORM entity setup
- MySQL database configuration
- Modular project structure for controllers, services, repositories, routes, and entities

## Tech Stack

- Node.js
- TypeScript
- Express
- TypeORM
- MySQL
- JSON Web Token
- bcryptjs

## Project Structure

```text
src/
├── config/
│   └── Database.ts
├── controllers/
├── entities/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
├── App.ts
└── server.ts
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=expense_tracker
DB_SYNCHRONIZE=true
```

## Available Scripts

```bash
npm run dev
npm run start
npm run build
```

- `npm run dev` starts the development server with `nodemon`
- `npm run start` runs the app with `ts-node`
- `npm run build` compiles TypeScript into `dist`

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`

### Users

#### User

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `PUT /api/users/change-password`
- `DELETE /api/users/profile`

#### Admin

- `GET /api/admin/profile`
- `GET /api/users`
- `GET /api/users/:id`

## Example Request Bodies

### Register

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### User Login

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Admin Login

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

## Run the Project

1. Install dependencies with `npm install`
2. Create the `.env` file
3. Make sure MySQL is running
4. Run `npm run dev`

The API will start on `http://localhost:3000`.

## Notes

- Current auth routes are wired and working with JWT.
- TypeORM entities are configured in `src/entities`.
- Database connection is configured in `src/config/Database.ts`.
- Authentication and user management now use the shared TypeORM-backed user repository.
