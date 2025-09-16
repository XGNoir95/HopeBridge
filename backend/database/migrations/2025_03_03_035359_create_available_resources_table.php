<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAvailableResourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('available_resources', function (Blueprint $table) {
            $table->increments('itemId');
            $table->string('donorName');
            $table->string('donorMail');
            $table->string('itemDescription');
            $table->integer('quantity');
            $table->string('pickUpLocation');
            $table->date('pickUpDate');
            $table->date('expirationDate')->nullable();
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
        Schema::dropIfExists('available_resources');
    }
}
