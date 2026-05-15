<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $resetUrl;

    public int $expireMinutes;

    public function __construct(
        public User $user,
        string $token,
        string $baseUrl,
    ) {
        $this->resetUrl = $baseUrl.route('password.reset', [
            'token' => $token,
            'email' => $user->getEmailForPasswordReset(),
        ], false);

        $this->expireMinutes = (int) config('auth.passwords.'.config('auth.defaults.passwords').'.expire', 60);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset your password — '.config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reset-password',
        );
    }
}
