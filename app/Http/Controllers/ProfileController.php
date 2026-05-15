<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfilePrivacyUpdateRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Jobs\SendEmailVerificationJob;
use App\Services\EmailVerificationService;
use App\Support\AppUrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $privacy = $user->privacySettingsOrCreate();

        return Inertia::render('Profile/Edit', [
            'status' => session('status'),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'mobile' => $user->mobile,
                'profile_photo_url' => $user->profile_photo_url,
            ],
            'privacy' => [
                'is_private_profile' => $privacy->is_private_profile,
                'show_online_status' => $privacy->show_online_status,
                'show_profile_image' => $privacy->show_profile_image,
                'show_email' => $privacy->show_email,
                'show_mobile' => $privacy->show_mobile,
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $originalEmail = $user->email;

        if ($request->boolean('remove_photo') && $user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
            $user->profile_photo = null;
        }

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            $user->profile_photo = $request->file('profile_photo')->store('avatars', 'public');
        }

        $user->fill($request->safe()->only(['name', 'username', 'email', 'mobile']));

        $emailChanged = $user->email !== $originalEmail;

        if ($emailChanged) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($emailChanged) {
            $baseUrl = AppUrl::currentBaseUrl($request);
            $plainToken = app(EmailVerificationService::class)->createToken($user);
            SendEmailVerificationJob::dispatch($user, $plainToken, $baseUrl);

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with(
                'status',
                'Your email was updated. Please sign in and verify your new email address — we sent you a link.'
            );
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    public function updatePrivacy(ProfilePrivacyUpdateRequest $request): RedirectResponse
    {
        $privacy = $request->user()->privacySettingsOrCreate();

        $privacy->update($request->validated());

        return Redirect::route('profile.edit')->with('status', 'privacy-updated');
    }
}
