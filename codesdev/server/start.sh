#!/usr/bin/env bash
echo "Cleaning up zombie runners..."
docker ps -a -q --filter "label=type=codesdev-runner" | xargs -r docker rm -f

# Wait for DB to be ready
echo "Waiting for database..."
sleep 2

# Apply migrations
echo "Applying database migrations..."
flask db upgrade || {
    echo "Upgrade failed, attempting to initialize..."
    flask db init
    flask db migrate -m "Auto-migration"
    flask db upgrade
}

# Start the Flask app
echo "Starting Flask..."
gunicorn --bind 0.0.0.0:5001 --workers 4 app:app