<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250227145452 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Rename properties name to title and type to color';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event RENAME COLUMN name TO title');
        $this->addSql('ALTER TABLE event RENAME COLUMN type TO color');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE event RENAME COLUMN title TO name');
        $this->addSql('ALTER TABLE event RENAME COLUMN color TO type');
    }
}
