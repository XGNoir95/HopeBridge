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
        $table->string('city');
        $table->string('district');
        $table->string('disaster_type');
        $table->string('status')->default('pending');
        $table->timestamps();

        // Add foreign key constraint for user_id
        $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
    });
}


    public function down()
    {
        Schema::dropIfExists('disaster_posts');
    }
}
