const paymentService = require('../services/paymentService');
const Order = require('../models/Order');
const { logger } = require('../middleware/securityMiddleware');

// Process payment for an order
exports.processPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod, paymentDetails } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const result = await paymentService.processPayment(
      orderId,
      paymentMethod,
      paymentDetails
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Process refund for an order
exports.processRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (!order.canBeRefunded()) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be refunded in current status'
      });
    }

    const result = await paymentService.processRefund(
      orderId,
      amount,
      reason
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Refund processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Generate settlement report
exports.generateSettlementReport = async (req, res) => {
  try {
    const { vendorId, startDate, endDate } = req.query;

    if (!vendorId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    const report = await paymentService.generateSettlementReport(
      vendorId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Settlement report generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Process vendor settlement
exports.processVendorSettlement = async (req, res) => {
  try {
    const { vendorId, startDate, endDate } = req.body;

    if (!vendorId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    const settlement = await paymentService.processVendorSettlement(
      vendorId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: settlement
    });
  } catch (error) {
    logger.error('Settlement processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get payment status for an order
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const paymentStatus = {
      status: order.paymentStatus,
      method: order.paymentMethod,
      details: order.paymentDetails,
      timeline: order.getPaymentStatusTimeline()
    };

    res.json({
      success: true,
      data: paymentStatus
    });
  } catch (error) {
    logger.error('Payment status retrieval error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get supported payment methods
exports.getSupportedPaymentMethods = (req, res) => {
  res.json({
    success: true,
    data: paymentService.supportedMethods
  });
}; 