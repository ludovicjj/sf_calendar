<?php

namespace App\Security\Token;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

interface TwoFactorTokenFactoryInterface
{
    public function create(TokenInterface $authenticatedToken, string $firewallName, array $activeProviders): TwoFactorTokenInterface;
}