<?php

namespace App\Enums;

enum MessageType: string
{
    case Text = 'text';
    case Voice = 'voice';
    case Image = 'image';
}
