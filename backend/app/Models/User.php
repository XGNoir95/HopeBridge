<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';

    protected $primaryKey = 'user_id';


    protected $fillable = [
        'userMail', 'donor_id', 'userPhone', 'userName', 
        'district', 'city', 'password', 'blood_group'
    ];

    public $incrementing = true;
    protected $keyType = 'integer';

    public $timestamps = false;
}
