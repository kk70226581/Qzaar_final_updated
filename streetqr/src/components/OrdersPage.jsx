import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import axios from 'axios';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  UtensilsCrossed,
  Wifi,
  WifiOff,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSocket } from '../api';
import Navbar from './Navbar';
import './OrdersPage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const statusOptions = ['all', 'pending', 'preparing', 'completed'];

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const formatOrderTime = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Time unavailable';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getOrderItemImage = (itemName = '') => {
  const name = itemName.toLowerCase();
  if (/coffee|shake/.test(name)) return '/images/menu/cold-coffee.png';
  if (/chai|lassi|soda/.test(name)) return '/images/menu/masala-chai.png';
  if (/chicken|tandoori/.test(name)) return '/images/menu/tandoori-chicken.png';
  if (/biryani|rice/.test(name)) return '/images/menu/biryani.png';
  if (/gulab|rasmalai|kulfi|brownie/.test(name)) return '/images/menu/gulab-jamun.png';
  return '/images/menu/paneer-tikka.png';
};

const getStatusIcon = (status) => {
  if (status === 'pending') return Clock3;
  if (status === 'preparing') return ChefHat;
  return CheckCircle2;
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
  const [lastSyncedAt, setLastSyncedAt] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const reduceMotion = useReducedMotion();
  const shopId = localStorage.getItem('shopId');

  const fetchData = useCallback(async () => {
    if (!shopId) {
      setErrorMessage('No restaurant workspace is selected. Open your dashboard and choose a workspace first.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const [ordersResponse, dashboardResponse] = await Promise.all([
        axios.get(`${API}/api/orders/${shopId}`),
        axios.get(`${API}/api/dashboard/${shopId}`),
      ]);

      if (ordersResponse.data.success) setOrders(ordersResponse.data.orders || []);
      if (dashboardResponse.data.success) setDashboard(dashboardResponse.data.dashboard);
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      setErrorMessage('Orders could not be refreshed. Check your connection and try again.');
      console.error('Unable to fetch order dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh || !shopId) return undefined;
    const intervalId = window.setInterval(fetchData, 25000);
    return () => window.clearInterval(intervalId);
  }, [autoRefresh, fetchData, shopId]);

  useEffect(() => {
    if (!shopId) return undefined;

    const socket = getSocket();
    const handleConnect = () => {
      setIsSocketConnected(true);
      socket.emit('join_shop', shopId);
    };
    const handleDisconnect = () => setIsSocketConnected(false);
    const handleLiveEvent = () => {
      setLastLiveEvent(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      fetchData();
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_order', handleLiveEvent);
    socket.on('order_status_changed', handleLiveEvent);
    socket.on('payment_received', handleLiveEvent);
    socket.on('order_cancelled', handleLiveEvent);
    if (socket.connected) handleConnect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_order', handleLiveEvent);
      socket.off('order_status_changed', handleLiveEvent);
      socket.off('payment_received', handleLiveEvent);
      socket.off('order_cancelled', handleLiveEvent);
    };
  }, [fetchData, shopId]);

  const statusCounts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((order) => order.status === 'pending').length,
    preparing: orders.filter((order) => order.status === 'preparing').length,
    completed: orders.filter((order) => order.status === 'completed').length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;
      const matchesSearch = !query || [
        order.customerName,
        order.customerEmail,
        order.tableNumber,
        order._id,
        ...(order.items || []).map((item) => item.name),
      ].some((value) => String(value || '').toLowerCase().includes(query));
      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, paymentFilter, searchTerm, statusFilter]);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`${API}/api/order-status/${orderId}`, { status });
      if (response.data.success) {
        await fetchData();
        if (selectedOrder?._id === orderId) setSelectedOrder((current) => ({ ...current, status }));
      }
    } catch (error) {
      setErrorMessage('That order status could not be changed. Please try again.');
      console.error('Unable to update order status.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(`${API}/api/cancel-order/${orderId}`, { reason: 'Cancelled by business team' });
      if (response.data.success) {
        await fetchData();
        if (selectedOrder?._id === orderId) setSelectedOrder(null);
      }
    } catch (error) {
      setErrorMessage('That order could not be cancelled. Please try again.');
      console.error('Unable to cancel order.');
    }
  };

  const renderDrawerActions = (order) => {
    if (order.status === 'pending') {
      return (
        <>
          <button type="button" className="orders-inline-btn orders-inline-btn--primary" onClick={() => updateStatus(order._id, 'preparing')}><ChefHat size={16} /> Start preparing</button>
          <button type="button" className="orders-inline-btn orders-inline-btn--success" onClick={() => updateStatus(order._id, 'completed')}><PackageCheck size={16} /> Complete</button>
          <button type="button" className="orders-inline-btn orders-inline-btn--danger" onClick={() => handleCancelOrder(order._id)}><XCircle size={16} /> Cancel</button>
        </>
      );
    }
    if (order.status === 'preparing') {
      return (
        <>
          <button type="button" className="orders-inline-btn orders-inline-btn--success" onClick={() => updateStatus(order._id, 'completed')}><PackageCheck size={16} /> Mark completed</button>
          <button type="button" className="orders-inline-btn orders-inline-btn--danger" onClick={() => handleCancelOrder(order._id)}><XCircle size={16} /> Cancel order</button>
        </>
      );
    }
    return <span className="orders-action-complete"><Check size={16} /> No action required</span>;
  };

  const summaryCards = [
    { label: 'All orders', value: dashboard?.totalOrders ?? statusCounts.all, helper: 'Recorded today', icon: Activity, tone: 'blue' },
    { label: 'Awaiting action', value: dashboard?.pendingOrders ?? statusCounts.pending, helper: statusCounts.pending ? 'Needs attention' : 'Queue is clear', icon: Clock3, tone: 'amber' },
    { label: 'In the kitchen', value: statusCounts.preparing, helper: 'Being prepared', icon: ChefHat, tone: 'violet' },
    { label: 'Completed', value: statusCounts.completed, helper: 'Finished orders', icon: CheckCircle2, tone: 'green' },
    { label: 'Completed revenue', value: formatCurrency(dashboard?.completedRevenue ?? 0), helper: `Avg. ${formatCurrency(dashboard?.averageOrderValue ?? 0)}`, icon: CircleDollarSign, tone: 'cyan' },
  ];

  const queueNeedsAttention = statusCounts.pending + statusCounts.preparing;

  return (
    <div className="orders-page">
      <Navbar hideAuth />
      <main className="orders-shell">
        <div className="orders-container">
          <section className="orders-hero">
            <div className="orders-hero__copy">
              <span className="orders-kicker"><Sparkles size={15} /> Live service desk</span>
              <h1>{dashboard?.shopName || 'Restaurant orders'}</h1>
              <p>Review every table order, move the kitchen queue, and close the service loop.</p>
              <div className="orders-live-status">
                <span className={`orders-live-dot ${isSocketConnected ? 'is-online' : ''}`} />
                <strong>{isSocketConnected ? 'Live updates connected' : 'Reconnecting live updates'}</strong>
                <i />
                <span>{lastLiveEvent ? `Last live event ${lastLiveEvent}` : lastSyncedAt ? `Synced ${lastSyncedAt}` : 'Preparing your queue'}</span>
              </div>
            </div>

            <div className="orders-hero__right">
              <div className={`orders-service-state ${queueNeedsAttention ? 'has-orders' : ''}`}>
                <span>{queueNeedsAttention ? <Zap size={18} /> : <Check size={18} />}</span>
                <div><small>SERVICE STATUS</small><b>{queueNeedsAttention ? `${queueNeedsAttention} active ${queueNeedsAttention === 1 ? 'order' : 'orders'}` : 'Queue is clear'}</b></div>
              </div>
              <div className="orders-hero__actions">
                <Link to="/modern/admin/kitchen" className="orders-btn orders-btn--kitchen"><ChefHat size={16} /> Kitchen display <ArrowRight size={15} /></Link>
                <button type="button" className="orders-btn orders-btn--secondary" onClick={fetchData} disabled={isLoading}><RefreshCw size={16} className={isLoading ? 'is-spinning' : ''} /> Refresh</button>
                <button type="button" role="switch" aria-checked={autoRefresh} className={`orders-auto-toggle ${autoRefresh ? 'is-on' : ''}`} onClick={() => setAutoRefresh((current) => !current)}><span /><b>Auto refresh</b><small>{autoRefresh ? 'On' : 'Off'}</small></button>
              </div>
            </div>
          </section>

          {errorMessage && <div className="orders-alert"><WifiOff size={17} /><span>{errorMessage}</span><button type="button" onClick={fetchData}>Try again</button></div>}

          <section className="orders-stats" aria-label="Order summary">
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article className={`orders-stat-card orders-stat-card--${card.tone}`} key={card.label} initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                  <div className="orders-stat-card__icon"><Icon size={19} /></div>
                  <div><span>{card.label}</span><strong>{card.value}</strong><small>{card.helper}</small></div>
                </motion.article>
              );
            })}
          </section>

          <div className="orders-layout">
            <aside className="orders-sidebar">
              <section className="orders-panel orders-pulse-panel">
                <div className="orders-panel__eyebrow"><Wifi size={14} /> Service pulse</div>
                <div className="orders-pulse-panel__heading"><div><h2>{queueNeedsAttention ? 'Queue in motion' : 'All caught up'}</h2><p>Live order distribution</p></div><span>{statusCounts.all}</span></div>
                <div className="orders-status-mix">
                  {[
                    ['Pending', statusCounts.pending, 'amber'],
                    ['Preparing', statusCounts.preparing, 'blue'],
                    ['Completed', statusCounts.completed, 'green'],
                  ].map(([label, count, tone]) => {
                    const width = statusCounts.all ? Math.max(6, (count / statusCounts.all) * 100) : 0;
                    return <div className="orders-status-mix__row" key={label}><span><b>{label}</b><small>{count}</small></span><i><em className={`is-${tone}`} style={{ width: `${width}%` }} /></i></div>;
                  })}
                </div>
                <div className="orders-average"><span><BarChart3 size={19} /></span><div><small>AVERAGE ORDER VALUE</small><b>{formatCurrency(dashboard?.averageOrderValue ?? 0)}</b></div></div>
              </section>

              <section className="orders-panel orders-top-panel">
                <div className="orders-panel__header"><div><span className="orders-panel__eyebrow"><UtensilsCrossed size={14} /> Menu signals</span><h2>Top items</h2><p>Ranked from completed orders.</p></div></div>
                {dashboard?.topItems?.length ? (
                  <div className="orders-top-list">
                    {dashboard.topItems.slice(0, 5).map((item, index) => (
                      <div key={item.name} className="orders-top-item">
                        <span className="orders-top-item__rank">{String(index + 1).padStart(2, '0')}</span>
                        <img src={getOrderItemImage(item.name)} alt="" />
                        <div className="orders-top-item__meta"><strong>{item.name}</strong><span>{item.quantity} sold</span></div>
                        <b>{formatCurrency(item.revenue)}</b>
                      </div>
                    ))}
                  </div>
                ) : <div className="orders-mini-empty"><ShoppingBag size={20} /><span><b>No top items yet</b><small>Completed orders will build this list.</small></span></div>}
              </section>
            </aside>

            <section className="orders-panel orders-queue-panel">
              <div className="orders-queue-header">
                <div><span className="orders-panel__eyebrow"><Activity size={14} /> Operational queue</span><h2>Orders</h2><p>{filteredOrders.length} visible · {statusCounts.preparing} currently in the kitchen</p></div>
                <div className="orders-queue-header__sync"><span className={`orders-live-dot ${isSocketConnected ? 'is-online' : ''}`} /><div><b>{isSocketConnected ? 'Live' : 'Syncing'}</b><small>{lastSyncedAt ? `Updated ${lastSyncedAt}` : 'Connecting'}</small></div></div>
              </div>

              <div className="orders-filter-panel">
                <label className="orders-search"><Search size={17} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search order, customer, table, or item" /></label>
                <select className="orders-select" value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} aria-label="Filter by payment method">
                  <option value="all">All payments</option><option value="cash">Cash</option><option value="razorpay">Online</option>
                </select>
              </div>

              <div className="orders-filter-row" role="tablist" aria-label="Filter orders by status">
                {statusOptions.map((status) => (
                  <button type="button" role="tab" aria-selected={statusFilter === status} key={status} className={`orders-filter ${statusFilter === status ? 'is-active' : ''}`} onClick={() => setStatusFilter(status)}>
                    <span className={`orders-filter__dot is-${status}`} />{status.charAt(0).toUpperCase() + status.slice(1)}<b>{statusCounts[status]}</b>
                  </button>
                ))}
              </div>

              {isLoading && !orders.length ? (
                <div className="orders-loading-list">{[1, 2, 3].map((item) => <span key={item} />)}</div>
              ) : filteredOrders.length === 0 ? (
                <div className="orders-empty-state"><div><PackageCheck size={25} /></div><strong>No matching orders</strong><p>Try another filter, or wait for the next table order.</p><button type="button" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPaymentFilter('all'); }}>Clear filters</button></div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map((order, index) => {
                    const StatusIcon = getStatusIcon(order.status);
                    const visibleItems = (order.items || []).slice(0, 2);
                    return (
                      <motion.article key={order._id} className={`orders-card orders-card--${order.status}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.035, 0.2) }}>
                        <div className="orders-card__status"><StatusIcon size={18} /><span /></div>
                        <div className="orders-card__content">
                          <div className="orders-card__heading">
                            <div className="orders-card__title-row"><strong>Order #{String(order._id || '').slice(-6)}</strong><span className={`orders-badge orders-badge--${order.status}`}>{order.status}</span></div>
                            <time><Clock3 size={13} /> {formatOrderTime(order.createdAt)}</time>
                          </div>
                          <div className="orders-card__context"><span><MapPin size={14} /> Table {order.tableNumber || '—'}</span><span><User size={14} /> {order.customerName || 'Guest'}</span><span><CreditCard size={14} /> {order.paymentMethod === 'razorpay' ? 'Online' : order.paymentMethod || 'Payment'} · {order.paymentStatus || 'pending'}</span></div>
                          <div className="orders-card__items">
                            {visibleItems.map((item, itemIndex) => <div className="orders-item-chip" key={`${order._id}-${itemIndex}`}><img src={getOrderItemImage(item.name)} alt="" /><span><b>{item.quantity || 1}× {item.name}</b><small>{formatCurrency((item.price || 0) * (item.quantity || 1))}</small></span></div>)}
                            {(order.items || []).length > 2 && <span className="orders-more-items">+{order.items.length - 2} more</span>}
                          </div>
                          {order.customerNote && <div className="orders-card__note"><Sparkles size={13} /><span><b>Guest note</b>{order.customerNote}</span></div>}
                        </div>
                        <div className="orders-card__side">
                          <div><small>ORDER TOTAL</small><strong>{formatCurrency(order.total)}</strong></div>
                          <button type="button" className="orders-view-btn" onClick={() => setSelectedOrder(order)}>View order <ChevronRight size={16} /></button>
                          {order.status === 'pending' && <button type="button" className="orders-quick-btn orders-quick-btn--primary" onClick={() => updateStatus(order._id, 'preparing')}><ChefHat size={15} /> Start preparing</button>}
                          {order.status === 'preparing' && <button type="button" className="orders-quick-btn orders-quick-btn--success" onClick={() => updateStatus(order._id, 'completed')}><PackageCheck size={15} /> Mark completed</button>}
                          {order.status === 'completed' && <span className="orders-card__done"><Check size={14} /> Service complete</span>}
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div className="order-details-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} />
            <motion.aside className="order-details-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 230 }} aria-label="Order details">
              <div className="order-details-drawer__header">
                <div className="order-details-drawer__identity"><span className={`is-${selectedOrder.status}`}>{React.createElement(getStatusIcon(selectedOrder.status), { size: 20 })}</span><div><small>ORDER DETAILS</small><h2>#{String(selectedOrder._id || '').slice(-6)}</h2><p><Clock3 size={13} /> Placed at {formatOrderTime(selectedOrder.createdAt)}</p></div></div>
                <button type="button" aria-label="Close order details" className="order-details-drawer__close" onClick={() => setSelectedOrder(null)}><X size={21} /></button>
              </div>

              <div className="order-details-drawer__body">
                <div className="order-details-progress">
                  {['pending', 'preparing', 'completed'].map((status, index) => {
                    const currentIndex = ['pending', 'preparing', 'completed'].indexOf(selectedOrder.status);
                    return <div className={index <= currentIndex ? 'is-complete' : ''} key={status}><span>{index < currentIndex ? <Check size={13} /> : index + 1}</span><b>{status}</b></div>;
                  })}
                </div>

                <section className="order-details-section">
                  <h3>Guest & table</h3>
                  <div className="order-details-grid">
                    <div className="order-details-item"><User size={17} /><div><label>Guest</label><span>{selectedOrder.customerName || 'Guest'}</span></div></div>
                    <div className="order-details-item"><MapPin size={17} /><div><label>Table</label><span>{selectedOrder.tableNumber || 'N/A'}</span></div></div>
                    {selectedOrder.customerPhone && <div className="order-details-item"><Phone size={17} /><div><label>Phone</label><span>{selectedOrder.customerPhone}</span></div></div>}
                    <div className="order-details-item"><CreditCard size={17} /><div><label>Payment</label><span>{selectedOrder.paymentMethod === 'razorpay' ? 'Online' : selectedOrder.paymentMethod} · <b className={`is-${selectedOrder.paymentStatus}`}>{selectedOrder.paymentStatus}</b></span></div></div>
                  </div>
                </section>

                {selectedOrder.customerNote && <section className="order-details-section"><div className="order-details-note"><Sparkles size={17} /><div><strong>Guest note</strong><p>{selectedOrder.customerNote}</p></div></div></section>}

                <section className="order-details-section">
                  <div className="order-details-section__title"><h3>Order items</h3><span>{(selectedOrder.items || []).length} items</span></div>
                  <div className="order-details-items">
                    {(selectedOrder.items || []).map((item, index) => <div key={`${selectedOrder._id}-${index}`} className="order-details-item-row"><div className="order-details-item-row__product"><img src={getOrderItemImage(item.name)} alt="" /><div><strong>{item.name}</strong><span>Quantity {item.quantity || 1}</span></div></div><b>{formatCurrency((item.price || 0) * (item.quantity || 1))}</b></div>)}
                  </div>
                </section>

                <section className="order-details-section order-details-summary">
                  <div className="summary-row"><span>Payment status</span><b>{selectedOrder.paymentStatus || 'pending'}</b></div>
                  <div className="summary-row total"><span>Order total</span><span>{formatCurrency(selectedOrder.total)}</span></div>
                </section>
              </div>

              <div className="order-details-drawer__footer"><div><small>NEXT STEP</small><b>{selectedOrder.status === 'pending' ? 'Send this order to the kitchen' : selectedOrder.status === 'preparing' ? 'Complete preparation and serve' : 'This order is complete'}</b></div><div className="order-details-drawer__actions">{renderDrawerActions(selectedOrder)}</div></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OrdersPage;
