#!/bin/bash

# Movie Explorer - Quick Start Script
# This script helps you set up and run the application quickly

set -e

echo "🎬 Movie Explorer - Quick Start"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed!"
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️  Setting up environment variables..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
        echo ""
        echo "⚠️  IMPORTANT: Edit .env file with your API keys before running!"
        echo ""
        echo "Required variables:"
        echo "  - AUTH0_ISSUER_URL"
        echo "  - AUTH0_AUDIENCE"
        echo "  - OMDB_API_KEY"
        echo "  - GOOGLE_API_KEY"
        echo "  - REACT_APP_AUTH0_DOMAIN"
        echo "  - REACT_APP_AUTH0_CLIENT_ID"
        echo "  - REACT_APP_AUTH0_AUDIENCE"
        echo ""
        echo "Note: A configured .env file will be provided via email."
        echo ""
        read -p "Press Enter when you have placed the .env file in the root directory..."
    else
        echo "❌ .env.example not found!"
        exit 1
    fi
else
    echo "✅ Environment file found"
fi

echo ""
echo "🚀 Starting Movie Explorer..."
echo ""
echo "This will:"
echo "  1. Build Docker images (first time only, may take 5-10 minutes)"
echo "  2. Start PostgreSQL database"
echo "  3. Start Backend API"
echo "  4. Start Frontend application"
echo ""

# Start services
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Movie Explorer is running!"
    echo ""
    echo "📍 Access the application:"
    echo "   Frontend:  http://localhost"
    echo "   Backend:   http://localhost:3000"
    echo "   API Docs:  http://localhost:3000/api"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Stop the application:"
    echo "   docker-compose down"
    echo ""
else
    echo "❌ Some services failed to start. Check logs:"
    echo "   docker-compose logs"
    exit 1
fi
