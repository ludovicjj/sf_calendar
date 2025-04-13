<?php

namespace App\Security\Entity;

interface TwoFactorEmailInterface
{
    public function isEmailAuthenticationEnabled(): bool;

    public function getEmailAuthCode(): string|null;

    public function setEmailAuthCode(string $authCode): static;
}
