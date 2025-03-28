<?php

namespace App\Security\Token;

use Exception;
use InvalidArgumentException;
use LogicException;
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

    /**
     * @throws Exception
     */
    public function preferProvider(string $preferredProvider): void
    {
        $this->removeProvider($preferredProvider);
        array_unshift($this->providers, $preferredProvider);
    }

    public function getCurrentProvider(): ?string
    {
        $first = reset($this->providers);

        return false !== $first ? $first : null;
    }

    /**
     * @throws Exception
     */
    public function setProviderComplete(string $providerName): void
    {
        if (!$this->isProviderPrepared($providerName)) {
            throw new LogicException(sprintf('Two-factor provider "%s" cannot be completed because it was not prepared.', $providerName));
        }

        $this->removeProvider($providerName);
    }

    public function allProvidersAuthenticated(): bool
    {
        return 0 === count($this->providers);
    }

    public function isProviderPrepared(string $providerName): bool
    {
        return $this->preparedProviders[$providerName] ?? false;
    }

    public function setProviderPrepared(string $providerName): void
    {
        $this->preparedProviders[$providerName] = true;
    }

    /**
     * @throws Exception
     */
    private function removeProvider(string $providerName): void
    {
        $key = array_search($providerName, $this->providers, true);
        if (false === $key) {
            throw new Exception(sprintf('Two-factor provider "%s" is not active.', $providerName));
        }

        unset($this->providers[$key]);
    }
}