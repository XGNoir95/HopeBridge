<?php
namespace App\Services;
use Illuminate\Support\Facades\Hash;
use App\Models\DisasterPost;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class DisasterPostService{
    public function createPost($request){
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'files' => 'nullable|array',
            'files.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'division' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'event_date' => 'nullable|date',
            'event_time' => 'nullable|date_format:H:i:s',
        ]);
    }
    public function getAllPost(){

    }
    public function getPost(){

    }
    public function updatePost($request){
    
    }
    public function deletPost($request){
    
    }
    public function getUserPost(){

    }
    public function findPostById($id){
        
    }
}