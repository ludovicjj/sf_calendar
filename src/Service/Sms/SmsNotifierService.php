<?php

namespace App\Service\Sms;

use Exception;
use Symfony\Component\Notifier\Exception\TransportExceptionInterface;
use Symfony\Component\Notifier\Message\SmsMessage;
use Symfony\Component\Notifier\TexterInterface;

readonly class SmsNotifierService
{
    public function __construct(
        private TexterInterface $texter
    ) {
    }

    /**
     * @throws TransportExceptionInterface|Exception
     */
    public function notify(
        string $phoneNumber,
        string $content,
    ): void {
        $sms = new SmsMessage($phoneNumber, $content);
        $this->texter->send($sms);
    }
}