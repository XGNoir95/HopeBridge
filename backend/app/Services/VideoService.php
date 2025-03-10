<?php

namespace App\Services;

use App\Models\Video;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
    // 
    public function getVideo($id)
    {
        $result =DB::table('videos')->where('video_id', $id)->first();
        return $result;
    }

    public function deleteVideo($id)
    {
        $result=$this->getVideo($id);
        if ($result) {
            DB::delete('delete * from videos where video_id= ?',[$id]);
            return true;
        }
        return false;
    }
    public function update($request,$id){
        $video=Video::findOrFail($id);
        $validatedData = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'video_link'=>'required|string|url'
        ]);
        $video->update([
            'title'=> $validatedData['title'],
            'description'=> $validatedData['description'],
            'video_link'=> $validatedData['video_link'],
        ]);
        return $video;
    }
    public function showAllVideos()
    {
        $videos = DB::select('select * from videos');
        return Video::all();
    }
}