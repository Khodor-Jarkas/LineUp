import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CreateBusinessPage.css';

const CreateBusinessPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    email: '',
    category: 'salon'
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
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: '/business/create' } });
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/business/register',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      alert('Business registered successfully!');
      navigate(`/business/manage/${response.data.businessId}`);
    } catch (error) {
      console.error('Error creating business:', error);
      setError(error.response?.data?.error || 'Failed to create business');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'salon', label: '💇 Hair Salon / Barber' },
    { value: 'restaurant', label: '🍽️ Restaurant / Cafe' },
    { value: 'clinic', label: '🏥 Medical Clinic' },
    { value: 'retail', label: '🛍️ Retail Store' },
    { value: 'spa', label: '🧖 Spa / Wellness' },
    { value: 'fitness', label: '💪 Fitness Center' },
    { value: 'auto', label: '🚗 Auto Service' },
    { value: 'other', label: '🏢 Other' }
  ];

  return (
    <div className="create-business-page">
      <div className="container">
        <div className="form-container">
          <div className="form-header">
            <h1>Register Your Business</h1>
            <p>Start managing your queues efficiently</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="business-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="business_name">Business Name *</label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your business name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Business Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your business and services"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Information</h3>
              
              <div className="form-row">
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
                  <label htmlFor="email">Business Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Location</h3>
              
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

                <div className="form-group">
                  <label htmlFor="zip_code">ZIP Code *</label>
                  <input
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    required
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Business'}
              </button>
            </div>
          </form>

          <div className="form-footer">
            <p>
              By registering your business, you agree to our 
              <a href="/terms"> Terms of Service</a> and 
              <a href="/privacy"> Privacy Policy</a>
            </p>
          </div>
        </div>

        <div className="info-sidebar">
          <h3>Benefits of Registering</h3>
          
          <div className="benefit-card">
            <div className="benefit-icon">📊</div>
            <div className="benefit-content">
              <h4>Real-time Analytics</h4>
              <p>Track customer flow and peak hours</p>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">⏱️</div>
            <div className="benefit-content">
              <h4>Reduce Wait Times</h4>
              <p>Optimize your queue management</p>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">📱</div>
            <div className="benefit-content">
              <h4>Mobile Management</h4>
              <p>Manage queues from anywhere</p>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🔔</div>
            <div className="benefit-content">
              <h4>Smart Notifications</h4>
              <p>Automatic customer updates</p>
            </div>
          </div>

          <div className="need-help">
            <h4>Need Help?</h4>
            <p>Contact our business support team:</p>
            <p>📞 1-800-QUEUE-MGMT</p>
            <p>✉️ business@lineup.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBusinessPage;