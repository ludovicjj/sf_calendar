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

        $event = $this->hydrateEvent(new Event(), $data);
        $event
            ->setToken($data['token'])
            ->addUser($user);

        return $event;
    }

    public function update(Event $event): Event
    {
        $request = $this->requestStack->getMainRequest();
        $data = $request->toArray();

        return $this->hydrateEvent($event, $data);
    }

    private function hydrateEvent(Event $event, array $data): Event
    {
        [$startAt, $endAt, $fullDay] = $this->processEventDates($data);

        return $event
            ->setTitle($data['title'] ?? null)
            ->setDescription($data['description'] ?? null)
            ->setColor($data['color'] ?? 'blue')
            ->setFullDay($fullDay)
            ->setStartAt($startAt)
            ->setEndAt($endAt);
    }

    private function processEventDates(array $data): array
    {
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
            // Silence les erreurs de parsing de date
        }

        return [$startAt, $endAt, $fullDay];
    }
}
