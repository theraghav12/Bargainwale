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
        const bookings = await Booking.find(); // Retrieve all bookings
        res.status(200).json(bookings);
      } catch (error) {
        console.error("Error retrieving bookings:", error.message || error);
        res.status(500).json({
          message: "Error retrieving bookings",
          error: {
            message: error.message || "An error occurred",
            stack: error.stack // Optional: include stack trace for more details
          }
        });
      }},
  
    // Get a booking by ID
    getBookingById: async (req, res) => {
      try {
        const booking = await Booking.findById(req.params.id)
          .populate('items.item')
          .populate('warehouse')
          .populate('organization')
          .populate('buyer');
          
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json(booking);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving booking", error });
      }
    },
  
    // Update a booking by ID
    updateBooking: async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;
  
        // Fetch the booking to update
        const booking = await Booking.findById(id);
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
  
        // Update booking fields
        Object.keys(updates).forEach((key) => {
          booking[key] = updates[key];
        });
  
        await booking.save();
        res.status(200).json({ message: "Booking updated successfully", booking });
      } catch (error) {
        res.status(400).json({ message: "Error updating booking", error });
      }
    },
  
    // Delete a booking by ID
    deleteBooking: async (req, res) => {
      try {
        const { id } = req.params;
  
        const booking = await Booking.findByIdAndDelete(id);
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
  
        // Update inventory if needed here
  
        res.status(200).json({ message: "Booking deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error });
      }
    },
  
    // Additional methods can be added here as needed
  };
  
  export default bookingController;
 