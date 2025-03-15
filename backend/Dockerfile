FROM php:8.0-fpm

# Set the working directory
WORKDIR /var/www/html

# Install dependencies and Nginx
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    nginx \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set environment variable to allow Composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Copy the backend directory to the working directory
COPY backend/ .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Ensure storage directories exist with proper permissions
RUN mkdir -p storage/framework/sessions \
    storage/framework/views \
    storage/framework/cache \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Configure Nginx to use the PORT environment variable
RUN echo 'server {\n\
    listen $PORT default_server;\n\
    server_name _;\n\
    root /var/www/html/public;\n\
    index index.php;\n\
    location / {\n\
        try_files $uri $uri/ /index.php?$query_string;\n\
    }\n\
    location ~ \.php$ {\n\
        fastcgi_pass 127.0.0.1:9000;\n\
        fastcgi_index index.php;\n\
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\n\
        include fastcgi_params;\n\
    }\n\
    location ~ /\.ht {\n\
        deny all;\n\
    }\n\
    error_page 404 /index.php;\n\
}' > /etc/nginx/conf.d/default.conf

# Remove default Nginx config
RUN rm -f /etc/nginx/sites-enabled/default

# Create start script that uses the PORT environment variable
RUN echo '#!/bin/bash\n\
# Default PORT to 8080 if not set by Render\n\
export PORT=${PORT:-8080}\n\
# Replace the PORT placeholder with the actual port\n\
sed -i "s/\$PORT/$PORT/g" /etc/nginx/conf.d/default.conf\n\
# Laravel optimizations\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
# Fix storage permissions again just to be sure\n\
chmod -R 775 storage bootstrap/cache\n\
chown -R www-data:www-data storage bootstrap/cache\n\
# Print directory structure for debugging\n\
echo "Directory structure:"\n\
ls -la\n\
echo "Public directory:"\n\
ls -la public\n\
# Start services\n\
service nginx start\n\
php-fpm\n' > /start.sh \
    && chmod +x /start.sh

# Set environment variables for Laravel
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
# Default to port 8080, will be overridden by Render
ENV PORT=8080

# Expose the PORT
EXPOSE 8080

# Start Nginx and PHP-FPM
CMD ["/start.sh"]