<?php

namespace App\Security\Authenticator;

use App\Security\Token\TwoFactorTokenInterface;
use LogicException;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\CredentialsInterface;

class TwoFactorCodeCredentials implements CredentialsInterface
{
    private bool $resolved = false;

    public function __construct(
        private readonly TwoFactorTokenInterface $twoFactorToken,
        private string|null $code,
    ) {
    }

    public function getTwoFactorToken(): TwoFactorTokenInterface
    {
        return $this->twoFactorToken;
    }

    public function markResolved(): void
    {
        $this->resolved = true;
        $this->code = null;
    }

    public function getCode(): string
    {
        if (null === $this->code) {
            throw new LogicException('The credentials are erased as another listener already verified these credentials.');
        }

        return $this->code;
    }

    public function isResolved(): bool
    {
        return $this->resolved;
    }
}