import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ErrorMessage.css';

const ErrorMessage = ({ 
  message = "Something went wrong.", 
  details,
  showRetry = false,
  onRetry,
  showHomeLink = true,
  type = 'error' // 'error', 'warning', 'info', 'success'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '❌';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'error';
    }
  };

  return (
    <div className={`error-message ${getColorClass()}`}>
      <div className="error-icon">{getIcon()}</div>
      <div className="error-content">
        <h3 className="error-title">{message}</h3>
        {details && <p className="error-details">{details}</p>}
        
        <div className="error-actions">
          {showRetry && (
            <button 
              onClick={onRetry} 
              className="btn btn-primary"
            >
              Try Again
            </button>
          )}
          
          {showHomeLink && (
            <Link to="/" className="btn btn-secondary">
              Go to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// Specific error types for common scenarios
export const NetworkError = ({ onRetry }) => (
  <ErrorMessage
    message="Network Error"
    details="Unable to connect to the server. Please check your internet connection."
    showRetry={true}
    onRetry={onRetry}
  />
);

export const NotFoundError = ({ resource = "page" }) => (
  <ErrorMessage
    message={`${resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found`}
    details={`The ${resource} you are looking for does not exist or has been removed.`}
    showHomeLink={true}
  />
);

export const AccessDeniedError = () => (
  <ErrorMessage
    message="Access Denied"
    details="You don't have permission to access this resource."
    showHomeLink={true}
    type="warning"
  />
);

export const LoadingError = ({ onRetry }) => (
  <ErrorMessage
    message="Failed to Load"
    details="There was a problem loading the data. Please try again."
    showRetry={true}
    onRetry={onRetry}
  />
);

export const SuccessMessage = ({ message, details }) => (
  <ErrorMessage
    message={message}
    details={details}
    showHomeLink={false}
    type="success"
  />
);

export default ErrorMessage;