<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserPrivacySetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_finds_user_by_name(): void
    {
        $viewer = $this->verifiedUser();
        $target = $this->discoverableUser(['name' => 'Alice Wonder']);

        $response = $this->actingAs($viewer)->getJson(route('users.search', ['q' => 'Alice']));

        $response->assertOk();
        $response->assertJsonPath('users.0.id', $target->id);
    }

    public function test_search_does_not_match_email_when_show_email_is_false(): void
    {
        $viewer = $this->verifiedUser();
        $this->discoverableUser([
            'email' => 'hidden@example.com',
        ], ['show_email' => false]);

        $response = $this->actingAs($viewer)->getJson(route('users.search', ['q' => 'hidden@example.com']));

        $response->assertOk();
        $response->assertJsonPath('users', []);
    }

    public function test_search_matches_email_when_show_email_is_true(): void
    {
        $viewer = $this->verifiedUser();
        $target = $this->discoverableUser([
            'email' => 'public@example.com',
        ], ['show_email' => true]);

        $response = $this->actingAs($viewer)->getJson(route('users.search', ['q' => 'public@example.com']));

        $response->assertOk();
        $response->assertJsonPath('users.0.id', $target->id);
        $response->assertJsonPath('users.0.email', 'public@example.com');
    }

    public function test_search_hides_email_in_response_when_show_email_is_false(): void
    {
        $viewer = $this->verifiedUser();
        $target = $this->discoverableUser([
            'name' => 'Bob Hidden',
            'email' => 'bobhidden@example.com',
        ], ['show_email' => false]);

        $response = $this->actingAs($viewer)->getJson(route('users.search', ['q' => 'Bob Hidden']));

        $response->assertOk();
        $response->assertJsonPath('users.0.id', $target->id);
        $response->assertJsonPath('users.0.email', null);
    }

    public function test_private_profiles_are_excluded(): void
    {
        $viewer = $this->verifiedUser();
        $this->discoverableUser(['name' => 'Private Person'], ['is_private_profile' => true]);

        $response = $this->actingAs($viewer)->getJson(route('users.search', ['q' => 'Private']));

        $response->assertOk();
        $response->assertJsonPath('users', []);
    }

    private function verifiedUser(): User
    {
        return User::factory()->create([
            'username' => 'viewer'.fake()->unique()->numerify('####'),
            'email_verified_at' => now(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @param  array<string, mixed>  $privacy
     */
    private function discoverableUser(array $attributes = [], array $privacy = []): User
    {
        $user = User::factory()->create(array_merge([
            'username' => 'user'.fake()->unique()->numerify('####'),
            'email_verified_at' => now(),
        ], $attributes));

        $user->privacySettings()->create(array_merge(
            UserPrivacySetting::defaultsFor($user->id),
            $privacy
        ));

        return $user;
    }
}
