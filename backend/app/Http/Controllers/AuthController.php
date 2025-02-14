<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Services\UserService;  
use App\Exceptions\GeneralException;

class AuthController extends Controller
{
    protected $userservice;
    public function login(Request $request){
        $request->validate([
            'userMail' => 'required|email',
            'password' => 'required',
        ]);
        $user =$this->userservice->getUserByMail($request->email);
        if(!$user||!Hash::check($request->password, $user->password)){
            return response()->json($user);
        }
    }
    public function logout(Request $request){
        Auth::logout();
        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out',
        ], 200);
    }
}
