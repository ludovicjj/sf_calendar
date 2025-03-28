<?php

namespace App\Controller\Security;

use App\Entity\User;
use App\Event\TwoFactorEvent;
use App\Security\Token\TwoFactorTokenInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class TwoFactorController extends AbstractController
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
    ) {
    }

    #[Route('/2fa/authentication', name: 'app_2fa_authenticate')]
    public function authenticate(Request $request, EventDispatcherInterface $dispatcher): Response
    {
        // Récupère le token stocké dans la session
        $token = $this->tokenStorage->getToken();

        if (!$token instanceof TwoFactorTokenInterface) {
            // TODO redirect here
        }

        /** @var User $user */
        $user = $token->getUser();

        if ($request->isMethod('POST')) {
            $authMethod = $request->request->get('auth_method');
            $event = new TwoFactorEvent($token);

            if ($authMethod === 'email') {
                $dispatcher->dispatch($event, TwoFactorEvent::EMAIL);

                return $this->redirectToRoute('app_2fa_authenticate_email');
            }
        }
        
        return $this->render('security/2fa_authentication.html.twig');
    }

    #[Route('/2fa/authentication/email', name: 'app_2fa_authenticate_email')]
    public function authenticateMail(Request $request): Response
    {
        return $this->render('security/2fa_email_form.html.twig');
    }
}
