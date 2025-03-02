<?php

namespace App\Services;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
class AdminService
{
    
    public function loginGo($request){
        $data = $request->validate([
            'userMail' => 'required|string|email',  // Change to 'userMail' instead of 'email'
            'password' => 'required|string',
        ]);
        $admin=$this->getAdminByMail($data['userMail']);
        if(!$admin||!Hash::check($data['password'], $admin['password'])){
            return null;
        }
        return $admin;
    }
    public function getAdminByMail($email) {
        $admin =DB::table('admins')->where('email', $email)->first();
        return $admin;
    }
    
    public function getAdminById($request){
        $adminId = $request->get('user_id');
        $admin = DB::table('admins')->where('admin_id', $adminId)->first();
        return $admin;
    }
}
