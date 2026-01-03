import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import components from '../components/Index.js';
import '../styles/QueueStatusPage.css';
import { useParams } from 'react-router-dom';

const QueueStatusPage = () => {
  const { QueueList, ErrorMessage } = components;
  const { id: businessId } = useParams(); // get business ID if provided
  
  const [currentQueue, setCurrentQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);


const fetchQueueData = useCallback(async () => {
    try {
      setError(null);
      
      let queueData = [];
      
      if (businessId) {
        const [queueResponse, businessResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/business/${businessId}/queue`),
          axios.get(`http://localhost:5000/api/businesses/${businessId}`)
        ]);
        
        queueData = queueResponse.data;
        setBusinessInfo(businessResponse.data);
      } else {
        const response = await axios.get('http://localhost:5000/api/business/1/queue');
        queueData = response.data;
      }
      
      const today = new Date().toISOString().split('T')[0];
      const todaysQueue = queueData.filter(item => 
        item.date === today && 
        item.status !== 'completed' && 
        item.status !== 'cancelled'
      );
      
      setCurrentQueue(todaysQueue);
    } catch (error) {
      console.error('Error fetching queue:', error);
      setError('Unable to load queue data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchQueueData();
    
    const intervalId = setInterval(fetchQueueData, 30000);
        return () => clearInterval(intervalId);
  }, [fetchQueueData]);

  const waitingCount = currentQueue.filter(item => item.status === 'waiting').length;
  const inProgressCount = currentQueue.filter(item => item.status === 'in-progress').length;
  const completedCount = currentQueue.filter(item => item.status === 'completed').length;

  const calculateAverageWaitTime = () => {
    if (currentQueue.length === 0) return '0 min';
    
    const waitingCustomers = currentQueue.filter(item => item.status === 'waiting');
    if (waitingCustomers.length === 0) return '0 min';
    
    // Simple calculation: each waiting customer adds 15 minutes
    const avgWait = Math.ceil((waitingCustomers.length * 15) / 2);
    return avgWait <= 60 ? `${avgWait} min` : `${Math.floor(avgWait / 60)}h ${avgWait % 60}min`;
  };

  if (loading) {
    return (
      <div className="queue-status-page loading">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading queue data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="queue-status-page">
        <div className="container">
          <ErrorMessage 
            message="Unable to Load Queue"
            details={error}
            showRetry={true}
            onRetry={fetchQueueData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="queue-status-page">
      <div className="page-header">
        <div className="container">
          {businessInfo ? (
            <>
              <h1>Queue at {businessInfo.business_name}</h1>
              <p>
                📍 {businessInfo.address}, {businessInfo.city} • 
                📞 {businessInfo.phone || 'N/A'} • 
                ✉️ {businessInfo.email || 'N/A'}
              </p>
            </>
          ) : (
            <>
              <h1>Current Queue Status</h1>
              <p>Real-time updates on queue positions & waiting times</p>
            </>
          )}
          
          <button 
            className="refresh-btn"
            onClick={fetchQueueData}
            title="Refresh queue data"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="container">
          <div className="queue-section">
            <div className="queue-header">
              <div className="header-left">
                <h2>Today's Queue</h2>
                <p className="last-updated">
                  Last updated: {new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              
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
                <div className="stat">
                  <span className="stat-number">{completedCount}</span>
                  <span className="stat-label">Completed Today</span>
                </div>
              </div>
            </div>

            {currentQueue.length === 0 ? (
              <div className="empty-queue">
                <div className="empty-icon">📭</div>
                <h3>No customers in the queue</h3>
                <p>The queue is empty for today. Check back later or join the queue!</p>
                {businessId && (
                  <a 
                    href={`/business/${businessId}/queue`} 
                    className="btn btn-primary"
                  >
                    Join Queue
                  </a>
                )}
              </div>
            ) : (
              <>
                <QueueList queue={currentQueue} />
                
                <div className="queue-summary">
                  <p>
                    <strong>Average Wait Time:</strong> {calculateAverageWaitTime()} • 
                    <strong> Next Available:</strong> {waitingCount > 0 ? 'In ' + calculateAverageWaitTime() : 'Now'}
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="sidebar-section">
            <div className="wait-time-info">
              <h3>📊 Estimated Wait Times</h3>
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

            <div className="queue-tips">
              <h3>💡 Queue Tips</h3>
              <ul>
                <li>Check your position regularly</li>
                <li>Arrive 5 minutes before your estimated time</li>
                <li>Bring required documents</li>
                <li>Cancel if you can't make it</li>
              </ul>
            </div>

            {businessInfo && (
              <div className="business-info-card">
                <h3>🏢 Business Info</h3>
                <p><strong>Name:</strong> {businessInfo.business_name}</p>
                <p><strong>Address:</strong> {businessInfo.address}</p>
                <p><strong>Phone:</strong> {businessInfo.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {businessInfo.email || 'N/A'}</p>
                <a 
                  href={`/business/${businessId}`} 
                  className="btn btn-outline"
                >
                  View Business Page
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatusPage;