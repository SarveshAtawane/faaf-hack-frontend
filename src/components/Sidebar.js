import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

const menuItems = [
  {
    path: '/search',
    icon: '🔍',
    label: 'Vendor Discovery'
  },
  {
    path: '/',
    icon: '🏠',
    label: 'Dashboard',
    exact: true
  },
  {
    path: '/porter-orders',
    icon: '🚚',
    label: 'Porter Orders'
  }
];


  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🛍️</span>
          {!collapsed && <span className="logo-text">VendorHub</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {collapsed ? '▶️' : '◀️'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
                end={item.exact}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <span className="user-name">John Doe</span>
              <span className="user-email">john@example.com</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;