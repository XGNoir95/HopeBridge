<?php

namespace App\Services;

use App\Models\User;
use DateTimeImmutable;
use Illuminate\Support\Facades\DB;
use Lcobucci\JWT\Configuration;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Request;

class UserService{
    public function createUser($data){
        // Create a new user instance
        $validator = Validator::make($data, [
            'userName' => 'required|string|max:255',
            'userMail' => 'required|email|unique:users,userMail',
            'userPhone' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'blood_group' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'city' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return false;
        }

        $user = User::create([
            'userName' => $data['userName'],
            'userMail' => $data['userMail'],
            'userPhone' => $data['userPhone'],
            'password' => Hash::make($data['password']),
            'blood_group' => $data['blood_group'],
            'district' => $data['district'],
            'city' => $data['city'],
        ]);
        return $user;
    }
    public function updateUser(User $user,$data){
        // Update user attributes
        $validator = Validator::make($data, [
            'userName' => 'required|string|max:255',
            'userMail' => 'required|email|unique:users,userMail',
            'userPhone' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'blood_group' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'city' => 'required|string|max:255',
        ]);
        $user->fill($data);
        $user->save();

        return $user;
    }
    public function loginGo($request){
        $data = $request->validate([
            'userMail' => 'required|string|email',  // Change to 'userMail' instead of 'email'
            'password' => 'required|string',
        ]);
        $user = $this->getUserByMail($data['userMail']);
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return false;
        }
        return $user;
    }
    public function getUserList(){
        // $user = User::all();
        $user =DB::table('users')->get();
        return $user->toArray();
    }
    public function getUserById($request){
        $userId = $request->get('user_id');
        $user = DB::table('users')->where('user_id',$userId)->first();
        return $user;
    }
    public function getUserByMail($mail) {
        // $user = User::where('userMail', $mail)->first();
        $user = DB::table('users')->where('userMail',$mail)->first();
        return $user;
    }
    public function deleteUser($id){
        // Delete the user
        // $user->delete();
        $user =$this->getUserByid($id);
        if(!$user)
            return false;
        DB::table('users')->where('user_id',$id)->delete();

        return true;
    }
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
    public function getToken($id){
        $token = $this->issueJwtToken($id);
        return $token;
    }
}