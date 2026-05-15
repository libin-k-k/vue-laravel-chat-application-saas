<?php

namespace App\Mail;

use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailMail extends Mailable
{
    use SerializesModels;

    public string $verificationUrl;

    public int $expireMinutes;

    public function __construct(
        public User $user,
        string $plainToken,
        string $baseUrl,
    ) {
        $service = app(EmailVerificationService::class);

        $this->verificationUrl = $service->verificationUrl($plainToken, $baseUrl);
        $this->expireMinutes = config('verification.expire_minutes', 2);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify your email — '.config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verify-email',
        );
    }
}
