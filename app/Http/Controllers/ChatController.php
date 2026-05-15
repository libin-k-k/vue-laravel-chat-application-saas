<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    /**
     * Display the chat application.
     */
    public function index(): Response
    {
        return Inertia::render('Chat/Index');
    }
}
