<?php

namespace App\Security\Generator;

use App\Entity\User;
use App\Security\Mailer\AuthCodeMailer;
use Doctrine\ORM\EntityManagerInterface;

readonly class CodeGenerator
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AuthCodeMailer         $mailer,
    ) {
    }

    public function generateAndSend(User $user): void
    {
        $min = 10 ** (6 - 1);
        $max = 10 ** 6 - 1;
        $code = $this->generateCode($min, $max);
        $user->setEmailAuthCode((string) $code);
        $this->entityManager->flush();

        $this->mailer->sendAuthCode($user);
    }

    protected function generateCode(int $min, int $max): int
    {
        return mt_rand($min, $max);
    }
}