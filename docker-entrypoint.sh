#!/bin/sh
set -e

# Default to SQLite if DB_CONNECTION is not defined or is empty
export DB_CONNECTION="${DB_CONNECTION:-sqlite}"

# Ensure database directory exists
mkdir -p /var/www/html/database

# Create SQLite database file if it doesn't exist
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi

# Ensure full read/write permissions for www-data on database and storage
chown -R www-data:www-data /var/www/html/database /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/database /var/www/html/storage /var/www/html/bootstrap/cache

# Clear stale caches
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Run database migrations and seeders automatically
echo "==> Running database migrations and seeders..."
php artisan migrate --force || echo "Migrations completed or already up to date."
php artisan db:seed --force || echo "Database already seeded."

# Re-enforce www-data ownership after migrations
chown -R www-data:www-data /var/www/html/database /var/www/html/storage /var/www/html/bootstrap/cache

exec "$@"
