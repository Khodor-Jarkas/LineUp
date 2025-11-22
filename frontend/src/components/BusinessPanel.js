import React, { useState } from 'react';
import '../styles/BusinessPanel.css';

const BusinessPanel = () => {
  const [queue, setQueue] = useState([
    { id: 1, customerName: 'John Doe', service: 'Haircut', status: 'waiting' },
    { id: 2, customerName: 'Jane Smith', service: 'Manicure', status: 'in-progress' },
    { id: 3, customerName: 'Bob Johnson', service: 'Massage', status: 'waiting' },
  ]);

  const moveToNext = (id) => {
    setQueue(queue.map(item => 
      item.id === id ? { ...item, status: 'completed' } : item
    ));
  };

  const removeCustomer = (id) => {
    setQueue(queue.filter(item => item.id !== id));
  };

  return (
    <div className="business-panel">
      <div className="panel-header">
        <h1>Business Dashboard</h1>
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
        </div>
      </div>

      <div className="queue-management">
        <h2>Manage Queue</h2>
        <div className="customer-list">
          {queue.map((customer) => (
            <div key={customer.id} className={`customer-card ${customer.status}`}>
              <div className="customer-info">
                <h3>{customer.customerName}</h3>
                <p>Service: {customer.service}</p>
                <span className={`status-badge ${customer.status}`}>
                  {customer.status}
                </span>
              </div>
              <div className="customer-actions">
                {customer.status === 'waiting' && (
                  <button 
                    className="btn start-btn"
                    onClick={() => moveToNext(customer.id)}
                  >
                    Start Service
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
    </div>
  );
};

export default BusinessPanel;