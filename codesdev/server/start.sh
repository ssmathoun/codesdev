# Wait for DB to be ready
echo "Waiting for database..."
sleep 2

# Apply migrations automatically
echo "Applying database migrations..."
flask db upgrade || {
    echo "Upgrade failed, attempting to initialize..."
    flask db init
    flask db migrate -m "Auto-migration"
    flask db upgrade
}

# Start the Flask app
echo "Starting Flask..."
python app.py