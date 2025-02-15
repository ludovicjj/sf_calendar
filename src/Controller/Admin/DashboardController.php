<?php

namespace App\Controller\Admin;

use App\Form\Type\EventType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use DateTime;

class DashboardController extends AbstractController
{
    #[Route('/', name: 'app_home', methods: ['GET'])]
    public function index(): Response
    {
        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/admin', name: 'app_dashboard', methods: ['GET', 'POST'])]
    public function dashboard(Request $request): Response
    {
//        $data = [
//            'name' => 'Mon titre',
//            'startAt' => DateTime::createFromFormat('Y-m-d H:i', '2025-02-15 09:00'),
//            'endAt' =>  DateTime::createFromFormat('Y-m-d H:i', '2025-02-16 16:00'),
//            'description' => 'Hello world',
//            'fullDay' => true
//        ];
        $form = $this->createForm(EventType::class, null, [
            'action' => $this->generateUrl('api_event_create')
        ])->handleRequest($request);

        return $this->render('admin/dashboard.html.twig', [
            'form' => $form
        ]);
    }
}