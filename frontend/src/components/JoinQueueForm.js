import React, { useState } from 'react';
import '../styles/JoinQueueForm.css';
import { addToQueue, getQueuePosition } from '../data/mockQueueData';

// form for the customer to join the queue
const JoinQueueForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: ''
  }
);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [queueInfo, setQueueInfo] = useState(null);
// handling form data changes
  const handleChange = (e) => {
    setFormData({ ...formData,[e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCustomer = addToQueue(formData);
    const position = getQueuePosition(newCustomer.id);
    
    setQueueInfo({
      position: position,
      customerName: newCustomer.customerName,
      service: newCustomer.service,
      estimatedTime: newCustomer.estimatedTime
    }
  );
    setShowConfirmation(true);
    //
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      time: ''
    }
  );
  };
//queue join9ing confirmation meassage
  if (showConfirmation) {

    return (
      <div className="confirmation-message">
        <div className="confirmation-content">
          <div className="success-icon"></div>
          <h3>Successfully Joined Queue!</h3>
          <div className="queue-details">

            <p><strong>Name:</strong> {queueInfo.customerName}</p>
            <p><strong>Service:</strong> {queueInfo.service}</p>
            <p><strong>Your Position:</strong> #{queueInfo.position}</p>
            <p><strong>Estimated Wait:</strong> {queueInfo.estimatedTime}</p>

          </div>
          <button 
            className="view-queue-btn"
            onClick={() => window.location.href = '/queue'}
          >
            View Queue Status
          </button>
          <button 
            className="back-btn"
            onClick={() => setShowConfirmation(false)}
          >
            Join Another Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="join-queue-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="service">Service</label>
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
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
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

      <button type="submit" className="submit-btn">
        Join Queue
      </button>
    </form>
  );
};

export default JoinQueueForm;