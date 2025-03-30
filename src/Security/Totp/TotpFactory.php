<?php

namespace App\Security\Totp;

use App\Entity\User;
use OTPHP\TOTP;
use OTPHP\TOTPInterface;

class TotpFactory
{
    public function createTotpForUser(User $user, string $secret): TOTPInterface
    {
        $totp = $this->createTotp($secret);
        $totp->setLabel($user->getUserIdentifier());
        $totp->setIssuer('Calendar OverFlow');

        return $totp;
    }

    public function createTotpFromUser(User $user): TOTPInterface
    {
        $totp = $this->createTotp($user->getTotpSecret());
        $totp->setLabel($user->getUserIdentifier());
        $totp->setIssuer('Calendar OverFlow');

        return $totp;
    }

    private function createTotp(string $secret): TOTPInterface
    {
        return TOTP::create(
            $secret,
            30,
            'sha1',
            6
        );
    }
}
