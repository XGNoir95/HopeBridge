<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class chatMessage extends Model
{
    use HasFactory;
    protected $table = "chat_messages";
    protected $fillable = [
        'user_id',
        'message',
        'response'
    ];
    protected $primaryKey = "messageId";
    public $incrementing = true;
}
