<?php

namespace App\Security\Provider;

interface TwoFactorProviderInterface
{
    public function validateAuthenticationCode(object $user, string $authenticationCode): bool;

    public function support(string $providerName): bool;
}