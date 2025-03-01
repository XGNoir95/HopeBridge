<?php

namespace App\Services;

use App\Models\newsArticle;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NewsArticleService{
    public function createArticle(array $data)
{
    // Validate the input data
    $validator = Validator::make($data, [
        'title' => 'required|string|max:255',
        'articleDescription' => 'required|string',
        'files' => 'nullable|array',
        'files.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    if ($validator->fails()) {
        throw new \InvalidArgumentException($validator->errors()->first());
    }

    $validatedData = $validator->validated();

    // Handle file uploads
    $urls = [];
    if (isset($data['files']) && is_array($data['files'])) {
        foreach ($data['files'] as $file) {
            $result = $file->storeOnCloudinary();
            $urls[] = $result->getSecurePath();
        }
    }

    // Create the article
    $article = newsArticle::create([
        'title' => $validatedData['title'],
        'articleDescription' => $validatedData['articleDescription'],
        'files' => json_encode($urls),
    ]);

    Log::info('New Article created', [
        'title' => $validatedData['title'],
        'articleDescription' => $validatedData['articleDescription'],
    ]);

    return $article;
}
    public function updateArticle($request){

    }
    public function getAllArticle(){
        $articles = DB::table('news_article')->get();
        return $articles;
    }
    public function getArticle($articleId){
        $result =newsArticle::find($articleId);
        return $result;
    }
    public function deleteArticle($articleId){
        $result = $this->getArticle($articleId);
        if ($result) {
            DB::table('news_article')->where('articleId', $articleId)->delete();
            return true;
        }
        return false;
    }
    

    
}