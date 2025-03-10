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
        $jwt = $request->bearerToken();
        if (!$jwt) {
            return response()->json(['message' => 'No token provided'], 401);
        }

        try {
            // Configure JWT verification
            $config = Configuration::forSymmetricSigner(
                new Sha256(),
                InMemory::plainText(config('app.jwt_secret'))
            );

            // Parse JWT token
            $token = $config->parser()->parse($jwt);

            // Validate signature
            $isValid = $config->validator()->validate($token, new SignedWith(
                $config->signer(),
                $config->signingKey()
            ));

            if (!$isValid) {
                return response()->json(['message' => 'Invalid token'], 401);
            }

            $claims = $token->claims()->all();

            Log::info('JWT Token Claims:', ['claims' => $claims]);

            $userId = $claims['uid'] ?? null;
            $userRole = $claims['role']?? null;

            if (!$userId) {
                return response()->json(['message' => 'User ID not found in token'], 401);
            }
            
            $request->attributes->add([
                'user_id' => $userId,
                'user_role' => $userRole,
            ]);
        } catch (\Exception $e) {
            Log::error('JWT Validation Failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Invalid or expired token'], 401);
        }

        return $next($request);
    }
}
