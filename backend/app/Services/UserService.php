<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
            return ['errors' => $validator->errors(), 'success' => false];
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

        return ['user' => $user->makeHidden(['password']), 'success' => true];
    }
    public function updateUser(User $user, array $userData){
        // Update user attributes
        $user->fill($userData);
        $user->save();

        return $user;
    }
    public function getUserList(){
        $user = User::all();
        return $user->toArray();
    }
    public function getUserById($id){
        $user = User::find($id);
        return $user;
    }
    public function getUserByMail($mail){
        $user = User::find($mail);
        return $user;
    }
    public function deleteUser(User $user){
        // Delete the user
        $user->delete();

        return true;
    }
}
