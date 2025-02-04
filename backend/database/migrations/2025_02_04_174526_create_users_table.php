<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->integer('user_id')->primary();
            $table->string('userMail', 255)->unique();
            $table->string('donor_id', 255)->unique();
            $table->string('userPhone', 255);
            $table->string('userName', 255);
            $table->string('district', 255);
            $table->string('city', 255);
            $table->string('password', 255);
            $table->string('blood_group', 255);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
