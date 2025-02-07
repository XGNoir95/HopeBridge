<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class videos extends Model
{
    use HasFactory;
    protected $table = 'videos';
    protected $primaryKey = 'videos_id';
    protected $incrementing = true;
    protected $keyType = 'integer';
    protected $fillable = ['videoDescription','videoDate','videoLink'];
    protected $timestamps=false;
}
