import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logged in user
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-text">LineUp</span>
            <span className="logo-badge">Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/businesses" className="nav-link">Businesses</Link>
            <Link to="/join" className="nav-link">Join Queue</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <div className="user-menu">
                  <span className="user-name">Hi, {user.full_name || user.email.split('@')[0]}</span>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}
            
            <Link to="/business/login" className="nav-link business-link">
              Business Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="menu-icon">{isMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/businesses" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Businesses</Link>
            <Link to="/join" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Join Queue</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <div className="mobile-user-info">
                  <p>Logged in as: {user.email}</p>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mobile-auth">
                <Link to="/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
            
            <Link to="/business/login" className="mobile-link business-link" onClick={() => setIsMenuOpen(false)}>
              Business Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;