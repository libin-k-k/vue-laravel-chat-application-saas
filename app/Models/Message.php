<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use SoftDeletes;

    public const TYPE_TEXT = 'text';

    public const TYPE_VOICE = 'voice';

    public const TYPE_IMAGE = 'image';

    protected $fillable = [
        'conversation_id',
        'user_id',
        'type',
        'body',
        'attachment_path',
        'attachment_mime',
        'attachment_duration',
    ];

    protected function casts(): array
    {
        return [
            'attachment_duration' => 'integer',
        ];
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
