<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class newsArticle extends Model
{
    use HasFactory;
    protected $table="newsarticle";
    protected $fillable = [
        "title",
        "articleDescription",
        "files"
    ];
    protected $primaryKey ="articleId";
    public $incrementing =true;
    public $timestamps = true;
}
