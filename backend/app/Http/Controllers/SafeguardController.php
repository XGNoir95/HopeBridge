<?php

namespace App\Http\Controllers;
use App\Services\NewsArticleService;
use Illuminate\Http\Request;
use App\Models\Video;

class SafeguardController extends Controller
{
    protected $newsArticleService;
    public function __construct(NewsArticleService $newsArticleService){
        $this->newsArticleService = $newsArticleService;
    }
    public function articleIndex(){

    }
    public function createArticle(Request $request){

    }
    public function updateArticle(Request $request){

    }
    public function deleteArticle(Request $request){

    }
    public function showArticle(Request $request){

    }

    public function createVideo(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'video_link' => 'required|string',
        ]);
    
        $video = Video::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'video_link' => $validated['video_link'],
        ]);
        return response()->json(['success' => true, 'video' => $video], 201);
    }

    public function showVideo($id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }
        return response()->json($video, 200);
    }

    public function deleteVideo($id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }
        $video->delete();
        return response()->json(['message' => 'Video deleted successfully'], 200);
    }

    public function showAllVideos()
    {
        $videos = Video::all();
        if ($videos->isEmpty()) {
            return response()->json(['message' => 'No videos found'], 404);
        }
        return response()->json($videos, 200);
    }

}
