<?php

namespace App\Http\Resources;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Support\AppUrl;
use App\Support\ChatTime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

/** @mixin Conversation */
class ConversationResource extends JsonResource
{
    /** @var Collection<int, int> */
    public static Collection $onlineUserIds;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        /** @var User|null $other */
        $other = $this->participants->first();
        $latest = $this->latestMessage;
        $privacy = $other?->privacySettings;

        $showImage = $privacy === null || $privacy->show_profile_image;
        $showOnline = $privacy === null || $privacy->show_online_status;
        $onlineIds = static::$onlineUserIds ?? collect();

        $avatar = ($showImage && $other?->profile_photo)
            ? AppUrl::currentBaseUrl().'/storage/'.ltrim($other->profile_photo, '/')
            : null;

        return [
            'id' => $this->id,
            'conversation_id' => $this->id,
            'user_id' => $other?->id,
            'name' => $other?->name ?? 'Unknown',
            'username' => $other?->username,
            'avatar' => $avatar,
            'online' => $showOnline && $other && $onlineIds->contains($other->id),
            'last_seen' => $other?->last_seen_at?->diffForHumans(),
            'last_message' => $this->formatPreview($latest, $user?->id),
            'last_time' => ChatTime::formatTime($latest?->created_at),
            'is_mine' => $latest && $user && $latest->user_id === $user->id,
            'unread' => (int) ($this->unread_count ?? 0),
            'muted' => false,
            'typing' => false,
        ];
    }

    private function formatPreview(?Message $message, ?int $currentUserId): ?string
    {
        if (! $message) {
            return null;
        }

        if ($message->trashed()) {
            return 'Message deleted';
        }

        return match ($message->type) {
            Message::TYPE_VOICE => '🎤 Voice message',
            Message::TYPE_IMAGE => '📷 Photo',
            default => $message->body,
        };
    }
}
