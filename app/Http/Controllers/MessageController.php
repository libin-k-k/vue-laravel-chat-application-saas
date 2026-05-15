<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct(
        private readonly MessageService $messages,
    ) {}

    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        $beforeId = $request->integer('before_id') ?: null;

        $result = $this->messages->paginate($conversation, $request->user(), $beforeId);

        $otherLastRead = (int) ($conversation->participants->first()?->pivot?->last_read_message_id ?? 0);
        MessageResource::$recipientLastReadId = $otherLastRead;

        $messages = MessageResource::collection($result['messages'])->resolve();

        MessageResource::$recipientLastReadId = null;

        return response()->json([
            'messages' => $messages,
            'has_more' => $result['has_more'],
            'oldest_id' => $result['oldest_id'],
        ]);
    }

    public function store(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if ($request->hasFile('voice')) {
            $validated = $request->validate([
                'voice' => ['required', 'file', 'mimetypes:audio/webm,audio/ogg,audio/mp4,audio/mpeg,audio/wav', 'max:10240'],
                'duration' => ['required', 'integer', 'min:1', 'max:300'],
            ]);

            $message = $this->messages->sendVoice(
                $conversation,
                $user,
                $request->file('voice'),
                (int) $validated['duration'],
            );
        } else {
            $validated = $request->validate([
                'body' => ['required', 'string', 'max:5000'],
            ]);

            $message = $this->messages->sendText($conversation, $user, $validated['body']);
        }

        $conversation = $message->conversation;
        $conversation->load([
            'participants' => fn ($q) => $q
                ->where('users.id', '!=', $request->user()->id, 'and')
                ->withPivot('last_read_message_id'),
        ]);

        MessageResource::$recipientLastReadId = (int) (
            $conversation->participants->first()?->pivot?->last_read_message_id ?? 0
        );

        $payload = (new MessageResource($message))->resolve($request);

        MessageResource::$recipientLastReadId = null;

        return response()->json([
            'message' => $payload,
        ], 201);
    }

    public function destroy(Request $request, Message $message): JsonResponse
    {
        $this->messages->delete($message, $request->user());

        return response()->json(['ok' => true]);
    }
}
