<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use DateTimeImmutable;

class AuthController extends Controller
{
    // Generate JWT Token
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

    // Parse JWT Token
    protected function parseJwtToken(string $jwt)
    {
        $config = Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::plainText(config('app.jwt_secret'))
        );

        try {
            $token = $config->parser()->parse($jwt);

            // Extract claims (fixing the issue)
            $claims = $token->claims()->all();  

            return $claims; // Return claims as an associative array
        } catch (\Exception $e) {
            return null; // Return null if parsing fails
        }
    }

    // Validate JWT Token
    protected function validateJwtToken(string $jwt)
    {
        if (!$jwt) {
            return false;
        }

        $config = Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::plainText(config('app.jwt_secret'))
        );

        try {
            $token = $config->parser()->parse($jwt);

            // Validate the token signature
            $isValid = $config->validator()->validate($token, new SignedWith(
                $config->signer(),
                $config->signingKey()
            ));

            return $isValid; // Return true if validation passes
        } catch (\Exception $e) {
            return false; // Return false if validation fails
        }
    }

    // Register a new user
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        return response()->json(['message' => 'User registered successfully'], 201);
    }

    // Login and issue a token
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $this->issueJwtToken($user->id);
        return response()->json(['token' => $token]);
    }

    // Validate Token
    public function validateToken(Request $request)
    {
        $jwt = $request->bearerToken();

        if (!$jwt) {
            return response()->json(['message' => 'No token provided'], 401);
        }

        if ($this->validateJwtToken($jwt)) {
            return response()->json(['message' => 'Token is valid']);
        }

        return response()->json(['message' => 'Invalid or expired token'], 401);
    }
}
