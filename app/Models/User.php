<?php

namespace App\Models;

use App\Jobs\SendEmailVerificationJob;
use App\Mail\ResetPasswordMail;
use App\Services\EmailVerificationService;
use App\Support\AppUrl;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'mobile',
        'profile_photo',
        'password',
    ];

    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_seen_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participants')
            ->withPivot(['last_read_message_id'])
            ->withTimestamps();
    }

    public function emailVerificationTokens(): HasMany
    {
        return $this->hasMany(EmailVerificationToken::class);
    }

    public function privacySettings(): HasOne
    {
        return $this->hasOne(UserPrivacySetting::class);
    }

    /**
     * Users visible in search (not private profile).
     */
    public function scopeDiscoverable(Builder $query): void
    {
        $query->where(function (Builder $builder) {
            $builder
                ->whereDoesntHave('privacySettings')
                ->orWhereHas('privacySettings', function (Builder $privacy) {
                    $privacy->where('is_private_profile', false);
                });
        });
    }

    public function privacySettingsOrCreate(): UserPrivacySetting
    {
        return $this->privacySettings()->firstOrCreate(
            ['user_id' => $this->id],
            UserPrivacySetting::defaultsFor($this->id)
        );
    }

    public function sendEmailVerificationNotification(?string $baseUrl = null): void
    {
        $plainToken = app(EmailVerificationService::class)->createToken($this);
        $baseUrl = $baseUrl ?? AppUrl::currentBaseUrl();

        SendEmailVerificationJob::dispatch($this, $plainToken, $baseUrl);
    }

    public function sendPasswordResetNotification($token): void
    {
        Mail::to($this->email)->send(
            new ResetPasswordMail($this, $token, AppUrl::currentBaseUrl())
        );
    }

    public function getProfilePhotoUrlAttribute(): ?string
    {
        if (! $this->profile_photo) {
            return null;
        }

        return AppUrl::currentBaseUrl().'/storage/'.ltrim($this->profile_photo, '/');
    }
}
