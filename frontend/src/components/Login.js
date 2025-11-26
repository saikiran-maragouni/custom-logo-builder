import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin, switchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { username });
      const response = await authAPI.login({ username, password });
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLogin(response.data.user);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      let errorMsg = 'Login failed. Please try again.';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data) {
        errorMsg = typeof error.response.data === 'string' ? error.response.data : 'Login failed';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back!</h2>
        <p>Sign in to access your logo designs</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? '🔄 Signing in...' : '🚀 Sign In'}
          </button>
        </form>
        
        <p className="auth-switch">
          Don't have an account?{' '}
          <button onClick={switchToRegister} className="link-btn">
            Create one here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;