<?php

namespace App\Security\Config;

class TwoFactorConfig
{
    private function getConfig(): array
    {
        return [
            'email' => [
                'icon' => 'fontisto:email',
                'title' => 'Email',
                'description' => 'Recevez un code de vérification par email',
                'process' => "Veuillez saisir le code qui vous a été envoyé par email",
                'enable' => "Veuillez saisir une adresse email pour recevoir le code d'authentification par mail",
            ],
            'sms' => [
                'icon' => 'bi:phone',
                'title' => 'SMS',
                'description' => 'Recevez un code de vérification par SMS',
                'process' => "Veuillez saisir le code qui vous a été envoyé par sms",
                'enable' => "Veuillez saisir un numéro de téléphone pour recevoir le code d'authentification par sms",
            ],
            'totp' => [
                'icon' => 'ion:finger-print',
                'title' => 'Authenticator App',
                'description' => 'Utilisez Google Authenticator ou une application similaire',
                'process' => "Veuillez saisir votre code depuis Google Authenticator",
                'enable' => "Veuillez scanner le QrCode via Google Authenticator pour obtenir le code de double authentification",
            ]
        ];
    }

    public function getActiveProviderData(array $activeProviders): array
    {
        return array_intersect_key($this->getConfig(), array_flip($activeProviders));
    }

    public function getSelectedProviderData(string $selectedProvider): string
    {
        $config = $this->getConfig();
        $defaultMessage = "Veuillez saisir votre code en fonction de la méthode d'authentification sélectionnée précédemment.";

        if(!isset($config[$selectedProvider])) {
            return $defaultMessage;
        }

        return $config[$selectedProvider]['process'];
    }

    public function getEnableProviderData(string $selectedProvider): string
    {
        $config = $this->getConfig();

        if(!isset($config[$selectedProvider])) {
            return '';
        }

        return $config[$selectedProvider]['enable'];
    }
}