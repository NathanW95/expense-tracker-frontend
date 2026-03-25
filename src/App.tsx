import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import type { Expense } from './types/expense';
import './App.css';

function App() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Determine initial page based on URL
  const [currentPage] = useState(() => {
    const path = window.location.pathname;
    const search = window.location.search;

    if (path === '/forgot-password') return 'forgot-password';
    if (path === '/reset-password' || search.includes('token=')) return 'reset-password';
    return 'login';
  });

  if (isLoading) {
    return (
      <div className="app">
        <h1>Expense Tracker</h1>
        <p>Loading...</p>
      </div>
    );
  }

  // Show forgot password page
  if (currentPage === 'forgot-password') {
    return <ForgotPassword />;
  }

  // Show reset password page
  if (currentPage === 'reset-password') {
    return <ResetPassword />;
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <h1>Expense Tracker</h1>
        {showRegister ? (
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExpense(null);
    setRefreshKey((prev) => prev + 1); // Refresh expense list
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleLogout = () => {
    logout();
    setShowRegister(false); // Always return to login page
  };

  return (
    <div className="app">
      <header style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '30px',
        padding: '20px 20px 30px 20px',
        borderBottom: '2px solid #333',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: 0, color: 'white' }}>Expense Tracker</h1>
          <p style={{ margin: '5px 0 0 0', color: '#888' }}>
            Welcome, {user?.firstName} {user?.lastName}!
          </p>
          <p style={{ margin: '5px 0 5px 0', color: '#666', fontSize: '14px' }}>
            ({user?.role})
          </p>
        </div>
      </header>

      <div style={{ width: '100%', maxWidth: '1200px', flex: 1 }}>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginBottom: '30px',
              fontSize: '16px',
            }}
          >
            Create New Expense
          </button>
        )}

        {showForm && (
          <ExpenseForm
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
            editExpense={editingExpense}
          />
        )}

        {/* Separator between form and expense list */}
        <div style={{
          borderTop: '2px solid #333',
          marginTop: showForm ? '30px' : '0px',
          marginBottom: '30px',
        }} />

        <ExpenseList key={refreshKey} onEdit={handleEdit} />
      </div>

      <footer style={{
        width: '100%',
        maxWidth: '1200px',
        padding: '20px',
        marginTop: '40px',
        borderTop: '2px solid #333',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 40px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Logout
        </button>
      </footer>
    </div>
  );
}

export default App;
