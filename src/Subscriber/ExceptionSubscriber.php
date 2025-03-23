<?php

namespace App\Subscriber;

use App\Exception\ValidationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        // return the subscribed events, their methods and priorities
        return [
            KernelEvents::EXCEPTION => [
                ['processException', 10],
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
}
