<?php

namespace App\Service\Sms;

use SensitiveParameter;
use Symfony\Component\Notifier\Exception\TransportException;
use Symfony\Component\Notifier\Exception\UnsupportedMessageTypeException;
use Symfony\Component\Notifier\Message\MessageInterface;
use Symfony\Component\Notifier\Message\SentMessage;
use Symfony\Component\Notifier\Message\SmsMessage;
use Symfony\Component\Notifier\Transport\AbstractTransport;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Exception;

class SmsTransportTransport extends AbstractTransport
{
    protected const HOST = 'http://api.smspartner.fr/v1/send';

    public function __construct(
        #[SensitiveParameter] private readonly string $authToken,
        private readonly string $from,
        ?HttpClientInterface $client = null,
    ) {
        parent::__construct($client);
    }

    /**
     * @param MessageInterface $message
     * @return SentMessage
     * @throws Exception
     */
    protected function doSend(MessageInterface $message): SentMessage
    {
        if (!$message instanceof SmsMessage) {
            throw new UnsupportedMessageTypeException(__CLASS__, SmsMessage::class, $message);
        }

        $from = $message->getFrom() ?: $this->from;
        $endpoint = $this->getEndpoint();
        $body = [
            'sender' => $from,
            'gamme' => 1,
            'phoneNumbers' => $message->getPhone(),
            'message' => $message->getSubject(),
            'apiKey' => $this->authToken,
        ];

        try {
            $response = $this->client->request('POST', $endpoint, [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'json' => $body,
            ]);
        } catch (TransportExceptionInterface) {
            throw new Exception("Could not reach the remote SMS Partner server.");
        }

        try {
            $statusCode = $response->getStatusCode();
        } catch (TransportExceptionInterface $exception) {
            throw new TransportException(
                "Could not reach the remote SMS Partner server.",
                $response,
                0,
                $exception
            );
        }

        if ($statusCode !== 200) {
            throw new TransportException("Could not reach the remote SMS Partner server.", $response);
        };

        return new SentMessage($message, (string) $this);
    }

    public function __toString(): string
    {
        return sprintf('smspartner://%s?from=%s', $this->getEndpoint(), $this->from);
    }

    public function supports(MessageInterface $message): bool
    {
        return $message instanceof SmsMessage;
    }
}