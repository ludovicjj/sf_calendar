<?php

namespace App\Subscriber;

use App\Entity\User;
use App\Event\TwoFactorEvent;
use App\Security\Generator\CodeGenerator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface as MailerExceptionInterface;
use Symfony\Component\Notifier\Exception\TransportExceptionInterface as NotifierExceptionInterface;
use Exception;

readonly class TwoFactorAuthenticationSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private CodeGenerator $codeGenerator
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            TwoFactorEvent::SEND => 'onSendAuthenticated',
        ];
    }

    /**
     * @throws MailerExceptionInterface
     * @throws NotifierExceptionInterface
     * @throws Exception
     */
    public function onSendAuthenticated(TwoFactorEvent $event): void
    {
        $token = $event->getToken();
        /** @var User $user */
        $user = $token->getUser();
        $providerName = $token->getCurrentProviderName();

        $this->codeGenerator->generateAndSend($user, $providerName);
    }
}
