<?php

namespace App\Services;

use App\Models\User;

class UserService{
    public function createUser(array $userData){
        // Create a new user instance
        $user = new User();
        $user->fill($userData);
        $user->save();

        return $user;
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
    public function deleteUser(User $user){
        // Delete the user
        $user->delete();

        return true;
    }
}
