const Order = require('../models/Order');
const DeliveryPartner = require('../models/DeliveryPartner');
const User = require('../models/User');
const { assignDeliveryPartner } = require('../controllers/deliveryController');
const notificationService = require('../services/notificationService');
const { logger } = require('../middleware/securityMiddleware');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { customerId, vendorId, items, deliveryTime, deliveryAddress } = req.body;

    // Calculate delivery times
    const { deliveryPartnerAssignmentTime, pickupTime } = Order.calculateDeliveryTime(deliveryTime);

    // Create order
    const order = new Order({
      customerId,
      vendorId,
      items,
      deliveryTime,
      deliveryPartnerAssignmentTime,
      pickupTime,
      deliveryAddress,
      status: 'pending'
    });

    await order.save();

    // Notify vendor about new order
    await notificationService.notifyOrderStatusUpdate(order._id, 'preparing');

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    logger.error(`Error creating order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('customerId', 'name email phone')
      .populate('vendorId', 'name email phone')
      .populate('deliveryPartnerId', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error(`Error getting order details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error getting order details',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    order.status = status;
    await order.save();

    // Send notifications
    await notificationService.notifyOrderStatusUpdate(orderId, status);

    // If order is ready, check if it's time to assign delivery partner
    if (status === 'ready' && order.shouldAssignDeliveryPartner()) {
      await assignDeliveryPartner(order);
    }

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    logger.error(`Error updating order status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user is authorized to cancel this order
    if (order.customer.toString() !== req.user.id && order.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order"
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled in current status"
      });
    }

    // Cancel order
    await order.cancelOrder(reason);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel order"
    });
  }
};

// Rate delivery partner
exports.rateDeliveryPartner = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user is authorized to rate this order
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to rate this order"
      });
    }

    // Rate delivery partner
    await order.rateDeliveryPartner(rating, review);

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      order
    });
  } catch (error) {
    console.error("Error rating delivery partner:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit rating"
    });
  }
};

// Get customer's orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('vendorId', 'name')
      .populate('deliveryPartnerId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    logger.error('Error fetching customer orders:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get vendor orders
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.user._id })
      .populate('customerId', 'name')
      .populate('deliveryPartnerId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    logger.error('Error fetching vendor orders:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get orders by user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId, role } = req.params;
    let query = {};

    if (role === 'customer') {
      query.customerId = userId;
    } else if (role === 'vendor') {
      query.vendorId = userId;
    } else if (role === 'delivery') {
      query.deliveryPartnerId = userId;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name')
      .populate('vendorId', 'name')
      .populate('deliveryPartnerId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    logger.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 