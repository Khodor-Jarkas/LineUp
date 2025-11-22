import React from 'react';
import '../styles/QueueList.css';

const QueueList = ({ queue = [] }) => {
  if (queue.length === 0) {
    return (
      <div className="queue-list empty">
        <p>No customers in the queue</p>
      </div>
    );
  }

  return (
    <div className="queue-list">
      {queue.map((item, index) => (
        <div key={item.id} className="queue-item">
          <div className="queue-position">
            #{index + 1}
          </div>
          <div className="queue-details">
            <h3>{item.customerName}</h3>
            <p>{item.service}</p>
          </div>
          <div className="queue-time">
            {item.estimatedTime}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QueueList;