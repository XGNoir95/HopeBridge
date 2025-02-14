<?php

use DateTimeImmutable;
use DateTimeZone;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\PermittedFor;
use Lcobucci\JWT\Validation\Constraint\ValidAt;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\Clock\SystemClock;
use Exception;
use Lcobucci\JWT\Token\Plain;
use Illuminate\Support\Facades\Log;
require 'vendor/autoload.php';
class JWTService{
    private static function getConfig(): Configuration{
        $jwtSecret = env('JWT_SECRET');
        if (!$jwtSecret) {
            throw new Exception('JWT_SECRET not set in the .env file');
        }
        return Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::plainText($jwtSecret)
        );
    }
    public function issueJwtToken($user)
    {
        $config = self::getConfig();
        $now = new DateTimeImmutable('now', new DateTimeZone(date_default_timezone_get()));
        $token = $config->builder()
        ->issuedBy(env('APP_URL'))
        ->permittedFor(env('APP_URL'))
        ->identifiedBy(bin2hex(random_bytes(16)))
        ->issuedAt($now)
        ->canOnlyBeUsedAfter($now)
        ->expiresAt($now->modify('+1 hour'))
        ->withClaim('user_id', $user->user_id)
            ->getToken($config->signer(), $config->signingKey());
        Log::info('Access Token: ' . $token->toString());
        return $token->toString();
    }

    public function verifyJwtToken($token){
        try{
            $config = self::getConfig();
            $token = $config->parser()->parse($token);
            $clock = new SystemClock(new DateTimeZone(date_default_timezone_get()));
            $constraints = [
                new IssuedBy(env('APP_URL')),
                new PermittedFor(env('APP_URL')),
                new SignedWith($config->signer(), $config->signingKey())
            ];
            $constraints[] = new ValidAt($clock);
            $config->validator()->assert($token, ...$constraints);
            return true;
        }catch(Exception $e){
            Log::error('Verification Error'. $e->getMessage());
            return false;
        }
    }
    public function parseJWTtoken(string $jwt){
        try {
            $config = self::getConfig();
            $token = $config->parser()->parse($jwt);
            if (!$token instanceof Plain) {
                Log::error('Token is not an instance of Plain');
                return null;
            }
            $claims = $token->claims()->all();
            return $claims['uid'] ?? null;
        } catch (Exception $e) {
            Log::error('Token Parsing Error: ' . $e->getMessage());
            return null;
        }
    }
}