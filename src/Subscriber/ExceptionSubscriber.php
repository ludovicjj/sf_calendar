<?php

namespace App\Subscriber;

use App\Exception\ValidationException;
use App\Security\Token\TwoFactorToken;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Http\HttpUtils;
use Symfony\Component\Security\Http\Util\TargetPathTrait;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class ExceptionSubscriber implements EventSubscriberInterface
{
    // Just before the firewall's Symfony\Component\Security\Http\Firewall\ExceptionListener
    private const LISTENER_PRIORITY = 2;

    use TargetPathTrait;

    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly HttpUtils $httpUtils,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => [
                ['processException', 10],
                ['onKernelException', self::LISTENER_PRIORITY],
            ],
        ];
    }

    public function processException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        if ($exception instanceof ValidationException) {
            $response = new Response(
                json_encode($exception->getErrors()),
                $exception->getCode(),
                [
                    'content-type' => 'application/json',
                ]
            );

            $event->setResponse($response);
        }
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if ($exception instanceof AccessDeniedException) {
            $this->handleAccessDeniedException($event);
        }
    }

    private function handleAccessDeniedException(ExceptionEvent $exceptionEvent): void
    {
        $token = $this->tokenStorage->getToken();

        if (!($token instanceof TwoFactorToken)) {
            return;
        }

        if ($token->getFirewallName() !== 'main') {
            return;
        }

        $request = $exceptionEvent->getRequest();

        if (
            !$this->httpUtils->checkRequestPath($request, "app_2fa_authenticate_check") &&
            $request->hasSession() &&
            $request->isMethodSafe() &&
            !$request->isXmlHttpRequest()
        ) {
            $this->saveTargetPath($request->getSession(), 'main', $request->getUri());
        }

        // [
        //    "auth_form_path" => "2fa_login"
        //    "check_path" => "2fa_login_check"
        //    "post_only" => true
        //    "always_use_default_target_path" => false
        //    "default_target_path" => "/"
        //    "success_handler" => null
        //    "failure_handler" => null
        //    "authentication_required_handler" => null
        //    "auth_code_parameter_name" => "_auth_code"
        //    "trusted_parameter_name" => "_trusted"
        //    "remember_me_sets_trusted" => false
        //    "multi_factor" => false
        //    "prepare_on_login" => false
        //    "prepare_on_access_denied" => false
        //    "enable_csrf" => false
        //    "csrf_parameter" => "_csrf_token"
        //    "csrf_token_id" => "two_factor"
        //    "provider" => null
        // ]

        $response = $this->httpUtils->createRedirectResponse($request, "app_2fa_authenticate");
        $exceptionEvent->allowCustomResponseCode();
        $exceptionEvent->setResponse($response);
    }
}
