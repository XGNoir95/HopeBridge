<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    use HasFactory;
    protected $table='volunteer';
    protected $primaryKey ='volunteer_id';
    public $incrementing=true;
    protected $fillable =[
        'user_id'
    ];
    public $timestamps=false;
}
