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
      console.log('Login response:', response);
      
      let data;
      if (typeof response.data === 'string') {
        if (response.data.startsWith('<!DOCTYPE') || response.data.startsWith('<html')) {
          throw new Error('Backend server is not responding correctly. Please ensure the backend is running on port 8080.');
        }
        data = JSON.parse(response.data);
      } else {
        data = response.data;
      }
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-site-title">Custom Logo Builder</h1>
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