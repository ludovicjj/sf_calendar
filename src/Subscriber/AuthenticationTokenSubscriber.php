<?php

namespace App\Subscriber;

use App\Entity\User;
use App\Security\Authenticator\TwoFactorAuthenticator;
use App\Security\Context\AuthenticationContextFactoryInterface;
use App\Security\Token\TwoFactorProviderInitiator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\RememberMeToken;
use Symfony\Component\Security\Http\Event\AuthenticationTokenCreatedEvent;
use RuntimeException;

readonly class AuthenticationTokenSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private RequestStack                          $requestStack,
        private AuthenticationContextFactoryInterface $authenticationContextFactory,
        private TwoFactorProviderInitiator            $twoFactorProviderInitiator,
    ) {
    }

    public function onAuthenticationTokenCreated(AuthenticationTokenCreatedEvent $event): void
    {
        $token = $event->getAuthenticatedToken();

        if ($token instanceof TwoFactorAuthenticator) {
            return;
        }

        if ($token instanceof RememberMeToken) {
            return;
        }

        if ($token->hasAttribute(TwoFactorAuthenticator::FLAG_2FA_COMPLETE)) {
            return;
        }

        $request = $this->getRequest();
        $passport = $event->getPassport();
        $user = $passport->getUser();

        if (!$user instanceof User) {
            return;
        }

        $context = $this->authenticationContextFactory->create($request, $token, $passport, 'main');
        $twoFactorToken = $this->twoFactorProviderInitiator->beginTwoFactorAuthentication($context);

        if (null === $twoFactorToken) {
            return;
        }

        $event->setAuthenticatedToken($twoFactorToken);
    }

    private function getRequest(): Request
    {
        $request = $this->requestStack->getMainRequest();
        if (null === $request) {
            throw new RuntimeException('No request available');
        }

        return $request;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            AuthenticationTokenCreatedEvent::class => 'onAuthenticationTokenCreated',
        ];
    }
}