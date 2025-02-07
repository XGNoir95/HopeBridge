<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $table = "users";
    protected $primaryKey = "user_id";
    public $incrementing = true;
    protected $keyType = "int";

    protected $fillable = [
        'userMail',
        'donor_id',
        'userPhone',
        'userName',
        'district',
        'city',
        'password',
        'blood_group',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public $timestamps = false;
}