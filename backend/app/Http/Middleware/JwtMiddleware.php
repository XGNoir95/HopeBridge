<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Illuminate\Support\Facades\Log;

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

            // Retrieve claims
            $claims = $token->claims()->all();

            // Debugging log to check the claims content
            Log::info('JWT Token Claims:', ['claims' => $claims]);

            // Extract user ID safely
            $userId = $claims['uid'] ?? null;

            if (!$userId) {
                return response()->json(['message' => 'User ID not found in token'], 401);
            }

            // Attach user ID to the request object for later use
            $request->attributes->add(['user_id' => $userId]);
        } catch (\Exception $e) {
            Log::error('JWT Validation Failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Invalid or expired token'], 401);
        }

        return $next($request);
    }
}
