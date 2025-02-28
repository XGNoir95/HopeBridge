<?php
namespace App\Services;
use Illuminate\Support\Facades\Hash;
use App\Models\DisasterPost;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
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
        $userId = $request->attributes->get('user_id');
		
		$files =$request->attributes->get('user_id');
		$urls=[];
		if($files && is_array($files)){
			foreach ($files as $file) {
                $result = $file->storeOnCloudinary();
                $urls[] = $result->getSecurePath();
            }
		}
		else{
			return null;
		}
		$disasterPost = DisasterPost::create([
            'user_id' => $userId,
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'files' => json_encode($urls),
            'division' => $validatedData['division'],
            'district' => $validatedData['district'],
            'event_date' => $validatedData['event_date'] ?? now()->toDateString(),
            'event_time' => $validatedData['event_time'] ?? now()->toTimeString(),
        ]);
		Log::info('New disaster post created', [
            'user_id' => $userId,
            'title' => $validatedData['title'],
            'division' => $validatedData['division'],
            'district' => $validatedData['district'],
            'event_date' => $disasterPost->event_date,
            'event_time' => $disasterPost->event_time,
        ]);
		return $disasterPost;
    }
    public function getAllPost(){
        $allPost=DB::table('disaster_posts')->get();
        return $allPost;
    }
    public function getPost($post_id){
        $result = DB::table('disaster_post')->where('post_id', $post_id);
        return $result;
    }
    public function updatePost($request){
    
    }
    public function deletePost($request){
    
    }
    public function getUserPost($request){
        $userId = $request->user_id;
        $results=null; /*= DB::table('disaster_post')
        ->where('user_id', $userId)
        ->select('*')
        ->orderBy('dp.created_at', 'desc')
        ->get();*/
        return $results;
    }
    public function findPostById($id){
        
    }
}