<?php

namespace App\Http\Controllers;
use App\Models\admins;
use App\Services\AdminService;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    //
    protected $adminService;
    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }
    public function index()
    {
        $admins = $this->adminService->getAdminList();
        return response()->json($admins);
    }
    public function show($id)
    {
        $admin= $this->adminService->getAdminByid($id);
        if(!$admin){
            return response()->json(['message'=>'Admin not found','code'=> '400'],404);
        }
        return response()->json($admin);
    }
    public function update(Request $request, $id){
        $admin = $this->adminService->getAdminByid($id);
        if(!$admin){
            return response()->json(['message'=> 'admin not found','code'=> ''],404);   
        }
        $adminData = $request->all();
        $updatedAdmin= $this->adminService->updateAdmin($admin, $adminData);
        return response()->json($updatedAdmin);
    }
    public function destroy($id)
    {
        $admin= $this->adminService->getAdminByid($id);
        if(!$admin){
            return response()->json(['message'=> 'admin not found'],404);
        }
        $this->adminService->deleteAdmin($admin);
        return response()->json(['message'=>'Admin deleted Successfully'],200);  
    }
}
