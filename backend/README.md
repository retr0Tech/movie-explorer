# Movie Explorer Backend

A NestJS-based backend API for managing favorite movies with Auth0 authentication and OMDB API integration.

## Features

- **Authentication**: Secure endpoints using Auth0 JWT authentication
- **Favorites Management**: Full CRUD operations for user's favorite movies
- **Movie Search**: Search movies by title using OMDB API
- **Movie Details**: Get detailed information about movies from OMDB
- **PostgreSQL Database**: Persistent storage with TypeORM

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Auth0 (JWT with RS256)
- **External API**: OMDB API
- **Validation**: class-validator & class-transformer

## Project Structure

```
src/
├── core/                           # Domain layer
│   └── exceptions/                 # Custom exceptions
├── infrastructure/                 # Infrastructure layer
│   ├── database/                   # Database configuration
│   └── omdb/                       # OMDB API integration
├── modules/                        # Feature modules
│   ├── auth/                       # Auth0 authentication
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── decorators/user.decorator.ts
│   └── movies/                     # Movies & favorites module
│       ├── entities/               # Database entities
│       ├── dto/                    # Data transfer objects
│       ├── movies.controller.ts
│       ├── movies.service.ts
│       └── movies.module.ts
├── app.module.ts
└── main.ts
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `src/.env` and update the values:

```bash
cp .env.example src/.env
```

Required environment variables:

```env
# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# Auth0 Configuration
AUTH0_DOMAIN=dev-0kc6l1vo2s2esnak.us.auth0.com
AUTH0_CLIENT_ID=gkSMJNU9w6u9PYsB5Zo2iJVNqo6cMaNj
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://dev-0kc6l1vo2s2esnak.us.auth0.com/api/v2/

# OMDB API Configuration
OMDB_API_KEY=189f1c16

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=movie_explorer
```

### 3. Set Up Auth0

Your Auth0 application is already configured with:
- **Domain**: `dev-0kc6l1vo2s2esnak.us.auth0.com`
- **Client ID**: `gkSMJNU9w6u9PYsB5Zo2iJVNqo6cMaNj`

The credentials are already set in the `.env` file. Make sure your Auth0 application has:
1. The correct callback URLs configured for your frontend
2. API permissions configured if you're using a custom API

### 4. Set Up PostgreSQL Database

```bash
# Create database
createdb movie_explorer

# Or using psql
psql -U postgres
CREATE DATABASE movie_explorer;
```

### 5. Run Database Migrations

The application uses TypeORM. On first run, you may need to sync the schema:

```bash
# For development, you can temporarily enable synchronize in database.postgresql.ts
# Or create migrations (recommended for production)
npm run start:dev
```

### 6. Start the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

All endpoints require an Auth0 JWT token in the Authorization header:

```
Authorization: Bearer <your-auth0-token>
```

### Movies Search

#### Search Movies by Title
```
GET /movies/search?title=<movie-title>&page=<page-number>
```

**Query Parameters:**
- `title` (required): Movie title to search
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "Search": [
    {
      "Title": "The Matrix",
      "Year": "1999",
      "imdbID": "tt0133093",
      "Type": "movie",
      "Poster": "https://..."
    }
  ],
  "totalResults": "1",
  "Response": "True"
}
```

#### Get Movie Details
```
GET /movies/:imdbId
```

**Response:** Full movie details from OMDB

### Favorites Management

#### Get All Favorites
```
GET /favorites
```

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "auth0|123",
    "imdbId": "tt0133093",
    "title": "The Matrix",
    "year": "1999",
    "poster": "https://...",
    "genre": "Action, Sci-Fi",
    "plot": "A computer hacker learns...",
    "imdbRating": "8.7",
    "director": "Lana Wachowski, Lilly Wachowski",
    "actors": "Keanu Reeves, Laurence Fishburne",
    "runtime": "136 min",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### Get Favorite by ID
```
GET /favorites/:id
```

#### Add Movie to Favorites
```
POST /favorites
```

**Request Body:**
```json
{
  "imdbId": "tt0133093",
  "title": "The Matrix",
  "year": "1999",
  "poster": "https://...",
  "genre": "Action, Sci-Fi",
  "plot": "A computer hacker learns...",
  "imdbRating": "8.7",
  "director": "Lana Wachowski, Lilly Wachowski",
  "actors": "Keanu Reeves, Laurence Fishburne",
  "runtime": "136 min"
}
```

**Required fields:** `imdbId`, `title`, `year`

**Response:** Created favorite object (HTTP 201)

#### Update Favorite
```
PUT /favorites/:id
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "year": "2000",
  "plot": "Updated plot..."
}
```

**Response:** Updated favorite object

#### Delete Favorite
```
DELETE /favorites/:id
```

**Response:** HTTP 204 No Content

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (trying to modify another user's favorite)
- `404` - Not Found
- `409` - Conflict (duplicate favorite)
- `500` - Internal Server Error

## Security Features

- **Auth0 Authentication**: OAuth2/JWT token validation using express-oauth2-jwt-bearer
- **User Isolation**: Users can only access their own favorites
- **Input Validation**: All inputs are validated using class-validator
- **CORS Protection**: Configured for frontend origin only
- **SQL Injection Protection**: TypeORM parameterized queries

## Development

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

## Database Schema

### Favorites Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | VARCHAR | Auth0 user ID |
| imdb_id | VARCHAR | IMDB movie ID |
| title | VARCHAR | Movie title |
| year | VARCHAR | Release year |
| poster | VARCHAR | Poster URL (nullable) |
| genre | VARCHAR | Genre (nullable) |
| plot | TEXT | Plot description (nullable) |
| imdb_rating | VARCHAR | IMDB rating (nullable) |
| director | VARCHAR | Director (nullable) |
| actors | VARCHAR | Actors (nullable) |
| runtime | VARCHAR | Runtime (nullable) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Index on `user_id`
- Unique composite index on `(user_id, imdb_id)`

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Ensure PostgreSQL is running
2. Verify database credentials in `.env`
3. Check that the database exists
4. Ensure the database user has proper permissions

### Auth0 Token Validation Fails

1. Verify `AUTH0_DOMAIN` is correct: `dev-0kc6l1vo2s2esnak.us.auth0.com`
2. Check that `AUTH0_AUDIENCE` matches your API identifier
3. Ensure your Auth0 token is not expired
4. Verify the token is in the format: `Bearer <token>`
5. Make sure your frontend is requesting tokens from the correct Auth0 domain

### OMDB API Errors

If movie searches fail:

1. Verify `OMDB_API_KEY` is set correctly
2. Check your API key hasn't exceeded rate limits
3. Test the API key directly: `http://www.omdbapi.com/?apikey=189f1c16&s=matrix`

## License

UNLICENSED
