import React from 'react';
import components from '../components/Index.js';
import '../styles/QueueStatusPage.css';

const QueueStatusPage = () => {
  const { QueueList, mockQueue } = components;

  return (
    <div className="queue-status-page">
      <div className="page-header">
        <div className="container">
          <h1>Current Queue Status</h1>
          <p>Real-time updates on queue positions and wait times</p>
        </div>
      </div>
      
      <div className="page-content">
        <div className="container">
          <div className="queue-section">
            <div className="queue-header">
              <h2>Today's Queue</h2>
              <div className="queue-stats">
                <div className="stat">
                  <span className="stat-number">{mockQueue.length}</span>
                  <span className="stat-label">Total in Queue</span>
                </div>
                <div className="stat">
                  <span className="stat-number">15</span>
                  <span className="stat-label">Avg Wait Time (min)</span>
                </div>
              </div>
            </div>
            <QueueList queue={mockQueue} />
          </div>
          
          <div className="wait-time-info">
            <h3>Estimated Wait Times</h3>
            <div className="time-slots">
              <div className="time-slot">
                <span className="service">Haircut</span>
                <span className="time">10-15 min</span>
              </div>
              <div className="time-slot">
                <span className="service">Manicure</span>
                <span className="time">20-25 min</span>
              </div>
              <div className="time-slot">
                <span className="service">Massage</span>
                <span className="time">30-45 min</span>
              </div>
              <div className="time-slot">
                <span className="service">Consultation</span>
                <span className="time">15-20 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatusPage;