import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Expense from '../expenses/models/expense.model';

@Injectable()
export class DatabaseMigrationService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseMigrationService.name);

  constructor(
    @InjectModel(Expense)
    private expenseModel: typeof Expense,
  ) {}

  async onModuleInit() {
    await this.fixNullTitles();
  }

  /**
   * Fix any expense records with null titles
   */
  async fixNullTitles() {
    try {
      this.logger.log('Checking for expense records with null titles...');
      
      // Find all expenses with null titles
      const expensesWithNullTitles = await this.expenseModel.findAll({
        where: {
          title: null
        }
      });
      
      if (expensesWithNullTitles.length === 0) {
        this.logger.log('No expenses with null titles found.');
        return;
      }
      
      this.logger.log(`Found ${expensesWithNullTitles.length} expenses with null titles. Fixing...`);
      
      // Update all expenses with null titles to have a default title
      for (const expense of expensesWithNullTitles) {
        await expense.update({ 
          title: `Untitled Expense (ID: ${expense.id.substring(0, 8)})` 
        });
      }
      
      this.logger.log('Successfully fixed expenses with null titles.');
    } catch (error) {
      this.logger.error('Error fixing expense records with null titles:', error);
    }
  }
}