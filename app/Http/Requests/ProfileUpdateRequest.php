<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'min:3',
                'max:30',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'mobile' => ['nullable', 'string', 'max:20'],
            'profile_photo' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,webp,gif',
                'max:2048',
                function (string $attribute, $value, \Closure $fail): void {
                    if (! $value || ! $value->isValid()) {
                        return;
                    }

                    $size = @getimagesize($value->getPathname());

                    if ($size === false) {
                        $fail('The profile photo must be a valid image.');

                        return;
                    }

                    [$width, $height] = $size;

                    if ($width !== $height) {
                        $fail('Profile photo must be square (1:1 aspect ratio).');
                    }
                },
            ],
            'remove_photo' => ['sometimes', 'in:0,1,true,false,on,off'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.regex' => 'Username may only contain lowercase letters, numbers and underscores.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('username')) {
            $this->merge([
                'username' => strtolower((string) $this->username),
            ]);
        }
    }
}
