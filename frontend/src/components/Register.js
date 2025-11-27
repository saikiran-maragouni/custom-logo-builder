import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Register = ({ onRegister, switchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.register({ username, email, password });
      console.log('Register response:', response);
      
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
        onRegister(data.user);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-site-title">Custom Logo Builder</h1>
      <div className="auth-card">
        <h2>Join Us!</h2>
        <p>Create your account to start designing amazing logos</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? '🔄 Creating account...' : '✨ Create Account'}
          </button>
        </form>
        
        <p className="auth-switch">
          Already have an account?{' '}
          <button onClick={switchToLogin} className="link-btn">
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;