<?php

namespace App\Factory;

use App\Exception\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;

class ErrorsValidationFactory
{
    /**
     * @throws ValidationException
     */
    public static function handle(ConstraintViolationListInterface $constraintViolationList): void
    {
        if (count($constraintViolationList) > 0) {
            $errors = [];
            /** @var ConstraintViolationInterface $constraint */
            foreach ($constraintViolationList as $constraint) {
                $errors[$constraint->getPropertyPath()][] = $constraint->getMessage();
            }

            throw new ValidationException(
                'unprocessable_entity',
                Response::HTTP_UNPROCESSABLE_ENTITY,
                $errors
            );
        }
    }
}
