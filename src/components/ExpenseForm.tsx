import { useState } from 'react';
import { createExpense, updateExpense } from '../services/expenseApi';
import type { ExpenseRequest, Expense } from '../types/expense';

interface ExpenseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editExpense?: Expense | null;
}

export function ExpenseForm({ onSuccess, onCancel, editExpense }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseRequest>({
    description: editExpense?.description || '',
    category: editExpense?.category || '',
    amount: editExpense?.amount || 0,
    expenseDate: editExpense?.expenseDate
      ? new Date(editExpense.expenseDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Food', 'Travel', 'Equipment', 'Entertainment', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editExpense) {
        // Update existing expense
        await updateExpense(editExpense.id, {
          ...formData,
          expenseDate: new Date(formData.expenseDate).toISOString(),
        });
      } else {
        // Create new expense
        await createExpense({
          ...formData,
          expenseDate: new Date(formData.expenseDate).toISOString(),
        });
      }
      onSuccess();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          `Failed to ${editExpense ? 'update' : 'create'} expense`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        border: '1px solid #333',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <h3 style={{ color: 'white', marginTop: 0 }}>
        {editExpense ? 'Edit Expense' : 'Create New Expense'}
      </h3>

      {error && (
        <div
          style={{
            color: '#ff6b6b',
            backgroundColor: '#2a1a1a',
            border: '1px solid #ff6b6b',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>
            Description *
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            placeholder="e.g., Team lunch at restaurant"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>
            Amount ($) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            placeholder="0.00"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>
            Expense Date *
          </label>
          <input
            type="date"
            value={formData.expenseDate}
            onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '12px 30px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating...' : editExpense ? 'Update Expense' : 'Create Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
