import React, { useState, useEffect } from 'react';
import '../styles/BusinessPanel.css';
import { getStoredQueue, saveQueue, updateQueueWaitTimes } from '../data/mockQueueData';

const BusinessPanel = () => {
  const [queue, setQueue] = useState([]);

  // Load queue from localStorage on component mount
  useEffect(() => {
    const storedQueue = getStoredQueue();
    setQueue(storedQueue);
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    if (queue.length > 0) {
      saveQueue(queue);
    }
  }, [queue]);

  // const moveToNext = (id) => {
  //   const customer = queue.find(item => item.id === id);
  //   const updatedQueue = queue.map(item => 
  //     item.id === id ? { ...item, status: 'completed' } : item
  //   );
  //   setQueue(updatedQueue);
    
  //   // Update wait times for other customers in the same service and date
  //   if (customer) {
  //     updateQueueWaitTimes(customer.service, customer.date);
  //   }
  // };

  const removeCustomer = (id) => {
    const customer = queue.find(item => item.id === id);
    const updatedQueue = queue.filter(item => item.id !== id);
    setQueue(updatedQueue);
    
    // Update wait times for other customers in the same service and date
    if (customer) {
      updateQueueWaitTimes(customer.service, customer.date);
    }
  };

  const startService = (id) => {
    const customer = queue.find(item => item.id === id);
    const updatedQueue = queue.map(item => 
      item.id === id ? { ...item, status: 'in-progress' } : item
    );
    setQueue(updatedQueue);
    
    // Update wait times for other customers in the same service and date
    if (customer) {
      updateQueueWaitTimes(customer.service, customer.date);
    }
  };

  const completeService = (id) => {
    const customer = queue.find(item => item.id === id);
    const updatedQueue = queue.map(item => 
      item.id === id ? { ...item, status: 'completed' } : item
    );
    setQueue(updatedQueue);
    
    // Update wait times for other customers in the same service and date
    if (customer) {
      updateQueueWaitTimes(customer.service, customer.date);
    }
  };

  // Group queue by date for better organization
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

  return (
    <div className="business-panel">
      <div className="panel-header">
        <h1 align="center">Business Dashboard</h1>
        <div className="stats">
          <div className="stat-card">
            <h3>Total in Queue</h3>
            <p>{queue.length}</p>
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
            <h3>Completed</h3>
            <p>{queue.filter(item => item.status === 'completed').length}</p>
          </div>
        </div>
      </div>

      <div className="queue-management">
        <h2>Manage Queue</h2>
        
        {Object.keys(groupedQueue).length === 0 ? (
          <div className="empty-queue">
            <p>No customers in the queue</p>
          </div>
        ) : (
          Object.entries(groupedQueue).map(([date, customers]) => (
            <div key={date} className="date-group">
              <h3 className="date-header">{new Date(date).toLocaleDateString()}</h3>
              <div className="customer-list">
                {customers.map((customer) => (
                  <div key={customer.id} className={`customer-card ${customer.status}`}>
                    <div className="customer-info">
                      <h3>{customer.customerName}</h3>
                      <p>Service: {customer.service}</p>
                      <p>Time: {customer.time}</p>
                      <p>Phone: {customer.phone}</p>
                      <p>Est. Wait: {customer.estimatedTime}</p>
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