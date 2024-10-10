import mongoose from 'mongoose';
import Order from "../models/orders.js";
import Warehouse from "../models/warehouse.js";
import Item from "../models/items.js";

const orderController = {
  createOrder: async (req, res) => {
    try {
      const {
        companyBargainDate,
        items,   
        inco,
        companyBargainNo,
        billType,
        status,
        description,
        organization,
        warehouse: warehouseId,
        manufacturer,
        paymentDays = 21,
        reminderDays = [7, 3, 1],
      } = req.body;

      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Items must be an array" });
      }

      const orderItems = [];

      for (const {
        itemId, 
        quantity, 
        pickup, 
        baseRate, 
        taxpaidAmount, 
        gst, 
        cgst, 
        sgst, 
        igst, 
        taxableAmount, 
        contNumber 
      } of items) {
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
          return res.status(400).json({ message: `Invalid itemId format: ${itemId}` });
        }

        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: `Item not found: ${itemId}` });
        }

        orderItems.push({
          item: item._id,
          quantity,
          pickup,
          baseRate,
          taxpaidAmount,
          gst,
          cgst,
          sgst,
          igst,
          taxableAmount,
          contNumber,
        });
      }

      const order = new Order({
        companyBargainDate: new Date(companyBargainDate),
        items: orderItems,
        inco,
        companyBargainNo,
        billType,
        status,
        description,
        organization,
        warehouse: warehouseId,
        manufacturer,
        paymentDays,
        reminderDays,
      });

      await order.save();

      let warehouseDocument = await Warehouse.findById(warehouseId);
      if (!warehouseDocument) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      for (let { item: itemId, quantity, pickup } of orderItems) {
        quantity = Number(quantity);
        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: `Item not found: ${itemId}` });
        }

        let existingVirtualInventoryItem = warehouseDocument.virtualInventory.find(
          (i) => i.item && i.item.toString() === itemId.toString() && i.pickup === pickup
        );

        let existingBilledInventoryItem = warehouseDocument.billedInventory.find(
          (i) => i.item && i.item.toString() === itemId.toString()
        );
 
        if (!existingVirtualInventoryItem) {
          warehouseDocument.virtualInventory.push({
            item: itemId,
            quantity,
            pickup,
          });
        } else {
          existingVirtualInventoryItem.quantity += quantity;
        }

        if (!existingBilledInventoryItem) {
          warehouseDocument.billedInventory.push({
            item: itemId,
            quantity: 0,
          });
        }
      }

      await warehouseDocument.save();
      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      console.error("Error creating order:", error.message || error);
      res.status(400).json({
        message: "Error creating order",
        error: {
          message: error.message || "An error occurred",
          stack: error.stack // Optional: include stack trace for more details
        }
      });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('items.item')
        .populate('warehouse')
        .populate('manufacturer');
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving orders", error });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('items.item')
        .populate('warehouse')
        .populate('manufacturer');
        
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving order", error });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const {
        companyBargainDate,
        items,   
        inco,
        companyBargainNo,
        billType,
        status,
        description,
        organization,
        warehouse: warehouseId,
        manufacturer,
        paymentDays = 21,
        reminderDays = [7, 3, 1],
      } = req.body;

      const order = await Order.findByIdAndUpdate(req.params.id, {
        companyBargainDate: new Date(companyBargainDate),
        items,
        inco,
        companyBargainNo,
        billType,
        status,
        description,
        organization,
        warehouse: warehouseId,
        manufacturer,
        paymentDays,
        reminderDays,
      }, {
        new: true,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
      res.status(400).json({ message: "Error updating order", error });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid orderId format' });
      }

      const order = await Order.findById(orderId).populate('warehouse');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const { items, warehouse } = order;

      for (const { item, quantity, pickup } of items) {
        const virtualInventoryItem = warehouse.virtualInventory.find(
          (i) => i.item && i.item.toString() === item.toString() && i.pickup === pickup
        );

        if (virtualInventoryItem) {
          virtualInventoryItem.quantity -= quantity;
          if (virtualInventoryItem.quantity < 0) virtualInventoryItem.quantity = 0;
        }
      }

      await warehouse.save();
      await Order.findByIdAndDelete(orderId);

      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error.message || error);
      res.status(400).json({
        message: 'Error deleting order',
        error: {
          message: error.message || 'An error occurred',
          stack: error.stack,
        },
      });
    }
  },

  fetchPendingRemindersToday: async () => {
    try {
      const today = new Date();
      const orders = await Order.find({ status: "payment pending" });

      const pendingReminders = [];

      orders.forEach((order) => {
        const bargainDate = new Date(order.companyBargainDate);
        const dueDate = new Date(bargainDate);
        dueDate.setDate(dueDate.getDate() + order.paymentDays);

        const reminderDates = order.reminderDays.map((days) => {
          const reminderDate = new Date(dueDate);
          reminderDate.setDate(reminderDate.getDate() - days);
          return reminderDate;
        });

        reminderDates.forEach((reminderDate) => {
          if (
            reminderDate.getDate() === today.getDate() &&
            reminderDate.getMonth() === today.getMonth() &&
            reminderDate.getFullYear() === today.getFullYear()
          ) {
            pendingReminders.push(order);
          }
        });
      });

      return pendingReminders;
    } catch (error) {
      console.error("Error fetching pending reminders:", error);
      return [];
    }
  },
};

export default orderController;
