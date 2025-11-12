import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>LineUp</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/customer">Customer</Link>
        <Link to="/business">Business</Link>
      </div>
    </nav>
  );
}

export default Navbar;
