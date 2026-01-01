import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/JoinQueueForm.css';
import { useParams, useNavigate } from 'react-router-dom';

const JoinQueueForm = () => {
  const { id: businessId } = useParams(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    business_id: businessId || '' 
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [queueInfo, setQueueInfo] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBusinessInfo = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/businesses/${businessId}`);
      setBusinessInfo(response.data);
    } catch (error) {
      console.error('Error fetching business info:', error);
      setError('Failed to load business information');
    }
  }, [businessId]);

   useEffect(() => {
    if (businessId) {
      fetchBusinessInfo();
    }
  }, [businessId, fetchBusinessInfo])

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

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // If no business_id in URL, we need to handle this case
    if (!formData.business_id) {
      setError('Please select a business first');
      setLoading(false);
      return;
    }

    try {
      // Send data to backend API
      const response = await axios.post('http://localhost:5000/api/queue', {
        business_id: formData.business_id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        service_name: formData.service,
        date: formData.date,
        time: formData.time
      });

      // Set confirmation data
      setQueueInfo({
        position: response.data.position,
        customerName: formData.name,
        service: formData.service,
        estimatedTime: `${response.data.estimatedWaitTime} minutes`,
        queueId: response.data.queueId
      });

      setShowConfirmation(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        business_id: formData.business_id // Keep business_id
      });
    } catch (error) {
      console.error('Error joining queue:', error);
      setError(error.response?.data?.error || 'Failed to join queue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Queue joining confirmation message
  if (showConfirmation && queueInfo) {
    return (
      <div className="confirmation-message">
        <div className="confirmation-content">
          <div className="success-icon">✅</div>
          <h3>Successfully Joined Queue!</h3>
          
          {businessInfo && (
            <div className="business-info">
              <h4>{businessInfo.business_name}</h4>
              <p>{businessInfo.address}, {businessInfo.city}</p>
            </div>
          )}

          <div className="queue-details">
            <p><strong>Name:</strong> {queueInfo.customerName}</p>
            <p><strong>Service:</strong> {queueInfo.service}</p>
            <p><strong>Your Position:</strong> #{queueInfo.position}</p>
            <p><strong>Estimated Wait:</strong> {queueInfo.estimatedTime}</p>
            <p><strong>Queue ID:</strong> {queueInfo.queueId}</p>
          </div>

          <div className="confirmation-buttons">
            <button 
              className="view-queue-btn"
              onClick={() => navigate(`/business/${businessId}`)}
            >
              View Business Page
            </button>
            <button 
              className="back-btn"
              onClick={() => {
                setShowConfirmation(false);
                setQueueInfo(null);
              }}
            >
              Join Another Queue
            </button>
          </div>

          <div className="queue-tips">
            <p>💡 <strong>Tips:</strong></p>
            <ul>
              <li>Arrive 5 minutes before your estimated time</li>
              <li>Bring any required documents or items</li>
              <li>Check your email for queue updates</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-queue-form-container">
      {businessInfo && (
        <div className="business-header">
          <h2>Join Queue at {businessInfo.business_name}</h2>
          <p className="business-location">
            📍 {businessInfo.address}, {businessInfo.city}
          </p>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="join-queue-form" onSubmit={handleSubmit}>
        {!businessId && (
          <div className="form-group">
            <label htmlFor="business_id">Business *</label>
            <select
              id="business_id"
              name="business_id"
              value={formData.business_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a business</option>
              {/* You could fetch and list businesses here */}
              <option value="1">Example Business 1</option>
              <option value="2">Example Business 2</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
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
          <label htmlFor="service">Service *</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            <option value="haircut">Haircut</option>
            <option value="manicure">Manicure</option>
            <option value="massage">Massage</option>
            <option value="consultation">Consultation</option>
            <option value="other">Other Service</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]} // Can't select past dates
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time *</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-notes">
          <p>Fields marked with * are required</p>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Joining Queue...' : 'Join Queue'}
        </button>
      </form>
    </div>
  );
};

export default JoinQueueForm;