<?php

namespace App\Security\Provider;

use App\Entity\User;
use App\Security\Totp\TotpFactory;

class TotpTwoFactorProvider implements TwoFactorProviderInterface
{
    private const PROVIDER_NAME = 'totp';

    public function __construct(private readonly TotpFactory $totpFactory)
    {
    }

    public function validateAuthenticationCode(object $user, string $authenticationCode): bool
    {
        if (!($user instanceof User)) {
            return false;
        }

        $authenticationCode = str_replace(' ', '', $authenticationCode);
        if (0 === strlen($authenticationCode)) {
            return false;
        }

        $totp = $this->totpFactory->createTotpFromUser($user);
        return $totp->verify($authenticationCode, null, 1);
    }

    public function support(string $providerName): bool
    {
        return $providerName === self::PROVIDER_NAME;
    }
}