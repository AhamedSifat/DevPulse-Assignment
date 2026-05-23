# DevPulse — Internal Tech Issue & Feature Tracker

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

---

## 🌐 Live URL

> [Live](https://dev-pulse-brown.vercel.app/)

---

## ✨ Features

- User registration & login with JWT authentication
- Role-based access control (`contributor` / `maintainer`)
- Create, view, update, and delete issues
- Filter issues by `type` and `status`; sort by newest or oldest
- Secure password hashing with bcrypt
- Clean REST API with consistent JSON responses

---

## 🛠️ Tech Stack

| Layer       | Technology                                              |
| ----------- | ------------------------------------------------------- |
| Runtime     | Node.js (LTS 24.x+)                                     |
| Language    | TypeScript (latest stable)                              |
| Framework   | Express.js (modular routers)                            |
| Database    | PostgreSQL (native `pg` driver)                         |
| Query Style | Raw SQL via `pool.query()` — no ORMs, no query builders |
| Auth        | JWT (`jsonwebtoken`)                                    |
| Hashing     | bcrypt (salt rounds: 8–12)                              |

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/AhamedSifat/DevPulse-Assignment
cd DevPulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env

DATABASE_URL=postgresql://user:password@localhost:5432/devpulse
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_access_token_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key
JWT_REFRESH_EXPIRES_IN=7d
```

### 4. Set up the database

Run the following SQL to create the required tables:

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)        NOT NULL,
  email       VARCHAR(255)        NOT NULL UNIQUE,
  password    VARCHAR(255)        NOT NULL,
  role        VARCHAR(20)         NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
  created_at  TIMESTAMP           NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE TABLE issues (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(150)        NOT NULL,
  description  TEXT                NOT NULL,
  type         VARCHAR(20)         NOT NULL CHECK (type IN ('bug', 'feature_request')),
  status       VARCHAR(20)         NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id  INTEGER             NOT NULL,
  created_at   TIMESTAMP           NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP           NOT NULL DEFAULT NOW()
);
```

### 5. Start the server

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

---

## 🗄️ Database Schema

### `users`

| Column       | Type         | Constraints                              |
| ------------ | ------------ | ---------------------------------------- |
| `id`         | SERIAL       | Primary Key                              |
| `name`       | VARCHAR(255) | NOT NULL                                 |
| `email`      | VARCHAR(255) | NOT NULL, UNIQUE                         |
| `password`   | VARCHAR(255) | NOT NULL (bcrypt hashed, never returned) |
| `role`       | VARCHAR(20)  | DEFAULT `contributor`, enum validated    |
| `created_at` | TIMESTAMP    | Auto-generated                           |
| `updated_at` | TIMESTAMP    | Auto-refreshed on update                 |

### `issues`

| Column        | Type         | Constraints                                       |
| ------------- | ------------ | ------------------------------------------------- |
| `id`          | SERIAL       | Primary Key                                       |
| `title`       | VARCHAR(150) | NOT NULL, max 150 chars                           |
| `description` | TEXT         | NOT NULL, min 20 chars                            |
| `type`        | VARCHAR(20)  | `bug` or `feature_request`                        |
| `status`      | VARCHAR(20)  | DEFAULT `open`; `open`, `in_progress`, `resolved` |
| `reporter_id` | INTEGER      | NOT NULL (validated in app logic)                 |
| `created_at`  | TIMESTAMP    | Auto-generated                                    |
| `updated_at`  | TIMESTAMP    | Auto-refreshed on update                          |

---

## 🌐 API Endpoints

### Auth

| Method | Endpoint           | Access | Description             |
| ------ | ------------------ | ------ | ----------------------- |
| POST   | `/api/auth/signup` | Public | Register a new user     |
| POST   | `/api/auth/login`  | Public | Login and receive a JWT |

### Issues

| Method | Endpoint          | Access                    | Description                        |
| ------ | ----------------- | ------------------------- | ---------------------------------- |
| POST   | `/api/issues`     | Authenticated             | Create a new issue                 |
| GET    | `/api/issues`     | Public                    | Get all issues (with filters/sort) |
| GET    | `/api/issues/:id` | Public                    | Get a single issue                 |
| PATCH  | `/api/issues/:id` | Maintainer or Issue Owner | Update issue fields                |
| DELETE | `/api/issues/:id` | Maintainer only           | Delete an issue                    |

### Query Parameters for `GET /api/issues`

| Param    | Values                            | Default  |
| -------- | --------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                | `newest` |
| `type`   | `bug`, `feature_request`          | (none)   |
| `status` | `open`, `in_progress`, `resolved` | (none)   |

## 👥 Role Permissions

| Action                         | Contributor | Maintainer |
| ------------------------------ | ----------- | ---------- |
| Register / Login               | ✅          | ✅         |
| Create issue                   | ✅          | ✅         |
| View all/single issues         | ✅          | ✅         |
| Update own issue (`open` only) | ✅          | ✅         |
| Update any issue               | ❌          | ✅         |
| Delete any issue               | ❌          | ✅         |
| Change issue status            | ❌          | ✅         |
