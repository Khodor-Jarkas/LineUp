import React from 'react';
import components from '../components/Index.js';
import '../styles/QueueStatusPage.css';
import { getQueue } from '../data/mockQueueData';
// status
const QueueStatusPage = () => {
  const { QueueList } = components;
  const currentQueue = getQueue();

  const waitingCount = currentQueue.filter(item => item.status === 'waiting').length;
  const inProgressCount = currentQueue.filter(item => item.status === 'in-progress').length;

  return (
    <div className="queue-status-page">
      <div className="page-header">
        <div className="container">
          <h1>Current Queue Status</h1>
          <p>Real time updating on queue position & waiting time</p>
        </div>
      </div>
      
      <div className="page-content">
        <div className="container">
          <div className="queue-section">
            <div className="queue-header">
              <h2>Today's Queue</h2>
              <div className="queue-stats">
                <div className="stat">
                  <span className="stat-number">{currentQueue.length}</span>
                  <span className="stat-label">Total in Queue</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{waitingCount}</span>
                  <span className="stat-label">Waiting</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{inProgressCount}</span>
                  <span className="stat-label">In Progress</span>
                </div>
              </div>
            </div>

            <QueueList queue={currentQueue} /> 
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