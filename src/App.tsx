import { useEffect, useState } from 'react';
import { getExpenses } from './services/expenseApi';
import type { Expense } from './types/expense';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await getExpenses();
        setExpenses(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch expenses. Is the backend running?');
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <h1>Expense Tracker</h1>
        <p>Loading expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <h1>Expense Tracker</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Expense Tracker</h1>
      <p>Total Expenses: {expenses.length}</p>

      {expenses.length === 0 ? (
        <p>No expenses found. Create one to get started!</p>
      ) : (
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          {expenses.map((expense) => (
            <li key={expense.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <strong>{expense.description}</strong> - ${expense.amount}
              <br />
              <small>Category: {expense.category}</small>
              <br />
              <small>Date: {new Date(expense.expenseDate).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
