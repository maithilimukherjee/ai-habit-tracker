# AI Habit Tracker

AI Habit Tracker is a full-stack productivity and habit-building application that combines traditional habit tracking with AI-powered insights and analysis.

The application helps users build consistency, monitor streaks, visualize progress, recover from broken streaks, and receive personalized habit recommendations using generative AI.

---

# Features

## Authentication

* User registration and login
* Secure password hashing with bcrypt
* JWT-based authentication
* Protected routes

## Habit Management

* Create habits
* Delete habits
* Categorize habits
* Add colors and icons to habits
* Track daily completions
* Habit streak calculation
* Longest streak tracking

## Analytics

* Habit heatmap visualization
* Consistency statistics
* Weekly AI-generated reports
* Morning motivational insights

## AI Features

* Personalized habit suggestions
* AI-powered streak recovery plans
* Habit analysis chatbot
* Productivity insights based on user data

## UI/UX

* Responsive design
* Sidebar profile menu
* Interactive habit cards
* Real-time streak updates
* Full-screen AI chat interface

---

# Tech Stack

## Frontend

* React
* Vite
* React Router DOM
* Axios
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## AI

* Google Gemini API

## Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

# Project Structure

```bash
frontend/
│
├── components/
├── pages/
├── services/
├── styles/
└── App.jsx

backend/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
└── server.js
```

---

# Environment Variables

## Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=your_frontend_url
```

## Frontend (.env)

```env
VITE_API_URL=your_backend_url/api
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/ai-habit-tracker.git
cd ai-habit-tracker
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# API Routes

## Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

## Habits

* GET `/api/habits`
* POST `/api/habits`
* DELETE `/api/habits/:id`

## Logs

* POST `/api/logs/complete`
* DELETE `/api/logs/uncomplete`
* GET `/api/logs/today`
* GET `/api/logs/stats/:habitId`

## AI

* POST `/api/ai/morning`
* POST `/api/ai/weekly-report`
* POST `/api/ai/suggest-ideas`
* POST `/api/ai/recovery-plan`
* POST `/api/ai/chat`

---

# Deployment

## Frontend

Deploy using Vercel.

## Backend

Deploy using Render.

## Database

Use MongoDB Atlas and whitelist deployment IPs if necessary.

---

# Future Improvements

* Edit habit functionality
* Habit reminders and notifications
* OAuth authentication
* Drag and drop habit reordering
* AI memory and personalized coaching
* Habit sharing and social accountability
* Dark/light theme switching

---

# Important Note

This project uses the Google Gemini API for AI-generated responses.

If the API quota limit is reached, certain AI-powered features such as:

* AI suggestions
* Chat analysis
* Recovery plans
* Weekly reports
* Morning motivation

may temporarily stop functioning or return errors until the quota resets.

