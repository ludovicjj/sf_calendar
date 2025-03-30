<?php

namespace App\Security\Token;

use App\Entity\User;
use InvalidArgumentException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;

interface TwoFactorTokenInterface extends TokenInterface
{
    public const ATTRIBUTE_NAME_USE_REMEMBER_ME = 'use_remember_me';

    /**
     * Return the authenticated token.
     */
    public function getAuthenticatedToken(): TokenInterface;

    /**
     * Returns a user representation.
     *
     * For a TwoFactorToken this is not nullable.
     */
    public function getUser(): UserInterface;

    /**
     * Duplicate the token with credentials.
     */
    public function createWithCredentials(string $credentials): self;

    /**
     * Return the firewall name.
     */
    public function getFirewallName(): string;

    /**
     * Return list of two-factor providers (their aliases), which are available.
     *
     * @return string[]
     */
    public function getProviders(): array;

    /**
     * Return the alias of the two-factor provider, which is currently active.
     */
    public function getCurrentProvider(): ?string;

    /**
     * Check if a two-factor provider has completed preparation. The provider's alias is passed as the argument.
     */
    public function isProviderPrepared(): bool;

    /**
     * Define the provider selected by the user for 2FA. The provider's alias is passed as the argument.
     * Check if the selected provider is valid.
     * Reset selected Provider each time the user change the selected provider
     * @throws InvalidArgumentException
     */
    public function setProviderPrepared(string $providerName): void;

    /**
     * Remove all prepared providers
     */
    public function clearProviderPrepared(): void;

    /**
     * Valid prepared provider
     */
    public function isValidProviderPrepared(string $providerName): bool;
}