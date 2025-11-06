# Movie Explorer - Setup Guide

Complete guide to running the Movie Explorer application using Docker (recommended) or traditional setup.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start with Docker (Recommended)](#quick-start-with-docker-recommended)
3. [Traditional Setup (Without Docker)](#traditional-setup-without-docker)
4. [API Keys & Configuration](#api-keys--configuration)
5. [Troubleshooting](#troubleshooting)
6. [Additional Commands](#additional-commands)

---

## Prerequisites

Choose your setup method:

### For Docker Setup (Recommended)
- **Docker Desktop** (includes Docker and Docker Compose)
  - [Download for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - [Download for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)
- Verify installation:
  ```bash
  docker --version
  docker-compose --version
  ```

### For Traditional Setup
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

### Required API Keys (Both Methods)
- **Auth0 Account** - [Sign up free](https://auth0.com/signup)
- **OMDB API Key** - [Get free key](http://www.omdbapi.com/apikey.aspx)
- **Google Gemini API Key** - [Get free key](https://aistudio.google.com/app/apikey)

**Note**: A fully configured `.env` file with all necessary API keys will be provided to you via email. You won't need to obtain these keys separately.

---

## 🚀 Quick Start with Docker (Recommended)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd movie-explorer
```

### Step 2: Configure Environment Variables

**Important**: You will receive a fully configured `.env` file via email.

Place the `.env` file in the **root directory** of the project:
```
movie-explorer/
├── .env          ← Place the file here
├── backend/
├── frontend/
├── docker-compose.yml
└── ...
```

The `.env` file contains all necessary configuration:
```env
# Auth0
AUTH0_ISSUER_URL=https://your-tenant.auth0.com/
AUTH0_AUDIENCE=your-api-identifier

# API Keys
OMDB_API_KEY=your-omdb-api-key
GOOGLE_API_KEY=your-google-gemini-api-key

# Frontend Auth0
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
REACT_APP_AUTH0_AUDIENCE=your-api-identifier
```

### Step 3: Build and Start All Services
```bash
# Build and start all containers (database, backend, frontend)
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

**That's it!** 🎉 The application is now running:
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### Step 4: Stop the Application
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

---

## 🛠️ Traditional Setup (Without Docker)

### Step 1: Setup PostgreSQL Database

#### Start PostgreSQL
```bash
# macOS (with Homebrew)
brew services start postgresql@15

# Windows (run in terminal as admin)
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# Linux
sudo systemctl start postgresql
```

#### Create Database
```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE movie_explorer;

# Exit
\q
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'BACKEND_ENV'
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=movie_explorer

# Auth0
AUTH0_ISSUER_URL=https://your-tenant.auth0.com/
AUTH0_AUDIENCE=your-api-identifier

# API Keys
OMDB_API_KEY=your-omdb-api-key
GOOGLE_API_KEY=your-google-gemini-api-key

# App
NODE_ENV=development
PORT=3000
BACKEND_ENV

# Edit .env with your actual values
nano .env

# Run database migrations (if any)
npm run typeorm migration:run

# Start the backend server
npm run start:dev
```

**Backend will be running at:** http://localhost:3000

### Step 3: Setup Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << 'FRONTEND_ENV'
REACT_APP_API_URL=http://localhost:3000
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
REACT_APP_AUTH0_AUDIENCE=your-api-identifier
FRONTEND_ENV

# Edit .env with your actual values
nano .env

# Start the frontend development server
npm start
```

**Frontend will be running at:** http://localhost:3000 (or 3001 if 3000 is taken)

### Step 4: Stop the Application
```bash
# In each terminal window, press:
Ctrl + C

# Stop PostgreSQL (optional)
# macOS
brew services stop postgresql@15

# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" stop

# Linux
sudo systemctl stop postgresql
```

---

## 🔑 API Keys & Configuration

**Important**: A fully configured `.env` file with all necessary API keys and configuration will be provided to you via email. This section is for reference only if you need to set up your own keys or understand the configuration.

---

### Auth0 Setup

1. **Create Auth0 Application**
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Create new **Single Page Application**
   - Note your **Domain** and **Client ID**

2. **Configure Application**
   - **Allowed Callback URLs**: `http://localhost, http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost, http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost, http://localhost:3000`

3. **Create API**
   - Go to APIs section
   - Create new API
   - Note your **API Identifier** (this is your audience)

### OMDB API Key

1. Visit [OMDB API](http://www.omdbapi.com/apikey.aspx)
2. Choose free tier (1,000 requests/day)
3. Verify your email
4. Copy your API key

### Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

**Note**: A fully configured `.env` file with all API keys will be provided via email. This section is for reference only if you need to obtain your own keys.

---

## 🐛 Troubleshooting

### Docker Issues

**Problem: Port already in use**
```bash
# Find what's using the port
lsof -i :3000  # or :80, :5432

# Stop the process or change port in docker-compose.yml
```

**Problem: Container won't start**
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Rebuild without cache
docker-compose build --no-cache
docker-compose up
```

**Problem: Database connection error**
```bash
# Ensure postgres is healthy
docker-compose ps

# Wait for postgres to be ready (check health status)
# The backend has a healthcheck dependency that waits for postgres
```

### Traditional Setup Issues

**Problem: Cannot connect to database**
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check connection settings in backend/.env
# Ensure DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD are correct
```

**Problem: npm install fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem: Backend won't start**
```bash
# Check if port 3000 is available
lsof -i :3000

# Kill the process using port 3000
kill -9 <PID>

# Or change PORT in backend/.env
```

**Problem: Frontend can't connect to backend**
```bash
# Ensure backend is running
curl http://localhost:3000/health

# Check REACT_APP_API_URL in frontend/.env
# Should be: REACT_APP_API_URL=http://localhost:3000
```

### Auth0 Issues

**Problem: Login not working**
- Verify Auth0 **Callback URLs** include your frontend URL
- Check Auth0 credentials in `.env` files
- Ensure **Application Type** is "Single Page Application"

**Problem: API returns 401 Unauthorized**
- Verify **AUTH0_AUDIENCE** matches between backend and frontend
- Check **AUTH0_ISSUER_URL** ends with `/`
- Ensure token is being sent in requests

---

## 📚 Additional Commands

### Docker Commands

```bash
# View running containers
docker-compose ps

# View logs (all services)
docker-compose logs

# View logs (specific service)
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f

# Restart a specific service
docker-compose restart backend

# Stop specific service
docker-compose stop frontend

# Execute command in running container
docker-compose exec backend npm run typeorm migration:run

# Access database
docker-compose exec postgres psql -U postgres -d movie_explorer

# Remove everything (including volumes)
docker-compose down -v
docker system prune -a
```

### Traditional Setup Commands

```bash
# Backend commands (in backend directory)
npm run start:dev      # Start in development mode
npm run build          # Build for production
npm run start:prod     # Start production build
npm test               # Run tests
npm run lint           # Check code style
npm run typeorm        # Run TypeORM CLI commands

# Frontend commands (in frontend directory)
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
npm run lint           # Check code style

# Database commands
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
npm run typeorm migration:revert
```

### Development Commands

```bash
# Backend: Watch mode with auto-reload
cd backend && npm run start:dev

# Frontend: Development server with hot reload
cd frontend && npm start

# Run tests with coverage
cd backend && npm test -- --coverage
cd frontend && npm test -- --coverage --watchAll=false

# Format code
cd backend && npm run format
cd frontend && npm run format
```

---

## 🎯 Quick Reference

### With Docker (Recommended)
```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f
```

### Traditional Setup
```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm start

# Terminal 3: Database (if not running as service)
postgres -D /usr/local/var/postgres
```

---

## 🔗 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost | Main application |
| Backend API | http://localhost:3000 | REST API |
| Swagger Docs | http://localhost:3000/api | API Documentation |
| Database | localhost:5432 | PostgreSQL |

---

## 📝 Notes

- **Docker is recommended** for easiest setup and consistency
- Database data persists in Docker volumes (won't be lost on restart)
- Use `docker-compose down -v` to completely reset (deletes data)
- Frontend `.env` changes require rebuild: `docker-compose up --build frontend`
- Backend `.env` changes require restart: `docker-compose restart backend`

---

## 🆘 Need Help?

1. Check the [Troubleshooting](#troubleshooting) section
2. View application logs
3. Verify all environment variables are set correctly
4. Ensure all required services are running
5. Check firewall/antivirus isn't blocking ports

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Frontend loads at http://localhost
- [ ] Can log in with Auth0
- [ ] Backend API responds at http://localhost:3000/health
- [ ] Can search for movies
- [ ] Can add movies to favorites
- [ ] Favorites persist after page refresh
- [ ] AI analysis works for movie details

**Congratulations! Your Movie Explorer is now running!** 🎬🍿
