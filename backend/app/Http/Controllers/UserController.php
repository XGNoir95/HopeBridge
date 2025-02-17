<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $users = $this->userService->getUserList();
        return response()->json($users);
    }
    public function register(Request $request) {
        $result = $this->userService->createUser($request->all());

        if (!$result['success']) {
            return response()->json(['errors' => $result['errors']], 422);
        }

        return response()->json([
            'message' => 'User created successfully',
            'user' => $result['user'],
        ], 201);
    }
    public function store(Request $request)
    {
        $userData = $request->all();
        $user = $this->userService->createUser($userData);
        return response()->json($user, 201);
    }

    public function show(Request $request)
    {
        $user = $this->userService->getUserById($request);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        $profilePicture = $user->profile_picture ? json_decode($user->profile_picture, true) 
            : ['https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg'];
    
        return response()->json([
            'user_id' => $user->user_id,
            'userMail' => $user->userMail,
            'userPhone' => $user->userPhone,
            'userName' => $user->userName,
            'district' => $user->district,
            'city' => $user->city,
            'blood_group' => $user->blood_group,
            'profile_picture' => $profilePicture,
        ], 200);
    }

    public function updateUser(Request $request)
    {
        $user = $this->userService->getUserById($request);

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
    
        $updatedUser = $this->userService->updateUser($user, $validatedData);
    
        return response()->json([
            'success' => true,
            'message' => 'User updated',
            'user' => $updatedUser,
        ]);
    }

    public function destroy($id)
    {
        $user = $this->userService->getUserById($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $this->userService->deleteUser($user);
        return response()->json(['message' => 'User deleted successfully'],200);
    }
}