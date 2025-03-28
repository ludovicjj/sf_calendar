<?php

namespace App\Exception;

use Symfony\Component\Security\Core\Exception\BadCredentialsException;

class TwoFactorCodeException extends BadCredentialsException
{
    public const MESSAGE = 'Invalid two-factor authentication code.';
    private const MESSAGE_KEY = 'code_invalid';

    public function getMessageKey(): string
    {
        return self::MESSAGE_KEY;
    }
}