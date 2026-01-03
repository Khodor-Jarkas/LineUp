// src/pages/BusinessDashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/DashboardPage.css';

const BusinessDashboardPage = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayCustomers: 0,
    waitingCustomers: 0,
    avgWaitTime: '0 min',
    completionRate: '0%'
  });

  const fetchBusinessData = useCallback(async () => {
    try {
      // Fetch business info
      const businessResponse = await axios.get(`http://localhost:5000/api/businesses/${id}`);
      setBusiness(businessResponse.data);

      // Fetch queue stats
      const queueResponse = await axios.get(`http://localhost:5000/api/business/${id}/queue`);
      const todayQueue = queueResponse.data.filter(item => 
        new Date(item.date).toDateString() === new Date().toDateString()
      );

      setStats({
        todayCustomers: todayQueue.length,
        waitingCustomers: todayQueue.filter(item => item.status === 'waiting').length,
        avgWaitTime: todayQueue.length > 0 ? '15 min' : '0 min',
        completionRate: todayQueue.length > 0 ? 
          `${Math.round((todayQueue.filter(item => item.status === 'completed').length / todayQueue.length) * 100)}%` : '0%'
      });
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]); // ✅ Add id as dependency to useCallback

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]); // ✅ Now includes fetchBusinessData in dependencies
  // You could also add [id] here instead, but using fetchBusinessData is cleaner

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>{business?.business_name || 'Business'} Dashboard</h1>
          <p>Manage your queue, track performance, and grow your business</p>
        </div>

        <div className="business-info-panel">
          <h2>Business Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Business Name:</span>
              <span className="info-value">{business?.business_name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{business?.category || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">{business?.address}, {business?.city}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{business?.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-number">{stats.todayCustomers}</span>
            <span className="stat-label">Today's Customers</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.waitingCustomers}</span>
            <span className="stat-label">Currently Waiting</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.avgWaitTime}</span>
            <span className="stat-label">Avg Wait Time</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.completionRate}</span>
            <span className="stat-label">Completion Rate</span>
          </div>
        </div>

        <div className="dashboard-cards">
          <Link to={`/business/${id}`} className="dashboard-card" style={{textDecoration: 'none'}}>
            <div className="card-icon">👁️</div>
            <h3 className="card-title">View Business Page</h3>
            <p className="card-content">See how customers view your business page</p>
          </Link>

          <Link to={`/business/${id}/queue`} className="dashboard-card" style={{textDecoration: 'none'}}>
            <div className="card-icon">📋</div>
            <h3 className="card-title">Manage Queue</h3>
            <p className="card-content">Add, remove, and manage customer queue</p>
          </Link>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3 className="card-title">Analytics</h3>
            <p className="card-content">View detailed reports and insights</p>
            <button className="action-btn" style={{marginTop: '1rem'}}>
              View Analytics
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3 className="card-title">Settings</h3>
            <p className="card-content">Update business info and preferences</p>
            <button className="action-btn secondary" style={{marginTop: '1rem'}}>
              Edit Settings
            </button>
          </div>
        </div>

        <div className="quick-actions">
          <Link to={`/business/${id}/queue`} className="action-btn">
            Manage Today's Queue
          </Link>
          <button className="action-btn secondary" onClick={fetchBusinessData}>
            Refresh Data
          </button>
          <Link to="/business/create" className="action-btn secondary">
            Edit Business Info
          </Link>
        </div>

        <div className="recent-activity">
          <h2>Quick Tips</h2>
          <ul className="activity-list">
            <li className="activity-item">
              <div className="activity-icon">💡</div>
              <div className="activity-content">
                <div className="activity-title">Keep wait times under 20 minutes for better customer satisfaction</div>
              </div>
            </li>
            <li className="activity-item">
              <div className="activity-icon">💡</div>
              <div className="activity-content">
                <div className="activity-title">Update your business hours regularly</div>
              </div>
            </li>
            <li className="activity-item">
              <div className="activity-icon">💡</div>
              <div className="activity-content">
                <div className="activity-title">Use the queue management features to reduce customer wait times</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboardPage;