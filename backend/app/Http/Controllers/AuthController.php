<?php

namespace App\Http\Controllers;

use App\Models\User;
use DateTimeImmutable;
use Illuminate\Http\Request;
use Lcobucci\JWT\Configuration;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Illuminate\Support\Facades\Validator;
use App\Services\UserService;
use Lcobucci\JWT\Validation\Constraint\SignedWith;

class AuthController extends Controller
{
    //Register a new user.
    protected $UserService;
    public function __construct(UserService $UserService){
        $this->UserService = $UserService;
    }
    public function register(Request $request)
    {
        $user=$this->UserService->createUser($request->all());
        if(!$user){
            return response()->json(["message"=> "Registration Failed"]  ,400);
        }
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->makeHidden(['password']), // Exclude sensitive fields
        ], 201);
    }

    // User Login
    public function login(Request $request)
    {
        $user =$this->UserService->loginGo($request);
        if(!$user){
            return response()->json(["message"=> "Login Failed"]  ,401);
        }
        $token= $this->UserService->getToken($user->user_id);
        Log::info('User logged in successfully', [
            'userMail' => $user->userMail,
            'user_id' => $user->user_id,
            'timestamp' => now(),
        ]);
        return response()->json(['token' => $token]);
    }
}