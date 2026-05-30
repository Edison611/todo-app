# TODO App

This is a full-stack TODO List application with a Next.js (React) frontend and a Ruby on Rails backend.

## Quick Start (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Ruby (3.x recommended)
- Bundler (`gem install bundler`)
- PostgreSQL

### 1. Start the Backend (Rails)

```
cd backend
bundle install
rails db:setup # or db:create db:migrate db:seed
rails server
```
The backend should run on http://localhost:8000 (not by default configured to 8000).

### 2. Start the Frontend (Next.js)

In a new terminal:

```
cd frontend
npm install
# Set the Rails API URL for the frontend:
echo "RAILS_API_URL=http://localhost:8000" > .env.local
npm run dev
```
The frontend will run on http://localhost:3000

### 3. Open the App

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

**Features:**
- Add, edit, and delete TODO items
- Assign priorities (lower number = higher priority)
- See missing priorities

---

**Troubleshooting:**
- Make sure both backend and frontend servers are running
- Ensure `RAILS_API_URL` in `.env.local` matches your backend URL
- For database issues, check your Rails logs and run migrations
