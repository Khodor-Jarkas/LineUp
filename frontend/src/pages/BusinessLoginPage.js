import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Add Link import
import axios from 'axios'; // You'll need axios for actual login
import '../styles/BusinessLoginPage.css';

const BusinessLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Add error state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Send login request to your backend
      const response = await axios.post('http://localhost:5000/api/business/login', formData);
      
      // Save token and business data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('business', JSON.stringify(response.data.business));
      
      // Redirect to business dashboard
      navigate(`/business/dashboard/${response.data.business.id}`);
      
    } catch (error) {
      console.error('Business login error:', error);
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="business-login-page">
      <div className="login-container">
        <div className="login-form-section">
          <div className="form-header">
            <h1>Business Login</h1>
            <p>Access your business dashboard</p>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Business Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@business.com"
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
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
            
            <div className="form-footer">
              <Link to="/forgot-password" className="forgot-link">
                Forgot your password?
              </Link>
              <p>
                Don't have an account?{' '}
                <Link to="/business/register" className="signup-link">
                  Register your business
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        <div className="login-info-section">
          <div className="info-content">
            <h2>Manage Your Business Queue</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">📊</span>
                <div>
                  <h4>Real-time Analytics</h4>
                  <p>Track queue performance and customer flow</p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">🔔</span>
                <div>
                  <h4>Smart Notifications</h4>
                  <p>Automatic customer alerts and reminders</p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">⏱️</span>
                <div>
                  <h4>Time Management</h4>
                  <p>Optimize staff scheduling and service times</p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">📱</span>
                <div>
                  <h4>Mobile Friendly</h4>
                  <p>Manage your queue from anywhere</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLoginPage;