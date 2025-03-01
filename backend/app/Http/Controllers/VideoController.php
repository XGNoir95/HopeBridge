<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VideoController extends Controller
{
    /**
     * Create a new video.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
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


    /**
     * Show a single video by ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Find the video by ID
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }

        return response()->json($video, 200);
    }

    /**
     * Delete a video by ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete($id)
    {
        // Find the video by ID
        $video = Video::find($id);

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }

        // Delete the video
        $video->delete();

        return response()->json(['message' => 'Video deleted successfully'], 200);
    }

    public function showAll()
    {
        $videos = Video::all();

        if ($videos->isEmpty()) {
            return response()->json(['message' => 'No videos found'], 404);
        }

        return response()->json($videos, 200);
    }
}
