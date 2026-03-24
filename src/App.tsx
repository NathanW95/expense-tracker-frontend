import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import './App.css';

function App() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) {
    return (
      <div className="app">
        <h1>Expense Tracker</h1>
        <p>Loading...</p>
      </div>
    );
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

  return (
    <div className="app">
      <h1>Expense Tracker</h1>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        marginBottom: '30px',
      }}>
        <span>
          Welcome, {user?.firstName} {user?.lastName}! ({user?.role})
        </span>
        <button
          onClick={logout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <p>Expense features coming soon...</p>
    </div>
  );
}

export default App;
