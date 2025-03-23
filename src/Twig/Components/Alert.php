<?php

namespace App\Twig\Components;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent]
class Alert
{
    public string $message;

    public string $icon = 'success';

    public string $color = 'bg-green-400';
}