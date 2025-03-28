<?php

namespace App\Subscriber;

use App\Security\Token\TwoFactorTokenInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;

class RememberMeSubscriber implements EventSubscriberInterface
{
    // Just before Symfony's RememberMeListener
    private const PRIORITY = -63;

    public function onSuccessfulLogin(LoginSuccessEvent $event): void
    {
        $passport = $event->getPassport();

        if (!$passport->hasBadge(RememberMeBadge::class)) {
            return;
        }

        $rememberMeBadge = $passport->getBadge(RememberMeBadge::class);
        assert($rememberMeBadge instanceof RememberMeBadge);

        if (!$rememberMeBadge->isEnabled()) {
            return; // User did not request a remember-me cookie
        }

        $token = $event->getAuthenticatedToken();
        if (!($token instanceof TwoFactorTokenInterface)) {
            return;
        }

        $rememberMeBadge->disable();
        $token->setAttribute(TwoFactorTokenInterface::ATTRIBUTE_NAME_USE_REMEMBER_ME, true);
    }

    public static function getSubscribedEvents(): array
    {
        return [LoginSuccessEvent::class => ['onSuccessfulLogin', self::PRIORITY]];
    }
}