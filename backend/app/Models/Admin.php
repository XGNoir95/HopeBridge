<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admins';

    protected $primaryKey = 'admin_id';
    public $incrementing = true;
    protected $keyType = "int";

    public $timestamps = true;

    protected $fillable = [
        'adminMail',
        'adminPhone',
        'adminName',
        'password',
        'district',
        'city',
        'blood_group',
        'profile_picture',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
