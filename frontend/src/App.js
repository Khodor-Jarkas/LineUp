import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import components from './components/Index';
import pages from './pages/PageIndex';
import './App.css';

function App() {
  const { NavBar, Footer, ProtectedRoute } = components;
  const { 
    HomePage, 
    BusinessPage, 
    JoinQueuePage, 
    QueueStatusPage, 
    BusinessLoginPage,
    BusinessesPage,
    CreateBusinessPage,
    LoginPage,
    RegisterPage,
    UserDashboardPage,
    BusinessDashboardPage,
    NotFoundPage
  } = pages;

  return (
    <Router basename="/lineup">
      <div className="App">
        <NavBar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
            <Route path="/join" element={<JoinQueuePage />} />
            <Route path="/queue" element={<QueueStatusPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/business/login" element={<BusinessLoginPage />} />
            <Route path="/business/create" element={<CreateBusinessPage />} />
            
            {/* Business Pages */}
            <Route path="/business/:id" element={<BusinessPage />} />
            <Route path="/business/:id/queue" element={<JoinQueuePage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboardPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/business/dashboard/:id" 
              element={
                <ProtectedRoute>
                  <BusinessDashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;