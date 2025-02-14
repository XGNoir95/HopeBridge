<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Services\JWTService;
use Closure;

class JWTMiddleware{
    protected $jwtService;
    public function handle(Request $request, Closure $next){
        $token = $request->bearerToken();
        $verification = $this->jwtService->verifyJwtToken($token);
        if(!$token|| !$verification){
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $next($request);
    }
}