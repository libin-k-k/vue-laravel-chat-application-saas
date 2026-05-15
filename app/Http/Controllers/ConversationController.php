<?php

namespace App\Http\Controllers;

use App\Http\Resources\ConversationResource;
use App\Services\ConversationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function __construct(
        private readonly ConversationService $conversations,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->conversations->listForUser($request->user());

        ConversationResource::$onlineUserIds = collect(
            $request->attributes->get('online_user_ids', [])
        );

        return response()->json([
            'conversations' => ConversationResource::collection($items)->resolve(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $conversation = $this->conversations->findOrCreateDirect(
            $request->user(),
            (int) $validated['user_id'],
        );

        ConversationResource::$onlineUserIds = collect(
            $request->attributes->get('online_user_ids', [])
        );

        return response()->json([
            'conversation' => (new ConversationResource($conversation))->resolve($request),
        ]);
    }
}
