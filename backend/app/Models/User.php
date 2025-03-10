<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Model
{
    use HasFactory;
    use Notifiable;

    protected $table = "users";
    protected $primaryKey = "user_id";
    public $incrementing = true;
    protected $keyType = "int";

    protected $fillable = [
        'userMail',
        'userPhone',
        'userName',
        'district',
        'city',
        'password',
        'blood_group',
        'profile_picture',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public $timestamps = false;
}