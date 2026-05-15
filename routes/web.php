<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

// Legacy dashboard → redirect to chat
Route::get('/dashboard', function () {
    return redirect()->route('chat');
})->middleware(['auth'])->name('dashboard');

Route::get('/chat', [ChatController::class, 'index'])
    ->middleware(['auth'])
    ->name('chat');

require __DIR__.'/auth.php';
