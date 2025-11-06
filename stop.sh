#!/bin/bash

# Movie Explorer - Stop Script
# This script stops all running containers

echo "🛑 Stopping Movie Explorer..."
echo ""

docker-compose down

echo ""
echo "✅ All services stopped"
echo ""
echo "To start again, run:"
echo "  ./start.sh"
echo ""
echo "To remove all data (including database):"
echo "  docker-compose down -v"
