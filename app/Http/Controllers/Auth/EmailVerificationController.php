<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\EmailVerificationService;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    public function __construct(
        protected EmailVerificationService $verification,
    ) {}

    /**
     * Verify email via token link (guest-accessible).
     */
    public function verify(Request $request, string $token): RedirectResponse|Response
    {
        $result = $this->verification->verify($token);

        if (! $result['success']) {
            return Inertia::render('Auth/VerifyEmailResult', [
                'success'       => false,
                'reason'        => $result['reason'],
                'expireMinutes' => config('verification.expire_minutes', 2),
            ]);
        }

        $user = $result['user'];

        if (! ($result['already_verified'] ?? false)) {
            event(new Verified($user));
        }

        if (! Auth::check() || Auth::id() !== $user->id) {
            Auth::login($user);
            $request->session()->regenerate();
        }

        return redirect()->route('chat')->with('status', 'email-verified');
    }
}
