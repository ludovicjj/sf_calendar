<?php

namespace App\Security\Provider;

use App\Entity\User;

class EmailTwoFactorProvider implements TwoFactorProviderInterface
{

    public function validateAuthenticationCode(object $user, string $authenticationCode): bool
    {
        if (!($user instanceof User)) {
            return false;
        }

        $authenticationCode = str_replace(' ', '', $authenticationCode);

        return $user->getEmailAuthCode() === $authenticationCode;
    }
}
