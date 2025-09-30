const Order = require('../models/Order');
const DeliveryPartner = require('../models/DeliveryPartner');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

exports.getAssignedOrders = async (req, res) => {
    try {
        const orders = await Order.find({ deliveryPartnerId: req.user.id });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.markPickedUp = async (req, res) => {
    try {
        const { orderId } = req.params;
        const deliveryPartnerId = req.user.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.deliveryPartner.toString() !== deliveryPartnerId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this order"
            });
        }

        if (order.status !== "assigned") {
            return res.status(400).json({
                success: false,
                message: "Order is not in the correct status for pickup"
            });
        }

        await order.updateStatus('picked_up');
        order.pickedUpAt = new Date();
        await order.save();

        // Notify all parties about pickup
        await notificationService.notifyOrderStatusUpdate(orderId, 'picked_up');

        res.status(200).json({
            success: true,
            message: "Order marked as picked up",
            order
        });
    } catch (error) {
        logger.error("Error marking order as picked up:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to mark order as picked up"
        });
    }
};

exports.markDelivered = async (req, res) => {
    try {
        const { orderId } = req.params;
        const deliveryPartnerId = req.user.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.deliveryPartner.toString() !== deliveryPartnerId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this order"
            });
        }

        if (order.status !== "out_for_delivery") {
            return res.status(400).json({
                success: false,
                message: "Order is not in the correct status for delivery"
            });
        }

        await order.updateStatus('delivered');
        order.deliveredAt = new Date();
        await order.save();

        // Update delivery partner's current load
        const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
        if (deliveryPartner) {
            deliveryPartner.currentLoad = Math.max(0, deliveryPartner.currentLoad - 1);
            await deliveryPartner.save();
        }

        // Notify all parties about delivery
        await notificationService.notifyOrderStatusUpdate(orderId, 'delivered');

        res.status(200).json({
            success: true,
            message: "Order marked as delivered",
            order
        });
    } catch (error) {
        logger.error("Error marking order as delivered:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to mark order as delivered"
        });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const total = await Order.countDocuments({ deliveryPartnerId: req.user.id });
        const pending = await Order.countDocuments({ 
            deliveryPartnerId: req.user.id, 
            status: { $in: ['assigned', 'picked_up', 'out_for_delivery'] }
        });
        const delivered = await Order.countDocuments({ 
            deliveryPartnerId: req.user.id, 
            status: 'delivered' 
        });
        res.json({ total, pending, delivered });
    } catch (err) {
        logger.error("Error fetching stats:", err);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

// Add delivery partner assignment logic
const assignDeliveryPartner = async (order) => {
    try {
        const maxRetries = 3;
        const searchRadius = 5000; // 5km in meters
        let retryCount = 0;
        let deliveryPartner = null;

        while (retryCount < maxRetries && !deliveryPartner) {
            // Increase search radius with each retry
            const currentRadius = searchRadius * (retryCount + 1);
            
            // Find available delivery partners
            const availablePartners = await DeliveryPartner.find({
                isAvailable: true,
                isVerified: true,
                currentLoad: { $lt: maxLoad },
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [order.deliveryAddress.coordinates[0], order.deliveryAddress.coordinates[1]]
                        },
                        $maxDistance: currentRadius
                    }
                }
            }).sort({ 
                rating: -1,
                currentLoad: 1 // Prioritize partners with lower current load
            });

            if (availablePartners.length > 0) {
                // Select the best partner based on rating and current load
                deliveryPartner = availablePartners.reduce((best, current) => {
                    const bestScore = (best.rating * 0.7) + ((1 - best.currentLoad / best.maxLoad) * 0.3);
                    const currentScore = (current.rating * 0.7) + ((1 - current.currentLoad / current.maxLoad) * 0.3);
                    return currentScore > bestScore ? current : best;
                });
                break;
            }

            retryCount++;
            if (retryCount < maxRetries) {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 5000));
                logger.info(`Retrying delivery partner assignment for order ${order._id} (attempt ${retryCount + 1})`);
            }
        }

        if (!deliveryPartner) {
            throw new Error(`No delivery partners available within ${maxRetries * 5}km radius after ${maxRetries} attempts`);
        }

        // Start a session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update partner's current load
            deliveryPartner.currentLoad += 1;
            await deliveryPartner.save({ session });

            // Update order with delivery partner
            order.deliveryPartner = deliveryPartner._id;
            await order.updateStatus('assigned');
            await order.save({ session });

            // Commit the transaction
            await session.commitTransaction();

            // Notify all parties
            await notificationService.notifyDeliveryPartnerAssigned(
                order._id,
                deliveryPartner._id,
                order.vendorId
            );

            logger.info(`Delivery partner ${deliveryPartner._id} assigned to order ${order._id}`);
            return deliveryPartner;
        } catch (error) {
            // If anything fails, rollback the transaction
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        logger.error(`Error assigning delivery partner: ${error.message}`);
        throw error;
    }
};

// Add updateDeliveryPartnerLocation function
exports.updateDeliveryPartnerLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const deliveryPartnerId = req.user.id;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required"
            });
        }

        const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: "Delivery partner not found"
            });
        }

        deliveryPartner.location = {
            type: "Point",
            coordinates: [longitude, latitude]
        };
        await deliveryPartner.save();

        res.status(200).json({
            success: true,
            message: "Location updated successfully",
            location: deliveryPartner.location
        });
    } catch (error) {
        console.error("Error updating delivery partner location:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update location"
        });
    }
};

// Add updateDeliveryPartnerAvailability function
exports.updateDeliveryPartnerAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body;
        const deliveryPartnerId = req.user.id;

        if (typeof isAvailable !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "isAvailable must be a boolean value"
            });
        }

        const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: "Delivery partner not found"
            });
        }

        deliveryPartner.isAvailable = isAvailable;
        await deliveryPartner.save();

        res.status(200).json({
            success: true,
            message: `Delivery partner is now ${isAvailable ? 'available' : 'unavailable'}`,
            isAvailable: deliveryPartner.isAvailable
        });
    } catch (error) {
        console.error("Error updating delivery partner availability:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update availability"
        });
    }
};
