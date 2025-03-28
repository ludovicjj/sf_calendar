<?php

namespace App\Event;

use App\Security\Token\TwoFactorTokenInterface;
use Symfony\Contracts\EventDispatcher\Event;

class TwoFactorEvent extends Event
{
    public function __construct(private readonly TwoFactorTokenInterface $token)
    {
    }

    public function getToken(): TwoFactorTokenInterface
    {
        return $this->token;
    }

    public const EMAIL = 'two_factor.authentication.email';
    public const SMS = 'two_factor.authentication.sms';
    public const TOTP = 'two_factor.authentication.totp';
}