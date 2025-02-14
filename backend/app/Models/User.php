<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'userMail', 'userPhone', 'userName', 
        'district', 'city', 'password', 'blood_group'
    ];
    protected $hidden = [
        'password', 'remember_token',
    ];
    public $incrementing = true;
    protected $keyType = 'integer';

    public $timestamps = false;
}
