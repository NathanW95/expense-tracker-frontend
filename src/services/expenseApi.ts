import axios from 'axios';
import type { Expense, ExpenseRequest } from '../types/expense';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getExpenses = async (): Promise<Expense[]> => {
  const response = await api.get<Expense[]>('/expenses/');
  return response.data;
};

export const getExpenseById = async (id: number): Promise<Expense> => {
  const response = await api.get<Expense>(`/expenses/${id}`);
  return response.data;
};

export const createExpense = async (
  expense: ExpenseRequest
): Promise<Expense> => {
  const response = await api.post<Expense>('/expenses/', expense);
  return response.data;
};

export const updateExpense = async (
  id: number,
  expense: ExpenseRequest
): Promise<Expense> => {
  const response = await api.put<Expense>(`/expenses/${id}`, expense);
  return response.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};


export const getTotalAmount = async (): Promise<number> => {
  const response = await api.get<number>('/expenses/total-amount/');
  return response.data;
};


export const getTotalAmountByCategory = async (
  category: string
): Promise<number> => {
  const response = await api.get<number>(`/expenses/total-amount/${category}`);
  return response.data;
};

export const getExpensesByCategory = async (
  category: string
): Promise<Expense[]> => {
  const response = await api.get<Expense[]>(`/expenses/category/${category}`);
  return response.data;
};

export const getAverageAmountByCategory = async (
  category: string
): Promise<number> => {
  const response = await api.get<number>(`/expenses/average-amount/${category}`);
  return response.data;
};
