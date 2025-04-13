<?php

namespace App\Controller\Security;

use App\Form\Type\EnableTwoFactorType;
use Endroid\QrCode\QrCode;
use App\Entity\User;
use App\Event\TwoFactorEvent;
use App\Security\Config\TwoFactorConfig;
use App\Security\Generator\TotpGenerator;
use App\Security\Token\TwoFactorTokenInterface;
use Doctrine\ORM\EntityManagerInterface;
use Endroid\QrCode\Writer\PngWriter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Throwable;

class TwoFactorController extends AbstractController
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
    ) {
    }

    #[Route('/2fa/authentication', name: 'app_2fa_authenticate')]
    public function authenticate(
        Request $request,
        TwoFactorConfig $twoFactorConfig,
        EventDispatcherInterface $dispatcher
    ): Response {
        $token = $this->tokenStorage->getToken();

        if (!$token instanceof TwoFactorTokenInterface) {
            $this->redirectToRoute('app_login');
        }

        $activeProvidersData = $twoFactorConfig->getActiveProviderData($token->getProviders());

        if ($request->isMethod('POST')) {
            $selectedProviderName = $request->request->get('auth_method');

            try {
                $token->setSelectedProvider($selectedProviderName);
                $isPrepared = $token->isSelectedProviderPrepared();
                if (!$isPrepared) {
                    return $this->redirectToRoute('app_2fa_authenticate_enable');
                }

                $event = new TwoFactorEvent($token);
                $dispatcher->dispatch($event, TwoFactorEvent::SEND);

                return $this->redirectToRoute('app_2fa_authenticate_check');
            } catch (Throwable $e) {
                return $this->render('security/2fa_authentication.html.twig', [
                    'providersData' => $activeProvidersData,
                    'error' => $e->getMessage(),
                ]);
            }
        }
        
        return $this->render('security/2fa_authentication.html.twig', [
            'providersData' => $activeProvidersData,
        ]);
    }

    #[Route('/2fa/authentication/enable', name: 'app_2fa_authenticate_enable')]
    public function enable2fa(
        EntityManagerInterface $entityManager,
        TwoFactorConfig $twoFactorConfig,
        EventDispatcherInterface $dispatcher,
        Request $request,
    ): Response {
        $token = $this->tokenStorage->getToken();

        if (!($token instanceof TwoFactorTokenInterface)) {
            $this->redirectToRoute('app_login');
        }

        /** @var User $user */
        $user = $token->getUser();
        $providerName = $token->getCurrentProviderName();

        if (!$user instanceof User) {
            return $this->redirectToRoute('app_login');
        }

        if ($token->isSelectedProviderPrepared()) {
            return $this->redirectToRoute('app_2fa_authenticate');
        }

        $form = $this->createForm(EnableTwoFactorType::class, $user, [
            'provider_name' => $providerName,
        ])->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();
            $event = new TwoFactorEvent($token);
            $dispatcher->dispatch($event, TwoFactorEvent::SEND);

            return $this->redirectToRoute('app_2fa_authenticate_check');
        }

        $activeProvidersData = $twoFactorConfig->getEnableProviderData($providerName);

        return $this->render('security/2fa_authentication_enable.html.twig', [
            'providersData' => $activeProvidersData,
            'form' => $form
        ]);
    }

    #[Route('/2fa/authentication/check', name: 'app_2fa_authenticate_check')]
    public function check(
        AuthenticationUtils $authenticationUtils,
        TwoFactorConfig $twoFactorConfig
    ): Response {
        $error = $authenticationUtils->getLastAuthenticationError();

        $token = $this->tokenStorage->getToken();
        assert($token instanceof TwoFactorTokenInterface);
        $providerName = $token->getCurrentProviderName();

        if (!$providerName) {
            return $this->redirectToRoute('app_2fa_authenticate');
        }

        $processDescription = $twoFactorConfig->getSelectedProviderData($providerName);

        return $this->render('security/2fa_email_form.html.twig', [
            'error' => $error,
            'processDescription' => $processDescription,
        ]);
    }

    #[Route('/2fa/authentication/qr-code/{code}', name: 'app_qr_code')]
    public function displayGoogleAuthenticatorQrCode(TotpGenerator $totpGenerator, string $code): Response
    {
        $token = $this->tokenStorage->getToken();
        /** @var User $user */
        $user = $token->getUser();
        $data = $totpGenerator->getQrContent($user, $code);

        // Build QR code
        $writer = new PngWriter();
        $qrCode = new QrCode(
            data: $data,
            size: 200,
            margin: 10,
        );
        $result = $writer->write($qrCode);

        return new Response($result->getString(), 200, ['Content-Type' => 'image/png']);
    }
}
