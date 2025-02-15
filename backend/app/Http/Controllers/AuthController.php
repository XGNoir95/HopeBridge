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
        $validator = Validator::make($request->all(), [
            'userName' => 'required|string|max:255',
            'userMail' => 'required|email|unique:users,userMail',
            'userPhone' => 'required|string|max:255',
            'password' => 'required|string|min:4',
            'blood_group' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'city' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'userName' => $request->userName,
            'userMail' => $request->userMail,
            'userPhone' => $request->userPhone,
            'password' => Hash::make($request->password),
            'blood_group' => $request->blood_group,
            'district' => $request->district,
            'city' => $request->city,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->makeHidden(['password']), // Exclude sensitive fields
        ], 201);
    }

    // User Login
    public function login(Request $request)
    {
        $data = $request->validate([
            'userMail' => 'required|string|email',  // Change to 'userMail' instead of 'email'
            'password' => 'required|string',
        ]);
    
        // $user= User::where('userMail', $data['userMail'])->first();
        $user= $this->UserService->getUserByMail($data['userMail']);
    
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        $token = $this->issueJwtToken($user->user_id);
        Log::info('User logged in successfully', [
            'userMail' => $data['userMail'],
            'user_id' => $user->user_id,
            'timestamp' => now(),
        ]);
        return response()->json(['token' => $token]);
    }

    //Token Issue
    protected function issueJwtToken($userId)
    {
        $config = Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::plainText(config('app.jwt_secret'))
        );

        $now = new DateTimeImmutable();
        $token = $config->builder()
            ->issuedBy(config('app.url'))  // Issuer (optional)
            ->issuedAt($now)
            ->expiresAt($now->modify('+1 hour'))
            ->withClaim('uid', $userId) // Add user ID as a claim
            ->getToken($config->signer(), $config->signingKey());

        return $token->toString();
    }
    
    //Parse Jwt
    // protected function parseJwtToken(string $jwt)
    // {
    //     $config = Configuration::forSymmetricSigner(
    //         new Sha256(),
    //         InMemory::plainText(config('app.jwt_secret'))
    //     );

    //     try {
    //         $token = $config->parser()->parse($jwt);

    //         // Extract claims (fixing the issue)
    //         $claims = $token->claims()->all();  

    //         return $claims;
    //     } catch (\Exception $e) {
    //         return null;
    //     }
    // }


    // Validate JWT
    // protected function validateJwtToken(string $jwt)
    // {
    //     if (!$jwt) {
    //         return false;
    //     }
    //     $config = Configuration::forSymmetricSigner(
    //         new Sha256(),
    //         InMemory::plainText(config('app.jwt_secret'))
    //     );
    //     try {
    //         $token = $config->parser()->parse($jwt);

    //         // Validate the token signature
    //         $isValid = $config->validator()->validate($token, new SignedWith(
    //             $config->signer(),
    //             $config->signingKey()
    //         ));

    //         return $isValid; // Return true if validation passes
    //     } catch (\Exception $e) {
    //         return false; // Return false if validation fails
    //     }
    // }

    //Validate Token
    // public function validateToken(Request $request)
    // {
    //     $jwt = $request->bearerToken();

    //     if (!$jwt) {
    //         return response()->json(['message' => 'No token provided'], 401);
    //     }

    //     if ($this->validateJwtToken($jwt)) {
    //         return response()->json(['message' => 'Token is valid']);
    //     }

    //     return response()->json(['message' => 'Invalid or expired token'], 401);
    // }
   
}