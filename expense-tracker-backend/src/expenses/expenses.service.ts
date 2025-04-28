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

  async findAll(filter?: ExpenseFilterInput): Promise<{ expenses: Expense[]; total: number }> {
    const where: WhereOptions<Expense> = {};

    if (filter) {
      if (filter.title) {
        where.title = { [Op.like]: `%${filter.title}%` };
      }
      if (filter.category) {
        where.category = filter.category;
      }

      if (filter.minAmount !== undefined || filter.maxAmount !== undefined) {
        where.amount = {};
        if (filter.minAmount !== undefined) {
          where.amount[Op.gte] = filter.minAmount;
        }
        if (filter.maxAmount !== undefined) {
          where.amount[Op.lte] = filter.maxAmount;
        }
      }

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

    const orderBy = filter?.orderBy || 'createdAt';
    const order = filter?.order || 'DESC';
    const limit = filter?.limit || 10;
    const offset = filter?.offset || 0;

    const validOrderFields = ['title', 'amount', 'category', 'createdAt'];
    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    const total = await this.expenseModel.count({ where });

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

  async create(createExpenseInput: CreateExpenseInput): Promise<Expense> {
    return this.expenseModel.create(createExpenseInput as any);
  }

  async update(updateExpenseInput: UpdateExpenseInput): Promise<Expense> {
    const { id, ...updateData } = updateExpenseInput;
    const expense = await this.expenseModel.findByPk(id);

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    await this.expenseModel.update(updateData, {
      where: { id }
    });

    const updatedExpense = await this.expenseModel.findByPk(id, { raw: true });

    if (!updatedExpense) {
      throw new Error(`Failed to retrieve updated expense with ID ${id}`);
    }

    return updatedExpense;
  }

  async remove(id: string): Promise<boolean> {
    const expense = await this.expenseModel.findByPk(id);

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    const deleted = await this.expenseModel.destroy({
      where: { id }
    });

    return deleted > 0;
  }

  async getStatistics(): Promise<{
    totalExpenses: number;
    totalAmount: number;
    avgAmount: number;
    categoryBreakdown: { category: string; count: number; totalAmount: number }[];
  }> {

    const totalExpenses = await this.expenseModel.count();
    const totalAmountResult = await this.expenseModel.sum('amount');
    const totalAmount = totalAmountResult || 0;

    const avgAmount = totalExpenses > 0 ? totalAmount / totalExpenses : 0;


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