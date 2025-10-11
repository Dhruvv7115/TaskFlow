# 🔧 TaskFlow Backend API

RESTful API built with Express.js and MongoDB featuring JWT authentication and task management.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Validation:** express-validator

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js          # User schema with password hashing
│   └── Task.js          # Task schema with validation
├── routes/
│   ├── auth.js          # Register/Login endpoints
│   ├── user.js          # User profile management
│   └── tasks.js         # Task CRUD operations
├── middleware/
│   └── auth.js          # JWT verification middleware
├── server.js            # Express app configuration
├── package.json
└── .env
```

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Create .env file
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000

# Start development server
npm run dev

# Start production server
npm start
```

Server runs on **http://localhost:5000**

## 📡 API Endpoints

### Authentication (Public)

```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user (returns JWT)
```

### User Management (Protected)

```
GET  /api/user/profile     # Get current user
PUT  /api/user/profile     # Update user info
```

### Tasks (Protected)

```
GET    /api/tasks          # Get all tasks (supports filters)
GET    /api/tasks/:id      # Get single task
POST   /api/tasks          # Create new task
PUT    /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task
```

### Query Parameters for GET /api/tasks

- `search` - Search in title/description
- `status` - Filter by pending/in-progress/completed
- `priority` - Filter by low/medium/high
- `sort` - Sort by newest/oldest/title/priority

## 🔐 Authentication Flow

1. User registers → Password hashed with bcrypt
2. User logs in → JWT token generated (30-day expiry)
3. Token sent in `Authorization: Bearer <token>` header
4. Middleware validates token for protected routes

## 📦 Dependencies

```json
{
	"express": "^4.18.2",
	"mongoose": "^7.6.3",
	"bcryptjs": "^2.4.3",
	"jsonwebtoken": "^9.0.2",
	"express-validator": "^7.0.1",
	"dotenv": "^16.3.1",
	"cors": "^2.8.5"
}
```

## 🛡️ Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication
- ✅ Input validation on all endpoints
- ✅ MongoDB injection prevention
- ✅ CORS configuration
- ✅ Error handling middleware

## 🧪 Testing with Postman

1. Import `postman-collection.json`
2. Register user via `/api/auth/register`
3. Copy JWT token from response
4. Add to Authorization header: `Bearer <token>`
5. Test all protected endpoints

## 🚀 Deployment

**Recommended:** Render, Railway, or Heroku

```bash
# Set environment variables
PORT=5000
MONGODB_URI=<mongodb-atlas-uri>
JWT_SECRET=<production-secret>
CORS_ORIGIN=<frontend-url>
NODE_ENV=production
```

## 📈 Scalability Tips

- Add Redis for caching and session management
- Implement rate limiting with express-rate-limit
- Add database indexes on userId, status, createdAt
- Use MongoDB connection pooling
- Implement API versioning (/api/v1/)
- Add comprehensive logging (Winston)
- Use PM2 for process management

---

**API Documentation:** Import Postman collection for interactive docs from /api-docs

**Built with ❤️ using Node.js, Express, and MongoDB**