import React, { useState } from 'react';
import './Orders.css';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('active');

  const orders = {
    active: [
      { id: 'ORD001', vendor: 'ABC Electronics', product: 'Laptop Repair', status: 'In Progress', date: '2024-01-15', amount: '$120' },
      { id: 'ORD002', vendor: 'Green Grocers', product: 'Weekly Vegetables', status: 'Confirmed', date: '2024-01-16', amount: '$45' }
    ],
    completed: [
      { id: 'ORD003', vendor: 'Quick Fix', product: 'Phone Screen Repair', status: 'Completed', date: '2024-01-10', amount: '$80' },
      { id: 'ORD004', vendor: 'Fresh Bakery', product: 'Birthday Cake', status: 'Delivered', date: '2024-01-08', amount: '$35' }
    ],
    cancelled: [
      { id: 'ORD005', vendor: 'Auto Service', product: 'Car Wash', status: 'Cancelled', date: '2024-01-05', amount: '$25' }
    ]
  };

  return (
    <div className="orders-page">
      <header className="page-header">
        <h1>📦 My Orders</h1>
        <p>Track and manage your vendor orders</p>
      </header>

      <div className="orders-tabs">
        <button 
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Orders ({orders.active.length})
        </button>
        <button 
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({orders.completed.length})
        </button>
        <button 
          className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({orders.cancelled.length})
        </button>
      </div>

      <div className="orders-list">
        {orders[activeTab].map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">{order.id}</span>
              <span className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                {order.status}
              </span>
            </div>
            <div className="order-details">
              <h3>{order.product}</h3>
              <p>from <strong>{order.vendor}</strong></p>
              <div className="order-meta">
                <span>📅 {order.date}</span>
                <span>💰 {order.amount}</span>
              </div>
            </div>
            <div className="order-actions">
              <button className="btn-secondary">View Details</button>
              {activeTab === 'active' && <button className="btn-primary">Track Order</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
