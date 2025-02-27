<?php

namespace App\Services;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

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

    public function getAdminByMail($email) {
        $admin = Admin::where('adminMail', $email)->first();
        return $admin;
    }
    
    public function getAdminById($request){
        $adminId = $request->get('user_id');
        $admin = Admin::find($adminId);
        return $admin;
    }
}
