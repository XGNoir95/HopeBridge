<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDisasterPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('disaster_posts', function (Blueprint $table) {
        $table->id('post_id');
        $table->unsignedInteger('user_id');
        $table->string('title');
        $table->text('description');
        $table->json('files')->nullable();
        $table->string('division');
        $table->string('district');
        $table->date('event_date')->nullable(); 
        $table->time('event_time')->nullable();         
        $table->timestamps();

        $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
    });
}


    public function down()
    {
        Schema::dropIfExists('disaster_posts');
    }
}
