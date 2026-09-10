#!/bin/sh
set -e

# Create SQLite database file if it doesn't exist
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
fi

# Run migrations and seeders automatically
php artisan migrate --force --seed || echo "Database already initialized."

exec "$@"
