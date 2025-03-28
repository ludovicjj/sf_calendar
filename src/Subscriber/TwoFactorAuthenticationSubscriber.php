<?php

namespace App\Subscriber;

use App\Entity\User;
use App\Event\TwoFactorEvent;
use App\Security\Generator\CodeGenerator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

readonly class TwoFactorAuthenticationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private CodeGenerator $codeGenerator
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            TwoFactorEvent::EMAIL => 'onEmailAuthenticated',
        ];
    }
    
    public function onEmailAuthenticated(TwoFactorEvent $event): void
    {
        $token = $event->getToken();
        /** @var User $user */
        $user = $token->getUser();

        $this->codeGenerator->generateAndSend($user);
    }
}