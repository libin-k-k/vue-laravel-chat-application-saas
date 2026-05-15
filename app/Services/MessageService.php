<?php

namespace App\Services;

use App\Enums\MessageType;
use App\Events\MessageDeleted;
use App\Events\MessageSent;
use App\Events\MessagesRead;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Support\AppUrl;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MessageService
{
    public const PER_PAGE = 30;

    public const DELETE_WINDOW_MINUTES = 5;

    public function __construct(
        public readonly ConversationService $conversations,
    ) {}

    /**
     * @return array{messages: \Illuminate\Support\Collection, has_more: bool, oldest_id: int|null}
     */
    public function paginate(Conversation $conversation, User $user, ?int $beforeId = null): array
    {
        abort_unless($this->conversations->userParticipates($conversation, $user), 403);

        $conversation->load([
            'participants' => fn ($q) => $q
                ->where('users.id', '!=', $user->id, 'and')
                ->withPivot('last_read_message_id'),
        ]);

        $query = Message::query()
            ->withTrashed()
            ->where('conversation_id', '=', $conversation->id, 'and')
            ->with('user:id,name,username,profile_photo')
            ->orderByDesc('id');

        if ($beforeId) {
            $query->where('id', '<', $beforeId, 'and');
        }

        $batch = $query->limit(self::PER_PAGE + 1)->get();
        $hasMore = $batch->count() > self::PER_PAGE;

        if ($hasMore) {
            $batch = $batch->take(self::PER_PAGE);
        }

        $messages = $batch->reverse()->values();
        $oldestId = $messages->first()?->id;

        return [
            'messages' => $messages,
            'has_more' => $hasMore,
            'oldest_id' => $oldestId,
        ];
    }

    public function sendText(Conversation $conversation, User $user, string $body): Message
    {
        return $this->store($conversation, $user, MessageType::Text, $body);
    }

    public function sendVoice(Conversation $conversation, User $user, UploadedFile $file, int $duration): Message
    {
        $path = $file->store('voice-messages/'.$conversation->id, 'public');

        return $this->store($conversation, $user, MessageType::Voice, null, $path, $file->getMimeType(), $duration);
    }

    private function store(
        Conversation $conversation,
        User $user,
        MessageType $type,
        ?string $body = null,
        ?string $attachmentPath = null,
        ?string $attachmentMime = null,
        ?int $attachmentDuration = null,
    ): Message {
        abort_unless($this->conversations->userParticipates($conversation, $user), 403);

        $message = DB::transaction(function () use ($conversation, $user, $type, $body, $attachmentPath, $attachmentMime, $attachmentDuration) {
            $message = Message::query()->create([
                'conversation_id' => $conversation->id,
                'user_id' => $user->id,
                'type' => $type->value,
                'body' => $body,
                'attachment_path' => $attachmentPath,
                'attachment_mime' => $attachmentMime,
                'attachment_duration' => $attachmentDuration,
            ]);

            $conversation->touch();

            return $message->load('user:id,name,username,profile_photo');
        });

        MessageSent::dispatch($message);

        return $message;
    }

    public function delete(Message $message, User $user): Message
    {
        abort_unless($message->user_id === $user->id, 403);
        abort_unless($this->conversations->userParticipates($message->conversation, $user), 403);
        abort_unless(
            $message->created_at && $message->created_at->gte(now()->subMinutes(self::DELETE_WINDOW_MINUTES)),
            403,
            'Messages can only be deleted within '.self::DELETE_WINDOW_MINUTES.' minutes.',
        );

        $message->delete();

        MessageDeleted::dispatch($message);

        return $message;
    }

    public function markRead(Conversation $conversation, User $user, int $messageId): void
    {
        abort_unless($this->conversations->userParticipates($conversation, $user), 403);

        $participant = $conversation->participants()
            ->where('users.id', '=', $user->id, 'and')
            ->first();

        $current = (int) ($participant?->pivot?->last_read_message_id ?? 0);

        if ($messageId <= $current) {
            return;
        }

        $exists = Message::query()
            ->where('conversation_id', '=', $conversation->id, 'and')
            ->whereKey($messageId)
            ->exists();

        abort_unless($exists, 422, 'Invalid message.');

        $conversation->participants()->updateExistingPivot($user->id, [
            'last_read_message_id' => $messageId,
        ]);

        MessagesRead::dispatch($conversation->id, $user->id, $messageId);
    }

    public static function attachmentUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return AppUrl::currentBaseUrl().'/storage/'.ltrim($path, '/');
    }
}
