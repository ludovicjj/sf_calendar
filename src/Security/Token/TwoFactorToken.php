<?php

namespace App\Security\Token;

use App\Entity\User;
use InvalidArgumentException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class TwoFactorToken implements TwoFactorTokenInterface
{
    private array $selectedProviders = [];

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
            $this->selectedProviders,
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
            $this->selectedProviders,
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

        foreach (array_keys($this->selectedProviders) as $selectedProviderName) {
            $credentialsToken->setSelectedProvider($selectedProviderName);
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


    public function getCurrentProviderName(): ?string
    {
        return array_key_first($this->selectedProviders);
    }


    public function isSelectedProviderPrepared(): bool
    {
        return $this->selectedProviders[$this->getCurrentProviderName()] ?? false;
    }

    private function isProviderPrepared(string $selectedProviderName): bool
    {
        /** @var User $user */
        $user = $this->getUser();

        return match($selectedProviderName) {
            'email' => $user->isEmailAuthenticationEnabled(),
            'sms'   => $user->isSmsAuthenticationEnabled(),
            'totp'  => $user->isTotpAuthenticationEnabled(),
            default => throw new InvalidArgumentException("La methode d'authentification est invalide.")
        };
    }

    /**
     * @throws InvalidArgumentException
     */
    public function setSelectedProvider(?string $selectedProviderName): void
    {
        if (!$selectedProviderName) {
            throw new InvalidArgumentException("Vous devez choisir une methode d'authentification.");
        }

        //  Valid the given selected provider
        if (!$this->isValidSelectedProvider($selectedProviderName)) {
            throw new InvalidArgumentException("La methode d'authentification est invalide.");
        }

        // Reset previous selected provider
        $this->clearSelectedProvider();

        $this->selectedProviders[$selectedProviderName] = $this->isProviderPrepared($selectedProviderName);
    }

    public function clearSelectedProvider(): void
    {
        $this->selectedProviders = [];
    }

    public function isValidSelectedProvider(string $selectedProviderName): bool
    {
        return in_array($selectedProviderName, $this->providers);
    }
}