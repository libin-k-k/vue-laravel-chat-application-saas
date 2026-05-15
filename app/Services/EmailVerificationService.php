<?php

namespace App\Services;

use App\Models\EmailVerificationToken;
use App\Models\User;
use App\Support\AppUrl;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EmailVerificationService
{
    public function createToken(User $user): string
    {
        $plainToken = Str::random(64);

        EmailVerificationToken::query()
            ->where('user_id', $user->id)
            ->whereNull('used_at')
            ->delete();

        EmailVerificationToken::create([
            'user_id'    => $user->id,
            'token'      => hash('sha256', $plainToken),
            'expires_at' => now()->addMinutes(config('verification.expire_minutes', 2)),
        ]);

        return $plainToken;
    }

    public function verify(string $plainToken): array
    {
        $record = EmailVerificationToken::query()
            ->where('token', hash('sha256', $plainToken))
            ->whereNull('used_at')
            ->first();

        if (! $record) {
            return ['success' => false, 'reason' => 'invalid'];
        }

        if ($record->expires_at->isPast()) {
            return ['success' => false, 'reason' => 'expired'];
        }

        $user = $record->user;

        if ($user->hasVerifiedEmail()) {
            $record->update(['used_at' => now()]);

            return ['success' => true, 'user' => $user, 'already_verified' => true];
        }

        DB::transaction(function () use ($user, $record) {
            $user->forceFill(['email_verified_at' => now()])->save();

            $record->update(['used_at' => now()]);

            EmailVerificationToken::query()
                ->where('user_id', $user->id)
                ->whereNull('used_at')
                ->whereKeyNot($record->id)
                ->update(['used_at' => now()]);
        });

        return ['success' => true, 'user' => $user->fresh(), 'already_verified' => false];
    }

    public function verificationUrl(string $plainToken, ?string $baseUrl = null): string
    {
        $baseUrl = rtrim($baseUrl ?? AppUrl::currentBaseUrl(), '/');
        $path = route('verification.verify', ['token' => $plainToken], absolute: false);

        return $baseUrl.$path;
    }
}
