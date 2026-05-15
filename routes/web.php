<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConversationActivityController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserSearchController;
use App\Http\Controllers\UsernameController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

Broadcast::routes(['middleware' => ['web', 'auth']]);

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

Route::middleware(['auth', 'verified'])->prefix('chat')->group(function () {
    Route::get('/conversations', [ConversationController::class, 'index'])->name('chat.conversations.index');
    Route::post('/conversations', [ConversationController::class, 'store'])->name('chat.conversations.store');
    Route::get('/conversations/{conversation}/messages', [MessageController::class, 'index'])->name('chat.messages.index');
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store'])->name('chat.messages.store');
    Route::post('/conversations/{conversation}/read', [ConversationActivityController::class, 'markRead'])->name('chat.conversations.read');
    Route::post('/conversations/{conversation}/typing', [ConversationActivityController::class, 'typing'])->name('chat.conversations.typing');
    Route::delete('/messages/{message}', [MessageController::class, 'destroy'])->name('chat.messages.destroy');
    Route::post('/presence/online', [PresenceController::class, 'online'])->name('chat.presence.online');
    Route::post('/presence/offline', [PresenceController::class, 'offline'])->name('chat.presence.offline');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/users/search', [UserSearchController::class, 'search'])->name('users.search');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/privacy', [ProfileController::class, 'updatePrivacy'])->name('profile.privacy.update');
});

require __DIR__.'/auth.php';
