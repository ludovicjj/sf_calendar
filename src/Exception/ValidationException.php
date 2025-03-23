<?php

namespace App\Exception;
use Exception;
use Throwable;

class ValidationException extends Exception
{
    public function __construct(
        string                 $message = "",
        int                    $code = 0,
        private readonly array $errors = [],
        ?Throwable             $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}