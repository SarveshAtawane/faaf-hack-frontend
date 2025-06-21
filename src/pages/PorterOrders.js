import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Reuse same CSS

const PorterOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPorterOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/get_all_porter_orders');
      if (!response.ok) throw new Error('Failed to fetch Porter orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
        setError(null);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPorterOrders();
  }, []);

  if (loading) return <div className="dashboard"><p>Loading Porter orders...</p></div>;
  if (error) return (
    <div className="dashboard">
      <p>Error: {error}</p>
      <button onClick={fetchPorterOrders}>Retry</button>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🚚 Porter Orders</h1>
        <p>List of all Porter orders from the database.</p>
      </header>

      <div className="dashboard-content">
        <div className="quick-actions">
          <button className="action-btn secondary" onClick={fetchPorterOrders}>🔄 Refresh</button>
        </div>

        <div className="enquiries-section">
          <h2>Porter Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="no-enquiries">
              <p>No Porter orders found.</p>
            </div>
          ) : (
            <div className="enquiries-grid">
              {orders.map((order) => (
                <div key={order._id} className="enquiry-card">
                  <h3>Order ID: {order.request_id}</h3>
                  <p>Vendor Name: {order.vendor_name}</p>
                  <p>Status: {order.status || 'N/A'}</p>
                  <p>Pickup Address: {order.pickup_address || 'N/A'}</p>
                  <p>Drop Address: {order.drop_address || 'N/A'}</p>
                  <p>Created At: {order.created_at || 'N/A'}</p>

                  {/* Add more fields as needed */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PorterOrders;
