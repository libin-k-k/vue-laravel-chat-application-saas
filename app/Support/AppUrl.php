<?php

namespace App\Support;

use Illuminate\Http\Request;

class AppUrl
{
    /**
     * Base URL for the current HTTP request (scheme + host + port).
     * Uses the request the user actually opened (IP, hostname, etc.), not APP_URL.
     */
    public static function currentBaseUrl(?Request $request = null): string
    {
        $request ??= request();

        if ($request && $request->getHost()) {
            return rtrim($request->getSchemeAndHttpHost(), '/');
        }

        return rtrim((string) config('app.url'), '/');
    }
}
