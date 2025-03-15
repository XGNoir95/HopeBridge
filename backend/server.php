<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

$port = getenv('PORT') ?: 8080;
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '');

// Serve static files when using PHP's built-in server
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

// Ensure Laravel serves on the correct port
echo "Starting Laravel server on 0.0.0.0:$port...\n";

require_once __DIR__.'/public/index.php';
