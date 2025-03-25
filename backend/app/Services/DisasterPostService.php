<?php

namespace App\Services;

use Illuminate\Support\Facades\Hash;
use App\Models\DisasterPost;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DisasterPostService
{
    public function createPost($request)
    {
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
// Get the authenticated user's ID
        $userId = $request->attributes->get('user_id');
        $files = $request->file('files');
        $urls = [];
        if ($files && is_array($files)) {
            foreach ($files as $file) {
                $result = $file->storeOnCloudinary();
                $urls[] = $result->getSecurePath();
            }
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
    //get every post in the database
    public function getAllPost()
    {
        $allPost = DB::select("select * from disaster_posts");
        return $allPost;
    }
    //find a post by the ID
    public function getPost($post_id)
    {
        $result = DB::select("select * from disaster_posts where post_id = ?", [$post_id]);
        return $result;
    }
    public function updatePost($request, $post_id)
    {
    }
    // delete a post
    public function deletePost($post_id)
    {
        $result = $this->getPost($post_id);
        if ($result) {
            DB::delete('delete from disaster_posts where post_id = ?', [$post_id]);
            return true;
        }
        return false;
    }
    //all post of a user
    public function getUserPost($request)
    {
        $userId = $request->attributes->get('user_id');
        $result = DB::select("select * from disaster_posts where user_id = ?", [$userId]);
        return $result;
    }
    public function heatMapArray()
    {
        $posts = $this->getAllPost();
        $city = [
            'Dhaka' => 0,
            'Chattogram' => 0,
            'Rajshahi' => 0,
            'Khulna' => 0,
            'Barishal' => 0,
            'Sylhet' => 0,
            'Rangpur' => 0,
            'Mymensingh' => 0
        ];
        foreach ($posts as $indv) {
            $div = $indv->division;
            if (array_key_exists($div, $city)) {
                $city[$div]++;
            }
        }
        // $city=DB::select("select division, COUNT(division) as count from disaster_posts group by division");
        foreach ($city as &$v) {
            $v *= 20;
        }
        return json_encode($city, JSON_PRETTY_PRINT);
    }
}
/*
for(auto indv:posts){
    string div=indv.division;
    for(auto val:city){
        if(val.first==div){
            val.second++;
        }
    }
}
*/
