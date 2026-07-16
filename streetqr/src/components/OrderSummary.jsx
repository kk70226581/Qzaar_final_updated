import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import {
  AlertCircle,
  ChefHat,
  Clock3,
  Copy,
  Home,
  PackageCheck,
  Receipt,
  RefreshCw,
  Share2,
  ShieldCheck,
  Wallet,
  XCircle
} from 'lucide-react';
import { cancelOrder, getMenu, getOrder, getSocket } from '../api';
import '../styles/OrderSummary.css';

const statusConfig = {
  pending: {
    label: 'Order received',
    tone: 'pending',
    icon: Clock3,
    title: 'The kitchen has your order',
    description: 'We are confirming the details and lining it up for preparation.',
    progress: 25
  },
  preparing: {
    label: 'Preparing',
    tone: 'preparing',
    icon: ChefHat,
    title: 'Your food is being prepared',
    description: 'The kitchen is actively working on your items right now.',
    progress: 68
  },
  completed: {
    label: 'Ready / completed',
    tone: 'completed',
    icon: PackageCheck,
    title: 'Your order is ready',
    description: 'The order has been completed and should be ready for pickup or service.',
    progress: 100
  },
  cancelled: {
    label: 'Cancelled',
    tone: 'cancelled',
    icon: XCircle,
    title: 'This order was cancelled',
    description: 'If payment was completed, the refund status is shown below.',
    progress: 100
  }
};

const trackerSteps = [
  { id: 'pending', label: 'Received', icon: Clock3 },
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'completed', label: 'Ready', icon: PackageCheck }
];

const formatCurrency = (value) => `Rs ${Number(value || 0).toFixed(0)}`;
const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : 'Not available');

function BrandLogo({ logo, shopName }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [logo]);

  if (!logo || hasError) {
    return (
      <div className="order-tracker-brand__fallback">
        <ChefHat size={28} />
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={shopName || 'Restaurant logo'}
      className="order-tracker-brand__image"
      onError={() => setHasError(true)}
    />
  );
}

