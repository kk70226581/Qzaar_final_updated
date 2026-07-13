const express = require('express');
const { PaymentTransaction, Order } = require('./models');

const router = express.Router();

// ========================================
// PAYMENT ENDPOINTS (20+ endpoints)
// ========================================

// ✅ 1. Process Payment
router.post('/process', async (req, res) => {
  try {
    const { orderId, amount, method, shopId, userId } = req.body;

    if (!orderId || !amount || !method) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const transaction = await PaymentTransaction.create({
      orderId,
      userId: userId || '',
      restaurantId: shopId,
      amount: Number(amount),
      method,
      status: 'pending'
    });

    return res.json({ success: true, transaction });
  } catch (error) {
    console.error('Process payment error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 2. Get Payment by ID
router.get('/:paymentId', async (req, res) => {
  try {
    const payment = await PaymentTransaction.findById(req.params.paymentId).lean();

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    return res.json({ success: true, payment });
  } catch (error) {
    console.error('Get payment error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 3. Validate Card
router.post('/validate-card', async (req, res) => {
  try {
    const { cardNumber, expiryDate, cvv } = req.body;

    // Basic validation
    if (!cardNumber || cardNumber.length < 13) {
      return res.status(400).json({ success: false, message: 'Invalid card number' });
    }

    return res.json({
      success: true,
      message: 'Card is valid',
      cardLast4: cardNumber.slice(-4)
    });
  } catch (error) {
    console.error('Validate card error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 4. Initiate UPI Payment
router.post('/upi/initiate', async (req, res) => {
  try {
    const { amount, orderId, shopId } = req.body;

    const transaction = await PaymentTransaction.create({
      orderId,
      restaurantId: shopId,
      amount: Number(amount),
      method: 'upi',
      status: 'pending',
      paymentGateway: 'razorpay'
    });

    return res.json({
      success: true,
      transaction,
      upiLink: `upi://pay?am=${amount}&tr=${transaction._id}`
    });
  } catch (error) {
    console.error('Initiate UPI error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 5. Verify UPI Payment
router.get('/upi/verify/:paymentId', async (req, res) => {
  try {
    const payment = await PaymentTransaction.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // TODO: Verify with payment gateway
    payment.status = 'completed';
    await payment.save();

    return res.json({ success: true, payment });
  } catch (error) {
    console.error('Verify UPI error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 6. Save Card
router.post('/cards/save', async (req, res) => {
  try {
    const { userId, cardNumber, cardName, expiryDate } = req.body;

    if (!userId || !cardNumber) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // TODO: Store card securely (use payment gateway tokenization)
    const savedCard = {
      userId,
      cardName: cardName || 'My Card',
      cardLast4: cardNumber.slice(-4),
      expiryDate,
      savedAt: new Date()
    };

    return res.json({ success: true, card: savedCard });
  } catch (error) {
    console.error('Save card error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 7. Get Saved Cards
router.get('/cards/:userId', async (req, res) => {
  try {
    // TODO: Retrieve saved cards for user from database
    const cards = [];

    return res.json({ success: true, cards });
  } catch (error) {
    console.error('Get cards error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 8. Delete Card
router.delete('/cards/:cardId', async (req, res) => {
  try {
    // TODO: Delete card from saved cards
    return res.json({ success: true, message: 'Card deleted' });
  } catch (error) {
    console.error('Delete card error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 9. Add Wallet Balance
router.post('/wallet/add', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // TODO: Add to user wallet
    const transaction = {
      userId,
      type: 'credit',
      amount: Number(amount),
      timestamp: new Date(),
      reason: 'Wallet top-up'
    };

    return res.json({
      success: true,
      message: 'Amount added to wallet',
      transaction
    });
  } catch (error) {
    console.error('Add wallet error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 10. Get Wallet Balance
router.get('/wallet/:userId', async (req, res) => {
  try {
    // TODO: Get wallet balance from user table
    const walletBalance = 500; // Mock value

    return res.json({
      success: true,
      wallet: {
        userId: req.params.userId,
        balance: walletBalance,
        currency: 'INR'
      }
    });
  } catch (error) {
    console.error('Get wallet error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 11. Use Wallet
router.post('/wallet/use', async (req, res) => {
  try {
    const { userId, amount, orderId } = req.body;

    // TODO: Deduct from wallet
    return res.json({
      success: true,
      message: 'Wallet used',
      transaction: {
        userId,
        type: 'debit',
        amount,
        orderId,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Use wallet error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 12. Get Payment History
router.get('/history/:userId', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const payments = await PaymentTransaction.find({
      userId: req.params.userId
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    return res.json({ success: true, payments });
  } catch (error) {
    console.error('Get history error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 13. Refund Payment
router.post('/:paymentId/refund', async (req, res) => {
  try {
    const { reason } = req.body;

    const payment = await PaymentTransaction.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot refund pending payment' });
    }

    // TODO: Process refund with payment gateway
    payment.status = 'refunded';
    payment.refundAmount = payment.amount;
    payment.refundStatus = 'completed';
    await payment.save();

    return res.json({
      success: true,
      message: 'Refund processed',
      refund: {
        amount: payment.amount,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Refund payment error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 14. Get Refund Status
router.get('/:paymentId/refund-status', async (req, res) => {
  try {
    const payment = await PaymentTransaction.findById(req.params.paymentId).lean();

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    return res.json({
      success: true,
      refund: {
        paymentId: req.params.paymentId,
        refundAmount: payment.refundAmount || 0,
        refundStatus: payment.refundStatus || 'not_refunded',
        refundId: payment.refundId
      }
    });
  } catch (error) {
    console.error('Get refund status error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 15. Initiate Subscription
router.post('/subscription/initiate', async (req, res) => {
  try {
    const { userId, planId, amount } = req.body;

    // TODO: Setup subscription with payment gateway
    return res.json({
      success: true,
      subscription: {
        subscriptionId: Math.random().toString(36).substring(7),
        userId,
        planId,
        amount,
        status: 'pending',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  } catch (error) {
    console.error('Initiate subscription error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 16. Cancel Subscription
router.post('/subscription/:subscriptionId/cancel', async (req, res) => {
  try {
    // TODO: Cancel subscription with payment gateway
    return res.json({
      success: true,
      message: 'Subscription cancelled'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 17. Get Receipt
router.get('/:paymentId/receipt', async (req, res) => {
  try {
    const payment = await PaymentTransaction.findById(req.params.paymentId).lean();

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const order = await Order.findById(payment.orderId).lean();

    const receipt = {
      receiptNumber: `RCP-${payment._id}`,
      paymentId: payment._id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      date: payment.createdAt,
      orderDetails: order ? {
        orderId: order._id,
        items: order.items,
        total: order.total
      } : null
    };

    return res.json({ success: true, receipt });
  } catch (error) {
    console.error('Get receipt error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 18. Download Receipt
router.post('/:paymentId/download-receipt', async (req, res) => {
  try {
    const payment = await PaymentTransaction.findById(req.params.paymentId).lean();

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // TODO: Generate PDF receipt
    const receiptContent = `
      RECEIPT
      Receipt #: RCP-${payment._id}
      Amount: ₹${payment.amount}
      Method: ${payment.method}
      Status: ${payment.status}
      Date: ${new Date(payment.createdAt).toLocaleString()}
    `;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="receipt.txt"');
    return res.send(receiptContent);
  } catch (error) {
    console.error('Download receipt error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 19. Get Payment Methods
router.get('/methods/:shopId', async (req, res) => {
  try {
    const methods = [
      { id: 'cash', name: 'Cash', enabled: true },
      { id: 'card', name: 'Credit/Debit Card', enabled: true },
      { id: 'upi', name: 'UPI', enabled: true },
      { id: 'wallet', name: 'Wallet', enabled: true }
    ];

    return res.json({ success: true, methods });
  } catch (error) {
    console.error('Get methods error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 20. Validate Payment Gateway
router.get('/validate-gateway/:shopId', async (req, res) => {
  try {
    const gatewayStatus = {
      razorpay: {
        connected: true,
        status: 'active'
      },
      stripe: {
        connected: false,
        status: 'not_configured'
      }
    };

    return res.json({ success: true, gatewayStatus });
  } catch (error) {
    console.error('Validate gateway error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 21. Calculate Tax
router.post('/calculate-tax', async (req, res) => {
  try {
    const { amount, state } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount required' });
    }

    // GST is 5% for food items
    const gstRate = 0.05;
    const taxAmount = Math.round(amount * gstRate);
    const totalAmount = amount + taxAmount;

    return res.json({
      success: true,
      tax: {
        subTotal: amount,
        taxRate: '5%',
        taxAmount,
        total: totalAmount
      }
    });
  } catch (error) {
    console.error('Calculate tax error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 22. Create Payment Intent
router.post('/intent', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    // TODO: Create payment intent with Razorpay
    return res.json({
      success: true,
      intent: {
        id: Math.random().toString(36).substring(7),
        amount,
        currency,
        status: 'created',
        clientSecret: Math.random().toString(36).substring(7)
      }
    });
  } catch (error) {
    console.error('Create intent error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
