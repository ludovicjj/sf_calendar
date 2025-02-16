<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\ColorType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => "Nom de l'événement"
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Commentaire',
                'label_html' => true
            ])
            ->add('startAt', DateTimeType::class, [
                'label' => "Date de début",
                'widget' => 'single_text',
                'format' => 'dd-MM-yyyy HH:mm',
                'html5' => false,
            ])
            ->add('endAt', DateTimeType::class, [
                'label' => "Date de fin",
                'widget' => 'single_text',
                'format' => 'dd-MM-yyyy HH:mm',
                'html5' => false,
            ])
            ->add('type', ChoiceType::class, [
                'label' => false,
                'choices' => [
                    '#3788d8' => 'blue',
                    '#74b057' => 'green',
                    '#ff5858' => 'red',
                    '#fcd34d' => 'yellow',
                    '#9ca3af' => 'gray'
                ],
                'expanded' => true,
                'multiple' => false,
            ])
            ->add('fullDay', CheckboxType::class, [
                'label' => "fullday",
                'required' => false
            ]);
    }

    public function getBlockPrefix(): string
    {
        return '';
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'csrf_protection' => false
        ]);
    }
}