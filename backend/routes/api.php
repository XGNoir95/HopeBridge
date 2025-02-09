<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DisasterPostController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
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
Route::get('/test', [TestController::class, 'getTestHuman'])->middleware('test.middleware');
Route::get('/test/{id}', [TestController::class, 'getTestHumanWithId']);

//Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//Post
Route::post('/image', [ImageController::class, 'store']);
Route::post('/create-post', [DisasterPostController::class, 'store']);
Route::get('/disaster-posts', [DisasterPostController::class, 'index']);
Route::put('/disaster-posts/{post_id}', [DisasterPostController::class, 'update']);
Route::delete('/disaster-posts/{post_id}', [DisasterPostController::class, 'destroy']);

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
