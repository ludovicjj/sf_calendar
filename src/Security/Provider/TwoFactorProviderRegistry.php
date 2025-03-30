<?php

namespace App\Security\Provider;

use InvalidArgumentException;

readonly class TwoFactorProviderRegistry implements TwoFactorProviderRegistryInterface
{
    public function __construct(private iterable $providers)
    {
    }

    public function valid(string $providerName, object $user, string $code): bool
    {
        /** @var TwoFactorProviderInterface $provider */
        foreach ($this->providers as $provider) {
            if ($provider->support($providerName)) {
                return $provider->validateAuthenticationCode($user, $code);
            }
        }

        $message = sprintf("Not found any provider '%s' to validate code.", $providerName);
        throw new InvalidArgumentException($message);
    }
}