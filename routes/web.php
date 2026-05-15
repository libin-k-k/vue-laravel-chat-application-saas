<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserSearchController;
use App\Http\Controllers\UsernameController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

// Username availability check — accessible to guests during registration
Route::get('/check-username', [UsernameController::class, 'check'])->name('username.check');

// Legacy dashboard → redirect to chat
Route::get('/dashboard', function () {
    return redirect()->route('chat');
})->middleware(['auth'])->name('dashboard');

Route::get('/chat', [ChatController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('chat');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/users/search', [UserSearchController::class, 'search'])->name('users.search');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/privacy', [ProfileController::class, 'updatePrivacy'])->name('profile.privacy.update');
});

require __DIR__.'/auth.php';
