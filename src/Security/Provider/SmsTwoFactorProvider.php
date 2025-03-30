<?php

namespace App\Security\Provider;


use App\Entity\User;

class SmsTwoFactorProvider implements TwoFactorProviderInterface
{
    private const PROVIDER_NAME = 'sms';

    public function validateAuthenticationCode(object $user, string $authenticationCode): bool
    {
        if (!($user instanceof User)) {
            return false;
        }

        $authenticationCode = str_replace(' ', '', $authenticationCode);

        return $user->getSmsAuthCode() === $authenticationCode;
    }

    public function support(string $providerName): bool
    {
        return $providerName === self::PROVIDER_NAME;
    }
}