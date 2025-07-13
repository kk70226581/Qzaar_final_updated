// ✅ OrdersPage.jsx - Separate page for shopkeeper to manage orders

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function OrdersPage() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const shopId = localStorage.getItem('shopId');

  useEffect(() => {
    if (!shopId) return;
    fetchOrders();
  }, [shopId]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${shopId}`);
      if (res.data.success) {
        const orders = res.data.orders;
        setPendingOrders(orders.filter(o => o.status !== 'completed'));
        setCompletedOrders(orders.filter(o => o.status === 'completed'));
      }
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  const markCompleted = async (orderId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/order-status/${orderId}`, {
        status: 'completed'
      });
      if (res.data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to mark as completed');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderOrder = (order, isPending = true) => (
    <div className={`card mb-4 shadow-sm border-${isPending ? 'warning' : 'success'}`} key={order._id}>
      <div className="card-body">
        <h5 className="card-title">Order #{order._id}</h5>
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Table:</strong> {order.tableNumber}</p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Ordered at:</strong> {formatTime(order.createdAt)}</p>
        <ul className="list-group list-group-flush mt-3">
          {order.items.map((item, idx) => (
            <li className="list-group-item" key={idx}>
              {item.name} — ₹{item.price} × {item.quantity || 1}
            </li>
          ))}
        </ul>
        {isPending && (
          <button onClick={() => markCompleted(order._id)} className="btn btn-sm btn-success mt-3">
            ✅ Mark as Completed
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Navbar hideAuth={true} />
      <div className="container py-5">
        <h2 className="fw-bold text-primary mb-4">📦 Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <p className="text-muted">No pending orders right now.</p>
        ) : (
          pendingOrders.map(order => renderOrder(order, true))
        )}

        <hr className="my-5" />

        <h2 className="fw-bold text-success mb-4">📜 Completed Orders</h2>
        {completedOrders.length === 0 ? (
          <p className="text-muted">No completed orders yet.</p>
        ) : (
          completedOrders.map(order => renderOrder(order, false))
        )}
      </div>
    </>
  );
}

export default OrdersPage;
