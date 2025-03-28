<?php

namespace App\Security\Authentication;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\HttpUtils;
use Symfony\Component\Security\Http\SecurityRequestAttributes;
use Symfony\Component\Security\Http\Util\TargetPathTrait;

class AuthenticationSuccessHandler
{
    use TargetPathTrait;

    private const DEFAULT_TARGET_PATH = 'app_dashboard';

    public function __construct(
        private readonly HttpUtils $httpUtils,
    ) {
    }

    public function onAuthenticationSuccess(Request $request): Response
    {
        $request->getSession()->remove(SecurityRequestAttributes::AUTHENTICATION_ERROR);

        return $this->httpUtils->createRedirectResponse($request, $this->determineRedirectTargetUrl($request));
    }

    private function determineRedirectTargetUrl(Request $request): string
    {
        $session = $request->getSession();
        $firewallName = 'main';

        $targetUrl = $this->getTargetPath($session, $firewallName);
        if (null !== $targetUrl) {
            $this->removeTargetPath($session, $firewallName);

            return $targetUrl;
        }

        return self::DEFAULT_TARGET_PATH;
    }
}