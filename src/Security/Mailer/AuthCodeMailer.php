<?php

namespace App\Security\Mailer;

use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

readonly class AuthCodeMailer implements AuthCodeMailerInterface
{
    public function __construct(
        private MailerInterface $mailer,
    ) {
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function sendAuthCode(User $user): void
    {
        $authCode = $user->getEmailAuthCode();
        if (null === $authCode) {
            return;
        }

        $message = new Email();
        $message
            ->from('no-reply@sf-calendar.com')
            ->to($user->getEmail())
            ->subject('Authentication Code')
            ->text($authCode);


        $this->mailer->send($message);
    }
}