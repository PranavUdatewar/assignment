<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {
    Route::get('assets', [AssetController::class, 'index']);
    Route::get('dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('dashboard/day-overview', [DashboardController::class, 'dayOverview']);
});
