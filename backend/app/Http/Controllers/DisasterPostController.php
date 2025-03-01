<?php

namespace App\Http\Controllers;
use App\Models\DisasterPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validate;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Services\DisasterPostService;

class DisasterPostController extends Controller
{
    protected $disasterPostService;
    public function __construct(DisasterPostService $disasterPostService){
        $this->disasterPostService = $disasterPostService;
    }
    public function store(Request $request)
    {
        $disasterPost=$this->disasterPostService->createPost($request);
		if($disasterPost){
			return response()->json([
				'success' => true,
				'disaster_post' => $disasterPost,
			]);
		}
		else{
			return response()->json([
			'message'=>'Post creation failed'
			],400);
        }
    }

    // Display all the  posts of all users
    public function index()
    {
        $disasterPosts=$this->disasterPostService->getAllPost();
        return response()->json([
            'success' => true,
            'disaster_posts' => $disasterPosts
        ]);
    }
    
    public function show($post_id)
    {
        // Find post by post_id and eager load user
        $disasterPost = $this->disasterPostService->getPost($post_id);
        return response()->json([
            'success' => true,
            'disaster_post' => $disasterPost,
        ]);
    }

    public function update(Request $request, $post_id)
    {
        $disasterPost = DisasterPost::findOrFail($post_id);

        $validatedData = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'files' => 'nullable|array',
            'files.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'division' => 'string|max:255',
            'district' => 'string|max:255',
            'event_date' => 'nullable|date',
            'event_time' => 'nullable|date_format:H:i:s',
        ]);
    
        $files = $request->file('files');
        $urls = [];
        if ($files && is_array($files)) {
            foreach ($files as $file) {
                $result = $file->storeOnCloudinary();
                $urls[] = $result->getSecurePath(); 
            }
        }
        $updatedFiles = !empty($urls) ? $urls : json_decode($disasterPost->files, true) ?? [];
        // Update the disaster post
        $disasterPost->update([
            'title' => $validatedData['title'] ?? $disasterPost->title,
            'description' => $validatedData['description'] ?? $disasterPost->description,
            'files' => json_encode($updatedFiles),
            'division' => $validatedData['division'] ?? $disasterPost->division,
            'district' => $validatedData['district'] ?? $disasterPost->district,
            'event_date' => $validatedData['event_date'] ?? $disasterPost->event_date,
            'event_time' => $validatedData['event_time'] ?? $disasterPost->event_time,
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Disaster post updated',
            'disaster_post' => $disasterPost,
        ]);
    } 
    
    // Delete post by id
    public function destroy($post_id)
    {
        $result =$this->disasterPostService->deletePost($post_id);
        if($result){
            return response()->json([
                'success' => true,
                'message' => 'Disaster post deleted successfully',
            ],201);
        }
        else{
            return response()->json([
                'success'=> false,
                'message'=> 'Post not found'
            ],400);
        }
    }

    //Show all posts of a user
    public function userPosts(Request $request)
    {
        $result=$this->disasterPostService->getUserPost($request);
    
        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'No Post Found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'user_posts' => $result,
        ]);
    }

    //Show a Selected post of the user
    public function FindPostById($post_id)
    {
        $userPost = $this->disasterPostService->getPost($post_id);
        if (!$userPost) {
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
