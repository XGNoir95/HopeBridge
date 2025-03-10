<?php

namespace App\Http\Controllers;

use App\Models\User;
use DateTimeImmutable;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Services\AdminService;
use Lcobucci\JWT\Configuration;
use Illuminate\Support\Facades\Hash;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Illuminate\Support\Facades\Validator;
use Lcobucci\JWT\Validation\Constraint\SignedWith;

class AuthController extends Controller
{
    //Register a new user.
    protected $UserService;
    protected $AdminService;
    public function __construct(UserService $UserService,AdminService $AdminService){
        $this->UserService = $UserService;
        $this->AdminService = $AdminService;   
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
        $admin = $this->AdminService->loginGo($request);
        $user = $this->UserService->loginGo($request);
        $role=null;
    
        if ($admin) {
            $role = 'admin';
            $token =$this->UserService->getToken($admin->admin_id,$role);
        }
        else if($user){
            $role = 'user';
            $token =$this->UserService->getToken($user->user_id,$role);
        }
        else {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $token,
            'role' => $role,
        ]);
    }
}