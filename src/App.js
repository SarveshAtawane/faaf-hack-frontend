// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import VendorDiscovery from './pages/VendorDiscovery';
import Dashboard from './pages/Dashboard';
// import Orders from './pages/Orders';
// import Favorites from './pages/Favorites';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
import './App.css';
import PorterOrders from './pages/PorterOrders';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        
        <main className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<VendorDiscovery />} />
            <Route path="/porter-orders" element={<PorterOrders />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;