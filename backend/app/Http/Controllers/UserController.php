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

    public function store(Request $request)
    {
        $userData = $request->all();
        $user = $this->userService->createUser($userData);
        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = $this->userService->getUserById($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    public function update(Request $request, $id)   
    {
        $user = $this->userService->getUserById($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $userData = $request->all();
        $updatedUser = $this->userService->updateUser($user, $userData);
        return response()->json($updatedUser);
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
