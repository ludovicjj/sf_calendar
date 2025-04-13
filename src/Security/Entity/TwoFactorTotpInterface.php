<?php

namespace App\Security\Entity;

interface TwoFactorTotpInterface
{
    public function isTotpAuthenticationEnabled(): bool;

    public function getTotpSecret(): ?string;

    public function setTotpSecret(string $totpSecret): static;
}