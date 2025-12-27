import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BusinessCard.css';

const BusinessCard = ({ business }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'salon': return '💇';
      case 'restaurant': return '🍽️';
      case 'clinic': return '🏥';
      case 'retail': return '🛍️';
      case 'spa': return '🧖';
      case 'fitness': return '💪';
      case 'auto': return '🚗';
      default: return '🏢';
    }
  };

  return (
    <div className="business-card">
      <div className="business-card-header">
        <div className="business-avatar">
          {getCategoryIcon(business.category)}
        </div>
        <div className="business-title">
          <h3>{business.business_name}</h3>
          <span className="business-category">{business.category || 'Service'}</span>
        </div>
      </div>
      
      <div className="business-card-body">
        <p className="business-description">
          {business.description || 'Professional services with virtual queue management.'}
        </p>
        
        <div className="business-meta">
          <div className="meta-item">
            <span className="meta-label">📍</span>
            <span className="meta-value">{business.city || 'Location'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">📅</span>
            <span className="meta-value">
              Joined {new Date(business.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="business-card-footer">
        <Link 
          to={`/business/${business.id}/queue`}
          className="btn btn-primary"
        >
          Join Queue
        </Link>
        <Link 
          to={`/business/${business.id}`}
          className="btn btn-outline"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default BusinessCard;