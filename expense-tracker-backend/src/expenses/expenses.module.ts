import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExpensesResolver } from './expenses.resolver';
import { ExpensesService } from './expenses.service';
import  Expense  from './models/expense.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Expense]),
  ],
  providers: [
    ExpensesResolver, 
    ExpensesService,
  ],
})
export class ExpensesModule {}