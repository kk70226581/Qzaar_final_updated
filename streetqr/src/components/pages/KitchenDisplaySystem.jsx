import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, ChefHat, Clock, LoaderCircle, Maximize2, Minimize2, RefreshCw, Volume2, Wifi, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOrders, getSocket, updateOrderStatus } from '../../api';
import { ModernButton } from '../ui';
import AdminLayout from '../layout/AdminLayout';
import '../../styles/pages/KitchenDisplaySystem.css';

const activeStatuses = new Set(['pending', 'confirmed', 'preparing', 'ready']);
const normalizeStatus = (status) => (status === 'confirmed' ? 'pending' : status);

const KitchenDisplaySystem = () => {
  const [orders, setOrders] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const boardRef = useRef(null);
  const shopId = localStorage.getItem('shopId');

  const fetchOrders = useCallback(async ({ silent = false } = {}) => {
    if (!shopId) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    if (silent) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const response = await getOrders(shopId);
      if (!response.data.success) throw new Error(response.data.message || 'Unable to load kitchen orders.');
      const liveOrders = (response.data.orders || [])
        .filter((order) => activeStatuses.has(order.status))
        .map((order) => ({
          ...order,
          id: order._id,
          displayId: `ORD-${String(order._id).slice(-5).toUpperCase()}`,
          status: normalizeStatus(order.status),
          orderTime: new Date(order.createdAt || Date.now()).getTime(),
          prepTime: Number(order.estimatedPrepMinutes) || 15,
          items: (order.items || []).map((item) => ({
            name: item.name || 'Menu item',
            qty: Number(item.quantity || item.qty || 1),
            notes: item.notes || item.note || '',
          })),
        }));
      setOrders(liveOrders);
      setLastSyncedAt(new Date());
    } catch (error) {
      console.error('Unable to load kitchen orders.', error);
      if (!silent) toast.error(error.response?.data?.message || error.message || 'Unable to load kitchen orders.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchOrders();
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    if (!shopId) return undefined;

    const socket = getSocket();
    const handleConnect = () => {
      setSocketConnected(true);
      socket.emit('join_shop', shopId);
    };
    const handleDisconnect = () => setSocketConnected(false);
    const handleOrderUpdate = () => fetchOrders({ silent: true });

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_order', handleOrderUpdate);
    socket.on('order_status_changed', handleOrderUpdate);
    socket.on('order_cancelled', handleOrderUpdate);
    if (socket.connected) handleConnect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_order', handleOrderUpdate);
      socket.off('order_status_changed', handleOrderUpdate);
      socket.off('order_cancelled', handleOrderUpdate);
    };
  }, [fetchOrders, shopId]);

  useEffect(() => {
    const handleFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getElapsedTime = (orderTime) => {
    const elapsed = Math.floor((now - orderTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    return `${minutes}:${String(elapsed % 60).padStart(2, '0')}`;
  };

  const playSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.25);
      oscillator.addEventListener('ended', () => audioContext.close());
    } catch { /* Audio is optional. */ }
  };

  const updateStatus = async (order, status) => {
    setUpdatingOrderId(order.id);
    try {
      const response = await updateOrderStatus(order.id, status);
      if (!response.data.success) throw new Error(response.data.message || 'Unable to update order.');
      setOrders((current) => status === 'completed'
        ? current.filter((item) => item.id !== order.id)
        : current.map((item) => item.id === order.id ? { ...item, status } : item));
      if (soundEnabled) playSound();
      toast.success(status === 'preparing' ? 'Order moved to preparing.' : status === 'ready' ? 'Order is ready for pickup.' : 'Order completed.');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to update order.');
    } finally {
      setUpdatingOrderId('');
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (boardRef.current?.requestFullscreen) await boardRef.current.requestFullscreen();
      else setFullscreen((current) => !current);
    } catch {
      setFullscreen((current) => !current);
    }
  };

  const groupedOrders = {
    pending: orders.filter((order) => order.status === 'pending'),
    preparing: orders.filter((order) => order.status === 'preparing'),
    ready: orders.filter((order) => order.status === 'ready'),
  };

  const OrderCard = ({ order }) => {
    const isOverdue = now - order.orderTime > order.prepTime * 60 * 1000;
    const isUpdating = updatingOrderId === order.id;
    const nextStatus = order.status === 'pending' ? 'preparing' : order.status === 'preparing' ? 'ready' : 'completed';
    const actionLabel = order.status === 'pending' ? 'Start preparing' : order.status === 'preparing' ? 'Mark ready' : 'Complete order';

    return (
      <motion.article className="kds__order-card" layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <div className="kds__order-header">
          <div><h3 className="kds__order-id">{order.displayId}</h3><small>Table {order.tableNumber || '—'}</small></div>
          <span className={`kds__priority kds__priority--${order.priority || 'normal'}`}>{order.priority || 'normal'} priority</span>
        </div>
        <div className={`kds__order-timer ${isOverdue ? 'is-overdue' : ''}`}><Clock size={18} /><span className="kds__order-time">{getElapsedTime(order.orderTime)}</span><span className="kds__order-target">/ {order.prepTime} min</span>{isOverdue && <strong>Overdue</strong>}</div>
        <div className="kds__order-items">
          {order.items.map((item, index) => <div key={`${item.name}-${index}`} className="kds__order-item"><span className="kds__item-qty">{item.qty}×</span><span className="kds__item-name">{item.name}</span>{item.notes && <span className="kds__item-notes">{item.notes}</span>}</div>)}
        </div>
        <ModernButton variant={order.status === 'preparing' ? 'success' : 'primary'} size="md" className="kds__action-btn" disabled={isUpdating} onClick={() => updateStatus(order, nextStatus)}>
          {isUpdating ? <LoaderCircle size={16} className="kds__spin" /> : nextStatus === 'preparing' ? <ChefHat size={16} /> : <CheckCircle size={16} />}
          {isUpdating ? 'Updating…' : actionLabel}
        </ModernButton>
      </motion.article>
    );
  };

  const renderColumn = (status, title, emptyText) => (
    <section className={`kds__column ${status === 'ready' ? 'kds__column--ready' : ''}`}>
      <header className="kds__column-header"><h2 className="kds__column-title">{title}</h2><span className="kds__column-count">{groupedOrders[status].length}</span></header>
      <div className="kds__column-content">
        {groupedOrders[status].length ? groupedOrders[status].map((order) => <OrderCard key={order.id} order={order} />) : <div className="kds__empty-state"><CheckCircle size={36} /><p>{emptyText}</p></div>}
      </div>
    </section>
  );

  if (!shopId) {
    return <AdminLayout title="Kitchen Display System"><div className="kds__setup-state"><AlertCircle size={34} /><h2>Sign in to open your kitchen queue</h2><p>Kitchen orders are connected to the currently signed-in restaurant.</p></div></AdminLayout>;
  }

  return (
    <AdminLayout title="Kitchen Display System">
      <div ref={boardRef} className={fullscreen ? 'kds kds--fullscreen' : 'kds'}>
        <header className="kds__toolbar">
          <div className="kds__toolbar-copy"><p><span /> {socketConnected ? 'Live kitchen queue' : 'Reconnecting kitchen queue'}</p><h2>Service control</h2><small>{isLoading ? 'Loading orders…' : `${orders.length} active ${orders.length === 1 ? 'order' : 'orders'}${lastSyncedAt ? ` · synced ${lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`}</small></div>
          <div className="kds__toolbar-actions"><span className={`kds__connection ${socketConnected ? 'is-live' : ''}`}>{socketConnected ? <Wifi size={15} /> : <WifiOff size={15} />}{socketConnected ? 'Live' : 'Offline'}</span><button className={`kds__toolbar-btn ${soundEnabled ? 'active' : ''}`} onClick={() => setSoundEnabled((current) => !current)} aria-label="Toggle sound"><Volume2 size={20} /></button><button className="kds__toolbar-btn" onClick={toggleFullscreen} aria-label="Toggle fullscreen">{fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}</button><button className="kds__toolbar-btn" onClick={() => fetchOrders({ silent: true })} aria-label="Refresh orders" disabled={isRefreshing}>{isRefreshing ? <LoaderCircle size={20} className="kds__spin" /> : <RefreshCw size={20} />}</button></div>
        </header>
        <div className="kds__columns">{renderColumn('pending', 'Pending', 'No new orders')} {renderColumn('preparing', 'Preparing', 'Nothing in the kitchen')} {renderColumn('ready', 'Ready', 'No orders ready for pickup')}</div>
      </div>
    </AdminLayout>
  );
};

export default KitchenDisplaySystem;
