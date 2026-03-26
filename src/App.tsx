import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Profile } from './pages/Profile';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import './App.css';

function App() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Determine initial page based on URL
  const [currentPage] = useState(() => {
    const path = window.location.pathname;
    const search = window.location.search;

    if (path === '/forgot-password') return 'forgot-password';
    if (path === '/reset-password' || search.includes('token=')) return 'reset-password';
    if (path === '/profile') return 'profile';
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

  // Show profile page
  if (currentPage === 'profile') {
    return <Profile />;
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
    setRefreshKey((prev) => prev + 1); // Refresh expense list
  };

  const handleCancel = () => {
    setShowForm(false);
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
            editExpense={null}
          />
        )}

        {/* Separator between form and expense list */}
        <div style={{
          borderTop: '2px solid #333',
          marginTop: showForm ? '30px' : '0px',
          marginBottom: '30px',
        }} />

        <ExpenseList key={refreshKey} />
      </div>

      <footer
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '20px',
          marginTop: '40px',
          borderTop: '2px solid #333',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <button
          onClick={() => (window.location.pathname = '/profile')}
          style={{
            padding: '10px 40px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Profile
        </button>
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
