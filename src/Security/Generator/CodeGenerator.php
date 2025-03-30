<?php

namespace App\Security\Generator;

use App\Entity\User;
use App\Security\Context\AuthenticationContextFactory;
use App\Security\Mailer\AuthCodeMailer;
use App\Service\Sms\SmsNotifierService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface as MailerExceptionInterface;
use Symfony\Component\Notifier\Exception\TransportExceptionInterface as NotifierExceptionInterface;
use Exception;

readonly class CodeGenerator
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AuthCodeMailer         $mailer,
        private SmsNotifierService     $smsNotifierService
    ) {
    }

    /**
     * @throws MailerExceptionInterface
     * @throws NotifierExceptionInterface
     * @throws Exception;
     */
    public function generateAndSend(User $user, string $providerName): void
    {
        // user need to scan QRCode, no action needed here.
        if ($providerName === AuthenticationContextFactory::TOTP_PROVIDER) {
            return;
        }

        $min = 10 ** (6 - 1);
        $max = 10 ** 6 - 1;
        $code = $this->generateCode($min, $max);

        if ($providerName === AuthenticationContextFactory::EMAIL_PROVIDER) {
            $user->setEmailAuthCode((string) $code);
            $this->mailer->sendAuthCode($user);
        }

        if ($providerName === AuthenticationContextFactory::SMS_PROVIDER) {
            $user->setSmsAuthCode((string) $code);
            $message = sprintf('Votre code est : %s', $code);
            $this->smsNotifierService->notify($user->getPhoneNumber(), $message);
        }

        $this->entityManager->flush();
    }

    protected function generateCode(int $min, int $max): int
    {
        return mt_rand($min, $max);
    }
}
