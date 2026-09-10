#!/bin/sh
set -e

echo "==> Booting Treadmesh on Railway..."

# Wait briefly for MySQL container to accept connections
sleep 2

# Cache configurations for speed
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Run database migrations and seed demo accounts
echo "==> Running database migrations and seeders..."
php artisan migrate --force --seed || echo "Database already migrated or seeding completed."

# Serve the application
PORT="${PORT:-8000}"
echo "==> Treadmesh is live and listening on port $PORT"
exec php artisan serve --host=0.0.0.0 --port="$PORT"
