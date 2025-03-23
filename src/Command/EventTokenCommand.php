<?php

namespace App\Command;

use App\Repository\EventRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Uid\Uuid;

#[AsCommand(
    name: 'app:event-token',
    description: 'Assign a unique token (UUID v4) to all events missing one.',
)]
class EventTokenCommand extends Command
{
    public function __construct(
        private readonly EventRepository $eventRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $events = $this->eventRepository->findAllWithoutToken();
        $count = 0;

        foreach ($events as $event) {
            $token = Uuid::v4();
            $event->setToken($token);
            $count++;
        }

        $this->entityManager->flush();

        $io->success(sprintf('Updated %d events.', $count));

        return Command::SUCCESS;
    }
}
