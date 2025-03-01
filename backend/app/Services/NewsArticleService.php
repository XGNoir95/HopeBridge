<?php

namespace App\Services;

use App\Models\newsArticle;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NewsArticleService{
    public function createArticle($request){
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'articleDescription' => 'required|string',
            'files' => 'nullable|array',
            'files.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $files = $request->file('files');
        $urls=[];
        if ($files && is_array($files)) {
            foreach ($files as $file) {
                $result = $file->storeOnCloudinary();
                $urls[] = $result->getSecurePath();
            }
        }      
        $article = newsArticle::create([
            'title'=> $validatedData['title'],
            'articleDescription'=> $validatedData['description'],
            'files' => json_encode($urls),
        ]);
        Log::info('New Article created',[
            'title' => $validatedData['title'],
            'articleDescription' => $validatedData['articleDescription']
        ]);
        return $article;
    }
    public function updateArticle($request){

    }
    public function getAllArticle(){
        $articles = DB::table('newsarticle')->get();
        return $articles;
    }
    public function getArticle($articleId){
        $result =newsArticle::find($articleId);
        return $result;
    }
    public function deleteArticle($articleId){
        $result=$this->getArticle( $articleId );
        if($result){
            DB::table('newarticle')->where('articleId',$articleId);
            return true;
        }
        return false;
    }
}