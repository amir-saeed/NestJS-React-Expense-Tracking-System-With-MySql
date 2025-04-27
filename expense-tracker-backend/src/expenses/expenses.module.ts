import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExpensesResolver } from './expenses.resolver';
import { ExpensesService } from './expenses.service';
import  Expense  from './models/expense.model';

@Module({
  imports: [
    // Register the Expense model with Sequelize
    SequelizeModule.forFeature([Expense]),
  ],
  providers: [
    ExpensesResolver, // GraphQL resolver
    ExpensesService,  // Service layer
  ],
})
export class ExpensesModule {}