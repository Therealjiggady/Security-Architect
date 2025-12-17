#!/bin/bash

# Start Celery worker and beat scheduler for Broken Beauty e-commerce platform
# This script runs both the worker (for processing tasks) and beat (for scheduled tasks)

echo "Starting Celery services..."

# Check if Redis is running
if ! redis-cli ping > /dev/null 2>&1; then
    echo "Error: Redis is not running. Please start Redis first with: redis-server"
    exit 1
fi

# Kill any existing Celery processes
pkill -f "celery.*broke_n_beauty" 2>/dev/null

# Start Celery worker in the background
echo "Starting Celery worker..."
celery -A app.celery_app worker \
    --loglevel=info \
    --concurrency=4 \
    --queues=emails,tracking,default \
    --logfile=celery_worker.log \
    --pidfile=celery_worker.pid \
    --detach

# Wait a moment for worker to start
sleep 2

# Start Celery beat scheduler in the background
echo "Starting Celery beat scheduler..."
celery -A app.celery_app beat \
    --loglevel=info \
    --logfile=celery_beat.log \
    --pidfile=celery_beat.pid \
    --detach

# Wait a moment for beat to start
sleep 2

echo ""
echo "Celery services started successfully!"
echo ""
echo "Worker PID: $(cat celery_worker.pid 2>/dev/null || echo 'Not found')"
echo "Beat PID: $(cat celery_beat.pid 2>/dev/null || echo 'Not found')"
echo ""
echo "Logs:"
echo "  - Worker: celery_worker.log"
echo "  - Beat: celery_beat.log"
echo ""
echo "To stop Celery services, run:"
echo "  pkill -f 'celery.*broke_n_beauty'"
echo ""
echo "To view logs in real-time:"
echo "  tail -f celery_worker.log"
echo "  tail -f celery_beat.log"
