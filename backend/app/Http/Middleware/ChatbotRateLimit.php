<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ChatbotRateLimit
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $identifier = $user ? 'user:' . $user->id : 'ip:' . $request->ip();
        
        $maxRequests = 10; // Increased for better UX
        $decayMinutes = 1;
        
        $key = 'chatbot-rate-limit:' . $identifier;
        $requests = Cache::get($key, 0);
        
        if ($requests >= $maxRequests) {
            return response()->json([
                'success' => false,
                'message' => 'Too many requests. Please try again later.'
            ], 429);
        }
        
        Cache::put($key, $requests + 1, now()->addMinutes($decayMinutes));
        
        return $next($request);
    }
}
