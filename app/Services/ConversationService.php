<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ConversationService
{
    /**
     * Direct conversations for a user that have at least one message.
     *
     * @return Collection<int, Conversation>
     */
    public function listForUser(User $user): Collection
    {
        return Conversation::query()
            ->whereHas('messages')
            ->whereHas('participants', fn ($q) => $q->where('users.id', '=', $user->id, 'and'))
            ->with([
                'latestMessage.user:id,name,username,profile_photo',
                'participants' => fn ($q) => $q
                    ->where('users.id', '!=', $user->id, 'and')
                    ->select('users.id', 'users.name', 'users.username', 'users.profile_photo', 'users.last_seen_at')
                    ->with('privacySettings:user_id,show_profile_image,show_online_status'),
            ])
            ->withCount([
                'messages as unread_count' => function ($q) use ($user) {
                    $q->where('user_id', '!=', $user->id, 'and')
                        ->whereNull('deleted_at')
                        ->whereRaw('messages.id > COALESCE((
                            SELECT last_read_message_id
                            FROM conversation_participants
                            WHERE conversation_participants.conversation_id = messages.conversation_id
                            AND conversation_participants.user_id = ?
                        ), 0)', [$user->id]);
                },
            ])
            ->withMax('messages as last_message_at', 'created_at')
            ->orderByDesc('last_message_at')
            ->get();
    }

    public function findOrCreateDirect(User $currentUser, int $otherUserId): Conversation
    {
        if ($otherUserId === $currentUser->id) {
            abort(422, 'You cannot start a conversation with yourself.');
        }

        User::query()->whereKey($otherUserId)->firstOrFail();

        $existing = Conversation::query()
            ->whereHas('participants', fn ($q) => $q->where('users.id', $currentUser->id))
            ->whereHas('participants', fn ($q) => $q->where('users.id', $otherUserId))
            ->has('participants', '=', 2)
            ->first();

        if ($existing) {
            return $existing->load([
                'participants' => fn ($q) => $q
                    ->where('users.id', '!=', $currentUser->id, 'and')
                    ->select('users.id', 'users.name', 'users.username', 'users.profile_photo', 'users.last_seen_at')
                    ->with('privacySettings:user_id,show_profile_image,show_online_status'),
            ]);
        }

        return DB::transaction(function () use ($currentUser, $otherUserId) {
            $conversation = Conversation::query()->create();

            $conversation->participants()->attach([
                $currentUser->id => ['created_at' => now(), 'updated_at' => now()],
                $otherUserId => ['created_at' => now(), 'updated_at' => now()],
            ]);

            return $conversation->load([
                'participants' => fn ($q) => $q
                    ->where('users.id', '!=', $currentUser->id, 'and')
                    ->select('users.id', 'users.name', 'users.username', 'users.profile_photo', 'users.last_seen_at')
                    ->with('privacySettings:user_id,show_profile_image,show_online_status'),
            ]);
        });
    }

    public function userParticipates(Conversation $conversation, User $user): bool
    {
        return $conversation->participants()
            ->where('users.id', '=', $user->id, 'and')
            ->exists();
    }
}
