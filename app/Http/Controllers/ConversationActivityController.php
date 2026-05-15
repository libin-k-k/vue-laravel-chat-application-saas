<?php

namespace App\Http\Controllers;

use App\Events\UserTyping;
use App\Models\Conversation;
use App\Services\MessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationActivityController extends Controller
{
    public function __construct(
        private readonly MessageService $messages,
    ) {}

    public function markRead(Request $request, Conversation $conversation): JsonResponse
    {
        $validated = $request->validate([
            'message_id' => ['required', 'integer', 'min:1'],
        ]);

        $this->messages->markRead(
            $conversation,
            $request->user(),
            (int) $validated['message_id'],
        );

        return response()->json(['ok' => true]);
    }

    public function typing(Request $request, Conversation $conversation): JsonResponse
    {
        $validated = $request->validate([
            'typing' => ['required', 'boolean'],
        ]);

        abort_unless($this->messages->conversations->userParticipates($conversation, $request->user()), 403);

        UserTyping::dispatch(
            $conversation->id,
            $request->user()->id,
            (bool) $validated['typing'],
        );

        return response()->json(['ok' => true]);
    }
}
