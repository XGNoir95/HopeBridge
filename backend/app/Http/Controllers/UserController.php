<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Services\UserService;

class UserController extends Controller
{
    //
    protected $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    public function index()
    {
       return response()->json(User::all(), 200);
    }

    public function store(Request $request)
    {
        
    }
  public function show($id)
{
    $user = User::find($id);
    
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    return response()->json($user, 200);
}

    public function update(Request $request, $id)   
    {
        $user = User::find($id);
        $user->update($request->all());
        return $user;
    }
    public function destroy($id)
    {
        $user = User::find($id);
        $user->delete();
    }
}
