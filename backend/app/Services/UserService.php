<?php

namespace App\Services;

use App\Models\User;
use DateTimeImmutable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Lcobucci\JWT\Configuration;
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
            'password' => 'required|string|min:4',
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
    public function updateUser($request){
        // Update user attributes
        $user = User::find($request->get('user_id'));

        $validatedData = $request->validate([
            'userMail' => 'string|email|max:255|unique:users,userMail,' . $user->user_id . ',user_id',
            'userPhone' => 'string|max:255',
            'userName' => 'string|max:255',
            'district' => 'string|max:255',
            'city' => 'string|max:255',
            'blood_group' => 'string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Handle profile picture upload
        ]);
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $result = $file->storeOnCloudinary();
            $validatedData['profile_picture'] = json_encode([$result->getSecurePath()]);
        } elseif ($request->input('profile_picture') === null) {
            $validatedData['profile_picture'] = null;
        } else {
            $validatedData['profile_picture'] = $user->profile_picture;
        }
        $user->update($validatedData);
        return $user;
    }


    public function loginGo($request){
        $data = $request->validate([
            'userMail' => 'required|string|email',  // Change to 'userMail' instead of 'email'
            'password' => 'required|string',
        ]);
        $user = $this->getUserByMail($data['userMail']);
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return null;
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
        $user = DB::table('users')->where('userMail',$mail)->first();
        return $user;
    }
    public function deleteUser($id){
        $user =$this->getUserByid($id);
        if(!$user)
            return false;
        DB::table('users')->where('user_id',$id)->delete();

        return true;
    }
    protected function issueJwtToken($userId,$role)
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
            ->withClaim('uid', $userId)
            ->withClaim('role', $role)
            ->getToken($config->signer(), $config->signingKey());

        return $token->toString();
    }
    public function getToken($id,$role){
        $token = $this->issueJwtToken($id,$role);
        return $token;
    }
}