<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisasterPost extends Model
{
    use HasFactory;

    protected $primaryKey = 'post_id';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'files',
        'division',
        'district',
        'event_date',
        'event_time',
    ];
}
