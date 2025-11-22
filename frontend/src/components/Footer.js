import React from 'react';
import '../styles/Footer.css';
import { APP_VERSION } from './Version';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { SiGooglemaps } from 'react-icons/si'; 

const Footer = () => {
const handleSocialClick = (platform) => {
  const links = {
    // these are placeholder links - ya3ni bas mwa22at 3abel ma n7ot el links
    Twitter: "https://twitter.com",
    Facebook: "https://facebook.com",
    Instagram: "https://instagram.com",
    LinkedIn: "https://github.com/Khodor-Jarkas/LineUp",
    "Google Maps": "https://maps.google.com"
  };

  window.open(links[platform], "_blank");
};

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3 className="footer-logo">LineUp</h3>
            <p className="footer-description">
              Streamlining queue management for businesses and customers alike.
            </p>
            <div className="footer-social">
              <button 
                onClick={() => handleSocialClick('Twitter')}
                aria-label="Twitter"
                className="social-button"
              >
                <FaTwitter />
              </button>

              <button 
                onClick={() => handleSocialClick('Facebook')}
                aria-label="Facebook"
                className="social-button"
              >
                <FaFacebookF />
              </button>

              <button 
                onClick={() => handleSocialClick('Instagram')}
                aria-label="Instagram"
                className="social-button"
              >
                <FaInstagram />
              </button>

              <button 
                onClick={() => handleSocialClick('LinkedIn')}
                aria-label="LinkedIn"
                className="social-button"
              >
                <FaLinkedinIn />
              </button>
              
              <button 
                onClick={() => handleSocialClick('Google Maps')}
                aria-label="Google Maps"
                className="social-button"
              >
                <SiGooglemaps />
              </button>

            </div>
          </div>

          {/* Rest of the footer remains the same */}
          <div className="footer-section">
            <h4 className="footer-title">For Customers</h4>
            <ul className="footer-links">
              <li><a href="/join">Join a Queue</a></li>
              <li><a href="/queue">View Queue Status</a></li>
              <li><a href="/how-it-works">How It Works</a></li>
              <li><a href="/download-app">Download App</a></li>
              <li><a href="/support">Customer Support</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>

          {/* For Business */}
          <div className="footer-section">
            <h4 className="footer-title">For Business</h4>
            <ul className="footer-links">
              <li><a href="/business/login">Business Login</a></li>
              <li><a href="/business/signup">Start Free Trial</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/case-studies">Case Studies</a></li>
              <li><a href="/demo">Request Demo</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/partners">Partners</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="/help-center">Help Center</a></li>
              <li><a href="/developers">Developer API</a></li>
              <li><a href="/community">Community</a></li>
              <li><a href="/webinars">Webinars</a></li>
              <li><a href="/documentation">Documentation</a></li>
              <li><a href="/status">System Status</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
       <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {new Date().getFullYear()} LineUp. All rights reserved.</p>
            <div className="version">v{APP_VERSION}</div>
          </div>
          <div className="footer-bottom-right">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;