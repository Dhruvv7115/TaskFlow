# 🎨 TaskFlow Frontend

Modern Next.js 15 application with authentication, task management, and beautiful UI powered by ShadCN UI.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript
- **Styling:** TailwindCSS
- **UI Library:** ShadCN UI Components
- **Icons:** Tabler Icons
- **HTTP Client:** Axios
- **State:** React Context API

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.js              # Root layout with AuthProvider
│   ├── page.js                # Landing page
│   ├── globals.css            # Global styles & Tailwind
│   ├── login/page.js          # Login page
│   ├── register/page.js       # Registration page
│   └── dashboard/
│       ├── layout.js          # Dashboard layout with navbar
│       ├── page.js            # Dashboard home with stats
│       ├── tasks/page.js      # Task management (CRUD)
│       └── profile/page.js    # User profile
├── components/
│   ├── ui/                    # ShadCN components
│   └── TaskModal.jsx          # Task create/edit modal
├── context/
│   └── AuthContext.js         # Authentication state
├── lib/
│   ├── api.js                 # API service layer
│   └── utils.js               # Utility functions
├── .env.local
├── package.json
├── tailwind.config.js
├── next.config.js
└── jsconfig.json
```

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Application runs on **http://localhost:3000**

## 🎯 Features

- ✅ Stunning landing page with gradients
- ✅ User registration with validation
- ✅ Secure login with JWT
- ✅ Protected dashboard routes
- ✅ Task CRUD operations with modal
- ✅ Search and filter functionality
- ✅ Profile management
- ✅ Fully responsive design
- ✅ Loading states and error handling
- ✅ Modern UI with animations

## 📱 Pages Overview

### Public Pages

- **/** - Landing page with features
- **/login** - Login with split-screen design
- **/register** - Registration with validation

### Protected Pages (Dashboard)

- **/dashboard** - Stats overview with cards
- **/dashboard/tasks** - Task management with filters
- **/dashboard/profile** - User profile editor

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token auto-added to API requests via interceptor
4. Protected routes check auth state
5. Redirect to login if unauthorized
6. Logout clears token and redirects

## 🎨 UI Components (ShadCN)

- **Button** - Multiple variants with gradients
- **Input** - Styled form inputs with icons
- **Card** - Container with header/content/footer
- **Label** - Form labels
- **Badge** - Status and priority indicators

## 📦 Key Dependencies

```json
{
	"next": "15.5.4",
	"react": "^18.2.0",
	"axios": "^1.6.0",
	"tailwindcss": "^3.3.5",
	"@tabler/icons-react": "^2.44.0",
	"class-variance-authority": "^0.7.0",
	"tailwind-merge": "^2.0.0"
}
```

## 🎯 API Integration

All API calls handled through `lib/api.js`:

```javascript
import { authAPI, userAPI, tasksAPI } from "@/lib/api";

// Usage examples
await authAPI.login({ email, password });
await tasksAPI.getTasks({ status: "pending" });
await tasksAPI.createTask({ title, description });
```

## 🧪 Testing Checklist

- [ ] Landing page loads correctly
- [ ] Register new user
- [ ] Login with credentials
- [ ] Dashboard shows correct stats
- [ ] Create task via modal
- [ ] Edit existing task
- [ ] Delete task with confirmation
- [ ] Search functionality works
- [ ] Status/priority filters work
- [ ] Profile update successful
- [ ] Logout redirects to login
- [ ] Protected routes redirect when not auth
- [ ] Responsive on mobile/tablet/desktop

## 🚀 Deployment

**Recommended:** Vercel (optimized for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Tested on Chrome, Firefox, Safari, and Edge.

## 🎨 Design Highlights

- Gradient backgrounds (indigo to purple)
- Smooth hover animations
- Glass-morphism effects
- Modern card designs
- Icon-enhanced navigation
- Split-screen auth pages
- Mobile-first approach

---

**Built with Next.js 15 and ShadCN UI**
