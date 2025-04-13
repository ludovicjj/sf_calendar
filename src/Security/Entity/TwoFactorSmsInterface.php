<?php

namespace App\Security\Entity;

interface TwoFactorSmsInterface
{
    public function isSmsAuthenticationEnabled(): bool;

    public function setSmsAuthCode(string $authCode): static;

    public function getSmsAuthCode(): string|null;
}
