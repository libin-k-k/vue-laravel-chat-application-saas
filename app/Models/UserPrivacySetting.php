<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPrivacySetting extends Model
{
    protected $fillable = [
        'user_id',
        'is_private_profile',
        'show_online_status',
        'show_profile_image',
        'show_email',
        'show_mobile',
    ];

    protected function casts(): array
    {
        return [
            'is_private_profile' => 'boolean',
            'show_online_status' => 'boolean',
            'show_profile_image' => 'boolean',
            'show_email' => 'boolean',
            'show_mobile' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function defaultsFor(int $userId): array
    {
        return [
            'user_id' => $userId,
            'is_private_profile' => false,
            'show_online_status' => true,
            'show_profile_image' => true,
            'show_email' => false,
            'show_mobile' => false,
        ];
    }
}
