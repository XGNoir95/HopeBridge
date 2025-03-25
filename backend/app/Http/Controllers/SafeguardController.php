<?php

namespace App\Http\Controllers;

use App\Models\NewsArticle;
use App\Models\Video;
use App\Services\NewsArticleService;
use App\Services\VideoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SafeguardController extends Controller
{
    protected $newsArticleService;
    protected $videoService;

    public function __construct(NewsArticleService $newsArticleService, VideoService $videoService)
    {
        $this->newsArticleService = $newsArticleService;
        $this->videoService = $videoService;
    }

    public function articleIndex()
    {
        $article = $this->newsArticleService->getAllArticle();
        if ($article) {
            return response()->json([
                'success' => true,
                'newsArticle' => $article
            ]);
        }
        return response()->json(['success' => false]);
    }

    public function createArticle(Request $request)
    {
        $article = $this->newsArticleService->createArticle($request->all());
        if ($article) {
            return response()->json([
                'success' => true,
                'newsArticle' => $article
            ]);
        }
        return response()->json(['success' => false]);
    }

    public function updateArticle(Request $request, $post_id)
    {
        $article = newsArticle::findOrFail($post_id);

        $validatedData = $request->validate([
        'title' => 'string|max:255',
        'articleDescription' => 'string',
        ]);

    // Update the news article
        $article->update([
        'title' => $validatedData['title'] ?? $article->title,
        'articleDescription' => $validatedData['articleDescription'] ?? $article->articleDescription,
        ]);

        return response()->json([
        'success' => true,
        'message' => 'News article updated',
        'newsArticle' => $article,
        ]);
    }

    public function deleteArticle($article_id)
    {
        $result = $this->newsArticleService->deleteArticle($article_id);
        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Article deleted Successfully'
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => 'Article Not Found'
        ]);
    }

    public function showArticle($article_id)
    {
        $article = $this->newsArticleService->getArticle($article_id);
        if ($article) {
            return response()->json([
                'success' => true,
                'newsArticle' => $article
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => 'Article Not Found'
        ]);
    }

    public function createVideo(Request $request)
    {
        try {
            $video = $this->videoService->createVideo($request->all());
            return response()->json([
            'success' => true,
            'video' => $video,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            Log::error('Error creating video: ' . $e->getMessage());
            return response()->json([
            'success' => false,
            'message' => 'Failed to create video. Please try again later.',
            ], 500);
        }
    }

    public function showVideo($id)
    {
        $video = $this->videoService->getVideo($id);
        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }
        return response()->json($video, 200);
    }

    public function deleteVideo($id)
    {
        $deleted = $this->videoService->deleteVideo($id);
        if (!$deleted) {
            return response()->json(['message' => 'Video not found'], 404);
        }
        return response()->json(['message' => 'Video deleted successfully'], 200);
    }
    public function updateVideo(Request $request, $id)
    {
        $result = $this->videoService->update($request, $id);
        return response()->json([
            'success' => true,
            'message' => 'video vlog updated',
            'news_article' => $result,
        ]);
    }

    public function showAllVideos()
    {
        $videos = $this->videoService->showAllVideos();
        if ($videos->isEmpty()) {
            return response()->json(['message' => 'No videos found'], 404);
        }
        return response()->json($videos, 200);
    }
}
