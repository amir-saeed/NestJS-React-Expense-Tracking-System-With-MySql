import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseMigrationService } from './database-migration.service';
import Expense from '../expenses/models/expense.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Expense]),
  ],
  providers: [DatabaseMigrationService],
  exports: [DatabaseMigrationService],
})
export class DatabaseMigrationModule {}