<?php

namespace App\Models;

use Carbon\Traits\Timestamp;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class donor extends Model
{
    use HasFactory;
    protected $table ='donor';
    protected $primaryKey= "donorId";
    public $incrementing=true;
    protected $fillable=[
        'user_id',
        'division',
        'district',
        'gender'
    ];
}
