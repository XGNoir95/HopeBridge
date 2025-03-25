<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;

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
    public function register(Request $request)
    {
        $result = $this->userService->createUser($request->all());

        if (!$result['success']) {
            return response()->json(['errors' => $result['errors']], 422);
        }

        return response()->json([
            'message' => 'User created successfully',
            'user' => $result['user'],
        ], 201);
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
        $updatedUser = $this->userService->updateUser($request);
        if (!$updatedUser) {
            return response()->json(['message' => 'Update Failed'], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'User updated',
            'user' => $updatedUser,
        ]);
    }

    public function destroy($id)
    {
        $result = $this->userService->deleteUser($id);
        if ($result) {
            return response()->json(['message' => 'User deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }
}
