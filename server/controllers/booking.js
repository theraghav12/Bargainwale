import mongoose from "mongoose";
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
        inco,
        validity,
        deliveryOption,
        warehouse: warehouseId,
        organization,
        buyer,
        deliveryAddress,
        description,
        reminderDays,
        totalAmount,
      } = req.body;

      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Items must be an array" });
      }

      // Validate items
      const orderItems = [];
      for (const {
        item: itemId,
        virtualQuantity,
        pickup,
        taxpaidAmount,
        taxableAmount,
        gst,
        cgst,
        sgst,
        igst,
          contNumber,
          rackPrice,
          depoPrice,
          plantPrice
      } of items) {       
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
          return res
            .status(400)
            .json({ message: `Invalid itemId format: ${itemId}` });
        }

        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: `Item not found: ${itemId}` });
        }
        // Check if the quantity is valid
       // if (Number(virtualQuantity) + Number(billedQuantity) !== Number(quantity)) {
       //   return res
       //     .status(400)
       //     .json({ message: `Quantity mismatch for item: ${itemId}` });
       // }
        orderItems.push({
          item: itemId,
          virtualQuantity,
          pickup,
          taxpaidAmount,
          taxableAmount,
        gst,
        cgst,
        sgst,
        igst,
          contNumber,
          rackPrice,
          depoPrice,
          plantPrice
        });
      }

      const warehouseDocument = await Warehouse.findById(warehouseId);
      if (!warehouseDocument) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      // Track updates to inventories
      const soldInventoryUpdates = [];
      const virtualInventoryUpdates = [];
      const billedInventoryUpdates = [];

      for (const {
        item: itemId,
        virtualQuantity,
        pickup,
        taxpaidAmount,
          contNumber,
          rackPrice,
          depoPrice,
          plantPrice,
          taxableAmount,
        gst,
        cgst,
        sgst,
        igst,
      } of items) {
        const virtualInventoryItem = warehouseDocument.virtualInventory.find(
          (i) => i.item && i.item.toString() === itemId.toString() && i.pickup===pickup
        );
        if (!virtualInventoryItem) {
          return res.status(400).json({
            message: `Item not found in virtual inventory: ${itemId}`,
          });
        }
        //if (virtualQuantity > virtualInventoryItem.quantity) {
        //  return res.status(400).json({
        //    message: `Not enough quantity in virtual inventory for item: ${itemId}`,
        //  });
       // }
        virtualInventoryItem.quantity -= virtualQuantity;
        virtualInventoryUpdates.push({ itemId,pickup, quantity: virtualQuantity });

        // const billedInventoryItem = warehouseDocument.billedInventory.find(
        //   (i) => i.item && i.item.toString() === itemId.toString()
        // );
        // if (!billedInventoryItem) {
        //   return res
        //     .status(400)
        //     .json({ message: `Item not found in billed inventory: ${itemId}` });
        // }
        //if (billedQuantity > billedInventoryItem.quantity) {
        //  return res.status(400).json({
        //    message: `Not enough quantity in billed inventory for item: ${itemId}`,
        //  });
        //}
       // billedInventoryItem.quantity -= billedQuantity;
       // billedInventoryUpdates.push({ itemId, quantity: billedQuantity });

        // console.log(pickup);
        const soldInventoryItem = warehouseDocument.soldInventory.find(
          (i) => {
            // console.log(i);
            return (i.item && i.item.toString() === itemId.toString() && i.pickup===pickup)
          }
        );
        // console.log(soldInventoryItem);
        if (soldInventoryItem) {
          soldInventoryItem.virtualQuantity += virtualQuantity;
        } else {
          const itemDetails = await Item.findById(itemId);
          warehouseDocument.soldInventory.push({
            item: itemId,
            virtualQuantity,
            pickup,
          });
        }
        // soldInventoryUpdates.push({ itemId, billedQuantity, virtualQuantity });
      }

      await warehouseDocument.save();

  
      const booking = new Booking({
        BargainDate: new Date(BargainDate),
        BargainNo,
        items: orderItems,
        validity,
        inco,
        deliveryOption,
        warehouse: warehouseId,
        organization,
        buyer,
        deliveryAddress,
        description,
        reminderDays,
        totalAmount,
      });

      await booking.save();
      res
        .status(201)
        .json({ message: "Booking created successfully", booking });
    } catch (error) {
      console.error("Error creating booking:", error.message || error);
      res.status(400).json({
        message: "Error creating booking",
        error: {
          message: error.message || "An error occurred",
          stack: error.stack,
        },
      });
    }
  },

  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate('items.item')
        .populate('warehouse')
        .populate("buyer")
      // Retrieve all bookings
      res.status(200).json(bookings);

    } catch (error) {
      console.error("Error retrieving bookings:", error.message || error);
      res.status(500).json({
        message: "Error retrieving bookings",
        error: {
          message: error.message || "An error occurred",
          stack: error.stack,
        },
      });
    }
  },

  // Get a booking by ID
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("items.item")
        .populate("warehouse")

        //.populate("organization")
        .populate("buyer");

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
      res
        .status(200)
        .json({ message: "Booking updated successfully", booking });
    } catch (error) {
      res.status(400).json({ message: "Error updating booking", error });
    }
  },
  getBookingsByBuyerId: async (req, res) => {
    try {
      const { buyerId } = req.params;
      
      
      const bookings = await Booking.find({ "buyer": buyerId })
        .populate('warehouse')
        .populate('buyer');  
      
      if (!bookings.length) {
        return res.status(404).json({ message: "No bookings found for the provided buyer ID" });
      }

      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  },

  // Delete a booking by ID
  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Fetch the warehouse associated with the booking
      const warehouse = await Warehouse.findById(booking.warehouse);
      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      // Revert the quantities in inventories
      for (const {
        item: itemId,
        quantity,
        virtualQuantity,
        billedQuantity,
        pickup
      } of booking.items) {
        const virtualInventoryItem = warehouse.virtualInventory.find(
          (i) => i.item && i.item.toString() === itemId.toString()
        );
        if (virtualInventoryItem) {
          virtualInventoryItem.quantity += virtualQuantity;
        } else {
          warehouse.virtualInventory.push({
            item: itemId,
            quantity: virtualQuantity,
          });
        }

        const billedInventoryItem = warehouse.billedInventory.find(
          (i) => i.item && i.item.toString() === itemId.toString()  && i.pickup===pickup
        );
        if (billedInventoryItem) {
          billedInventoryItem.quantity += billedQuantity;
        } else {
          warehouse.billedInventory.push({
            item: itemId,
            quantity: billedQuantity,
          });
        }

        const soldInventoryItem = warehouse.soldInventory.find(
          (i) => i.item && i.item.toString() === itemId.toString()
        );
        if (soldInventoryItem) {
          if (soldInventoryItem.billedQuantity >= billedQuantity) {
            soldInventoryItem.billedQuantity -= billedQuantity;
            if (
              soldInventoryItem.billedQuantity === 0 &&
              soldInventoryItem.virtualQuantity === 0
            ) {
              warehouse.soldInventory = warehouse.soldInventory.filter(
                (i) => i.item.toString() !== itemId.toString()
              );
            }
          } else {
            return res.status(400).json({
              message: `Mismatch in sold inventory quantity for item: ${itemId}`,
            });
          }
        } else {
          return res.status(400).json({
            message: `Item not found in sold inventory: ${itemId}`,
          });
        }
      }

      await warehouse.save();

      await Booking.findByIdAndDelete(id);

      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting booking", error });
    }
  },
};

export default bookingController;
