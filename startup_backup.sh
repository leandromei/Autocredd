#!/bin/bash

echo "🚀 Starting AutoCred System (Simple Version)..."
echo "📧 Login: admin@autocred.com"
echo "🔑 Password: admin123"
echo "🌍 Environment: Railway Production"

# Set environment variables
export PYTHONUNBUFFERED=1
export ENVIRONMENT=railway

# Get port from Railway or default to 8000
if [ -z "$PORT" ]; then
    export PORT=8000
fi

echo "🌐 Starting server on port $PORT..."

# Start the simple application for Railway compatibility - using python direct
python simple_app.py 