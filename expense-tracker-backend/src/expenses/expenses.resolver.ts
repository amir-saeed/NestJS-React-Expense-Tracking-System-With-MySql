import { Resolver, Query, Mutation, Args, ID, ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ExpensesService } from './expenses.service';
import Expense from './models/expense.model';
import { CreateExpenseInput } from './dto/create-expense.input';
import { UpdateExpenseInput } from './dto/update-expense.input';
import { ExpenseFilterInput } from './dto/expense-filter.input';

@ObjectType()
class CategoryBreakdown {
  @Field()
  category: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  totalAmount: number;
}

@ObjectType()
class ExpenseStatistics {
  @Field(() => Int)
  totalExpenses: number;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => Float)
  avgAmount: number;

  @Field(() => [CategoryBreakdown])
  categoryBreakdown: CategoryBreakdown[];
}

@ObjectType()
class PaginatedExpenses {
  @Field(() => [Expense])
  expenses: Expense[];

  @Field(() => Int)
  total: number;
}

@Resolver(() => Expense)
export class ExpensesResolver {
  constructor(private expensesService: ExpensesService) { }

  @Query(() => PaginatedExpenses, { name: 'expenses' })
  async getExpenses(
    @Args('filter', { nullable: true }) filter?: ExpenseFilterInput,
  ): Promise<PaginatedExpenses> {
    const results = this.expensesService.findAll(filter);
    return results;
  }

  @Query(() => Expense, { name: 'expense' })
  async getExpense(@Args('id', { type: () => ID }) id: string): Promise<Expense> {
    return this.expensesService.findOne(id);
  }

  @Query(() => ExpenseStatistics, { name: 'expenseStatistics' })
  async getExpenseStatistics(): Promise<ExpenseStatistics> {
    return this.expensesService.getStatistics();
  }

  @Mutation(() => Expense, { name: 'createExpense' })
  async createExpense(
    @Args('createExpenseInput') createExpenseInput: CreateExpenseInput,
  ): Promise<Expense> {
    return this.expensesService.create(createExpenseInput);
  }

  @Mutation(() => Expense, { name: 'updateExpense' })
  async updateExpense(
    @Args('updateExpenseInput') updateExpenseInput: UpdateExpenseInput,
  ): Promise<Expense> {
    return this.expensesService.update(updateExpenseInput);
  }

  @Mutation(() => Boolean, { name: 'removeExpense' })
  async removeExpense(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.expensesService.remove(id);
  }
}