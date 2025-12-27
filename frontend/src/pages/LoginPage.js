import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuthPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      
      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to home or previous page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="form-header">
            <h1>Welcome Back</h1>
            <p>Login to manage your account</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-auth"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="form-links">
              <Link to="/forgot-password">Forgot password?</Link>
              <p>
                Don't have an account?{' '}
                <Link to="/register">Sign up</Link>
              </p>
            </div>
          </form>

          <div className="auth-divider">
            <span>Or login as</span>
          </div>

          <div className="alternative-login">
            <Link to="/business/login" className="btn btn-secondary">
              Business Account
            </Link>
          </div>
        </div>

        <div className="auth-info-section">
          <div className="info-content">
            <h2>Join LineUp Today</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">🎯</span>
                <div>
                  <h4>Join Queues Faster</h4>
                  <p>Skip the line with virtual queuing</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📱</span>
                <div>
                  <h4>Mobile Notifications</h4>
                  <p>Get real-time queue updates</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">💼</span>
                <div>
                  <h4>Register Your Business</h4>
                  <p>Manage queues efficiently</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;