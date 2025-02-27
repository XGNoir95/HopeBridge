<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\QueryException;

class CreateAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
           $table->increments('admin_id');
            $table->string('adminMail', 255)->unique();
            $table->string('adminPhone', 255);
            $table->string('adminName', 255);
            $table->string('password', 255);
            $table->string('district', 255);
            $table->string('city', 255);
            $table->string('blood_group', 255);
            $table->json('profile_picture')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admins');
    }
}
