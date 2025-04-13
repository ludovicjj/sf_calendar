<?php

namespace App\Subscriber;

use App\Exception\TwoFactorCodeException;
use App\Security\Authenticator\TwoFactorCodeCredentials;
use App\Security\Provider\TwoFactorProviderRegistryInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Event\CheckPassportEvent;

class CheckTwoFactorCodeSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly TwoFactorProviderRegistryInterface $twoFactorProviderRegistry,
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
        $providerName = $token->getCurrentProviderName();

        if (!$this->isValideCode($providerName, $token->getUser(), $twoFactorCredentialBadge->getCode())) {
            throw new TwoFactorCodeException(TwoFactorCodeException::MESSAGE);
        }

        $twoFactorCredentialBadge->markResolved();
    }

    private function isValideCode(string $providerName, UserInterface $user, string $code): bool
    {
        return $this->twoFactorProviderRegistry->valid($providerName, $user, $code);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CheckPassportEvent::class => ['onCheckPassport', self::LISTENER_PRIORITY]
        ];
    }
}