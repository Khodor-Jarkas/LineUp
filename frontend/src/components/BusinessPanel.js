import React, { useState, useEffect } from 'react';
import '../styles/BusinessPanel.css';
import axios from 'axios';

const BusinessPanel = ({ businessId }) => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessInfo, setBusinessInfo] = useState(null);

  useEffect(() => {
    if (businessId) {
      fetchBusinessInfo();
      fetchQueue();
    }
  }, [businessId]);

  const fetchBusinessInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/businesses/${businessId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setBusinessInfo(response.data);
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/business/${businessId}/queue`
      );
      setQueue(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching queue:', error);
      setLoading(false);
    }
  };

  const updateQueueStatus = async (queueId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/queue/${queueId}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      fetchQueue(); // Refresh queue
    } catch (error) {
      console.error('Error updating queue status:', error);
    }
  };

  const removeCustomer = async (queueId) => {
    if (window.confirm('Are you sure you want to remove this customer?')) {
      await updateQueueStatus(queueId, 'cancelled');
    }
  };

  const startService = async (queueId) => {
    await updateQueueStatus(queueId, 'in-progress');
  };

  const completeService = async (queueId) => {
    await updateQueueStatus(queueId, 'completed');
  };

  const groupQueueByDate = () => {
    const grouped = {};
    queue.forEach(customer => {
      if (!grouped[customer.date]) {
        grouped[customer.date] = [];
      }
      grouped[customer.date].push(customer);
    });
    return grouped;
  };

  const groupedQueue = groupQueueByDate();

  if (loading) {
    return (
      <div className="business-panel loading">
        <p>Loading queue data...</p>
      </div>
    );
  }

  return (
    <div className="business-panel">
      <div className="panel-header">
        <div className="business-info">
          <h1>{businessInfo?.business_name || 'Business Dashboard'}</h1>
          <p>{businessInfo?.address}, {businessInfo?.city}</p>
        </div>
        <div className="stats">
          <div className="stat-card">
            <h3>Total in Queue</h3>
            <p>{queue.filter(item => item.status !== 'completed' && item.status !== 'cancelled').length}</p>
          </div>
          <div className="stat-card">
            <h3>Waiting</h3>
            <p>{queue.filter(item => item.status === 'waiting').length}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{queue.filter(item => item.status === 'in-progress').length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Today</h3>
            <p>{queue.filter(item => item.status === 'completed' && 
                 new Date(item.date).toDateString() === new Date().toDateString()).length}</p>
          </div>
        </div>
      </div>

      <div className="queue-management">
        <div className="section-header">
          <h2>Manage Queue</h2>
          <button className="btn btn-primary" onClick={fetchQueue}>
            Refresh
          </button>
        </div>
        
        {queue.length === 0 ? (
          <div className="empty-queue">
            <p>No customers in the queue</p>
          </div>
        ) : (
          Object.entries(groupedQueue).map(([date, customers]) => (
            <div key={date} className="date-group">
              <h3 className="date-header">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="customer-list">
                {customers.map((customer) => (
                  <div key={customer.id} className={`customer-card ${customer.status}`}>
                    <div className="customer-info">
                      <h3>{customer.customer_name}</h3>
                      <div className="customer-details">
                        <p><strong>Service:</strong> {customer.service_name}</p>
                        <p><strong>Time:</strong> {customer.time}</p>
                        <p><strong>Phone:</strong> {customer.customer_phone}</p>
                        <p><strong>Position:</strong> #{customer.position}</p>
                        {customer.estimated_wait_time && (
                          <p><strong>Est. Wait:</strong> {customer.estimated_wait_time} min</p>
                        )}
                      </div>
                      <span className={`status-badge ${customer.status}`}>
                        {customer.status}
                      </span>
                    </div>
                    <div className="customer-actions">
                      {customer.status === 'waiting' && (
                        <button 
                          className="btn start-btn"
                          onClick={() => startService(customer.id)}
                        >
                          Start Service
                        </button>
                      )}
                      {customer.status === 'in-progress' && (
                        <button 
                          className="btn complete-btn"
                          onClick={() => completeService(customer.id)}
                        >
                          Complete
                        </button>
                      )}
                      <button 
                        className="btn remove-btn"
                        onClick={() => removeCustomer(customer.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessPanel;