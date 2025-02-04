<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;
    protected $table = "users";
    protected $primaryKey = "id";
    public $incrementing = true;
    protected $keyType = "int";

    protected $fillable = ['name','email','password'];
    protected $hidden = ['password','remember_token'];
    
}
