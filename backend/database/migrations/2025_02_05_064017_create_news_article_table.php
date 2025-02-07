<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\QueryException;

class CreateNewsArticleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('newsArticle', function (Blueprint $table) {
			$table->integer('videoId')->primary();
			$table->string('articleDescription',255);
			$table->string('articleDate',255);
			$table->string('articleImageLink',255);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('newsArticle');
    }
}
