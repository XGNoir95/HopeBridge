<?php

namespace App\Http\Controllers;

use App\Services\ChatbotService;
use App\Services\NlpService;
use Illuminate\Http\Request;
use App\Models\chatMessage;

class ChatbotController extends Controller
{
    protected $chatbotService;
    protected $nlpService;

    public function __construct(ChatbotService $chatbotService, NlpService $nlpService)
    {
        $this->chatbotService = $chatbotService;
        $this->nlpService = $nlpService;
    }

public function handle(Request $request)
{
    try {
        $message = $request->input('message');
        
        if (empty($message)) {
            return response()->json([
                'success' => false,
                'message' => 'Message is required'
            ], 400);
        }
        
        // Get user_id from header (sent by frontend) or request body
        $userId = $request->header('X-User-ID') ?: $request->input('user_id');
        
        // Convert empty string or 'null' string to actual null
        if ($userId === '' || $userId === 'null' || $userId === null) {
            $userId = null;
        }
        
        \Log::info('ChatBot: Processing message', [
            'message' => $message,
            'user_id' => $userId,
            'is_authenticated' => !is_null($userId)
        ]);
        
        // Detect intent
        $intent = $this->nlpService->detectIntent($message);
        $response = $this->nlpService->generateResponse($intent);
        
        // Only save chat history if user is authenticated
        if ($userId !== null) {
            \Log::info('ChatBot: Saving message for authenticated user', ['user_id' => $userId]);
            
            $chatMessage = $this->chatbotService->saveMessage([
                'user_id' => $userId,
                'message' => $message,
                'response' => $response['text'],
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $chatMessage,
                'bot_response' => $response,
            ]);
        } else {
            \Log::info('ChatBot: Unauthenticated user, not saving message');
            
            // For unauthenticated users, create a temporary response without saving to database
            $tempMessage = (object) [
                'messageId' => 'temp_' . time(),
                'user_id' => null,
                'message' => $message,
                'response' => $response['text'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            return response()->json([
                'success' => true,
                'data' => $tempMessage,
                'bot_response' => $response,
            ]);
        }
        
    } catch (\Exception $e) {
        \Log::error('ChatBot: Error in handle method', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'An error occurred: ' . $e->getMessage(),
        ], 500);
    }
}


    public function index()
    {
        try {
            // Get user_id from header (sent by frontend)
            $userId = request()->header('X-User-ID');
            
            \Log::info('ChatBot: Loading messages for user_id', ['user_id' => $userId]);
            
            if (!$userId) {
                return response()->json([
                    'success' => true,
                    'messages' => []
                ]);
            }
            
            $messages = chatMessage::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get()
                ->reverse()
                ->values();

            \Log::info('ChatBot: Messages found', ['count' => $messages->count()]);

            return response()->json([
                'success' => true,
                'messages' => $messages
            ]);
        } catch (\Exception $e) {
            \Log::error('ChatBot: Error loading messages', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => true,
                'messages' => []
            ]);
        }
    }

    public function show($id)
    {
        try {
            $message = $this->chatbotService->getMessage($id);
            
            if (!$message) {
                return response()->json([
                    'success' => false,
                    'message' => 'Message not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching message: ' . $e->getMessage()
            ], 500);
        }
    }
}
