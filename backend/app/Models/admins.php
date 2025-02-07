<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class admins extends Model
{
    use HasFactory;
    protected $table='admins';
    protected $primaryKey= 'admin_id';
    
    protected $keyType = 'integer';
    protected $fillable=['adminMail','adminPhone','adminName','password'];
    protected $timestamps =false;
}
