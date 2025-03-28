<?php

namespace App\Subscriber;

use App\Exception\TwoFactorCodeException;
use App\Security\Authenticator\TwoFactorCodeCredentials;
use App\Security\Provider\EmailTwoFactorProvider;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Event\CheckPassportEvent;

class CheckTwoFactorCodeSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly EmailTwoFactorProvider $emailTwoFactorProvider,
    ) {
    }

    public const LISTENER_PRIORITY = 0;

    public function onCheckPassport(CheckPassportEvent $event): void
    {
        $passport = $event->getPassport();

        if (!$passport->hasBadge(TwoFactorCodeCredentials::class)) {
            return;
        }

        $twoFactorCredentialBadge = $passport->getBadge(TwoFactorCodeCredentials::class);
        assert($twoFactorCredentialBadge instanceof TwoFactorCodeCredentials);
        $token = $twoFactorCredentialBadge->getTwoFactorToken();

        // TODO : get the provider name to use from token (key : currentProvider)
        if (!$this->isValideCode('email', $token->getUser(), $twoFactorCredentialBadge->getCode())) {
            return;
        }

        $twoFactorCredentialBadge->markResolved();
    }

    private function isValideCode(string $providerName, object $user, string $code): bool
    {
        // TODO :
        //  make registry (ProviderRegistry)
        //  each Provider must implement interface
        //  each provider must support one provider name

        if (!$this->emailTwoFactorProvider->validateAuthenticationCode($user, $code)) {
            throw new TwoFactorCodeException(TwoFactorCodeException::MESSAGE);
        }

        return true;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CheckPassportEvent::class => ['onCheckPassport', self::LISTENER_PRIORITY]
        ];
    }
}