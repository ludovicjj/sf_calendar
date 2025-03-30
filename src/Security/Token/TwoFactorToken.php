<?php

namespace App\Security\Token;

use App\Entity\User;
use InvalidArgumentException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class TwoFactorToken implements TwoFactorTokenInterface
{
    private array $preparedProviders = [];

    public function __construct(
        private readonly TokenInterface $authenticatedToken,
        private ?string $credentials,
        private readonly string $firewallName,
        private readonly array $providers,
        private array $attributes = []
    ) {
    }

    public function __toString(): string
    {
        return $this->getUserIdentifier();
    }

    public function getUserIdentifier(): string
    {
        return $this->authenticatedToken->getUserIdentifier();
    }

    public function getRoleNames(): array
    {
        return [];
    }

    public function setUser(UserInterface $user): void
    {
        $this->authenticatedToken->setUser($user);
    }

    public function eraseCredentials(): void
    {
        $this->credentials = null;
    }

    public function getAttributes(): array
    {
        return $this->attributes;
    }

    public function setAttributes(array $attributes): void
    {
        $this->attributes = $attributes;
    }

    public function hasAttribute(string $name): bool
    {
        return array_key_exists($name, $this->attributes);
    }

    public function getAttribute(string $name): mixed
    {
        if (!array_key_exists($name, $this->attributes)) {
            throw new InvalidArgumentException(sprintf('This token has no "%s" attribute.', $name));
        }

        return $this->attributes[$name];
    }

    public function setAttribute(string $name, mixed $value): void
    {
        $this->attributes[$name] = $value;
    }

    public function __serialize(): array
    {
        return [
            $this->authenticatedToken,
            $this->credentials,
            $this->firewallName,
            $this->attributes,
            $this->providers,
            $this->preparedProviders,
        ];
    }

    public function __unserialize(array $data): void
    {
        [
            $this->authenticatedToken,
            $this->credentials,
            $this->firewallName,
            $this->attributes,
            $this->providers,
            $this->preparedProviders,
        ] = $data;
    }

    public function getAuthenticatedToken(): TokenInterface
    {
        return $this->authenticatedToken;
    }

    public function getUser(): UserInterface
    {
        return $this->authenticatedToken->getUser();
    }

    public function createWithCredentials(string $credentials): TwoFactorTokenInterface
    {
        $credentialsToken = new self($this->authenticatedToken, $credentials, $this->firewallName, $this->providers);

        foreach (array_keys($this->preparedProviders) as $preparedProviderName) {
            $credentialsToken->setProviderPrepared($preparedProviderName);
        }

        $credentialsToken->setAttributes($this->getAttributes());

        return $credentialsToken;
    }

    public function getFirewallName(): string
    {
        return $this->firewallName;
    }

    public function getProviders(): array
    {
        return $this->providers;
    }


    public function getCurrentProvider(): ?string
    {
        return array_key_first($this->preparedProviders);
    }

    public function isProviderPrepared(): bool
    {
        /** @var User $user */
        $user = $this->getUser();

        return match($this->getCurrentProvider()) {
            'email' => $user->isEmailAuthenticationEnabled(),
            'sms'   => $user->isSmsAuthenticationEnabled(),
            'totp'  => $user->isTotpAuthenticationEnabled(),
            default => throw new InvalidArgumentException("La methode d'authentification est invalide.")
        };
    }

    /**
     * @throws InvalidArgumentException
     */
    public function setProviderPrepared(?string $providerName): void
    {
        if (!$providerName) {
            throw new InvalidArgumentException("Vous devez choisir une methode d'authentification.");
        }

        //  Valid the given prepared provider
        if (!$this->isValidProviderPrepared($providerName)) {
            throw new InvalidArgumentException("La methode d'authentification est invalide.");
        }

        // clear previous prepared provider
        $this->clearProviderPrepared();

        // Add new prepared provider
        $this->preparedProviders[$providerName] = true;
    }

    public function clearProviderPrepared(): void
    {
        $this->preparedProviders = [];
    }

    public function isValidProviderPrepared(string $providerName): bool
    {
        return in_array($providerName, $this->providers);
    }
}