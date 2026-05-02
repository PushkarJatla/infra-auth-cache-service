# 🚀 InfraAuth – Scalable Authentication & Caching Service

A production-ready backend authentication system built using **Node.js**, **Express**, **PostgreSQL**, and **Redis**.
This project focuses on **security**, **performance**, and **scalability**, implementing real-world backend patterns like JWT authentication, RBAC, caching, and rate limiting.

---

## 🧠 Overview

InfraAuth is designed as a modular authentication service that handles:

- User registration and login
- Secure token-based authentication
- Role-based access control
- Performance optimization using caching
- API protection using rate limiting

The system is structured in a **clean architecture** with controllers, services, repositories, and middleware layers.

---

## ⚙️ Tech Stack

| Layer                   | Technology                       |
| ----------------------- | -------------------------------- |
| **Backend**             | Node.js, Express.js              |
| **Database**            | PostgreSQL (via Prisma ORM)      |
| **Caching & Rate Limiting** | Redis (via ioredis)         |
| **Authentication**      | JWT (Access + Refresh Tokens)    |
| **Validation**          | Zod                              |
| **Security**            | Helmet, bcrypt, CORS             |
| **API Documentation**   | Swagger UI                       |
| **Containerization**    | Docker, Docker Compose           |

---

## 📁 Project Structure

```
infra-auth-cache-service/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── env.js
│   │   ├── prisma.js
│   │   ├── redis.js
│   │   └── swagger.js
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── redisRateLimiter.middleware.js
│   │   ├── role.middleware.js
│   │   └── validate.middleware.js
│   ├── repositories/
│   │   └── user.repository.js
│   ├── routes/
│   │   └── auth.routes.js
│   ├── services/
│   │   └── auth.service.js
│   ├── utils/
│   ├── validations/
│   ├── validators/
│   ├── app.js
│   └── server.js
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

---

## 🔐 Features

### 1. Authentication System
- User registration and login
- Password hashing using **bcrypt**
- JWT-based authentication:
  - **Access Token** (short-lived)
  - **Refresh Token** (long-lived)

### 2. Authorization (RBAC)
- Role-Based Access Control (`USER`, `ADMIN`)
- Protected routes using middleware
- Admin-only endpoints

### 3. Middleware Architecture
- **Authentication middleware** – JWT verification
- **Validation middleware** – Request validation using Zod schemas
- **Role-based middleware** – Access control by role
- **Rate limiter middleware** – Redis-backed request throttling
- **Error handling middleware** – Centralized error responses

### 4. Redis Integration

#### ⚡ Caching
- User profile (`/me`) cached in Redis
- Reduces database load
- Improves response time

#### 🚫 Rate Limiting
- Limits number of requests per user/IP
- Prevents brute-force attacks
- Protects login and registration endpoints

### 5. API Documentation
- **Swagger UI** for testing APIs interactively
- Available at `/api-docs`
- Auto-generated from JSDoc annotations in route files

### 6. Docker Support
- Full **Docker Compose** setup with:
  - App container with hot-reload
  - PostgreSQL 15 (Alpine)
  - Redis 7 (Alpine)
- Health checks for all services
- One-command local development

---

## 🔄 Request Flow

```
Client Request
      │
      ▼
┌─────────────────┐
│  Rate Limiter    │  ← Redis-backed throttling
└────────┬────────┘
         ▼
┌─────────────────┐
│  Auth Middleware  │  ← JWT verification
└────────┬────────┘
         ▼
┌─────────────────┐
│  Validation      │  ← Zod schema validation
└────────┬────────┘
         ▼
┌─────────────────┐
│  Controller      │  ← Handles request
└────────┬────────┘
         ▼
┌─────────────────┐
│  Service         │  ← Business logic
└────────┬────────┘
         ▼
┌─────────────────┐
│  Redis Cache     │  ← Check cache first
└────────┬────────┘
         ▼
