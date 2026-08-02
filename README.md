# 🔐 SecureAuth

A production-ready authentication and authorization backend built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**. SecureAuth provides secure JWT-based authentication, refresh token rotation, password reset via email, API documentation, and production deployment using Docker and Railway.

> 🚀 Live Demo: https://secureauth-production-db25.up.railway.app  
> 📖 API Documentation: https://secureauth-production-db25.up.railway.app/api-docs

---

## ✨ Features

- 🔑 User Registration & Login
- 🔒 JWT Access & Refresh Token Authentication
- 🍪 HTTP-Only Secure Refresh Token Cookies
- 🔄 Refresh Token Rotation
- 👤 Protected Routes Middleware
- 🔐 Password Hashing with bcrypt
- 📧 Forgot Password & Reset Password via Email (Mailtrap)
- 🛡️ Security Middleware (Helmet, CORS, Rate Limiting, Compression)
- 🗄️ PostgreSQL Database with Prisma ORM
- 📚 Interactive Swagger API Documentation
- 🐳 Dockerized for Easy Deployment
- ☁️ Production Deployment on Railway
- 📝 Centralized Error Handling & Logging

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| Password Hashing | bcrypt |
| Validation | Zod |
| Email Service | Nodemailer + Mailtrap |
| API Docs | Swagger |
| Deployment | Railway |
| Containerization | Docker |

---

# 📂 Project Structure

```
src
├── config
├── database
├── docs
├── logger
├── middleware
├── modules
│   └── auth
├── shared
├── types
├── utils
├── app.ts
└── server.ts
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/mkrishna09/SecureAuth.git

cd SecureAuth
```

Install dependencies

```bash
npm install
```

Create your environment file

```bash
cp .env.example .env
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Start development server

```bash
npm run dev
```

---

# 🔑 Environment Variables

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

---

# 📚 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Register User |
| POST | `/auth/login` | Login User |
| POST | `/auth/refresh` | Refresh Access Token |
| POST | `/auth/logout` | Logout User |
| POST | `/auth/forgot-password` | Request Password Reset |
| POST | `/auth/reset-password` | Reset Password |
| GET | `/auth/me` | Get Current User |

---

# 📖 API Documentation

Swagger UI

```
/api-docs
```

Example

```
https://secureauth-production-db25.up.railway.app/api-docs
```

---

# 🔒 Authentication Flow

```text
User Login
     │
     ▼
Verify Credentials
     │
     ▼
Generate Access Token (15 min)
Generate Refresh Token (30 days)
     │
     ▼
Store Refresh Token Hash in Database
     │
     ▼
Return Access Token + HTTP-only Cookie
```

---

# 🔄 Refresh Token Flow

```text
Client sends Refresh Cookie
        │
        ▼
Verify JWT
        │
        ▼
Lookup Hashed Token in Database
        │
        ▼
Generate New Access Token
Generate New Refresh Token
        │
        ▼
Replace Stored Hash
        │
        ▼
Return New Tokens
```

---

# 🐳 Docker

Build

```bash
docker compose build
```

Run

```bash
docker compose up
```

Stop

```bash
docker compose down
```

---

# ☁️ Deployment

SecureAuth is deployed using:

- Railway
- Neon PostgreSQL
- Docker
- GitHub Actions Ready

---

# 🚀 Future Improvements

- Email Verification
- OAuth (Google & GitHub Login)
- Multi-Factor Authentication (MFA)
- Session Management Dashboard
- Role-Based Access Control (RBAC)
- Audit Logs
- Unit & Integration Tests
- CI/CD Pipeline with GitHub Actions

---

# 👨‍💻 Author

**Krishna Maheshwari**

GitHub: https://github.com/mkrishna09

LinkedIn: https://linkedin.com/in/krishna-maheshwari-5ab072298

---

# 📄 License

This project is licensed under the MIT License.