<?php

namespace App\Security\Token;

use App\Security\Context\AuthenticationContextInterface;

readonly class TwoFactorProviderInitiator
{
    public function __construct(
        private TwoFactorTokenFactoryInterface $twoFactorTokenFactory,
    ) {
    }

    public function beginTwoFactorAuthentication(
        AuthenticationContextInterface $authenticationContext
    ): ?TwoFactorTokenInterface {
        $activeProviders = $authenticationContext->getActiveProviders();
        $authenticatedToken = $authenticationContext->getToken();

        if ($activeProviders) {
            return $this->twoFactorTokenFactory->create(
                $authenticatedToken,
                $authenticationContext->getFirewallName(),
                $activeProviders
            );
        }

        return null;
    }
}