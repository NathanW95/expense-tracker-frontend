import { useState, useEffect, useCallback } from 'react';
import { getExpenses, deleteExpense, approveExpense, getAllExpensesAdmin } from '../services/expenseApi';
import type { Expense } from '../types/expense';
import { useAuth } from '../hooks/useAuth';

interface ExpenseListProps {
  onEdit?: (expense: Expense) => void;
}

export function ExpenseList({ onEdit }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'my' | 'team' | 'all'>('my');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [teamFilter, setTeamFilter] = useState<number | 'ALL'>('ALL');
  const [personFilter, setPersonFilter] = useState<number | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'status' | 'date' | 'amount'>('status');
  const { user } = useAuth();

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Expense[];
      if (view === 'all' && user?.role === 'ADMIN') {
        // Use admin endpoint for "All Expenses"
        data = await getAllExpensesAdmin();
      } else if (view === 'my') {
        // Explicitly request user's own expenses
        // For MANAGER: need ?view=personal (default is team!)
        // For USER/ADMIN: no param works
        data = user?.role === 'MANAGER' ? await getExpenses('personal') : await getExpenses();
      } else if (view === 'team') {
        // Explicitly request team expenses
        data = await getExpenses('team');
      } else {
        // Fallback
        data = await getExpenses();
      }

      setExpenses(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [view, user?.role]);

  useEffect(() => {
    loadExpenses();
  }, [view, loadExpenses]);

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

  if (initialLoad && loading) {
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
      <h2 style={{ color: 'white', marginBottom: '20px' }}>
        {view === 'my' ? 'My Expenses' : view === 'team' ? 'Team Expenses' : 'All Expenses'}
      </h2>

      {/* View Tabs (Managers & Admins) */}
      {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          borderBottom: '2px solid #333',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => setView('my')}
            style={{
              padding: '10px 20px',
              backgroundColor: view === 'my' ? '#4CAF50' : 'transparent',
              color: 'white',
              border: 'none',
              borderBottom: view === 'my' ? '3px solid #4CAF50' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            My Expenses
          </button>

          {user?.role === 'MANAGER' && (
            <button
              onClick={() => setView('team')}
              style={{
                padding: '10px 20px',
                backgroundColor: view === 'team' ? '#4CAF50' : 'transparent',
                color: 'white',
                border: 'none',
                borderBottom: view === 'team' ? '3px solid #4CAF50' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Team Expenses
            </button>
          )}

          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setView('all')}
              style={{
                padding: '10px 20px',
                backgroundColor: view === 'all' ? '#4CAF50' : 'transparent',
                color: 'white',
                border: 'none',
                borderBottom: view === 'all' ? '3px solid #4CAF50' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              All Expenses
            </button>
          )}
        </div>
      )}

      {/* Filter & Sort Box */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
      }}>
        {/* Row 1: Filters */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#888' }}>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Filter by Team (Admin only, NOT in My view) */}
          {user?.role === 'ADMIN' && view !== 'my' && (() => {
            const uniqueTeams = Array.from(
              new Set(
                expenses
                  .filter(e => e.teamId && e.teamName)
                  .map(e => JSON.stringify({ id: e.teamId, name: e.teamName }))
              )
            ).map(str => JSON.parse(str));

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', color: '#888' }}>Filter by Team:</label>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">All Teams</option>
                  {uniqueTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            );
          })()}

          {/* Filter by User (Admin/Manager in team/all views) */}
          {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && view !== 'my' && (() => {
            const uniqueUsers = Array.from(
              new Set(
                expenses
                  .filter(e => e.userId && e.submitterName)
                  .map(e => JSON.stringify({ id: e.userId, name: e.submitterName }))
              )
            ).map(str => JSON.parse(str));

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', color: '#888' }}>Filter by User:</label>
                <select
                  value={personFilter}
                  onChange={(e) => setPersonFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">All Users</option>
                  {uniqueUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            );
          })()}
        </div>

        {/* Row 2: Sort */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#888' }}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'status' | 'date' | 'amount')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="status">Status (Pending First)</option>
              <option value="date">Date (Newest First)</option>
              <option value="amount">Amount (Highest First)</option>
            </select>
          </div>
        </div>
      </div>

      {(() => {
        // Apply status filter
        let filteredExpenses = statusFilter === 'ALL'
          ? expenses
          : expenses.filter(e => e.status === statusFilter);

        // Apply team filter (admin only)
        if (teamFilter !== 'ALL') {
          filteredExpenses = filteredExpenses.filter(e => e.teamId === teamFilter);
        }

        // Apply person filter (admin/manager)
        if (personFilter !== 'ALL') {
          filteredExpenses = filteredExpenses.filter(e => e.userId === personFilter);
        }

        // Apply sorting
        filteredExpenses = [...filteredExpenses].sort((a, b) => {
          if (sortBy === 'status') {
            // PENDING first, then APPROVED, then REJECTED
            const statusOrder = { PENDING: 0, APPROVED: 1, REJECTED: 2 };
            return statusOrder[a.status] - statusOrder[b.status];
          } else if (sortBy === 'date') {
            // Newest first
            return new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime();
          } else if (sortBy === 'amount') {
            // Highest first
            return b.amount - a.amount;
          }
          return 0;
        });

        return filteredExpenses.length === 0 ? (
          <p style={{ color: 'white' }}>No expenses match your filters.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            {filteredExpenses.map((expense) => (
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
                  </div>
                )}
            </div>
          ))}
        </div>
        );
      })()}
    </div>
  );
}
