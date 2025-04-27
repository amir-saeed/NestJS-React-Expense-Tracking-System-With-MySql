import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OnModuleInit } from '@nestjs/common';
import Expense from '../expenses/models/expense.model';

@Injectable()
export class ExpenseSeeder implements OnModuleInit {
    private readonly logger = new Logger(ExpenseSeeder.name);

    constructor(
        @InjectModel(Expense)
        private expenseModel: typeof Expense,
    ) { }

    /**
     * Seed the database with initial expense data
     * This runs automatically when the application starts
     */
    async onModuleInit() {
        try {
            // Only seed if the table is empty
            const count = await this.expenseModel.count();
            if (count > 0) {
                this.logger.log('Database already seeded, skipping...');
                return;
            }

            this.logger.log('Seeding expenses database...');

            // Sample expense data
            const expenses = [
                {
                    title: 'Grocery Shopping',
                    amount: 125.50,
                    category: 'Food',
                    description: 'Weekly grocery shopping at Walmart',
                },
                {
                    title: 'Electricity Bill',
                    amount: 95.20,
                    category: 'Utilities',
                    description: 'Monthly electricity bill for April',
                },
                {
                    title: 'Netflix Subscription',
                    amount: 14.99,
                    category: 'Entertainment',
                    description: 'Monthly Netflix subscription',
                },
                {
                    title: 'Gas',
                    amount: 45.30,
                    category: 'Transportation',
                    description: 'Filled up the car',
                },
                {
                    title: 'Restaurant Dinner',
                    amount: 86.75,
                    category: 'Food',
                    description: 'Dinner with family at Italian restaurant',
                },
                {
                    title: 'Internet Bill',
                    amount: 79.99,
                    category: 'Utilities',
                    description: 'Monthly internet service',
                },
                {
                    title: 'Mobile Phone Bill',
                    amount: 65.00,
                    category: 'Utilities',
                    description: 'Monthly phone bill',
                },
                {
                    title: 'Gym Membership',
                    amount: 50.00,
                    category: 'Health & Fitness',
                    description: 'Monthly gym subscription',
                },
                {
                    title: 'Movie Tickets',
                    amount: 32.50,
                    category: 'Entertainment',
                    description: 'Weekend movie with friends',
                },
                {
                    title: 'Office Supplies',
                    amount: 27.80,
                    category: 'Work',
                    description: 'Notebooks and pens',
                },
                {
                    title: 'Car Insurance',
                    amount: 153.25,
                    category: 'Insurance',
                    description: 'Monthly car insurance premium',
                },
                {
                    title: 'Dog Food',
                    amount: 42.99,
                    category: 'Pets',
                    description: 'Monthly supply of dog food',
                },
            ];

            // Create all expenses
            await this.expenseModel.bulkCreate(expenses);

            this.logger.log(`Successfully seeded ${expenses.length} expenses`);
        } catch (error) {
            this.logger.error('Error seeding database:', error);
        }
    }
}