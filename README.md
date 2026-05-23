# MployCheck — Employee Verification Portal

<p align="center">
  <strong>A production-quality SaaS admin dashboard for employee background verification management.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-17+-red?style=flat-square&logo=angular" alt="Angular 17+">
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=flat-square&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Material-UI-blue?style=flat-square&logo=material-design" alt="Material UI">
  <img src="https://img.shields.io/badge/JWT-Auth-orange?style=flat-square&logo=json-web-tokens" alt="JWT Auth">
</p>

---

## 📋 Overview

MployCheck is an enterprise-grade Employee Verification Portal built as a Single Page Application (SPA). It provides a modern, secure dashboard for managing employee background verification records with role-based access control, real-time data management, and a premium SaaS-style UI.

## ✨ Features

### Authentication & Security
- JWT-based authentication with bcrypt password hashing
- Role-based access control (Admin / General User)
- Route guards and API protection
- Login persistence with session management

### Dashboard
- Welcome section with personalized greeting
- Real-time verification statistics (total, verified, pending, rejected)
- Verification breakdown charts (by company and type)
- Recent activity timeline
- Loading skeleton animations

### Record Management
- Full employee verification records table
- Server-side pagination, sorting, and filtering
- Search by employee name or company
- Status-based filtering (Pending, Verified, Rejected)
- Color-coded status chips and access level badges

### Admin Panel
- Complete user CRUD operations
- Create, edit, and delete users via dialog forms
- Activate/deactivate user accounts
- Role management (Admin / General User)
- Reactive forms with validation

### UI/UX
- Premium glassmorphism design
- Dark / Light theme with auto-detection
- Responsive layout (mobile, tablet, desktop)
- Skeleton loading states
- Toast notification system
- Smooth animations and transitions
- Custom Angular Material theme

### API Features
- Artificial delay mechanism (`?delay=ms`) for async demo
- Full REST API with validation middleware
- Global error handling
- Paginated responses with stats

---

## 📁 Folder Structure

```
MployCheck-Assignment/
├── client/                          # Angular 17+ Frontend
│   └── src/
│       └── app/
│           ├── admin/               # Admin panel (user management)
│           ├── auth/                # Authentication (login)
│           ├── dashboard/           # Dashboard with stats
│           ├── guards/              # Auth & Admin guards
│           ├── interceptors/        # HTTP interceptors
│           ├── layouts/             # Main layout (sidebar + navbar)
│           ├── models/              # TypeScript interfaces
│           ├── records/             # Verification records
│           ├── services/            # API services
│           └── shared/              # Reusable components
│
├── server/                          # Node.js + Express Backend
│   ├── config/                      # DB connection, constants
│   ├── controllers/                 # Route handlers
│   ├── middleware/                   # Auth, role, delay, error
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API route definitions
│   └── utils/                       # Seed scripts
│
├── instructions.txt                 # Project requirements
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)
- Angular CLI 17+ (`npm install -g @angular/cli`)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd MployCheck-Assignment
```

### 2. Backend Setup
```bash
cd server
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI

# Start the server (auto-seeds on first run)
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install

# Start Angular dev server
npm start
```

### 4. Access the Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Admin@123 |
| General User | user@demo.com | User@123 |

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/employee-verification` |
| `JWT_SECRET` | JWT signing secret | `dev_jwt_secret_mploycheck_2024` |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

---

## 📡 API Documentation

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/login` | No | — | User login |
| GET | `/api/auth/me` | Yes | Any | Current user profile |
| GET | `/api/users` | Yes | Admin | List all users |
| POST | `/api/users` | Yes | Admin | Create a user |
| PUT | `/api/users/:id` | Yes | Admin | Update a user |
| DELETE | `/api/users/:id` | Yes | Admin | Delete a user |
| GET | `/api/records` | Yes | Any | List verification records |
| GET | `/api/records/stats` | Yes | Any | Dashboard statistics |
| GET | `/api/health` | No | — | Health check |

### Query Parameters (Records)
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10, max: 100)
- `search` — Search by name or company
- `status` — Filter by Pending/Verified/Rejected
- `company` — Filter by company
- `sortBy` — Sort field (default: submittedDate)
- `sortOrder` — asc or desc (default: desc)
- `delay` — Artificial delay in ms (for async demo)

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Angular 17+ | Frontend SPA framework |
| Angular Material | UI component library |
| SCSS | Custom styling |
| RxJS | Reactive state management |
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication tokens |
| bcrypt | Password hashing |

---

## 🔮 Future Improvements

- [ ] Refresh token rotation
- [ ] WebSocket real-time notifications
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Audit trail logging
- [ ] Two-factor authentication
- [ ] Role-based API rate limiting
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Unit and E2E test coverage
- [ ] Activity logs page
- [ ] User profile editing
- [ ] Batch verification processing
- [ ] Advanced analytics with charts

---

## 📜 License

This project was built as an internship assignment for MployCheck.

---

<p align="center">
  Built with ❤️ using Angular, Node.js, and MongoDB
</p>
