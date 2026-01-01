import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/BusinessPage.css';

const BusinessesPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');


   const filterBusinesses = useCallback(() => {
    let filtered = businesses;

    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(business =>
        business.category === categoryFilter
      );
    }

    setFilteredBusinesses(filtered);
  }, [businesses, searchTerm, categoryFilter]); 

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/businesses');
        setBusinesses(response.data);
        setFilteredBusinesses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

    useEffect(() => {
    filterBusinesses();
  }, [filterBusinesses]);


  const categories = ['all', 'salon', 'restaurant', 'clinic', 'retail', 'spa', 'other'];

  return (
    <div className="businesses-page">
      <div className="page-header">
        <div className="container">
          <h1>Business Directory</h1>
          <p>Find and join queues at your favorite businesses</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Search and Filter */}
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search businesses by name, location, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-filter ${categoryFilter === category ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === 'all' ? 'All' : 
                   category === 'salon' ? '💇 Salon' :
                   category === 'restaurant' ? '🍽️ Restaurant' :
                   category === 'clinic' ? '🏥 Clinic' :
                   category === 'retail' ? '🛍️ Retail' :
                   category === 'spa' ? '🧖 Spa' : '🏢 Other'}
                </button>
              ))}
            </div>
          </div>

          {/* Create Business Button (for logged in users) */}
          <div className="create-business-section">
            <Link to="/business/create" className="btn btn-primary btn-create">
              + Register Your Business
            </Link>
            <p>Want to manage your own queues? Register your business today!</p>
          </div>

          {/* Businesses Grid */}
          {loading ? (
            <div className="loading">Loading businesses...</div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="no-results">
              <p>No businesses found. Try a different search.</p>
            </div>
          ) : (
            <div className="businesses-grid">
              {filteredBusinesses.map((business) => (
                <div key={business.id} className="business-card">
                  <div className="business-card-header">
                    <div className="business-avatar">
                      {business.category === 'salon' ? '💇' : 
                       business.category === 'restaurant' ? '🍽️' : 
                       business.category === 'clinic' ? '🏥' : 
                       business.category === 'retail' ? '🛍️' : 
                       business.category === 'spa' ? '🧖' : '🏢'}
                    </div>
                    <h3>{business.business_name}</h3>
                    <span className="business-category">
                      {business.category || 'Service'}
                    </span>
                  </div>
                  
                  <div className="business-card-body">
                    <p className="business-description">
                      {business.description || 'Professional services with virtual queue management.'}
                    </p>
                    
                    <div className="business-details">
                      <div className="detail-item">
                        <span className="detail-label">📍 Location</span>
                        <span className="detail-value">
                          {business.city || 'Not specified'}
                          {business.state ? `, ${business.state}` : ''}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">📅 Joined</span>
                        <span className="detail-value">
                          {new Date(business.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="business-card-footer">
                    <Link 
                      to={`/business/${business.id}/queue`}
                      className="btn btn-primary btn-join"
                    >
                      Join Queue
                    </Link>
                    <Link 
                      to={`/business/${business.id}`}
                      className="btn btn-outline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessesPage;