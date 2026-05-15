<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Email verification link lifetime (minutes)
    |--------------------------------------------------------------------------
    */

    'expire_minutes' => (int) env('EMAIL_VERIFICATION_EXPIRE_MINUTES', 2),

];
