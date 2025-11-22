import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
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