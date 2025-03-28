<?php

namespace App\Security\Mailer;

use App\Entity\User;

interface AuthCodeMailerInterface
{
    public function sendAuthCode(User $user): void;
}