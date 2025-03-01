<?php

namespace App\Services;

use App\Models\Video;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class VideoService
{
    public function createVideo(array $data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'video_link' => 'required|string|url', // Ensure the video link is a valid URL
        ]);

        if ($validator->fails()) {
            throw new \InvalidArgumentException($validator->errors()->first());
        }

        $validatedData = $validator->validated();

        // Create the video
        $video = Video::create([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'video_link' => $validatedData['video_link'],
        ]);

        Log::info('New Video created', [
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
        ]);

        return $video;
    }

    public function getVideo($id)
    {
        return Video::find($id);
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