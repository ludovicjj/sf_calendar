<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Form\Type\EventType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use DateTime;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class DashboardController extends AbstractController
{
    #[Route('/', name: 'app_home', methods: ['GET'])]
    public function index(): Response
    {
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/admin', name: 'app_dashboard', methods: ['GET', 'POST'])]
    public function dashboard(
        Request $request,
        NormalizerInterface $normalizer,
        #[CurrentUser] User $user
    ): Response {
        $events = $normalizer->normalize($user->getEvents(), 'json', ['groups' => ['event:read']]);

        $form = $this->createForm(EventType::class, null, [
            'action' => $this->generateUrl('api_event_create')
        ])->handleRequest($request);

        return $this->render('admin/dashboard.html.twig', [
            'form' => $form,
            'events' => $events
        ]);
    }
}