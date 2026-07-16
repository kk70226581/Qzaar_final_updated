import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard, Loader2, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { createRazorpayOrder, verifyPayment } from '../api';
import '../styles/PaymentGateway.css';

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

function PaymentGateway({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  tableNumber,
  shopId,
  items,
  couponCode = '',
  discountAmount = 0,
  subTotal,
  onSuccess,
  onClose
}) {
  const [status, setStatus] = useState('Preparing secure payment...');
  const [isLaunching, setIsLaunching] = useState(true);
  const hasLaunchedRef = useRef(false);

  useEffect(() => {
    if (hasLaunchedRef.current) {
      return undefined;
    }

    hasLaunchedRef.current = true;
    let isMounted = true;

    const startPayment = async () => {
      try {
        setStatus('Connecting to Razorpay...');
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay checkout.');
        }

        if (!isMounted) {
          return;
        }

        setStatus('Creating your payment request...');
        const orderResponse = await createRazorpayOrder({
          shopId,
          customerName,
          customerEmail,
          customerPhone,
          tableNumber: tableNumber || 'Online',
          items,
          total: amount,
          subTotal: subTotal || amount,
          couponCode,
          discountAmount,
          paymentMethod: 'razorpay'
        });

        if (!orderResponse.data.success) {
          throw new Error(orderResponse.data.message || 'Failed to initialize payment.');
        }

        const { razorpayOrderId, keyId, currency, orderId } = orderResponse.data;

        const razorpay = new window.Razorpay({
          key: keyId,
          amount: Math.round(amount * 100),
          currency,
          name: 'Qzaar',
          description: 'Food order payment',
          order_id: razorpayOrderId,
          customer_notification: 1,
          modal: {
            ondismiss: () => {
              if (isMounted) {
                toast('Payment was cancelled.');
                onClose?.();
              }
            }
          },
          handler: async (response) => {
            try {
              setStatus('Verifying payment...');
              const verifyResponse = await verifyPayment({
                razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId
              });

              if (!verifyResponse.data.success) {
                throw new Error('Payment verification failed.');
              }

              toast.success('Payment successful!');
              onSuccess?.(verifyResponse.data.order);
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error(error.message || 'Payment verification failed.');
              onClose?.();
            }
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone
          },
          notes: {
            shopId,
            tableNumber
          },
          theme: {
            color: '#f97316'
          }
        });

        razorpay.on('payment.failed', (response) => {
          toast.error(response.error?.description || 'Payment failed.');
          onClose?.();
        });

        if (!isMounted) {
          return;
        }

        setStatus('Opening Razorpay...');
        setIsLaunching(false);
        razorpay.open();
      } catch (error) {
        console.error('Payment error:', error);
        toast.error(error.message || 'Payment failed. Please try again.');
        onClose?.();
      }
    };

    startPayment();

    return () => {
      isMounted = false;
    };
  }, [amount, couponCode, customerEmail, customerName, customerPhone, discountAmount, items, onClose, onSuccess, shopId, subTotal, tableNumber]);

  return (
    <div className="payment-launcher" role="status" aria-live="polite">
      <div className="payment-launcher__backdrop" />
      <div className="payment-launcher__card">
        <button type="button" className="payment-launcher__close" onClick={() => onClose?.()} aria-label="Close payment">
          <X size={18} />
        </button>

        <div className="payment-launcher__media">
          <img src="/images/ads/cart-cartoon-banner.png" alt="" />
        </div>

        <div className="payment-launcher__icon">
          <Loader2 size={24} className={isLaunching ? 'payment-launcher__spinner' : ''} />
        </div>

        <h3>Redirecting to Razorpay</h3>
        <p>{status}</p>

        <div className="payment-launcher__amount">Rs {Number(amount || 0).toFixed(2)}</div>

        <div className="payment-launcher__steps" aria-hidden="true">
          <span className="is-active"><LockKeyhole size={14} /> Secure</span>
          <span><CreditCard size={14} /> Pay</span>
          <span><ShieldCheck size={14} /> Verify</span>
        </div>

        <div className="payment-launcher__trust">
          <ShieldCheck size={16} />
          <span>Secure checkout powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;
