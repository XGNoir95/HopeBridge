<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Validation\Constraint\SignedWith;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $jwt = $request->bearerToken(); // Extract token from Authorization header

        if (!$jwt) {
            return response()->json(['message' => 'No token provided'], 401);
        }

        try {
            // Configure JWT verification
            $config = Configuration::forSymmetricSigner(
                new Sha256(),
                InMemory::plainText(config('app.jwt_secret'))
            );

            // Parse the JWT token
            $token = $config->parser()->parse($jwt);

            // Validate signature
            $isValid = $config->validator()->validate($token, new SignedWith(
                $config->signer(),
                $config->signingKey()
            ));

            if (!$isValid) {
                return response()->json(['message' => 'Invalid token'], 401);
            }

            // Retrieve claims correctly
            $claims = $token->claims()->all();

            // Extract user ID safely
            $userId = $claims['uid'] ?? null;

            if (!$userId) {
                return response()->json(['message' => 'Invalid token payload'], 401);
            }

            // Attach user ID to request attributes
            $request->attributes->add(['user_id' => $userId]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid or expired token'], 401);
        }

        return $next($request);
    }
}
