<?php

use App\Http\Controllers\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/test', [TestController::class, 'getTestHuman']);
Route::get('/test/{id}', [TestController::class, 'getTestHumanWithId']);

Route::get('/tests', function () {
    return response()->json(['message' => 'Connect Hoise'], 200);
});
