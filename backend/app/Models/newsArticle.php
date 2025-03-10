<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class newsArticle extends Model
{
    use HasFactory;
    protected $table="news_article";
    protected $fillable = [
        "title",
        "articleDescription",
        "files"
    ];
    protected $primaryKey ="articleId";
    public $incrementing =true;
}
