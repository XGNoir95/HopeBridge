<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use App\Services\AdminService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    protected $adminService;
    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function createAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'adminMail' => 'required|email|unique:admins,adminMail',
            'adminPhone' => 'required|string',
            'adminName' => 'required|string',
            'password' => 'required|string',
            'blood_group' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'city' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $admin = Admin::create([
            'adminMail' => $request->adminMail,
            'adminPhone' => $request->adminPhone,
            'adminName' => $request->adminName,
            'password' => Hash::make($request->password),
            'blood_group' => $request->blood_group,
            'district' => $request->district,
            'city' => $request->city,
        ]);

        return response()->json([
            'message' => 'Admin created successfully',
            'admin' => $admin->makeHidden(['password']),
        ], 201);
    }

    //Show admin info
    public function showAdmin(Request $request)
    {
        $admin = $this->adminService->getAdminById($request);
        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }
    
        $profilePicture = $admin->profile_picture ? json_decode($admin->profile_picture, true) 
            : ['https://cdn.vectorstock.com/i/500p/52/38/avatar-icon-vector-11835238.jpg'];
    
        return response()->json([
            'admin_id' => $admin->admin_id,
            'adminMail' => $admin->adminMail,
            'adminPhone' => $admin->adminPhone,
            'adminName' => $admin->adminName,
            'district' => $admin->district,
            'city' => $admin->city,
            'blood_group' => $admin->blood_group,
            'profile_picture' => $profilePicture,
        ], 200);
    }
    // show all admins
    public function showAllAdmins()
    {
        $admins = Admin::all();

        return response()->json($admins);
    }
    // delete an admin
    public function deleteAdmin(Request $request)
    {
        $admin = $this->adminService->getAdminById($request);

        $admin->delete();

        return response()->json(['message' => 'Admin Removed']);
    }
}
