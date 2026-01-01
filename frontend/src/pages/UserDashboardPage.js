// src/pages/UserDashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DashboardPage.css';

const UserDashboardPage = () => {
  // Mock data - in real app, this would come from API
  const userStats = {
    totalQueues: 5,
    activeQueues: 2,
    completedQueues: 3,
    avgWaitTime: '15 min'
  };

  const recentActivity = [
    { id: 1, title: 'Joined queue at Salon', time: '2 hours ago', icon: '⏳' },
    { id: 2, title: 'Queue completed at Restaurant', time: 'Yesterday', icon: '✅' },
    { id: 3, title: 'Updated profile', time: '2 days ago', icon: '👤' },
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>User Dashboard</h1>
          <p>Welcome back! Here's your queue management overview.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-number">{userStats.totalQueues}</span>
            <span className="stat-label">Total Queues</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{userStats.activeQueues}</span>
            <span className="stat-label">Active Now</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{userStats.completedQueues}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{userStats.avgWaitTime}</span>
            <span className="stat-label">Avg Wait Time</span>
          </div>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3 className="card-title">Current Queues</h3>
            <p className="card-content">View and manage your active queue positions</p>
            <Link to="/queue" className="action-btn" style={{marginTop: '1rem', display: 'inline-block'}}>
              View Queues
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3 className="card-title">Queue History</h3>
            <p className="card-content">See your past queue activities and wait times</p>
            <button className="action-btn secondary" style={{marginTop: '1rem'}}>
              View History
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3 className="card-title">Settings</h3>
            <p className="card-content">Update your profile and notification preferences</p>
            <button className="action-btn secondary" style={{marginTop: '1rem'}}>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {recentActivity.map(activity => (
              <li key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="quick-actions">
          <Link to="/join" className="action-btn">
            Join New Queue
          </Link>
          <Link to="/businesses" className="action-btn secondary">
            Browse Businesses
          </Link>
          <button className="action-btn secondary">
            Help & Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;