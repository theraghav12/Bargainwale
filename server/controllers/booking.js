import mongoose from 'mongoose';
import Booking from "../models/booking.js";
import Warehouse from "../models/warehouse.js";
import Buyer from "../models/buyer.js";
import Item from "../models/items.js";


const bookingController = {
  createBooking: async (req, res) => {
    try {
      const {
        BargainDate,
        BargainNo,
        items,
        validity,
        deliveryOption,
        warehouse: warehouseId,
        organization,
        buyer,
        deliveryAddress,
        description,
        reminderDays,
      } = req.body;

      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Items must be an array" });
      }

      // Validate items
      const orderItems = [];
      let totalVirtualQty = 0;
      let totalBilledQty = 0;

      for (const { item: itemId, quantity, virtualQuantity, billedQuantity } of items) {
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
          return res.status(400).json({ message: `Invalid itemId format: ${itemId}` });
        }

        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: `Item not found: ${itemId}` });
        }

        // Check if the quantity is valid
        if (virtualQuantity + billedQuantity !== quantity) {
          return res.status(400).json({ message: `Quantity mismatch for item: ${itemId}` });
        }

        orderItems.push({ item: itemId, quantity });
        totalVirtualQty += virtualQuantity;
        totalBilledQty += billedQuantity;
      }

      // Find and update warehouse
      const warehouseDocument = await Warehouse.findById(warehouseId);
      if (!warehouseDocument) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      for (const { item: itemId, quantity, virtualQuantity, billedQuantity } of items) {
        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: `Item not found: ${itemId}` });
        }

        // Update virtual inventory
        let virtualInventoryItem = warehouseDocument.virtualInventory.find(
          (i) => i.item && i.item.toString() === itemId.toString()
        );
        if (!virtualInventoryItem) {
          return res.status(400).json({ message: `Item not found in virtual inventory: ${itemId}` });
        }
        if (virtualQuantity > virtualInventoryItem.quantity) {
          return res.status(400).json({ message: `Not enough quantity in virtual inventory for item: ${itemId}` });
        }
        virtualInventoryItem.quantity -= virtualQuantity;

        // Update billed inventory
        let billedInventoryItem = warehouseDocument.billedInventory.find(
          (i) => i.item && i.item.toString() === itemId.toString()
        );
        if (!billedInventoryItem) {
          return res.status(400).json({ message: `Item not found in billed inventory: ${itemId}` });
        }
        if (billedQuantity > billedInventoryItem.quantity) {
          return res.status(400).json({ message: `Not enough quantity in billed inventory for item: ${itemId}` });
        }
        billedInventoryItem.quantity -= billedQuantity;
      }

      await warehouseDocument.save();

      // Create booking
      const booking = new Booking({
        BargainDate: new Date(BargainDate),
        BargainNo,
        items: orderItems,
        validity,
        deliveryOption,
        warehouse: warehouseId,
        organization,
        buyer,
        deliveryAddress,
        description,
        reminderDays,
      });

      await booking.save();
      res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
      console.error("Error creating booking:", error.message || error);
      res.status(400).json({
        message: "Error creating booking",
        error: {
          message: error.message || "An error occurred",
          stack: error.stack, // Optional: include stack trace for more details
        },
      });
    }},

  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving bookings", error });
    }
  },

  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving booking", error });
    }
  },

  updateBooking: async (req, res) => {
    try {
      const {
        deliveryOption,
        deliveryAddress,
        items,
        virtualInventoryQuantities,
        billedInventoryQuantities,
        status,
        reminderDays,
      } = req.body;

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Update booking details
      if (deliveryOption) booking.deliveryOption = deliveryOption;
      if (deliveryAddress) booking.deliveryAddress = deliveryAddress;
      if (items) booking.items = items;
      if (virtualInventoryQuantities)
        booking.virtualInventoryQuantities = virtualInventoryQuantities;
      if (billedInventoryQuantities)
        booking.billedInventoryQuantities = billedInventoryQuantities;
      if (status) booking.status = status;
      if (reminderDays) booking.reminderDays = reminderDays;

      await booking.save();

      if (booking.deliveryOption === "Pickup") {
        const warehouseDocument = await Warehouse.findById(booking.warehouse);
        if (!warehouseDocument) {
          return res.status(404).json({ message: "Warehouse not found" });
        }

        // Process virtual inventory
        for (const virtualItem of virtualInventoryQuantities) {
          const existingVirtualItem = warehouseDocument.virtualInventory.find(
            (i) => i.itemName === virtualItem.itemName
          );
          if (existingVirtualItem) {
            existingVirtualItem.quantity -= virtualItem.quantity;
          } else {
            return res.status(400).json({
              message: `Item ${virtualItem.itemName} not found in warehouse`,
            });
          }
        }

        // Process billed inventory
        for (const billedItem of billedInventoryQuantities) {
          const existingBilledItem = warehouseDocument.billedInventory.find(
            (i) => i.itemName === billedItem.itemName
          );
          if (existingBilledItem) {
            existingBilledItem.quantity -= billedItem.quantity;
          } else {
            return res.status(400).json({
              message: `Item ${billedItem.itemName} not found in warehouse`,
            });
          }
        }

        await warehouseDocument.save();
      }

      res
        .status(200)
        .json({ message: "Booking updated successfully", booking });
    } catch (error) {
      res.status(400).json({ message: "Error updating booking", error });
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await Booking.findByIdAndDelete(req.params.id);

      if (booking.deliveryOption === "Pickup") {
        const warehouseDocument = await Warehouse.findById(booking.warehouse);
        if (!warehouseDocument) {
          return res.status(404).json({ message: "Warehouse not found" });
        }

        // Revert inventory changes for Pickup
        for (const virtualItem of booking.virtualInventoryQuantities) {
          const existingVirtualItem = warehouseDocument.virtualInventory.find(
            (i) => i.itemName === virtualItem.itemName
          );
          if (existingVirtualItem) {
            existingVirtualItem.quantity += virtualItem.quantity;
          } else {
            return res.status(400).json({
              message: `Item ${virtualItem.itemName} not found in warehouse`,
            });
          }
        }

        for (const billedItem of booking.billedInventoryQuantities) {
          const existingBilledItem = warehouseDocument.billedInventory.find(
            (i) => i.itemName === billedItem.itemName
          );
          if (existingBilledItem) {
            existingBilledItem.quantity += billedItem.quantity;
          } else {
            return res.status(400).json({
              message: `Item ${billedItem.itemName} not found in warehouse`,
            });
          }
        }

        await warehouseDocument.save();
      }

      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting booking", error });
    }
  },

  fetchPendingRemindersToday: async (req, res) => {
    try {
      const today = new Date();
      const bookings = await Booking.find({ status: "payment pending" });
        if (!bookings || bookings.length === 0) {
          console.log("No bookings found with status 'payment pending'.");
          return res.status(200).json([]);
        }
      const pendingReminders = [];

      bookings.forEach((booking) => {
        const companyBargainDate = new Date(booking.companyBargainDate);
        const dueDate = new Date(companyBargainDate);
        dueDate.setDate(dueDate.getDate() + booking.validity);

        const daysUntilDue = Math.floor(
          (dueDate - today) / (1000 * 60 * 60 * 24)
        );
        if (booking.reminderDays.includes(daysUntilDue)) {
          pendingReminders.push(booking);
        }
      });
      return pendingReminders;
    } catch (error) {
        console.log(error);
        return [];
    }
  },
};

export default bookingController;
