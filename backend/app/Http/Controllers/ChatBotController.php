<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatMessageRequest;
use App\Services\ChatbotService;
use App\Services\NlpService;

class ChatbotController extends Controller
{
    protected $chatbotService;
    protected $nlpService;

    public function __construct(ChatbotService $chatbotService, NlpService $nlpService)
    {
        $this->chatbotService = $chatbotService;
        $this->nlpService = $nlpService;
    }

    public function handle(ChatMessageRequest $request)
    {
        $message = $request->input('message');

        // Detect intent
        $intent = $this->nlpService->detectIntent($message);
        $response = $this->nlpService->generateResponse($intent);

        // Save chat history
        $chatMessage = $this->chatbotService->saveMessage([
            'user_id' => $request->input('user_id'),
            'message' => $message,
            'response' => $response['text'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $chatMessage,
            'bot_response' => $response,
        ]);
    }
}
