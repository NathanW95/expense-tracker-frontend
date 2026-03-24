import { useState, useEffect } from 'react';
import { getExpenses, deleteExpense, approveExpense } from '../services/expenseApi';
import type { Expense } from '../types/expense';
import { useAuth } from '../hooks/useAuth';

interface ExpenseListProps {
  onEdit?: (expense: Expense) => void;
}

export function ExpenseList({ onEdit }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const updated = await approveExpense(id, 'APPROVED');
      setExpenses(expenses.map((e) => (e.id === id ? updated : e)));
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to approve expense');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject this expense?')) return;

    try {
      const updated = await approveExpense(id, 'REJECTED');
      setExpenses(expenses.map((e) => (e.id === id ? updated : e)));
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to reject expense');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '#28a745';
      case 'REJECTED':
        return '#dc3545';
      default:
        return '#ffc107';
    }
  };

  if (loading) {
    return <div>Loading expenses...</div>;
  }

  if (error) {
    return (
      <div style={{ color: '#dc3545', marginBottom: '20px' }}>
        <strong>Error:</strong> {error}
        <button onClick={loadExpenses} style={{ marginLeft: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>My Expenses</h2>

      {expenses.length === 0 ? (
        <p style={{ color: 'white' }}>No expenses yet. Create your first one!</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          {expenses.map((expense) => (
            <div
              key={expense.id}
              style={{
                backgroundColor: '#1e1e1e',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
              }}
            >
              {/* Header: Category + Status */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    color: '#888',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  {expense.category}
                </span>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backgroundColor: getStatusColor(expense.status),
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                >
                  {expense.status}
                </span>
              </div>

              {/* Description */}
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  margin: '0 0 8px 0',
                  fontWeight: '600',
                }}
              >
                {expense.description}
              </h3>

              {/* Amount */}
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#4CAF50',
                  marginBottom: '12px',
                }}
              >
                {formatAmount(expense.amount)}
              </div>

              {/* Date */}
              <div
                style={{
                  color: '#888',
                  fontSize: '13px',
                  marginBottom: '12px',
                }}
              >
                {formatDate(expense.expenseDate)}
              </div>

              {/* Submitted By (for managers/admins) */}
              {user?.role !== 'USER' && (
                <div
                  style={{
                    color: '#888',
                    fontSize: '13px',
                    marginBottom: '12px',
                  }}
                >
                  👤 {expense.userFirstName} {expense.userLastName}
                </div>
              )}

              {/* Actions */}
              {expense.userId === user?.id && expense.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    onClick={() => onEdit?.(expense)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Manager/Admin Approve/Reject Buttons */}
              {(user?.role === 'MANAGER' || user?.role === 'ADMIN') &&
                expense.status === 'PENDING' &&
                expense.userId !== user?.id && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={() => handleApprove(expense.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(expense.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