┌─────────────────┐
│  Repository      │  ← Database query (if cache miss)
└────────┬────────┘
         ▼
     Response
```

---

## 📌 API Endpoints

### Auth

| Method | Endpoint                        | Description              | Auth Required |
| ------ | ------------------------------- | ------------------------ | :-----------: |
| POST   | `/api/v1/auth/register`         | Register a new user      | ❌            |
| POST   | `/api/v1/auth/login`            | Login user               | ❌            |
| POST   | `/api/v1/auth/refresh-token`    | Refresh access token     | ❌            |
| GET    | `/api/v1/auth/verify`           | Verify JWT token         | ✅            |

### User

| Method | Endpoint                        | Description              | Auth Required |
| ------ | ------------------------------- | ------------------------ | :-----------: |
| GET    | `/api/v1/auth/me`               | Get current user (cached)| ✅            |
| PUT    | `/api/v1/auth/update-profile`   | Update user profile      | ✅            |

### Admin

| Method | Endpoint                        | Description              | Auth Required |
| ------ | ------------------------------- | ------------------------ | :-----------: |
| GET    | `/api/v1/auth/admin-only`       | Admin-only route (RBAC)  | ✅ (ADMIN)    |

> 📖 **Interactive API docs available at** `/api-docs` **(Swagger UI)**

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) & Docker Compose
- Or: PostgreSQL & Redis running locally

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/infra-auth-cache-service.git
cd infra-auth-cache-service

# Start all services
docker compose up --build
```

The app will be available at `http://localhost:5000` and Swagger UI at `http://localhost:5000/api-docs`.

### Manual Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your PostgreSQL and Redis connection details

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

| Variable              | Description                  |
| --------------------- | ---------------------------- |
| `PORT`                | Server port (default: 5000)  |
| `DATABASE_URL`        | PostgreSQL connection string |
| `REDIS_HOST`          | Redis host                   |
| `REDIS_PORT`          | Redis port                   |
| `JWT_SECRET`          | Secret key for access tokens |
| `JWT_REFRESH_SECRET`  | Secret key for refresh tokens|

---

## ⚡ Performance Optimization

- **Redis caching** reduces repeated database queries
- **Faster response time** for frequently accessed data (e.g., user profiles)
- **Scalable design** ready for high-traffic environments

---

## 🔐 Security Measures

- JWT-based authentication with access & refresh token rotation
- Password hashing using **bcrypt**
- Role-based access control (RBAC)
- Rate limiting to prevent brute-force & abuse
- Input validation using **Zod** for all API endpoints
- **Helmet** for HTTP security headers
- **CORS** configuration

---

## 📈 Impact

| Area            | Benefit                                            |
| --------------- | -------------------------------------------------- |
| 🚀 Performance | Caching reduces DB load & improves response times  |
| 🔐 Security    | JWT + RBAC ensures authenticated & authorized access|
| 🚫 Abuse Prevention | Rate limiting protects against brute-force attacks |
| 🧠 Architecture | Clean layered design enables scalability           |

---

## 🧩 Future Improvements

- [ ] Convert into a microservice-based auth system
- [ ] Add OAuth (Google, GitHub login)
- [ ] Implement CI/CD pipeline
- [ ] Add monitoring & logging (e.g., Winston, Prometheus)
- [ ] Multi-application support (centralized auth service)
- [ ] Cloud deployment (Render + Neon + Upstash)

---

## 🧠 Key Learnings

- Designing scalable backend architecture with clean separation of concerns
- Implementing secure authentication systems with JWT token rotation
- Using Redis for caching and performance optimization
- Structuring production-grade Node.js applications
- Containerizing applications with Docker Compose

---

## 🎯 Summary

**InfraAuth** is not just a CRUD project — it demonstrates how real-world backend systems handle **authentication**, **security**, **performance**, and **scalability**. Built with a clean architecture and production-ready patterns, it serves as a solid foundation for any application requiring a robust auth service.

---

## 📄 License

ISC
