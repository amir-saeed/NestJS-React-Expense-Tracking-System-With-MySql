export const categories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Housing',
  'Travel',
  'Education',
  'Personal',
  'Other'
];


export interface ExpenseFormData {
  title: string;
  amount: string;
  category: string;
  description: string;
}

export interface ExpenseData {
  expense: {
    id: string;
    title: string;
    amount: number;
    category: string | null;
    description: string | null;
  };
}


export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string | null;
  description: string | null;
  createdAt: string;
}

export interface ExpensesData {
  expenses: {
    expenses: Expense[];
    total: number;
  };
}