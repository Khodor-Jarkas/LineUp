// pages/BusinessRegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/BusinessRegisterPage.css'; // You'll need to create this CSS

const BusinessRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    business_type: 'salon',
    owner_name: '',
    phone: '',
    address: '',
    city: '',
    state: ''
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
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // This should create both user account AND business in one go
      const response = await axios.post('http://localhost:5000/api/business/register-complete', {
        business_name: formData.business_name,
        email: formData.email,
        password: formData.password,
        business_type: formData.business_type,
        owner_name: formData.owner_name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state
      });

      // Save token and business data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('business', JSON.stringify(response.data.business));
      
      alert('Business account created successfully!');
      navigate(`/business/dashboard/${response.data.business.id}`);
      
    } catch (error) {
      console.error('Business registration error:', error);
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    { value: 'salon', label: '💇 Hair Salon / Barber' },
    { value: 'restaurant', label: '🍽️ Restaurant / Cafe' },
    { value: 'clinic', label: '🏥 Medical Clinic' },
    { value: 'retail', label: '🛍️ Retail Store' },
    { value: 'spa', label: '🧖 Spa / Wellness' },
    { value: 'fitness', label: '💪 Fitness Center' },
    { value: 'auto', label: '🚗 Auto Service' },
    { value: 'other', label: '🏢 Other Business' }
  ];

  return (
    <div className="business-register-page">
      <div className="register-container">
        <div className="register-form-section">
          <div className="form-header">
            <h1>Register Your Business</h1>
            <p>Create your business account on LineUp</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="business-register-form">
            <div className="form-section">
              <h3>Business Information</h3>
              
              <div className="form-group">
                <label htmlFor="business_name">Business Name *</label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  required
                  placeholder="Your Business Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="business_type">Business Type *</label>
                <select
                  id="business_type"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  required
                >
                  {businessTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="owner_name">Owner/Manager Name *</label>
                <input
                  type="text"
                  id="owner_name"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Account Details</h3>
              
              <div className="form-group">
                <label htmlFor="email">Business Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="business@example.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="At least 6 characters"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Information</h3>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="123 Main Street"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="New York"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="NY"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-register"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Business Account'}
            </button>

            <div className="form-links">
              <p>
                Already have a business account?{' '}
                <Link to="/business/login">Login here</Link>
              </p>
              <p>
                Want to register as a customer?{' '}
                <Link to="/register">Customer Registration</Link>
              </p>
            </div>
          </form>
        </div>

        <div className="register-info-section">
          <div className="info-content">
            <h2>Why Register Your Business?</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">📊</span>
                <div>
                  <h4>Free Queue Management</h4>
                  <p>Manage customer queues efficiently at no cost</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔔</span>
                <div>
                  <h4>Customer Notifications</h4>
                  <p>Automated SMS/email alerts for your customers</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">⏱️</span>
                <div>
                  <h4>Reduce Wait Times</h4>
                  <p>Improve customer satisfaction with virtual queuing</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📱</span>
                <div>
                  <h4>Mobile Dashboard</h4>
                  <p>Manage your business from anywhere</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">👥</span>
                <div>
                  <h4>Multi-Staff Support</h4>
                  <p>Add multiple staff members to your account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegisterPage;