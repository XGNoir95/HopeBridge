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

    }
    public function createArticle(Request $request){

    }
    public function updateArticle(Request $request){

    }
    public function deleteArticle(Request $request){

    }
    public function showArticle(Request $request){

    }
}
