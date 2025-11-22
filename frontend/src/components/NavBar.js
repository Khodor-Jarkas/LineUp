import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          LineUp
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/queue" className="nav-link">
            Queue Status
          </Link>
          <Link to="/join" className="nav-link">
            Join Queue
          </Link>
          <Link to="/business/login" className="nav-link business-link">
            Business
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;