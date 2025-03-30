<?php

namespace App\Security\Generator;

use App\Entity\User;
use App\Security\Totp\TotpFactory;
use ParagonIE\ConstantTime\Base32;

readonly class TotpGenerator
{
    public function __construct(private TotpFactory $factory)
    {
    }

    public function generateSecret(): string
    {
        return Base32::encodeUpperUnpadded(random_bytes(32));
    }

    public function getQrContent(User $user, string $secret): string
    {
        return $this->factory->createTotpForUser($user, $secret)->getProvisioningUri();
    }
}