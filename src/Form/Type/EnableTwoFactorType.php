<?php

namespace App\Form\Type;

use App\Entity\User;
use App\Security\Generator\TotpGenerator;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class EnableTwoFactorType extends AbstractType
{
    public function __construct(
        private readonly TotpGenerator $totpGenerator,
    ) {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $currentProvider = $options['current_provider'];

        if ($currentProvider === 'sms') {
            $builder->add('phoneNumber', TelType::class, [
                'label' => 'Numéro de téléphone',
                'constraints' => [
                    new NotBlank(),
                    new Length(min: 10)
                ]
            ]);
        } elseif ($currentProvider === 'email') {
            $builder->add('email', EmailType::class, [
                'label' => 'Adresse email',
                'constraints' => [
                    new NotBlank(),
                    new Email()
                ]
            ]);
        } elseif ($currentProvider === 'totp') {
            $builder->add('totpSecret', HiddenType::class, [
                'data' => $this->totpGenerator->generateSecret(),
            ]);
        }

    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'current_provider' => null,
        ]);
    }
}