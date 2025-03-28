<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\AuthenticatedVoter;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;
use App\Security\Token\TwoFactorTokenInterface;

class TwoFactorVoter implements VoterInterface
{
    public const IS_AUTHENTICATED_2FA_IN_PROGRESS = 'IS_AUTHENTICATED_2FA_IN_PROGRESS';

    public function supportsAttribute(string $attribute): bool
    {
        return self::IS_AUTHENTICATED_2FA_IN_PROGRESS === $attribute || AuthenticatedVoter::PUBLIC_ACCESS === $attribute;
    }

    public function vote(TokenInterface $token, mixed $subject, array $attributes): int
    {
        if (!($token instanceof TwoFactorTokenInterface)) {
            return VoterInterface::ACCESS_ABSTAIN;
        }

        if (in_array(self::IS_AUTHENTICATED_2FA_IN_PROGRESS, $attributes, true)) {
            return VoterInterface::ACCESS_GRANTED;
        }

        return VoterInterface::ACCESS_ABSTAIN;
    }
}