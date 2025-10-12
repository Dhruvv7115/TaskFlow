# 🚀 TaskFlow - Full Stack Task Management Application

A modern, responsive task management application built with Next.js 15, Express.js, and MongoDB featuring JWT authentication, CRUD operations, and beautiful UI.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login/registration with bcrypt password hashing
- ✅ **Task Management** - Complete CRUD operations for tasks
- 🔍 **Advanced Filtering** - Search, filter by status/priority, and sort tasks
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎨 **Modern UI** - Built with ShadCN UI components and Tabler Icons
- ⚡ **Real-time Updates** - Instant task synchronization
- 🛡️ **Protected Routes** - Secure dashboard with authentication middleware

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React, TailwindCSS, ShadCN UI, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT, bcrypt  
**Icons:** Tabler Icons

## 📁 Project Structure

```
TaskFlow/
├── backend/          # Express API with MongoDB
│   ├── models/       # User & Task schemas
│   ├── routes/       # API endpoints
│   └── middleware/   # JWT authentication
└── frontend/         # Next.js application
    ├── app/          # Pages (App Router)
    ├── components/   # UI components
    └── lib/          # API services
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
# Create .env with: MONGODB_URI, JWT_SECRET, PORT
npm run dev  # Runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev  # Runs on http://localhost:3000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/user/profile` | Get user profile (Protected) |
| PUT | `/api/user/profile` | Update profile (Protected) |
| GET | `/api/tasks` | Get all tasks with filters (Protected) |
| POST | `/api/tasks` | Create task (Protected) |
| PUT | `/api/tasks/:id` | Update task (Protected) |
| DELETE | `/api/tasks/:id` | Delete task (Protected) |

## 🎯 Key Features Implemented

✅ User registration with validation  
✅ Secure login with JWT tokens  
✅ Create, read, update, delete tasks  
✅ Search tasks by title/description  
✅ Filter by status (pending/in-progress/completed)  
✅ Filter by priority (low/medium/high)  
✅ Responsive design for all devices  
✅ Form validation (client & server)  
✅ Error handling and loading states  
✅ Profile management  

## 📸 Screenshots

### Desktop View

#### Dashboard
![Dashboard Desktop](/assets/dashboard-desktop.png)
*Modern dashboard with task statistics, gradient cards, and quick actions*

#### Tasks Page
![Tasks Desktop](/assets/tasks-desktop.png)
*Task management with search, filters, and CRUD operations*

### Mobile View

#### Dashboard Mobile
<img src="/assets/dashboard-mobile.png" alt="Dashboard Mobile" height="400" />

*Fully responsive dashboard with mobile navigation*

#### Tasks Mobile
<img src="/assets/tasks-mobile.png" alt="Dashboard Mobile" height="400" />
*Touch-optimized task management interface*

## 🔐 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication with 30-day expiry
- Protected API routes with middleware
- Input validation on client and server
- CORS configuration
- XSS and injection prevention

## 📈 Scalability Considerations

**For Production:**
- Add Redis for caching and session management
- Implement rate limiting for API protection
- Add pagination for large datasets
- Use database indexing for performance
- Implement refresh token rotation
- Add comprehensive logging (Winston/Morgan)
- Deploy with CI/CD pipeline
- Use CDN for static assets

## 🚀 Deployment

**Backend:** Render/Railway/Heroku  
**Frontend:** Vercel  
**Database:** MongoDB Atlas

## 📝 Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🧪 Testing

1. Register a new user
2. Login with credentials
3. Create tasks with different priorities
4. Test search and filter functionality
5. Edit and delete tasks
6. Update user profile
7. Test logout and login again

## 📦 Dependencies

**Key Backend Packages:** express, mongoose, jsonwebtoken, bcryptjs, express-validator  
**Key Frontend Packages:** next, react, axios, tailwindcss, @tabler/icons-react

---

**Built with ❤️ using Next.js 15, Express, and MongoDB**