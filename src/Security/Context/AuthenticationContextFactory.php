<?php

namespace App\Security\Context;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

readonly class AuthenticationContextFactory implements AuthenticationContextFactoryInterface
{
    /**
     * List of allowed providers
     */
    private const ALLOWED_PROVIDERS = ['email', 'sms', 'totp'];

    public const SMS_PROVIDER = 'sms';
    public const TOTP_PROVIDER = 'totp';
    public const EMAIL_PROVIDER = 'email';
    
    public function __construct(
        #[Autowire('%env(array:TWO_FACTOR_ACTIVE_PROVIDERS)%')]
        private array $activeProviders = []
    ) {
    }

    public function create(
        Request $request,
        TokenInterface $token,
        Passport $passport,
        string $firewallName
    ): AuthenticationContextInterface {

        return new AuthenticationContext(
            $request,
            $token,
            $passport,
            $firewallName,
            $this->getFilteredActiveProviders()
        );
    }

    /**
     * Filter the active providers to only return allowed ones
     */
    private function getFilteredActiveProviders(): array
    {
        return array_values(array_intersect($this->activeProviders, self::ALLOWED_PROVIDERS));
    }
}
