import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import Expense from './models/expense.model';
import { CreateExpenseInput } from './dto/create-expense.input';
import { UpdateExpenseInput } from './dto/update-expense.input';
import { ExpenseFilterInput } from './dto/expense-filter.input';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense)
    private expenseModel: typeof Expense,
  ) { }

  // Get all expenses with optional filtering
  async findAll(filter?: ExpenseFilterInput): Promise<{ expenses: Expense[]; total: number }> {
    const where: WhereOptions<Expense> = {};

    // Apply filters if provided
    if (filter) {
      // Title filter (case-insensitive partial match)
      if (filter.title) {
        where.title = { [Op.like]: `%${filter.title}%` };
      }

      // Category filter (exact match)
      if (filter.category) {
        where.category = filter.category;
      }

      // Amount range filter
      if (filter.minAmount !== undefined || filter.maxAmount !== undefined) {
        where.amount = {};
        if (filter.minAmount !== undefined) {
          where.amount[Op.gte] = filter.minAmount;
        }
        if (filter.maxAmount !== undefined) {
          where.amount[Op.lte] = filter.maxAmount;
        }
      }

      // Date range filter
      if (filter.startDate || filter.endDate) {
        where.createdAt = {};
        if (filter.startDate) {
          where.createdAt[Op.gte] = filter.startDate;
        }
        if (filter.endDate) {
          where.createdAt[Op.lte] = filter.endDate;
        }
      }
    }

    // Default sorting and pagination
    const orderBy = filter?.orderBy || 'createdAt';
    const order = filter?.order || 'DESC';
    const limit = filter?.limit || 10;
    const offset = filter?.offset || 0;

    // Validate orderBy field
    const validOrderFields = ['title', 'amount', 'category', 'createdAt'];
    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    // Get total count for pagination
    const total = await this.expenseModel.count({ where });

    // Get paginated results
    const expenses = await this.expenseModel.findAll({
      where,
      order: [[orderBy, order]],
      limit,
      offset,
      raw: true,
    });

    console.log('Expenses:', expenses);

    return { expenses, total };
  }

  // Get expense by ID
  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findByPk(
      id,
      {
        raw: true,
      });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  // Create a new expense
  async create(createExpenseInput: CreateExpenseInput): Promise<Expense> {
    return this.expenseModel.create(createExpenseInput as any);
  }

  // Update an expense
  async update(updateExpenseInput: UpdateExpenseInput): Promise<Expense> {
    const { id, ...updateData } = updateExpenseInput;

    // First check if the expense exists
    const expense = await this.expenseModel.findByPk(id);

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Update the expense using the model's update method
    await this.expenseModel.update(updateData, {
      where: { id }
    });

    // Return the updated expense
    const updatedExpense = await this.expenseModel.findByPk(id, { raw: true });

    // This check is needed to satisfy TypeScript
    if (!updatedExpense) {
      throw new Error(`Failed to retrieve updated expense with ID ${id}`);
    }

    return updatedExpense;
  }

  // Delete an expense
  async remove(id: string): Promise<boolean> {
    // First check if the expense exists
    const expense = await this.expenseModel.findByPk(id);

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Delete the expense using the model's destroy method
    const deleted = await this.expenseModel.destroy({
      where: { id }
    });

    return deleted > 0;
  }

  // Get expense statistics
  async getStatistics(): Promise<{
    totalExpenses: number;
    totalAmount: number;
    avgAmount: number;
    categoryBreakdown: { category: string; count: number; totalAmount: number }[];
  }> {
    // Get total expenses and amount
    const totalExpenses = await this.expenseModel.count();
    const totalAmountResult = await this.expenseModel.sum('amount');
    const totalAmount = totalAmountResult || 0;

    // Calculate average expense amount
    const avgAmount = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

    // Get category breakdown
    const sequelize = this.expenseModel.sequelize as any;
    const categoryResults = await this.expenseModel.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      ],
      where: {
        category: { [Op.not]: null },
      },
      group: ['category'],
      raw: true,
    });

    const categoryBreakdown = categoryResults.map((result: any) => ({
      category: result.category || 'Uncategorized',
      count: parseInt(result.count, 10),
      totalAmount: parseFloat(result.totalAmount),
    }));

    return {
      totalExpenses,
      totalAmount,
      avgAmount,
      categoryBreakdown,
    };
  }
}