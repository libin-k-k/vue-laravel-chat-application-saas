<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class UserSearchService
{
    private const MIN_QUERY_LENGTH = 2;

    private const RESULT_LIMIT = 20;

    /**
     * @return list<array<string, mixed>>
     */
    public function search(User $currentUser, string $rawQuery): array
    {
        $query = trim($rawQuery);

        if (mb_strlen($query) < self::MIN_QUERY_LENGTH) {
            return [];
        }

        $like = '%'.$this->escapeLikeWildcards($query).'%';

        return User::query()
            ->select(['id', 'name', 'username', 'email', 'profile_photo'])
            ->whereKeyNot($currentUser->id)
            ->whereNotNull('email_verified_at')
            ->discoverable()
            ->where(fn (Builder $builder) => $this->applyTextMatch($builder, $like))
            ->with(['privacySettings:user_id,show_profile_image,show_email'])
            ->orderBy('name')
            ->limit(self::RESULT_LIMIT)
            ->get()
            ->map(fn (User $user) => $this->formatResult($user))
            ->all();
    }

    private function applyTextMatch(Builder $builder, string $like): void
    {
        $builder
            ->where('name', 'like', $like, 'and')
            ->orWhere('username', 'like', $like, 'and')
            ->orWhere(function (Builder $emailQuery) use ($like) {
                $emailQuery
                    ->where('email', 'like', $like, 'and')
                    ->whereRelation('privacySettings', 'show_email', true);
            });
    }

    /**
     * @return array<string, mixed>
     */
    private function formatResult(User $user): array
    {
        $privacy = $user->privacySettings;
        $showImage = $privacy === null || $privacy->show_profile_image;
        $showEmail = $privacy !== null && $privacy->show_email;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $showEmail ? $user->email : null,
            'profile_photo_url' => $showImage ? $user->profile_photo_url : null,
        ];
    }

    private function escapeLikeWildcards(string $value): string
    {
        return str_replace(['%', '_'], ['\%', '\_'], $value);
    }
}
