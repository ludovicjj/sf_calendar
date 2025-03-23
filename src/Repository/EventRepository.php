<?php

namespace App\Repository;

use App\Entity\Event;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Event>
 */
class EventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }

    public function findAllWithoutToken(): array
    {
        $qb = $this->createQueryBuilder('e');
        $qb->andWhere($qb->expr()->isNull('e.token'));

        return $qb->getQuery()->getResult();
    }
}
