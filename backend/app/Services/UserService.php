<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
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
    public function getUserList(){
        $user = User::all();
        return $user->toArray();
    }
    public function getUserById($request){
        $userId = $request->get('user_id');
        $user = User::find($userId);
        return $user;
    }
    public function getUserByMail($mail) {
        $user = User::where('userMail', $mail)->first();
        return $user;
    }
    public function deleteUser(User $user){
        // Delete the user
        $user->delete();

        return true;
    }
}