<?php

namespace App\Support;

use Carbon\CarbonInterface;

class ChatTime
{
    public const TIMEZONE = 'Asia/Kolkata';

    public static function formatTime(?CarbonInterface $at): ?string
    {
        if (! $at) {
            return null;
        }

        return $at->copy()->timezone(self::TIMEZONE)->format('g:i A');
    }

    public static function formatDate(?CarbonInterface $at): ?string
    {
        if (! $at) {
            return null;
        }

        $local = $at->copy()->timezone(self::TIMEZONE);
        $today = now(self::TIMEZONE)->startOfDay();
        $messageDay = $local->copy()->startOfDay();

        if ($messageDay->equalTo($today)) {
            return 'Today';
        }

        if ($messageDay->equalTo($today->copy()->subDay())) {
            return 'Yesterday';
        }

        return $local->format('j M Y');
    }
}
