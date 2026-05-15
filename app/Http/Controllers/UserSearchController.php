<?php

namespace App\Http\Controllers;

use App\Services\UserSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserSearchController extends Controller
{
    public function __construct(
        private readonly UserSearchService $userSearch,
    ) {}

    public function search(Request $request): JsonResponse
    {
        $users = $this->userSearch->search(
            $request->user(),
            (string) $request->input('q', ''),
        );

        return response()->json(['users' => $users]);
    }
}
