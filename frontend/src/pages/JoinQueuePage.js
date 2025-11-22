import React from 'react';
import components from '../components/Index.js';
import '../styles/JoinQueuePage.css';

const JoinQueuePage = () => {
  const { JoinQueueForm } = components;
  return (
    <div className="join-queue-page">
      <div className="page-header">
        <div className="container">
          <h1>Join the Queue</h1>
          <p>Book your spot and avoid waiting in line</p>
        </div>
      </div>
      
      <div className="page-content">
        <div className="container">
          <div className="form-container">
            <JoinQueueForm />
          </div>
          
          <div className="info-sidebar">
            <h3>How it works</h3>
            <div className="info-item">
              <span className="info-number">1</span>
              <div className="info-content">
                <h4>Fill out the form</h4>
                <p>Provide your details and select your preferred service</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-number">2</span>
              <div className="info-content">
                <h4>Get your position</h4>
                <p>Receive your queue number and estimated wait time</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-number">3</span>
              <div className="info-content">
                <h4>Wait comfortably</h4>
                <p>Get notified when it's almost your turn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinQueuePage;