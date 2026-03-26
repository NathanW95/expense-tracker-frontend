import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, forgotPassword } from '../services/authApi';

export function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setProfileLoading(true);

    try {
      await updateProfile(profileData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');
    setResetLoading(true);

    try {
      if (!user?.email) {
        setError('User email not found');
        return;
      }
      await forgotPassword({ email: user.email });
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '600px', flex: 1 }}>
        <h2 style={{ color: 'white', marginBottom: '30px', textAlign: 'center' }}>Profile Settings</h2>

        {error && (
          <div
            style={{
              width: '100%',
              color: '#ff6b6b',
              backgroundColor: '#2a1a1a',
              border: '1px solid #ff6b6b',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              width: '100%',
              color: '#4CAF50',
              backgroundColor: '#1a2a1a',
              border: '1px solid #4CAF50',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
            }}
          >
            {success}
          </div>
        )}

        {/* Profile Information Section */}
        <div
          style={{
            backgroundColor: '#1e1e1e',
            padding: '30px',
            borderRadius: '12px',
            width: '100%',
            marginBottom: '30px',
            boxSizing: 'border-box',
          }}
        >
        <h3 style={{ color: 'white', marginTop: 0 }}>Profile Information</h3>
        <form onSubmit={handleProfileUpdate}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
              First Name
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) =>
                setProfileData({ ...profileData, firstName: e.target.value })
              }
              required
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
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
              Last Name
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) =>
                setProfileData({ ...profileData, lastName: e.target.value })
              }
              required
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
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#888',
                boxSizing: 'border-box',
                cursor: 'not-allowed',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
              Team
            </label>
            <input
              type="text"
              value={user?.teamName || 'No team assigned'}
              disabled
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#888',
                boxSizing: 'border-box',
                cursor: 'not-allowed',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
              Role
            </label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#888',
                boxSizing: 'border-box',
                cursor: 'not-allowed',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: profileLoading ? 'not-allowed' : 'pointer',
              opacity: profileLoading ? 0.6 : 1,
            }}
          >
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Reset Password Section */}
      <div
        style={{
          backgroundColor: '#1e1e1e',
          padding: '30px',
          borderRadius: '12px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <h3 style={{ color: 'white', marginTop: 0 }}>Reset Password</h3>
        <p style={{ color: '#ccc', marginBottom: '20px' }}>
          Click the button below to receive a password reset email at <strong>{user?.email}</strong>
        </p>
        <button
          onClick={handleResetPassword}
          disabled={resetLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: resetLoading ? 'not-allowed' : 'pointer',
            opacity: resetLoading ? 0.6 : 1,
          }}
        >
          {resetLoading ? 'Sending Email...' : 'Send Password Reset Email'}
        </button>
      </div>

        <button
          onClick={() => (window.location.pathname = '/')}
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Back to Expenses
        </button>
      </div>
    </div>
  );
}
