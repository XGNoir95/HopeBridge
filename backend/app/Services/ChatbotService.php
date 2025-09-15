<?php

namespace App\Services;

use App\Models\chatMessage;
use Illuminate\Support\Facades\DB;

class ChatbotService
{
    public function saveMessage(array $validatedData)
    {
        return chatMessage::create([
            'user_id'  => $validatedData['user_id'],
            'message'  => $validatedData['message'],
            'response' => $validatedData['response'],
        ]);
    }

    public function getMessage($id)
    {
        return DB::table('chat_messages')->where('messageId', $id)->first();
    }

    public function getAllMessages()
    {
        return DB::table('chat_messages')->orderBy('created_at', 'desc')->get();
    }

    public function getUserMessages($userId, $limit = 20)
    {
        return chatMessage::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function deleteMessage($id)
    {
        return chatMessage::where('messageId', $id)->delete();
    }
}
