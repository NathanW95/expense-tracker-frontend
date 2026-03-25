import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { resetPassword } from '../services/authApi';
import type { ResetPasswordRequest } from '../types/auth';

export function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Extract token from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setIsLoading(true);

    try {
      const request: ResetPasswordRequest = {
        token,
        newPassword: formData.newPassword,
      };
      const response = await resetPassword(request);
      setSuccess(response.message || 'Password reset successful! Redirecting to login...');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        error.response?.data?.message ||
          error.message ||
          'Failed to reset password. The link may have expired.'
      );
      console.error('Reset password error:', err);
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
          Reset Password
        </h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="newPassword"
              style={{ display: 'block', marginBottom: '5px', color: 'white' }}
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
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
              placeholder="At least 8 characters"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="confirmPassword"
              style={{ display: 'block', marginBottom: '5px', color: 'white' }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              placeholder="Re-enter your password"
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
            disabled={isLoading || !token}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading || !token ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: isLoading || !token ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', color: '#888' }}>
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
