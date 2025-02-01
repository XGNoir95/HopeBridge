<?php

use App\Http\Controllers\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require JWT validation)
Route::middleware('jwt')->group(function () {
    Route::post('/validate-token', [AuthController::class, 'validateToken']);
    Route::get('/user', function (Request $request) {
        return response()->json(['user_id' => $request->attributes->get('user_id')]);
    });

    Route::get('/tests', function () {
        return response()->json(['message' => 'Connect Hoise'], 200);
    });
});
