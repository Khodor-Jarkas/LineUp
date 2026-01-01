import React from 'react';
import '../styles/QueueList.css';

const QueueList = ({ queue = [] }) => {
  if (queue.length === 0) {
    return (
      <div className="queue-list empty">
        <div className="empty-state">
          <p>📭 No customers in the queue</p>
        </div>
      </div>
    );
  }

  // Sort queue by position
  const sortedQueue = [...queue].sort((a, b) => {
    // First sort by status: in-progress, then waiting
    const statusOrder = { 'in-progress': 1, 'waiting': 2, 'completed': 3, 'cancelled': 4 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    
    // If same status, sort by position
    if (statusDiff === 0) {
      return (a.position || 0) - (b.position || 0);
    }
    
    return statusDiff;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress': return '▶️';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="queue-list">
      <div className="queue-header-row">
        <div className="header-position">#</div>
        <div className="header-name">Customer</div>
        <div className="header-service">Service</div>
        <div className="header-status">Status</div>
        <div className="header-time">Est. Time</div>
      </div>

      {sortedQueue.map((item) => (
        <div key={item.id} className={`queue-item ${item.status}`}>
          <div className="queue-position">
            #{item.position || 'N/A'}
          </div>
          <div className="queue-details">
            <h3>{item.customer_name}</h3>
            <p className="customer-meta">
              📱 {item.customer_phone} • 
              📧 {item.customer_email?.split('@')[0] || 'No email'} • 
              🕒 {item.time}
            </p>
          </div>
          <div className="queue-service">
            {item.service_name}
          </div>
          <div className="queue-status">
            <span className={`status-badge ${item.status}`}>
              {getStatusIcon(item.status)} {item.status}
            </span>
          </div>
          <div className="queue-time">
            {item.estimated_wait_time ? `${item.estimated_wait_time} min` : 'Calculating...'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QueueList;