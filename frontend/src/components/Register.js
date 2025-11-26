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
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onRegister(response.data.user);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
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