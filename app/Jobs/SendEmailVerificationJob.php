<?php

namespace App\Jobs;

use App\Mail\VerifyEmailMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendEmailVerificationJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user,
        public string $plainToken,
        public string $baseUrl,
    ) {}

    public function handle(): void
    {
        if ($this->user->hasVerifiedEmail()) {
            return;
        }

        Mail::to($this->user->email)->send(
            new VerifyEmailMail($this->user, $this->plainToken, $this->baseUrl)
        );
    }
}
