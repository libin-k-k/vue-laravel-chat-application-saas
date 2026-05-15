<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UsernameController extends Controller
{
    /**
     * Check if a username is available and return suggestions if not.
     */
    public function check(Request $request): JsonResponse
    {
        $username = Str::lower(trim($request->string('username')->toString()));

        // Basic format validation
        if (strlen($username) < 3) {
            return response()->json([
                'available'   => false,
                'status'      => 'invalid',
                'message'     => 'Username must be at least 3 characters.',
                'suggestions' => [],
            ]);
        }

        if (! preg_match('/^[a-z0-9_]+$/', $username)) {
            return response()->json([
                'available'   => false,
                'status'      => 'invalid',
                'message'     => 'Only lowercase letters, numbers and underscores allowed.',
                'suggestions' => [],
            ]);
        }

        $exceptId = $request->integer('except');

        if ($exceptId > 0 && User::query()->whereKey($exceptId)->where('username', '=', $username, 'and')->exists()) {
            return response()->json([
                'available'   => true,
                'status'      => 'current',
                'message'     => 'This is your current username.',
                'suggestions' => [],
            ]);
        }

        $query = User::query()->where('username', '=', $username, 'and');
        if ($exceptId > 0) {
            $query->where('id', '!=', $exceptId, 'and');
        }

        $taken = $query->exists();

        return response()->json([
            'available'   => ! $taken,
            'status'      => $taken ? 'taken' : 'available',
            'message'     => $taken ? 'Username is already taken.' : 'Username is available!',
            'suggestions' => $taken ? $this->suggestions($username, $exceptId > 0 ? $exceptId : null) : [],
        ]);
    }

    /**
     * Generate up to 4 alternative usernames based on the given base.
     */
    private function suggestions(string $base, ?int $exceptId = null): array
    {
        $results = [];
        $attempts = 0;
        $i = 1;

        $isAvailable = function (string $candidate) use ($exceptId): bool {
            $query = User::query()->where('username', '=', $candidate, 'and');
            if ($exceptId) {
                $query->where('id', '!=', $exceptId, 'and');
            }

            return ! $query->exists();
        };

        while (count($results) < 3 && $attempts < 15) {
            $candidate = $base.$i;
            if ($isAvailable($candidate)) {
                $results[] = $candidate;
            }
            $i++;
            $attempts++;
        }

        $suffix = rand(10, 99);
        $candidate = $base.'_'.$suffix;
        if (count($results) < 4 && $isAvailable($candidate)) {
            $results[] = $candidate;
        }

        return array_values($results);
    }
}
