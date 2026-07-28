import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  ChefHat,
  Clock3,
  PackageCheck,
  RefreshCw,
  Search,
  Sparkles,
  XCircle,
  Zap,
  ChevronRight,
  X,
  User,
  Phone,
  CreditCard
} from 'lucide-react';
import { getSocket } from '../api';
import Navbar from './Navbar';
import './OrdersPage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const statusOptions = ['all', 'pending', 'preparing', 'completed'];

const formatCurrency = (value) => `Rs ${Number(value || 0).toFixed(0)}`;

const getOrderItemImage = (itemName = '') => {
  const name = itemName.toLowerCase();
  if (/coffee|shake/.test(name)) return '/images/menu/cold-coffee.png';
  if (/chai|lassi|soda/.test(name)) return '/images/menu/masala-chai.png';
  if (/chicken|tandoori/.test(name)) return '/images/menu/tandoori-chicken.png';
  if (/biryani|rice/.test(name)) return '/images/menu/biryani.png';
  if (/gulab|rasmalai|kulfi|brownie/.test(name)) return '/images/menu/gulab-jamun.png';
  return '/images/menu/paneer-tikka.png';
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [lastLiveEvent, setLastLiveEvent] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const shopId = localStorage.getItem('shopId');

  const fetchData = useCallback(async () => {
    if (!shopId) {
      return;
    }

    setIsLoading(true);
    try {
      const [ordersResponse, dashboardResponse] = await Promise.all([
        axios.get(`${API}/api/orders/${shopId}`),
        axios.get(`${API}/api/dashboard/${shopId}`)
      ]);

      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.orders || []);
      }

      if (dashboardResponse.data.success) {
        setDashboard(dashboardResponse.data.dashboard);
      }
    } catch (error) {
      console.error('Unable to fetch order dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh || !shopId) {
      return undefined;
    }

    const intervalId = window.setInterval(fetchData, 25000);
    return () => window.clearInterval(intervalId);
  }, [autoRefresh, fetchData, shopId]);

  useEffect(() => {
    if (!shopId) {
      return undefined;
    }

    const socket = getSocket();
    const handleConnect = () => {
      setIsSocketConnected(true);
      socket.emit('join_shop', shopId);
    };
    const handleDisconnect = () => setIsSocketConnected(false);
    const handleLiveEvent = () => {
      setLastLiveEvent(new Date().toLocaleTimeString());
      fetchData();
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_order', handleLiveEvent);
    socket.on('order_status_changed', handleLiveEvent);
    socket.on('payment_received', handleLiveEvent);
    socket.on('order_cancelled', handleLiveEvent);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_order', handleLiveEvent);
      socket.off('order_status_changed', handleLiveEvent);
      socket.off('payment_received', handleLiveEvent);
      socket.off('order_cancelled', handleLiveEvent);
    };
  }, [fetchData, shopId]);

  const filteredOrders = useMemo(
    () => {
      const query = searchTerm.trim().toLowerCase();

      return orders.filter((order) => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;
        const matchesSearch = !query || [
          order.customerName,
          order.customerEmail,
          order.tableNumber,
          ...(order.items || []).map((item) => item.name)
        ].some((value) => String(value || '').toLowerCase().includes(query));

        return matchesStatus && matchesPayment && matchesSearch;
      });
    },
    [orders, paymentFilter, searchTerm, statusFilter]
  );

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`${API}/api/order-status/${orderId}`, { status });
      if (response.data.success) {
        fetchData();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (error) {
      console.error('Unable to update order status.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(`${API}/api/cancel-order/${orderId}`, {
        reason: 'Cancelled by business team'
      });

      if (response.data.success) {
        fetchData();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null);
        }
      }
    } catch (error) {
      console.error('Unable to cancel order.');
    }
  };

  const renderActionButtons = (order) => {
    if (order.status === 'pending') {
      return (
        <>
          <button type="button" className="orders-inline-btn orders-inline-btn--dark" onClick={() => updateStatus(order._id, 'preparing')}>
            <ChefHat size={15} /> Start preparing
          </button>
          <button type="button" className="orders-inline-btn orders-inline-btn--success" onClick={() => updateStatus(order._id, 'completed')}>
            <PackageCheck size={15} /> Complete
          </button>
          <button type="button" className="orders-inline-btn orders-inline-btn--danger" onClick={() => handleCancelOrder(order._id)}>
            <XCircle size={15} /> Cancel
          </button>
        </>
      );
    }

    if (order.status === 'preparing') {
      return (
        <>
          <button type="button" className="orders-inline-btn orders-inline-btn--success" onClick={() => updateStatus(order._id, 'completed')}>
            <PackageCheck size={15} /> Mark completed
          </button>
          <button type="button" className="orders-inline-btn orders-inline-btn--danger" onClick={() => handleCancelOrder(order._id)}>
            <XCircle size={15} /> Cancel order
          </button>
        </>
      );
    }

    return null;
  };

  const summaryCards = [
    { label: 'Total orders', value: dashboard?.totalOrders ?? orders.length, icon: Activity, tone: 'blue' },
    { label: 'Pending now', value: dashboard?.pendingOrders ?? orders.filter((order) => order.status === 'pending').length, icon: Clock3, tone: 'amber' },
    { label: 'Completed revenue', value: formatCurrency(dashboard?.completedRevenue ?? 0), icon: CheckCircle2, tone: 'green' },
    { label: 'Average order', value: formatCurrency(dashboard?.averageOrderValue ?? 0), icon: BarChart3, tone: 'violet' }
  ];

  return (
    <>
      <Navbar hideAuth={true} />
      <div className="orders-shell">
        <div className="orders-container">
          <section className="orders-hero">
            <div className="orders-hero__copy">
              <span className="orders-kicker">
                <Sparkles size={16} />
                Operations dashboard
              </span>
              <h1>{dashboard?.shopName || 'Live order management'}</h1>
              <p>Accept, prepare, complete.</p>
              <div className="orders-live-status">
                <span className={`orders-live-dot ${isSocketConnected ? 'is-online' : ''}`} />
                <strong>{isSocketConnected ? 'Live updates connected' : 'Live updates reconnecting'}</strong>
                {lastLiveEvent && <span>Last event {lastLiveEvent}</span>}
              </div>
            </div>

            <div className="orders-hero__actions">
              <button type="button" className="orders-btn orders-btn--secondary" onClick={fetchData}>
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                type="button"
                className={`orders-btn ${autoRefresh ? 'orders-btn--primary' : 'orders-btn--ghost'}`}
                onClick={() => setAutoRefresh((current) => !current)}
              >
                Auto {autoRefresh ? 'On' : 'Off'}
              </button>
            </div>
          </section>

          <section className="orders-stats">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <article className={`orders-stat-card orders-stat-card--${card.tone}`} key={card.label}>
                  <div className="orders-stat-card__icon">
                    <Icon size={20} />
                  </div>
                  <div>
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                  </div>
                </article>
              );
            })}
          </section>

          <div className="orders-layout">
            <section className="orders-panel">
              <div className="orders-panel__header">
                <div>
                  <h2>Top items</h2>
                  <p>Completed orders.</p>
                </div>
              </div>

              {dashboard?.topItems?.length ? (
                <div className="orders-top-list">
                  {dashboard.topItems.map((item) => (
                    <div key={item.name} className="orders-top-item">
                      <div className="orders-top-item__meta">
                        <strong>{item.name}</strong>
                        <span>{item.quantity} sold</span>
                      </div>
                      <b>{formatCurrency(item.revenue)}</b>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="orders-empty-copy">No top items yet.</p>
              )}
            </section>

            <section className="orders-panel">
              <div className="orders-panel__header orders-panel__header--stack">
                <div>
                  <h2>Order queue</h2>
                  <p>Live service queue.</p>
                </div>

                <div className="orders-filter-panel">
                  <label className="orders-search">
                    <Search size={16} />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search customer, table, or item"
                    />
                  </label>
                  <div className="orders-filter-row">
                    <select
                      className="orders-select"
                      value={paymentFilter}
                      onChange={(event) => setPaymentFilter(event.target.value)}
                    >
                      <option value="all">All payments</option>
                      <option value="cash">Cash</option>
                      <option value="razorpay">Online</option>
                    </select>
                  {statusOptions.map((status) => (
                    <button
                      type="button"
                      key={status}
                      className={`orders-filter ${statusFilter === status ? 'is-active' : ''}`}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                  </div>
                </div>
              </div>

              <div className="orders-queue-insight">
                <span><Zap size={15} /> {filteredOrders.length} orders in this view</span>
                <span>{orders.filter((order) => order.status === 'preparing').length} currently in kitchen</span>
              </div>

              {isLoading ? (
                <p className="orders-empty-copy">Loading orders...</p>
              ) : filteredOrders.length === 0 ? (
                <div className="orders-empty-state">
                  <div><PackageCheck size={24} /></div>
                  <strong>No matching orders</strong>
                  <p>New table orders will appear here instantly.</p>
                </div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map((order) => (
                    <article key={order._id} className={`orders-card orders-card--${order.status}`}>
                      <div className="orders-card__top">
                        <div>
                          <div className="orders-card__title-row">
                            <strong>Order #{order._id.slice(-6)}</strong>
                            <span className={`orders-badge orders-badge--${order.status}`}>
                              {order.status}
                            </span>
                            <span className="orders-card__item-count">{(order.items || []).length} item{(order.items || []).length === 1 ? '' : 's'}</span>
                          </div>
                          <div className="orders-card__meta">
                            Customer {order.customerName} | Table {order.tableNumber}
                          </div>
                          <div className="orders-card__meta">
                            Payment {order.paymentMethod} | {order.paymentStatus}
                          </div>
                          <div className="orders-card__meta">
                            Placed {new Date(order.createdAt).toLocaleString()}
                          </div>
                          {order.customerNote && <div className="orders-card__note">Note: {order.customerNote}</div>}
                        </div>

                        <div className="orders-card__side">
                          <div className="orders-card__total">{formatCurrency(order.total)}</div>
                          <div className="orders-card__actions">
                            <button type="button" className="orders-inline-btn orders-inline-btn--dark" onClick={() => setSelectedOrder(order)}>
                              View Details <ChevronRight size={16} />
                            </button>
                            {renderActionButtons(order)}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              className="order-details-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div 
              className="order-details-drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="order-details-drawer__header">
                <div>
                  <h2>Order #{selectedOrder._id.slice(-6)}</h2>
                  <span className={`orders-badge orders-badge--${selectedOrder.status}`}>{selectedOrder.status}</span>
                </div>
                <button className="order-details-drawer__close" onClick={() => setSelectedOrder(null)}><X size={24} /></button>
              </div>

              <div className="order-details-drawer__body">
                <div className="order-details-section">
                  <h3>Customer Details</h3>
                  <div className="order-details-grid">
                    <div className="order-details-item">
                      <User size={16} />
                      <div>
                        <label>Name</label>
                        <span>{selectedOrder.customerName || 'Guest'}</span>
                      </div>
                    </div>
                    <div className="order-details-item">
                      <Zap size={16} />
                      <div>
                        <label>Table</label>
                        <span>{selectedOrder.tableNumber || 'N/A'}</span>
                      </div>
                    </div>
                    {selectedOrder.customerPhone && (
                      <div className="order-details-item">
                        <Phone size={16} />
                        <div>
                          <label>Phone</label>
                          <span>{selectedOrder.customerPhone}</span>
                        </div>
                      </div>
                    )}
                    <div className="order-details-item">
                      <CreditCard size={16} />
                      <div>
                        <label>Payment</label>
                        <span>{selectedOrder.paymentMethod} · <b style={{textTransform:'capitalize', color: selectedOrder.paymentStatus === 'paid' ? '#16a34a' : '#ea580c'}}>{selectedOrder.paymentStatus}</b></span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.customerNote && (
                  <div className="order-details-section">
                    <div className="order-details-note">
                      <strong>Note from customer:</strong>
                      <p>{selectedOrder.customerNote}</p>
                    </div>
                  </div>
                )}

                <div className="order-details-section">
                  <h3>Order Items ({(selectedOrder.items || []).length})</h3>
                  <div className="order-details-items">
                    {(selectedOrder.items || []).map((item, index) => (
                      <div key={`${selectedOrder._id}-${index}`} className="order-details-item-row">
                        <div className="order-details-item-row__product">
                          <img src={getOrderItemImage(item.name)} alt="" />
                          <div>
                            <strong>{item.name}</strong>
                            <span>Qty {item.quantity || 1}</span>
                          </div>
                        </div>
                        <b>{formatCurrency((item.price || 0) * (item.quantity || 1))}</b>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="order-details-section order-details-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Paid</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="order-details-drawer__footer">
                <div className="order-details-drawer__actions">
                  {renderActionButtons(selectedOrder)}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default OrdersPage;
