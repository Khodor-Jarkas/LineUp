import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import axios from 'axios';

const HomePage = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/businesses');
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="nav-logo">
              LineUp
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/businesses" className="nav-link">Businesses</Link>
              <Link to="/join" className="nav-link">Join Queue</Link>
              <Link to="/business/login" className="nav-link">Business Login</Link>
            </div>
            <div className="nav-auth">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to LineUp</h1>
          <p className="hero-subtitle">
            Efficient booking and queue management for small businesses
          </p>
          <div className="hero-buttons">
            <Link to="/join" className="btn btn-primary">
              Join a Queue
            </Link>
            <Link to="/business/login" className="btn btn-secondary">
              Business Login
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            📋 Queue Management Made Simple
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="featured-businesses">
        <div className="container">
          <div className="section-header">
            <h2>Featured Businesses</h2>
            <Link to="/businesses" className="view-all">View All →</Link>
          </div>
          <div className="businesses-grid">
            {businesses.slice(0, 3).map((business) => (
              <div key={business.id} className="business-card">
                <div className="business-card-header">
                  <div className="business-icon">
                    {business.category === 'salon' ? '💇' : 
                     business.category === 'restaurant' ? '🍽️' : 
                     business.category === 'clinic' ? '🏥' : '🏢'}
                  </div>
                  <h3>{business.business_name}</h3>
                </div>
                <div className="business-card-body">
                  <p className="business-description">
                    {business.description || 'Professional services'}
                  </p>
                  <div className="business-info">
                    <span className="business-location">
                      📍 {business.city || 'Location'}
                    </span>
                    <span className="business-category">
                      {business.category || 'Service'}
                    </span>
                  </div>
                </div>
                <div className="business-card-footer">
                  <Link 
                    to={`/business/${business.id}/queue`} 
                    className="btn btn-sm btn-primary"
                  >
                    Join Queue
                  </Link>
                  <Link 
                    to={`/business/${business.id}`} 
                    className="btn btn-sm btn-outline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose LineUp?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Save Time</h3>
              <p>Reduce waiting times and manage customer flow efficiently</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Booking</h3>
              <p>Customers can join queues from their mobile devices</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Analytics</h3>
              <p>Track queue performance and customer patterns</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Smart Notifications</h3>
              <p>Automatic alerts when it's almost your turn</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Find Business</h3>
              <p>Search for your favorite business or scan their QR code</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Join Queue</h3>
              <p>Select service and join the virtual queue</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Notified</h3>
              <p>Receive updates on your queue position</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Served</h3>
              <p>Arrive just in time for your appointment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;