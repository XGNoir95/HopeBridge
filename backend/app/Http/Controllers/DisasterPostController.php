<?php

namespace App\Http\Controllers;
use App\Models\DisasterPost;
use Illuminate\Http\Request;
use App\Models\User;

class DisasterPostController extends Controller
{
    public function store(Request $request)
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
        'event_date' => $validatedData['event_date'] ??  now()->toDateString(),
        'event_time' => $validatedData['event_time'] ?? now()->toTimeString(),
    ]);

    return response()->json([
        'success' => true,
        'disaster_post' => $disasterPost,
    ]);
}

    // Display all of the disaster posts
    public function index()
    {
        $disasterPosts = DisasterPost::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'disaster_posts' => $disasterPosts
        ]);
    }
    
    public function show($post_id)
    {
        // Find post by post_id and eager load user
        $disasterPost = DisasterPost::with('user')->findOrFail($post_id);
        return response()->json([
            'success' => true,
            'disaster_post' => $disasterPost,
        ]);
    }

    public function update(Request $request, $post_id)
    {
        $disasterPost = DisasterPost::findOrFail($post_id);

        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'files' => 'nullable|array',
            'files.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'city' => 'sometimes|required|string|max:255',
            'district' => 'sometimes|required|string|max:255',
            'disaster_type' => 'sometimes|required|string|max:255',
            'status' => 'nullable|string|in:pending,approved,rejected',
        ]);
    
        $files = $request->file('files');
        $urls = [];
        if ($files && is_array($files)) {
            foreach ($files as $file) {
                $result = $file->storeOnCloudinary();
                $urls[] = $result->getSecurePath(); 
            }
        }
    
        //merge New data with unchanged data
        $existingFiles = json_decode($disasterPost->files, true) ?? [];
        $updatedFiles = array_merge($existingFiles, $urls);
    
        // Update the disaster post
        $disasterPost->update([
            'title' => $validatedData['title'] ?? $disasterPost->title,
            'description' => $validatedData['description'] ?? $disasterPost->description,
            'files' => json_encode($updatedFiles),
            'city' => $validatedData['city'] ?? $disasterPost->city,
            'district' => $validatedData['district'] ?? $disasterPost->district,
            'disaster_type' => $validatedData['disaster_type'] ?? $disasterPost->disaster_type,
            'status' => $validatedData['status'] ?? $disasterPost->status,
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Disaster post updated successfully',
            'disaster_post' => $disasterPost,
        ]);
    }



    // Delete post by id
    public function destroy($post_id)
    {
        $disasterPost = DisasterPost::findOrFail($post_id);
        $disasterPost->delete();
        return response()->json([
            'success' => true,
            'message' => 'Disaster post deleted successfully',
        ]);
    }

    //Show all posts of a user
    public function userPosts(Request $request)
    {
        $userId = $request->get('user_id');
        $user = User::find($userId);
    
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }
    
        $userPosts = DisasterPost::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    
        return response()->json([
            'success' => true,
            'user_posts' => $userPosts,
        ]);
    }

    //Show a Selected post of the user
    public function FindPostById(Request $request, $post_id)
{
    $userId = $request->get('user_id');

    $userPost = DisasterPost::find($post_id);

    if (!$userPost || $userPost->user_id !== $userId) {
        return response()->json([
            'success' => false,
            'message' => 'Post not found',
        ], 404);
    }
    return response()->json([
        'success' => true,
        'user_post' => $userPost,
    ]);
}


}
