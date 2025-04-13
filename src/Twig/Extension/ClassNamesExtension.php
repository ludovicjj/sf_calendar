<?php

namespace App\Twig\Extension;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ClassNamesExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('class_names', [$this, 'classNames']),
        ];
    }

    public function classNames(array $classes): string
    {
        $classList = [];

        foreach ($classes as $class => $condition) {
            if (is_int($class)) {
                $classList[] = $condition; // Si c'est juste une classe sans condition
            } elseif ($condition) {
                $classList[] = $class;
            }
        }

        return implode(' ', $classList);
    }
}
