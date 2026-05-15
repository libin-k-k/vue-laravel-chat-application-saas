<?php

namespace App\Http\Resources;

use App\Models\Message;
use App\Services\MessageService;
use App\Support\ChatTime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Message */
class MessageResource extends JsonResource
{
    /** Last message id read by the other participant (for outgoing status). */
    public static ?int $recipientLastReadId = null;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isMine = $user && $this->user_id === $user->id;
        $isDeleted = $this->trashed();

        $sender = $this->relationLoaded('user') ? $this->user : null;
        $senderPhoto = $sender?->profile_photo
            ? MessageService::attachmentUrl($sender->profile_photo)
            : null;

        $data = [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->user_id,
            'type' => $this->type,
            'text' => $isDeleted ? null : ($this->type === Message::TYPE_TEXT ? $this->body : null),
            'time' => ChatTime::formatTime($this->created_at),
            'date' => ChatTime::formatDate($this->created_at),
            'created_at' => $this->created_at?->toIso8601String(),
            'is_mine' => $isMine,
            'is_deleted' => $isDeleted,
            'status' => $isMine ? $this->resolveStatus() : null,
            'deleted_at' => $this->deleted_at,
            'sender_name' => $sender?->name,
            'sender_avatar' => $senderPhoto,
        ];

        if ($this->type === Message::TYPE_VOICE && $this->attachment_path && ! $isDeleted) {
            $data['voice'] = [
                'url' => MessageService::attachmentUrl($this->attachment_path),
                'duration' => $this->attachment_duration ?? 0,
                'mime_type' => $this->attachment_mime,
            ];
        }

        if ($this->type === Message::TYPE_IMAGE && $this->attachment_path && ! $isDeleted) {
            $data['image'] = MessageService::attachmentUrl($this->attachment_path);
            $data['image_alt'] = 'Image';
        }

        return $data;
    }

    private function resolveStatus(): string
    {
        if ($this->trashed()) {
            return 'sent';
        }

        $recipientLastRead = static::$recipientLastReadId ?? 0;

        if ($this->id <= $recipientLastRead) {
            return 'read';
        }

        return 'sent';
    }
}
