<?php

namespace App\Service\Sms;

use Symfony\Component\Notifier\Exception\UnsupportedSchemeException;
use Symfony\Component\Notifier\Transport\AbstractTransportFactory;
use Symfony\Component\Notifier\Transport\Dsn;
use Symfony\Component\Notifier\Transport\TransportInterface;

class SmsPartnerTransportFactory extends AbstractTransportFactory
{
    protected function getSupportedSchemes(): array
    {
        return ['smspartner'];
    }

    public function create(Dsn $dsn): TransportInterface
    {
        $scheme = $dsn->getScheme();

        if ($scheme !== 'smspartner') {
            throw new UnsupportedSchemeException($dsn, 'smspartner', $this->getSupportedSchemes());
        }

        $authToken = $this->getPassword($dsn);
        $from = $dsn->getRequiredOption('from');
        $host = $dsn->getHost() === 'default' ? null : $dsn->getHost();
        $port = $dsn->getPort();

        return (new SmsTransportTransport($authToken, $from, $this->client))->setHost($host)->setPort($port);
    }
}