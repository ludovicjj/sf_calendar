<?php

namespace App\Security\Token;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class TwoFactorTokenFactory implements TwoFactorTokenFactoryInterface
{

    public function create(TokenInterface $authenticatedToken, string $firewallName, array $activeProviders): TwoFactorTokenInterface
    {
        return new TwoFactorToken($authenticatedToken, null, $firewallName, $activeProviders);
    }
}