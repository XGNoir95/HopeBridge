<?php

namespace App\Services;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
class AdminService
{
    public function authenticate($email, $password)
    {
        $admin = Admin::where('adminMail', $email)->first();

       if ($admin && Hash::check($password, $admin->password)) {
            return $admin;
        }
        return null;
    }
    public function loginGo($request){
        $data = $request->validate([
            'userMail' => 'required|string|email',  // Change to 'userMail' instead of 'email'
            'password' => 'required|string',
        ]);
        $admin=$this->getAdminByMail($data['userMail']);
        if(!$admin||!Hash::check($data['password'], $admin->password)){
            return null;
        }
        return $admin;
    }
    public function getAdminByMail($email) {
        $admin = Admin::where('adminMail', $email)->first();
        // $admin =DB::table('admin')->where('adminMail', $email)->first();    
        return $admin;
    }
    
    public function getAdminById($request){
        $adminId = $request->get('user_id');
        $admin = Admin::find($adminId);
        // $admin = DB::table('admin')->where('admin_id', $adminId)->first();
        return $admin;
    }
}