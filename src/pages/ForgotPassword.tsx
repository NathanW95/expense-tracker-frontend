import { useState } from 'react';
import type { FormEvent } from 'react';
import { forgotPassword } from '../services/authApi';
import type { ForgotPasswordRequest } from '../types/auth';

export function ForgotPassword() {
  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await forgotPassword(formData);
      setSuccess(response.message || 'Password reset email sent! Check your inbox.');
      setFormData({ email: '' });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        error.response?.data?.message ||
          error.message ||
          'Failed to send reset email. Please try again.'
      );
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Expense Tracker</h1>
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '40px',
          backgroundColor: '#1e1e1e',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ marginTop: 0, color: 'white', textAlign: 'center' }}>
          Forgot Password
        </h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: 'white' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '6px',
                color: 'white',
                boxSizing: 'border-box',
              }}
              placeholder="your.email@example.com"
            />
          </div>

          {error && (
            <div
              style={{
                color: '#ff6b6b',
                marginBottom: '15px',
                padding: '12px',
                backgroundColor: '#2a1a1a',
                border: '1px solid #ff6b6b',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                color: '#4CAF50',
                marginBottom: '15px',
                padding: '12px',
                backgroundColor: '#1a2a1a',
                border: '1px solid #4CAF50',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', color: '#888' }}>
          Remember your password?{' '}
          <a
            href="/"
            style={{
              color: '#007bff',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
