export interface Expense {
    id: number;
    description: string | null;
    category: string | null;
    amount: number;
    expenseDate: string | null;
    dateAdded: string | null;
    userId: number;
    userFirstName: string;
    userLastName: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    teamId: number | null;
    receiptUrl: string | null;
}

export interface ExpenseRequest {
    description: string;
    category: string;
    amount: number;
    expenseDate: string;
    receiptUrl?: string | null;
}