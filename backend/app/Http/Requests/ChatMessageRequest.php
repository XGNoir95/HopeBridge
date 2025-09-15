<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatMessageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'message' => 'required|string|max:500',
            'user_id' => 'nullable', // Changed from 'nullable|string' to just 'nullable'
        ];
    }

    public function messages()
    {
        return [
            'message.required' => 'Message is required.',
            'message.string' => 'Message must be a string.',
            'message.max' => 'Message cannot exceed 500 characters.',
        ];
    }

    protected function prepareForValidation()
    {
        // Convert empty string or "null" to actual null
        $userId = $this->input('user_id');
        if ($userId === '' || $userId === 'null' || $userId === null) {
            $this->merge(['user_id' => null]);
        }
    }
}
