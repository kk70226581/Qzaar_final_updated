import React, { useState } from 'react';
import { validateCoupon } from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Ticket, Check, X } from 'lucide-react';
import '../styles/CouponApplier.css';

const CouponApplier = ({ shopId, cartTotal, onCouponApplied }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      const response = await validateCoupon(shopId, couponCode.toUpperCase(), cartTotal);

      if (response.data.success) {
        const coupon = response.data.coupon;
        setAppliedCoupon(coupon);
        toast.success(`✅ Coupon applied! Discount: ₹${coupon.discountAmount}`);

        onCouponApplied && onCouponApplied({
          code: coupon.code,
          discountAmount: coupon.discountAmount,
          discountType: coupon.discountType,
          description: coupon.description
        });

        setShowInput(false);
      } else {
        toast.error(response.data.message || 'Invalid coupon');
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast.error('Failed to validate coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    onCouponApplied && onCouponApplied(null);
    toast('Coupon removed');
  };

  return (
    <motion.div
      className="coupon-applier"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {appliedCoupon ? (
        <div className="coupon-applied">
          <div className="coupon-header">
            <Check size={20} className="success-icon" />
            <span className="coupon-code">{appliedCoupon.code}</span>
            <button
              className="remove-coupon-btn"
              onClick={handleRemoveCoupon}
              title="Remove coupon"
            >
              <X size={18} />
            </button>
          </div>
          <div className="coupon-details">
            <p className="coupon-description">{appliedCoupon.description}</p>
            <div className="coupon-discount">
              <span className="discount-label">Discount:</span>
              <span className="discount-amount">₹{appliedCoupon.discountAmount}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="coupon-input-container">
          {!showInput ? (
            <button
              className="add-coupon-btn"
              onClick={() => setShowInput(true)}
            >
              <Ticket size={18} />
              Apply Coupon Code
            </button>
          ) : (
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="coupon-input"
                autoFocus
              />
              <button type="submit" className="apply-btn" disabled={loading}>
                {loading ? '...' : 'Apply'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowInput(false);
                  setCouponCode('');
                }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CouponApplier;
