export interface Expense {
    id: number;
    description: string;
    category: string;
    amount: number;
    expenseDate: string;
    dateAdded: string;
}

export interface ExpenseRequest {
    description: string;
    category: string;
    amount: number;
    expenseDate: string;
}