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

# Install PHP dependencies (only if composer.json exists)
RUN if [ -f "composer.json" ]; then \
        composer install --no-dev --optimize-autoloader; \
    fi

# Configure Nginx directly
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /var/www/html/public; \
    index index.php; \
    location / { \
        try_files $uri $uri/ /index.php?$query_string; \
    } \
    location ~ \.php$ { \
        fastcgi_pass 127.0.0.1:9000; \
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name; \
        include fastcgi_params; \
    } \
}' > /etc/nginx/sites-available/default \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Expose port 80
EXPOSE 80

# Create start script
RUN echo '#!/bin/bash \n\
service nginx start \n\
php-fpm' > /start.sh \
    && chmod +x /start.sh

# Start Nginx and PHP-FPM
CMD ["/start.sh"]