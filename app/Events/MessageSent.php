<?php

namespace App\Events;

use App\Http\Resources\MessageResource;
use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message)
    {
        $this->message->loadMissing('user:id,name,username,profile_photo');
    }

    /**
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('conversation.'.$this->message->conversation_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $conversation = $this->message->conversation;
        $conversation->load([
            'participants' => fn ($q) => $q
                ->where('users.id', '!=', $this->message->user_id, 'and')
                ->withPivot('last_read_message_id'),
        ]);

        MessageResource::$recipientLastReadId = (int) (
            $conversation->participants->first()?->pivot?->last_read_message_id ?? 0
        );

        $payload = (new MessageResource($this->message))->resolve(
            \Illuminate\Http\Request::create('/')
        );

        MessageResource::$recipientLastReadId = null;

        // Clients decide is_mine from sender_id (broadcast has no per-user auth context).
        $payload['is_mine'] = false;

        return [
            'message' => $payload,
        ];
    }
}
