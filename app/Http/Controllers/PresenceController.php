<?php

namespace App\Http\Controllers;

use App\Events\UserPresenceUpdated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function online(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->forceFill(['last_seen_at' => now()])->save();

        UserPresenceUpdated::dispatch($user, true);

        return response()->json(['ok' => true]);
    }

    public function offline(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->forceFill(['last_seen_at' => now()])->save();

        UserPresenceUpdated::dispatch($user, false);

        return response()->json(['ok' => true]);
    }
}
