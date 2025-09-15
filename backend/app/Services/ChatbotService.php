<?php

namespace App\Services;

use App\Models\ChatMessage;
use Illuminate\Support\Facades\DB;

class ChatbotService
{
    public function saveMessage(array $validatedData)
    {
        return ChatMessage::create([
            'user_id'  => $validatedData['user_id'],
            'message'  => $validatedData['message'],
            'response' => $validatedData['response'],
        ]);
    }

    public function getMessage($id)
    {
        return DB::table('chat_messages')->where('id', $id)->first();
    }

    public function getAllMessages()
    {
        return DB::table('chat_messages')->get();
    }
}
