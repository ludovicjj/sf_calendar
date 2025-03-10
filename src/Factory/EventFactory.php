<?php

namespace App\Factory;

use App\Entity\Event;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use DateTime;
use Exception;

readonly class EventFactory
{
    public function __construct(
        private RequestStack $requestStack,
        private Security $security
    ){
    }

    public function create(): Event
    {
        $request = $this->requestStack->getMainRequest();
        $data = $request->toArray();

        /** @var User $user */
        $user = $this->security->getUser();

        $startAt = null;
        $endAt = null;
        $fullDay = null;
        try {
            $start = $data['start'] ?? null;
            $end = $data['end'] ?? null;

            if ($start) {
                $startAt = new DateTime($data['start']);
            }

            if ($end) {
                $endAt = new DateTime($data['end']);
            }

            if ($startAt && $endAt) {
                $fullDay = $startAt->format('Y-m-d') !== $endAt->format('Y-m-d');
            }
        } catch (Exception) {
        }

        return (new Event())
            ->setTitle($data['title'] ?? null)
            ->setDescription($data['description'] ?? null)
            ->setColor($data['color'] ?? 'blue')
            ->setFullDay($fullDay)
            ->setStartAt($startAt)
            ->setEndAt($endAt)
            ->setToken($data['token'])
            ->addUser($user);
    }
}
