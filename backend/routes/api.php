<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuestController;
use App\Http\Controllers\SubmissionController;

// Public routes
Route::get('/quests', [QuestController::class, 'index']);
Route::get('/leaderboard', [UserController::class, 'leaderboard']);
Route::get('/submissions/{submission}/image', [SubmissionController::class, 'image']);

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
        'database' => \Illuminate\Support\Facades\DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'app_env' => config('app.env'),
    ]);
});

// Protected routes (Supabase Auth)
Route::middleware('auth.supabase')->group(function () {
    Route::get('/users/me', [UserController::class, 'me']);
    Route::get('/quests/{id}', [QuestController::class, 'show']);
    
    Route::post('/quests', [QuestController::class, 'store']);
    Route::post('/quests/{id}/join', [QuestController::class, 'join']);
    
    Route::post('/quests/{id}/submissions', [SubmissionController::class, 'store']);
    Route::get('/quests/{id}/submissions', [SubmissionController::class, 'index']);
    Route::get('/submissions/{submission}', [SubmissionController::class, 'show']);
});
