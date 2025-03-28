<?php

namespace App\Security\Authenticator;

use App\Security\Authentication\AuthenticationFailureHandler;
use App\Security\Authentication\AuthenticationSuccessHandler;
use App\Security\Token\TwoFactorTokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AuthenticatorInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\HttpUtils;

readonly class TwoFactorAuthenticator implements AuthenticatorInterface
{
    public const FLAG_2FA_COMPLETE = '2fa_complete';

    private const DEFAULT_CSRF_TOKEN_ID = 'two_factor';

    public function __construct(
        private HttpUtils                    $httpUtils,
        private TokenStorageInterface        $tokenStorage,
        private AuthenticationFailureHandler $failureHandler,
        private AuthenticationSuccessHandler $successHandler,
    ) {
    }

    public function supports(Request $request): ?bool
    {
        return $request->isMethod('POST') &&
            $this->httpUtils->checkRequestPath($request, 'app_2fa_authenticate_check');

    }

    public function authenticate(Request $request): Passport
    {
        $currentToken = $this->tokenStorage->getToken();
        $code = $request->request->get('code');
        $csrf = $request->request->get('_csrf_token');

        if (!($currentToken instanceof TwoFactorTokenInterface)) {
            throw new AccessDeniedException('User is not in a two-factor authentication process.');
        }

        $credentials = new TwoFactorCodeCredentials($currentToken, $code);
        $userLoader = static function () use ($currentToken): UserInterface {
            return $currentToken->getUser();
        };

        $userBadge = new UserBadge($currentToken->getUserIdentifier(), $userLoader);
        $passport = new Passport($userBadge, $credentials, []);

        // Prise en charge du CSRF
        $passport->addBadge(new CsrfTokenBadge(self::DEFAULT_CSRF_TOKEN_ID, $csrf));


        // Prise en charge du remember me
        if ($currentToken->hasAttribute(TwoFactorTokenInterface::ATTRIBUTE_NAME_USE_REMEMBER_ME)) {
            $rememberMeBadge = new RememberMeBadge();
            $rememberMeBadge->enable();
            $passport->addBadge($rememberMeBadge);
        }

        return $passport;
    }

    public function createToken(Passport $passport, string $firewallName): TokenInterface
    {
        $credentialsBadge = $passport->getBadge(TwoFactorCodeCredentials::class);
        assert($credentialsBadge instanceof TwoFactorCodeCredentials);
        $twoFactorToken = $credentialsBadge->getTwoFactorToken();

        // Authentication complete, unwrap the token
        $token =  $twoFactorToken->getAuthenticatedToken();
        $token->setAttribute(self::FLAG_2FA_COMPLETE, true);

        return $token;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return $this->successHandler->onAuthenticationSuccess($request);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $currentToken = $this->tokenStorage->getToken();
        assert($currentToken instanceof TwoFactorTokenInterface);

        return $this->failureHandler->onAuthenticationFailure($request, $exception);
    }
}
