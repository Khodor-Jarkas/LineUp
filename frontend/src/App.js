import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import components from './components/Index';
import pages from './pages/PageIndex';
import './App.css';

function App() {
  const { NavBar, Footer } = components;
  const { 
    HomePage, 
    BusinessPage, 
    JoinQueuePage, 
    QueueStatusPage, 
    BusinessLoginPage 
  } = pages;

  return (
    <Router>
      <div className="App">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/join" element={<JoinQueuePage />} />
            <Route path="/queue" element={<QueueStatusPage />} />
            <Route path="/business/login" element={<BusinessLoginPage />} />
            <Route path="/business" element={<BusinessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;