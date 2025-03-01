<?php

namespace App\Http\Controllers;
use App\Services\NewsArticleService;
use Illuminate\Http\Request;

class SafeguardController extends Controller
{
    protected $newsArticleService;
    public function __construct(NewsArticleService $newsArticleService){
        $this->newsArticleService = $newsArticleService;
    }
    public function articleIndex(){
        $article= $this->newsArticleService->getAllArticle();
        if($article){
            return response()->json([
                'success'=>true,
                'newsArticle'=>$article
            ]);
        }
        return response()->json([
            'success'=>false
        ]);
    }
    public function createArticle(Request $request){
        $article= $this->newsArticleService->createArticle($request->all());
        if($article){
            return response()->json([
                'success'=>true,
                'newsArticle'=> $article
            ]);
        }
        return response()->json([
            'success'=>false
        ]); 
    }
    public function updateArticle(Request $request){
        
    }
    public function deleteArticle($article_id){
        $result =$this->newsArticleService->getArticle($article_id);
        if($result){
            return response()->json([
                'success'=>true,
                'message'=>'Article deleted Successfully'
            ]);
        }
        return response()->json([
            'success'=>false,
            'message'=> 'Article Not Found'
        ]);
    }
    public function showArticle($article_id){
        $article= $this->newsArticleService->getArticle($article_id);
        if($article){
            return response()->json([
                'success'=>true,
                'newsArticle'=>$article
            ]);
        }
        return response()->json([
            'success'=>false,
            'message'=>'Article Not Found'
        ]);
    }
}
