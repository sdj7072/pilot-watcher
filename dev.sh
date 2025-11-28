#!/bin/bash

# Function to kill background processes on exit
cleanup() {
  echo "Stopping services..."
  kill $(jobs -p) 2>/dev/null
}
trap cleanup EXIT

echo "Starting Backend..."
cd backend && npm run dev &

echo "Starting Frontend..."
cd frontend && npm run dev

wait
