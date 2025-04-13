<?php

namespace App\Twig\Components;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent]
class Menu
{
    public function __construct(private readonly RequestStack $requestStack)
    {
    }

    public bool $open = false;

    public array $links = [
        [
            'label' => 'Calendrier',
            'route' => 'app_dashboard',
            'icon' => 'ion:calendar-outline'
        ]
    ];

    public function mount(): void
    {
        $request = $this->requestStack->getMainRequest();

        if(!$request) {
            return;
        }
        $this->open = true;

//        $session = $request->getSession();
//
//        $this->open = $session->get('menu_state', false);
    }
}