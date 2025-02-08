<?php

namespace App\Controller\Api;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EventController extends AbstractController
{
    #[Route('/api/events/user/{id}', name: 'api_events')]
    public function events(User $user): Response
    {
        return $this->json($user, 200, [], ['groups' => ['user:events']]);
    }
}