# 🎬 Movie Explorer

A full-stack movie exploration application with AI-powered reviews, user authentication, and favorites management.

## Features

- 🔍 **Search Movies** - Search millions of movies using OMDB API
- ⭐ **Favorites** - Save and manage your favorite movies
- 🤖 **AI Reviews** - Get AI-generated sentiment analysis of movie ratings
- 🎨 **Modern UI** - Beautiful, responsive interface with PrimeReact
- 🔐 **Secure Auth** - Authentication powered by Auth0
- 📊 **Pagination** - Efficient browsing with paginated results

## Tech Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- PrimeReact UI components
- Auth0 for authentication
- Framer Motion for animations

### Backend
- NestJS with TypeScript
- PostgreSQL database
- TypeORM for database management
- Auth0 JWT validation
- Google Gemini AI integration
- Swagger API documentation

## Quick Start

### Option 1: Docker (Recommended) ⚡

```bash
# 1. Clone the repository
git clone https://github.com/retr0Tech/movie-explorer.git
cd movie-explorer

# 2. Set up environment variables
# You will receive a configured .env file via email
# Place the .env file in the root directory of the project (movie-explorer/.env)

# 3. Run the start script
./start.sh
//if using windows run this command in git bash
```

**That's it!** Access the app at http://localhost

### Start/Stop
```bash
./start.sh              # Start everything
./stop.sh               # Stop everything
docker-compose up -d    # Start detached
docker-compose down     # Stop services
docker-compose down -v  # Stop + remove data
```

**Note**: The `.env` file contains all necessary API keys and configuration. It will be provided to you via email. Simply place it in the root directory of the project.

### Option 2: Traditional Setup

## Documentation

- **[🧪 Test Documentation](./TEST_SUMMARY.md)** - Comprehensive testing guide with 41 passing tests
- **[🔧 API Documentation](http://localhost:3000/api)** - Swagger docs (when backend is running)

## Environment Variables
- Step 1
in the frontend directory incert the .env file in /option 2/frontend directory in the google drive link shared in the email

-Step 2
in the backend directory incert the .env file in /option 2/backend directory in the google drive link shared in the email

## steps
NOTE: an instance of postgre needs to be running
```bash
# 1. Clone the repository
git clone https://github.com/retr0Tech/movie-explorer.git

cd movie-explorer
cd frontend
npm i
npm start

```

in a separate command line

```bash
cd movie-explorer
cd backend
npm i
npm run start:dev

```

## Project Structure

```
movie-explorer/
├── backend/              # NestJS API server
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── infrastructure/ # External services
│   │   └── main.ts       # Application entry
│   ├── Dockerfile
│   └── package.json
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── store/        # Redux store
│   │   ├── services/     # API services
│   │   └── App.tsx       # App entry
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml    # Docker orchestration
├── .env          				# Environment file (will be provided by author)
├── SETUP.md              # Setup instructions
└── README.md             # This file
```

## Available Scripts

### Docker
- `./start.sh` - Start all services
- `./stop.sh` - Stop all services
- `docker-compose up -d` - Start in detached mode
- `docker-compose down` - Stop services
- `docker-compose down -v` - Stop and remove data

### Development
```bash
# Backend
cd backend
npm install
npm run start:dev
npm test

# Frontend
cd frontend
npm install
npm start
npm test
```

## Testing

Run the comprehensive test suite:

```bash
# Backend (23 tests)
cd backend && npm test

# Frontend (18 tests)
cd frontend && npm test -- --watchAll=false

# With coverage
npm test -- --coverage
```

See [TEST_SUMMARY.md](./TEST_SUMMARY.md) for details.

## Features in Detail

### 🔍 Movie Search
- Real-time search with OMDB API
- Pagination support
- Movie posters and metadata
- Favorite status indicators

### ⭐ Favorites Management
- Add/remove favorites
- Persistent storage in PostgreSQL
- Paginated favorites list
- Filter by title

### 🤖 AI-Powered Reviews
- Sentiment analysis using Google Gemini AI
- Audience vs Critics reception analysis
- Key insights extraction
- Overall sentiment scoring

### 🔐 Authentication
- Secure Auth0 integration
- JWT token validation
- Protected API endpoints
- User-specific favorites

## API Endpoints

### Movies
- `GET /movies/search?title=inception` - Search movies
- `GET /movies/:imdbId` - Get movie details
- `GET /movies/:imdbId/analysis` - Get AI analysis

### Favorites
- `GET /favorites` - Get user's favorites (paginated)
- `POST /favorites` - Add to favorites
- `DELETE /favorites/:id` - Remove from favorites

Full API documentation: http://localhost:3000/api

## Troubleshooting

See [SETUP.md - Troubleshooting](./SETUP.md#troubleshooting) for common issues and solutions.

Quick fixes:
```bash
# Rebuild containers
docker-compose up --build

# View logs
docker-compose logs backend

# Reset everything
docker-compose down -v
docker system prune -a
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- 📧 Email: support@movieexplorer.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Docs: [SETUP.md](./SETUP.md)

---

**Made with ❤️ and powered by Claude AI**
