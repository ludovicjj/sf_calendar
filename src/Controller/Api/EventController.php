<?php

namespace App\Controller\Api;

use App\Entity\Event;
use App\Entity\User;
use App\Exception\ValidationException;
use App\Factory\ErrorsValidationFactory;
use App\Factory\EventFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class EventController extends AbstractController
{
    #[Route('/api/events/user/{id}', name: 'api_events', methods: ['GET'])]
    public function events(User $user): Response
    {
        return $this->json($user, 200, [], ['groups' => ['user:events']]);
    }

    /**
     * @throws ValidationException
     */
    #[Route('/api/event', name: 'api_event_create', methods: ['POST'])]
    public function create(
        EventFactory $eventFactory,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): Response {
        $event = $eventFactory->create();
        $constraintList = $validator->validate($event);
        ErrorsValidationFactory::handle($constraintList);

        $entityManager->persist($event);
        $entityManager->flush();

        return $this->json([
            'message' => 'success',
            'event' => $event
        ], Response::HTTP_CREATED, [], ['groups' => ['event:read']]);
    }

    /**
     * @throws ValidationException
     */
    #[Route('/api/event/{token:event}', name: 'api_event_update',methods: ['POST'])]
    public function update(
        EventFactory $eventFactory,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        Event $event
    ): Response {
        $event = $eventFactory->update($event);
        $constraintList = $validator->validate($event);
        ErrorsValidationFactory::handle($constraintList);
        $entityManager->flush();

        return $this->json([
            'message' => 'success',
            'event' => $event
        ], Response::HTTP_OK, [], ['groups' => ['event:read']]);
    }
}