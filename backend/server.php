<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

$port = getenv('PORT') ?: 8080;
$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

// This file allows us to emulate Apache's "mod_rewrite" functionality from the
// built-in PHP web server. This provides a convenient way to test a Laravel
// application without installing a real web server.
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

echo "Starting Laravel development server on port $port...\n";
exec("php -S 0.0.0.0:$port -t public");
