<?php

namespace App\Security\Authenticator;

use App\Security\Token\TwoFactorTokenInterface;
use Scheb\TwoFactorBundle\Security\Http\Authenticator\Passport\Credentials\TwoFactorCodeCredentials;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\HttpUtils;

class TwoFactorAuthenticator extends AbstractAuthenticator
{

    public function __construct(
        private readonly HttpUtils $httpUtils,
        private readonly TokenStorageInterface $tokenStorage
    )
    {
    }

    public function supports(Request $request): ?bool
    {
        return $request->isMethod('POST') &&
            $this->httpUtils->checkRequestPath($request, 'app_2fa_authenticate_check');

    }

    public function authenticate(Request $request): Passport
    {
        // When the firewall is lazy, the token is not initialized in the "supports" stage, so this check does only work
        // within the "authenticate" stage.
        $currentToken = $this->tokenStorage->getToken();
        if (!($currentToken instanceof TwoFactorTokenInterface)) {
            // This should only happen when the check path is called outside of a 2fa process
            // access_control can't handle this, as it's called after the authenticator
            throw new AccessDeniedException('User is not in a two-factor authentication process.');
        }

        dd($currentToken);


        $credentials = new TwoFactorCodeCredentials($currentToken, $this->twoFactorFirewallConfig->getAuthCodeFromRequest($request));
        $userLoader = static function () use ($currentToken): UserInterface {
            return $currentToken->getUser();
        };
        $userBadge = new UserBadge($currentToken->getUserIdentifier(), $userLoader);
        $passport = new Passport($userBadge, $credentials, []);
        if ($currentToken->hasAttribute(TwoFactorTokenInterface::ATTRIBUTE_NAME_USE_REMEMBER_ME)) {
            $rememberMeBadge = new RememberMeBadge();
            $rememberMeBadge->enable();
            $passport->addBadge($rememberMeBadge);
        }

        if ($this->twoFactorFirewallConfig->isCsrfProtectionEnabled()) {
            $tokenValue = $this->twoFactorFirewallConfig->getCsrfTokenFromRequest($request);
            $tokenId = $this->twoFactorFirewallConfig->getCsrfTokenId();
            $passport->addBadge(new CsrfTokenBadge($tokenId, $tokenValue));
        }

        // Make sure the trusted device package is installed
        if (class_exists(TrustedDeviceBadge::class) && $this->shouldSetTrustedDevice($request, $passport)) {
            $passport->addBadge(new TrustedDeviceBadge());
        }

        return $passport;
    }


    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // TODO: Implement onAuthenticationSuccess() method.
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // TODO: Implement onAuthenticationFailure() method.
    }
}