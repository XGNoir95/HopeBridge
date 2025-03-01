<?php

namespace App\Services;

use App\Models\Video;
use Illuminate\Http\Request;

class VideoService
{
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
        return $video;
    }

    public function getVideo($id)
    {
        $result =Video::find($id);
        return $result;
    }

    public function deleteVideo($id)
    {
        $video = Video::find($id);
        if ($video) {
            $video->delete();
            return true;
        }
        return false;
    }

    public function showAllVideos()
    {
        return Video::all();
    }
}
