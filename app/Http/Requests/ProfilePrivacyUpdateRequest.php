<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfilePrivacyUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_private_profile' => ['required', 'boolean'],
            'show_online_status' => ['required', 'boolean'],
            'show_profile_image' => ['required', 'boolean'],
            'show_email' => ['required', 'boolean'],
            'show_mobile' => ['required', 'boolean'],
        ];
    }
}
