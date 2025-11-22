import React from 'react';
import components from '../components/Index';
import '../styles/BusinessPage.css';

const BusinessPage = () => {
  const { BusinessPanel } = components;

  return (
    <div className="business-page">
      <BusinessPanel />
    </div>
  );
};

export default BusinessPage;