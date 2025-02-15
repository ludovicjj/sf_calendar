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

        $fullDay = isset($data['fullDay']) && $data['fullDay'];
        /** @var User $user */
        $user = $this->security->getUser();

        $startAt = null;
        $endAt = null;
        try {
            $start = $data['startAt'] ?? null;
            $end = $data['endAt'] ?? null;

            if ($start) {
                $startAt = new DateTime($data['startAt']);
            }

            if ($end) {
                $endAt = new DateTime($data['endAt']);
            }
        } catch (Exception) {
        }

        return (new Event())
            ->setName($data['name'] ?? null)
            ->setDescription($data['description'] ?? null)
            ->setType($data['type'] ?? 'blue')
            ->setFullDay($fullDay)
            ->setStartAt($startAt)
            ->setEndAt($endAt)
            ->addUser($user);
    }
}
