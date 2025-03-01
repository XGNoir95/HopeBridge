<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ShelterController;
use App\Http\Controllers\DisasterPostController;

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

//Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
//Route::get('/vt', [AuthController::class, 'validateToken']);

//Post
Route::post('/create-post', [DisasterPostController::class, 'store'])->middleware('jwt');
Route::get('/disaster-posts', [DisasterPostController::class, 'index'])->middleware('jwt');

//need to use post insted of put to update mixed files
//admin korbe eta
Route::post('/disaster-posts/{post_id}/update', [DisasterPostController::class, 'update'])->middleware('jwt');

Route::delete('/disaster-posts/{post_id}', [DisasterPostController::class, 'destroy']);
Route::get('/disaster-posts/RedZone', [DisasterPostController::class,'heatMapData']);

Route::get('/shelters', [ShelterController::class, 'index']);
Route::get('/shelters/{id}', [ShelterController::class, 'show']);

Route::get('/users', [UserController::class, 'index'])->middleware('jwt','admin');
Route::get('/user', [UserController::class, 'show'])->middleware('jwt');

//need to use post insted of put to update mixed files
Route::post('/user/update-user', [UserController::class, 'updateUser'])->middleware('jwt');
//Route::get('/users/{id}', [UserController::class, 'show'])->middleware('jwt');

Route::get('/user/posts', [DisasterPostController::class, 'userPosts'])->middleware('jwt');
Route::get('/user/posts/{post_id}', [DisasterPostController::class, 'FindPostById'])->middleware('jwt');

//admin
Route::post('/register/admin', [AdminController::class, 'createAdmin'])->middleware('jwt','admin');
Route::get('/admin', [AdminController::class, 'showAdmin'])->middleware('jwt','admin');
Route::get('/admins', [AdminController::class, 'showAllAdmins'])->middleware('jwt','admin');