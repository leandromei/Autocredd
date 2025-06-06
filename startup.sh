#!/bin/bash

echo "🚀 Starting AutoCred System..."
echo "📧 Login: admin@autocred.com"
echo "🔑 Password: admin123"
echo "🌍 Environment: Railway Production"

# Set environment variables
export PYTHONUNBUFFERED=1
export ENVIRONMENT=railway

# Get port from Railway or default to 8000
export PORT=${PORT:-8000}

echo "🌐 Starting server on port $PORT..."

# Start the application with uvicorn for Railway compatibility
uvicorn main:app --host 0.0.0.0 --port $PORT 