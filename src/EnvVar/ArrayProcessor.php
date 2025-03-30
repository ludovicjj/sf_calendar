<?php

namespace App\EnvVar;

use Symfony\Component\DependencyInjection\EnvVarProcessorInterface;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

class ArrayProcessor implements EnvVarProcessorInterface
{
    public function getEnv(string $prefix, string $name, \Closure $getEnv): array
    {
        $env = $getEnv($name);

        if (empty($env)) {
            return [];
        }

        return array_map('trim', explode(',', $env));
    }

    public static function getProvidedTypes(): array
    {
        return [
            'array' => 'array',
        ];
    }
}
