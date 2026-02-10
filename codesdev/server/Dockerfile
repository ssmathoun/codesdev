FROM python:3.10-slim

# Install system dependencies for PostgreSQL and Docker-in-Docker
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && curl -fsSL https://get.docker.com | sh \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Ensure gunicorn is installed for production
RUN pip install gunicorn

# Copy the rest of the code
COPY . .

# Permissions for the startup script
RUN chmod +x start.sh

# Use the startup script to launch the app
CMD ["./start.sh"]