function OrderSummary() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [shopMeta, setShopMeta] = useState({ shopName: '', logo: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const socket = getSocket();

  const fetchOrder = useCallback(async () => {
    try {
      const response = await getOrder(orderId);
      if (response.data.success) {
        setOrder(response.data.order);
        setError(null);
        setLastUpdated(new Date());
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.message || 'Unable to fetch order details.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const handleOrderStatusUpdate = useCallback((data) => {
    if (data.orderId === orderId || !data.orderId) {
      setOrder((prev) => (prev ? {
        ...prev,
        status: data.status,
        estimatedReadyAt: data.estimatedReadyAt || prev.estimatedReadyAt
      } : prev));
      setLastUpdated(new Date());
      toast.success(`Order status updated: ${String(data.status || '').toUpperCase()}`);
    }
  }, [orderId]);

  const handleOrderCancelled = useCallback((data) => {
    if (data.orderId === orderId || !data.orderId) {
      setOrder((prev) => (prev ? {
        ...prev,
        status: 'cancelled',
        refundAmount: data.refundAmount || prev.refundAmount
      } : prev));
      setLastUpdated(new Date());
      toast('Order has been cancelled');
    }
  }, [orderId]);

  const handlePaymentConfirmed = useCallback((data) => {
    if (data.orderId === orderId || !data.orderId) {
      setOrder((prev) => (prev ? {
        ...prev,
        paymentStatus: 'paid',
        paymentReference: data.paymentReference || prev.paymentReference
      } : prev));
      setLastUpdated(new Date());
      toast.success('Payment confirmed');
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    const refreshInterval = window.setInterval(fetchOrder, 10000);

    socket.emit('join_order_tracking', orderId);
    socket.on('order_status_changed', handleOrderStatusUpdate);
    socket.on('order_cancelled', handleOrderCancelled);
    socket.on('payment_confirmed', handlePaymentConfirmed);

    return () => {
      window.clearInterval(refreshInterval);
      socket.off('order_status_changed', handleOrderStatusUpdate);
      socket.off('order_cancelled', handleOrderCancelled);
      socket.off('payment_confirmed', handlePaymentConfirmed);
    };
  }, [fetchOrder, handleOrderCancelled, handleOrderStatusUpdate, handlePaymentConfirmed, orderId, socket]);

  useEffect(() => {
    if (!order?.shopId) {
      return;
    }

    const loadShopMeta = async () => {
      try {
        const response = await getMenu(order.shopId);
        if (response.data.success) {
          setShopMeta({
            shopName: response.data.shopName || '',
            logo: response.data.logo || ''
          });
        }
      } catch {
        setShopMeta({ shopName: '', logo: '' });
      }
    };

    loadShopMeta();
  }, [order?.shopId]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelling(true);
      const response = await cancelOrder(orderId, cancelReason);
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        setOrder((prev) => (prev ? {
          ...prev,
          status: 'cancelled',
          refundAmount: response.data.refundAmount
        } : prev));
        setLastUpdated(new Date());
        setShowCancelModal(false);
      } else {
        toast.error(response.data.message || 'Cancellation failed');
      }
    } catch {
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const copyTrackingLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Tracking link copied');
  };

  const shareTrackingLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order ${orderId}`,
          text: 'Track this order in real time',
          url: window.location.href
        });
        return;
      } catch {
        // Fall back to copy.
      }
    }

    copyTrackingLink();
  };

  const getTimeRemaining = useCallback(() => {
    if (!order?.estimatedReadyAt) return 'Calculating...';
    const remaining = new Date(order.estimatedReadyAt) - new Date();
    const minutes = Math.max(0, Math.ceil(remaining / 1000 / 60));
    return `${minutes} min`;
  }, [order]);

  const currentStatus = statusConfig[order?.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;
  const isCompleted = order?.status === 'completed';
  const isCancelled = order?.status === 'cancelled';
  const canCancel = order && !isCompleted && !isCancelled;

  const subTotal = Number(order?.subTotal || order?.subtotal || order?.total || 0);
  const discountAmount = Number(order?.discountAmount || 0);
  const taxAmount = Number(order?.taxes || 0);
  const totalAmount = Number(order?.total || 0);
  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - ((currentStatus.progress / 100) * ringCircumference);

  const recognitionItems = useMemo(() => [
    {
      label: 'Kitchen recognition',
      value: order?.status === 'pending' ? 'Order acknowledged' : order?.status === 'preparing' ? 'In progress' : order?.status === 'completed' ? 'Finished' : 'Cancelled'
    },
    {
      label: 'Payment recognition',
      value: order?.paymentStatus === 'paid' ? 'Verified payment' : 'Pending payment'
    },
    {
      label: 'Refresh system',
      value: lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Waiting for first sync'
    }
  ], [lastUpdated, order]);

  if (loading) {
    return (
      <div className="order-summary-container">
        <div className="order-tracker-state">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-summary-container">
        <div className="order-tracker-state order-tracker-state--error">
          <AlertCircle size={46} />
          <h3>Order not found</h3>
          <p>{error || 'The order you are looking for does not exist.'}</p>
          <Link to="/" className="tracker-btn tracker-btn--primary">
            <Home size={18} /> Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="order-summary-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="order-tracker-shell">
        <section className={`order-tracker-hero order-tracker-hero--${currentStatus.tone}`}>
          <div className="order-tracker-hero__copy">
            <div className="order-tracker-live">
              <span className="order-tracker-live__dot" />
              Live tracking active
            </div>
            <div className="order-tracker-brand">
              <div className="order-tracker-brand__logo">
                <BrandLogo logo={shopMeta.logo} shopName={shopMeta.shopName} />
              </div>
              <div className="order-tracker-brand__copy">
                <span>Restaurant</span>
                <strong>{shopMeta.shopName || 'Your restaurant'}</strong>
              </div>
            </div>
            <h1>{currentStatus.title}</h1>
            <p>{currentStatus.description}</p>

            <div className="order-tracker-hero__meta">
              <div>
                <span>Tracking code</span>
                <strong>#{orderId.slice(-6).toUpperCase()}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{currentStatus.label}</strong>
              </div>
              <div>
                <span>ETA</span>
                <strong>{isCompleted ? 'Ready now' : isCancelled ? 'Cancelled' : getTimeRemaining()}</strong>
              </div>
            </div>
          </div>

          <div className="order-tracker-hero__status-card">
            <div className="order-tracker-status-card__brand">
              <div className="order-tracker-status-card__logo">
                <BrandLogo logo={shopMeta.logo} shopName={shopMeta.shopName} />
              </div>
              <div>
                <span>Tracking with</span>
                <strong>{shopMeta.shopName || 'Restaurant team'}</strong>
              </div>
            </div>
            <div className="order-tracker-ring">
              <svg viewBox="0 0 140 140" className="order-tracker-ring__svg" aria-hidden="true">
                <circle className="order-tracker-ring__track" cx="70" cy="70" r={ringRadius} />
                <motion.circle
                  className="order-tracker-ring__progress"
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  initial={{ strokeDashoffset: ringCircumference }}
                  animate={{ strokeDashoffset: ringOffset }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    strokeDasharray: ringCircumference,
                    strokeDashoffset: ringOffset
                  }}
                />
              </svg>
              <div className={`order-tracker-status-icon order-tracker-status-icon--${currentStatus.tone}`}>
                <StatusIcon size={34} />
              </div>
              <div className="order-tracker-ring__center">
                <strong>{currentStatus.progress}%</strong>
                <span>tracked</span>
              </div>
            </div>
            <strong>{currentStatus.progress}% complete</strong>
            <span>{order.paymentStatus === 'paid' ? 'Payment verified' : 'Payment pending'}</span>
            <div className="order-tracker-progress">
              <div className="order-tracker-progress__bar" style={{ width: `${currentStatus.progress}%` }} />
            </div>
            <small>Placed on {formatDateTime(order.createdAt)}</small>
          </div>
        </section>

        <section className="order-tracker-grid">
          <div className="order-tracker-main">
            <article className="tracker-card">
              <div className="tracker-card__header">
                <h2>Tracking timeline</h2>
                <button type="button" className="tracker-inline-btn" onClick={fetchOrder}>
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>

              <div className="tracker-timeline">
                {trackerSteps.map((step, index) => {
                  const stepConfig = statusConfig[step.id];
                  const StepIcon = step.icon;
                  const isActive = step.id === 'pending'
                    || (step.id === 'preparing' && ['preparing', 'completed'].includes(order.status))
                    || (step.id === 'completed' && order.status === 'completed');

                  return (
                    <React.Fragment key={step.id}>
                      <div className={`tracker-timeline__step ${isActive ? 'is-active' : ''} ${order.status === 'cancelled' ? 'is-muted' : ''}`}>
                        <div className="tracker-timeline__marker"><StepIcon size={18} /></div>
                        <strong>{step.label}</strong>
                        <span>{stepConfig.description}</span>
                      </div>
                      {index < trackerSteps.length - 1 && <div className={`tracker-timeline__line ${isActive && order.status !== 'cancelled' ? 'is-active' : ''}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </article>

            <article className="tracker-card tracker-card--details">
              <div className="tracker-card__header">
                <h2>Recognition system</h2>
                <span className={`tracker-pill tracker-pill--${currentStatus.tone}`}>{currentStatus.label}</span>
              </div>

              <div className="tracker-recognition">
                {recognitionItems.map((item) => (
                  <div key={item.label} className="tracker-recognition__item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="tracker-card tracker-card--details">
              <div className="tracker-card__header">
                <h2>Order details</h2>
                <span className="tracker-muted">{formatDateTime(order.createdAt)}</span>
              </div>

              <div className="tracker-details">
                <div><span>Customer</span><strong>{order.customerName}</strong></div>
                <div><span>Table</span><strong>{order.tableNumber}</strong></div>
                {order.customerEmail ? <div><span>Email</span><strong>{order.customerEmail}</strong></div> : null}
                {order.customerPhone ? <div><span>Phone</span><strong>{order.customerPhone}</strong></div> : null}
                {order.customerNote ? <div className="tracker-details__wide"><span>Special note</span><strong>{order.customerNote}</strong></div> : null}
              </div>
            </article>

            <article className="tracker-card tracker-card--details">
              <div className="tracker-card__header">
                <h2>Items ordered</h2>
                <span className="tracker-muted">{order.items?.length || 0} items</span>
              </div>

              <div className="tracker-items">
                {(order.items || []).map((item, index) => (
                  <div key={`${item.name}-${index}`} className="tracker-items__row">
                    <div>
                      <strong>{item.name}</strong>
                      <span>Qty {item.quantity} • {item.prepTime ? `${item.prepTime} min prep` : 'Kitchen timing available'}</span>
                    </div>
                    <b>{formatCurrency(Number(item.price) * Number(item.quantity || 1))}</b>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="order-tracker-sidebar">
            <article className="tracker-card">
              <div className="tracker-card__header">
                <h2>Payment and total</h2>
                <Wallet size={18} />
              </div>
              <div className="tracker-pricing">
                <div><span>Subtotal</span><strong>{formatCurrency(subTotal)}</strong></div>
                {discountAmount > 0 ? <div className="is-discount"><span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span><strong>-{formatCurrency(discountAmount)}</strong></div> : null}
                {taxAmount > 0 ? <div><span>Taxes</span><strong>{formatCurrency(taxAmount)}</strong></div> : null}
                <div className="is-total"><span>Total</span><strong>{formatCurrency(totalAmount)}</strong></div>
              </div>
              <div className={`tracker-payment tracker-payment--${order.paymentStatus || 'pending'}`}>
                <ShieldCheck size={18} />
                <div>
                  <strong>{order.paymentStatus === 'paid' ? 'Payment verified' : 'Payment pending'}</strong>
                  <span>{order.paymentReference ? `Reference ${order.paymentReference}` : 'Waiting for confirmation'}</span>
                </div>
              </div>
              {isCancelled && Number(order.refundAmount) > 0 ? (
                <div className="tracker-refund">Refund amount: {formatCurrency(order.refundAmount)}</div>
              ) : null}
            </article>

            <article className="tracker-card">
              <div className="tracker-card__header">
                <h2>Share tracking</h2>
                <Share2 size={18} />
              </div>
              <div className="tracker-qr">
                <QRCode value={window.location.href} size={164} level="H" />
              </div>
              <div className="tracker-actions">
                <button type="button" className="tracker-btn tracker-btn--secondary" onClick={copyTrackingLink}>
                  <Copy size={17} /> Copy link
                </button>
                <button type="button" className="tracker-btn tracker-btn--secondary" onClick={shareTrackingLink}>
                  <Share2 size={17} /> Share
                </button>
                {canCancel ? (
                  <button type="button" className="tracker-btn tracker-btn--danger" onClick={() => setShowCancelModal(true)}>
                    <XCircle size={17} /> Cancel order
                  </button>
                ) : null}
                <Link to="/" className="tracker-btn tracker-btn--primary">
                  <Home size={17} /> Place new order
                </Link>
              </div>
            </article>

            <article className="tracker-card tracker-card--compact">
              <div className="tracker-card__header">
                <h2>Support snapshot</h2>
                <Receipt size={18} />
              </div>
              <div className="tracker-support">
                <div><span>Last sync</span><strong>{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Waiting...'}</strong></div>
                <div><span>Ready at</span><strong>{order.estimatedReadyAt ? formatDateTime(order.estimatedReadyAt) : 'Calculating...'}</strong></div>
                <div><span>Order state</span><strong>{order.status}</strong></div>
              </div>
            </article>
          </aside>
        </section>
      </div>

      <AnimatePresence>
        {showCancelModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}>
              <h3>Cancel this order?</h3>
              <p>Tell the kitchen why the order is being cancelled so the team has the right context.</p>
              <textarea
                placeholder="Reason for cancellation..."
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                rows="4"
                className="cancel-textarea"
              />
              <div className="modal-buttons">
                <button className="tracker-btn tracker-btn--danger" onClick={handleCancelOrder} disabled={cancelling}>
                  {cancelling ? 'Cancelling...' : 'Confirm cancel'}
                </button>
                <button className="tracker-btn tracker-btn--secondary" onClick={() => setShowCancelModal(false)}>
                  Keep order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default OrderSummary;
