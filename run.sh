#!/usr/bin/env bash

set -e

# Kill background processes on exit
cleanup() {
  echo "Shutting down..."
  kill $RAILS_PID $NEXT_PID 2>/dev/null
  exit
}

trap cleanup SIGINT SIGTERM

echo "Starting Rails backend on port 8000..."
(
  cd backend
  PORT=8000 rails s
) &
RAILS_PID=$!

echo "Starting Next.js frontend on port 3000..."
(
  cd frontend
  npm run dev
) &
NEXT_PID=$!

echo "Both servers running:"
echo "- Rails: http://localhost:8000"
echo "- Next:  http://localhost:3000"

# Wait for both processes
wait $RAILS_PID $NEXT_PID
