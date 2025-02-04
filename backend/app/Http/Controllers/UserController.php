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
        $users = User::all();
        return $users;
    }
    public function store(Request $request)
    {
        
    }
    public function show($id)
    {
        $user = User::find($id);
        return $user;
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
