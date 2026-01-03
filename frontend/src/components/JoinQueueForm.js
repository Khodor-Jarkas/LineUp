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
    date: new Date().toISOString().split('T')[0], // Set today as default
    time: '09:00', // Default time
    business_id: businessId || '' 
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [queueInfo, setQueueInfo] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);

  // Fetch all businesses for dropdown
  const fetchAllBusinesses = useCallback(async () => {
    try {
      setLoadingBusinesses(true);
      const response = await axios.get('http://localhost:5000/api/businesses');
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setError('Failed to load businesses list');
    } finally {
      setLoadingBusinesses(false);
    }
  }, []);

  // Fetch business info if businessId is provided
  const fetchBusinessInfo = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/businesses/${businessId}`);
      setBusinessInfo(response.data);
      // If business has services, set them
      if (response.data.services) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
      setError('Failed to load business information');
    }
  }, [businessId]);

  // Fetch services when business is selected from dropdown
  const fetchServicesForBusiness = useCallback(async (businessId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/businesses/${businessId}`);
      if (response.data.services) {
        setServices(response.data.services);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      // If businessId is in URL, fetch that specific business
      fetchBusinessInfo();
      setFormData(prev => ({ ...prev, business_id: businessId }));
    } else {
      // If no businessId, fetch all businesses for dropdown
      fetchAllBusinesses();
    }
  }, [businessId, fetchBusinessInfo, fetchAllBusinesses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({ 
      ...formData,
      [name]: value 
    });

    // If business changes in dropdown, fetch its services
    if (name === 'business_id' && value) {
      fetchServicesForBusiness(value);
      
      // Also find and set business info for the selected business
      const selectedBusiness = businesses.find(b => b.id === parseInt(value));
      if (selectedBusiness) {
        setBusinessInfo({
          business_name: selectedBusiness.business_name,
          address: selectedBusiness.address,
          city: selectedBusiness.city,
          category: selectedBusiness.category
        });
      }
    }
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

    // If no business_id, show error
    if (!formData.business_id) {
      setError('Please select a business first');
      setLoading(false);
      return;
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.time)) {
      setError('Please enter a valid time in HH:MM format (24-hour)');
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
      
      // Reset form but keep business_id and date/time defaults
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        business_id: formData.business_id
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
              onClick={() => navigate(`/business/${formData.business_id}`)}
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

  // Generate business hours (8 AM to 8 PM)
  const generateTimeSlots = () => {
    const slots = [];
    // Add more flexible hours
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute of ['00', '15', '30', '45']) {
        // Skip invalid times like 20:45 if business closes at 8 PM
        if (hour === 20 && minute === '45') continue;
        
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="join-queue-form-container">
      {businessInfo && businessId ? (
        <div className="business-header">
          <h2>Join Queue at {businessInfo.business_name}</h2>
          <p className="business-location">
            📍 {businessInfo.address}, {businessInfo.city}
          </p>
          <p className="business-category">
            Category: {businessInfo.category}
          </p>
        </div>
      ) : (
        <div className="business-header">
          <h2>Join a Queue</h2>
          <p>Select a business and join their queue</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="join-queue-form" onSubmit={handleSubmit}>
        {/* Business dropdown - only show if no businessId in URL */}
        {!businessId && (
          <div className="form-group">
            <label htmlFor="business_id">Business *</label>
            {loadingBusinesses ? (
              <p>Loading businesses...</p>
            ) : (
              <select
                id="business_id"
                name="business_id"
                value={formData.business_id}
                onChange={handleChange}
                required
                disabled={loadingBusinesses}
              >
                <option value="">Select a business</option>
                {businesses.map(business => (
                  <option key={business.id} value={business.id}>
                    {business.business_name} - {business.category} ({business.city})
                  </option>
                ))}
              </select>
            )}
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
            {/* Show services from database if available */}
            {services.length > 0 ? (
              services.map(service => (
                <option key={service.id} value={service.service_name}>
                  {service.service_name}
                  {service.duration && ` (${service.duration} min)`}
                  {service.price && ` - $${service.price}`}
                </option>
              ))
            ) : (
              // Fallback to default services if no services in database
              <>
                <option value="Haircut">Haircut</option>
                <option value="Manicure">Manicure</option>
                <option value="Massage">Massage</option>
                <option value="Consultation">Consultation</option>
                <option value="General Service">General Service</option>
                <option value="other">Other Service</option>
              </>
            )}
          </select>
          {formData.service === 'other' && (
            <input
              type="text"
              placeholder="Please specify your service"
              value={formData.customService || ''}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              className="custom-service-input"
              style={{ marginTop: '8px' }}
            />
          )}
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
            <div className="time-input-container">
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="time-input"
              />
              <div className="quick-time-buttons">
                <small>Quick select:</small>
                <button 
                  type="button" 
                  className="quick-time-btn"
                  onClick={() => setFormData({...formData, time: '09:00'})}
                >
                  9:00 AM
                </button>
                <button 
                  type="button" 
                  className="quick-time-btn"
                  onClick={() => setFormData({...formData, time: '13:00'})}
                >
                  1:00 PM
                </button>
                <button 
                  type="button" 
                  className="quick-time-btn"
                  onClick={() => setFormData({...formData, time: '17:00'})}
                >
                  5:00 PM
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="form-notes">
          <p>Fields marked with * are required</p>
          <p className="note">⏰ Business hours typically 8 AM - 8 PM</p>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || loadingBusinesses}
        >
          {loading ? 'Joining Queue...' : 'Join Queue'}
        </button>
      </form>
    </div>
  );
};

export default JoinQueueForm;