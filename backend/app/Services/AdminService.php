<?php

namespace App\Services;
use App\Models\admins;

class AdminService{
    public function updateAdmin(admins $admin,array $adminData){
        $admin->fill($adminData);
        $admin->save();
        return $admin;
    }
    public function getAdminList(){
        $admins =admins::all();
        return $admins;
    }
    public function getAdminByid($id){
        $admins =admins::find($id);
        return $admins;
    }
    public function deleteAdmin(admins $admin){
        $admin->delete();
        return true;
    }
}