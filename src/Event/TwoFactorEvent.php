<?php

namespace App\Event;

use App\Security\Token\TwoFactorTokenInterface;
use Symfony\Contracts\EventDispatcher\Event;

class TwoFactorEvent extends Event
{
    public function __construct(
        private readonly TwoFactorTokenInterface $token,
        private readonly ?string $data = null
    ){
    }

    public function getToken(): TwoFactorTokenInterface
    {
        return $this->token;
    }

    public function getData(): ?string
    {
        return $this->data;
    }

    public const SEND = 'two_factor.authentication.send';
}
