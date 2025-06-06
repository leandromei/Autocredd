# Use Python 3.11 slim image
FROM python:3.11-slim

# Install Node.js for frontend build
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY . .

# Build frontend
WORKDIR /app/frontend_bolt
RUN npm install && npm run build

# Go back to app root
WORKDIR /app

# Set environment for Railway
ENV ENVIRONMENT=railway
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Start command - run Python directly
CMD ["python", "simple_app.py"] 