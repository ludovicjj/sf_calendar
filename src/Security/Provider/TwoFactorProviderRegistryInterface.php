<?php

namespace App\Security\Provider;


interface TwoFactorProviderRegistryInterface
{
    public function valid(string $providerName, object $user, string $code): bool;
}