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

# Copy current directory contents to working directory
COPY . .

# Create required storage directory structure if not exists
RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader || echo "Composer install failed"

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

# Better Nginx configuration
RUN echo 'server { \
    listen 80 default_server; \
    listen [::]:80 default_server; \
    \
    root /var/www/html/public; \
    index index.php; \
    \
    server_name _; \
    \
    location / { \
        try_files $uri $uri/ /index.php?$query_string; \
    } \
    \
    location ~ \.php$ { \
        include snippets/fastcgi-php.conf; \
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock; \
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; \
        include fastcgi_params; \
    } \
    \
    location ~ /\.ht { \
        deny all; \
    } \
}' > /etc/nginx/sites-available/default

# Fix PHP-FPM socket configuration
RUN echo '[www] \
user = www-data \
group = www-data \
listen = /var/run/php/php8.0-fpm.sock \
listen.owner = www-data \
listen.group = www-data \
pm = dynamic \
pm.max_children = 5 \
pm.start_servers = 2 \
pm.min_spare_servers = 1 \
pm.max_spare_servers = 3' > /usr/local/etc/php-fpm.d/www.conf \
    && mkdir -p /var/run/php

# Create start script
RUN echo '#!/bin/bash \n\
php artisan config:clear \n\
php artisan route:clear \n\
php artisan cache:clear \n\
php artisan key:generate --force \n\
service nginx start \n\
php-fpm' > /start.sh \
    && chmod +x /start.sh

# Set environment variables for Laravel
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

# Expose port 80
EXPOSE 80

# Start Nginx and PHP-FPM
CMD ["/start.sh"]