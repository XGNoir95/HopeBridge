<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //Register a new user.
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
    
    // public function login(Request $request)
    // {
    //     // Validate input
    //     $validator = Validator::make($request->all(), [
    //         'userMail' => 'required|email',
    //         'password' => 'required|string',
    //     ]);

    //     // Return validation errors if any
    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     // Attempt to login using provided credentials
    //     if (Auth::attempt(['userMail' => $request->userMail, 'password' => $request->password])) {
    //         $user = Auth::user();
    //         return response()->json(['user' => $user->makeHidden(['password'])], 200);
    //     } else {
    //         return response()->json(['error' => 'Invalid credentials'], 401);
    //     }
    // }
}