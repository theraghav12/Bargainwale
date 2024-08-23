import Booking from "../models/booking.js";
import Warehouse from "../models/warehouse.js";

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const {
        companyBargainDate,
        companyBargainNo,
        buyer,
        items,
        validity,
        deliveryOption,
        warehouse,
        deliveryAddress,
        virtualInventoryQuantities,
        billedInventoryQuantities,
        description,
      } = req.body;

      const booking = new Booking({
        companyBargainDate: new Date(companyBargainDate),
        companyBargainNo,
        buyer,
        items,
        validity,
        deliveryOption,
        warehouse,
        deliveryAddress,
        virtualInventoryQuantities,
        billedInventoryQuantities,
        description,
      });

      await booking.save();

      if (deliveryOption === "Pickup") {
        const warehouseDocument = await Warehouse.findById(warehouse);
        if (!warehouseDocument) {
          return res.status(404).json({ message: "Warehouse not found" });
        }

        // Process virtual inventory
        for (const virtualItem of virtualInventoryQuantities) {
          const existingVirtualItem = warehouseDocument.virtualInventory.find(
            (i) => i.itemName === virtualItem.itemName
          );
          if (existingVirtualItem) {
            if (existingVirtualItem.quantity < virtualItem.quantity) {
              return res
                .status(400)
                .json({
                  message: `Not enough quantity in virtual inventory for ${virtualItem.itemName}`,
                });
            }
            existingVirtualItem.quantity -= virtualItem.quantity;
          } else {
            return res
              .status(400)
              .json({
                message: `Item ${virtualItem.itemName} not found in virtual inventory`,
              });
          }
        }

        // Process billed inventory
        for (const billedItem of billedInventoryQuantities) {
          const existingBilledItem = warehouseDocument.billedInventory.find(
            (i) => i.itemName === billedItem.itemName
          );
          if (existingBilledItem) {
            if (existingBilledItem.quantity < billedItem.quantity) {
              return res
                .status(400)
                .json({
                  message: `Not enough quantity in billed inventory for ${billedItem.itemName}`,
                });
            }
            existingBilledItem.quantity -= billedItem.quantity;
          } else {
            return res
              .status(400)
              .json({
                message: `Item ${billedItem.itemName} not found in billed inventory`,
              });
          }
        }

        await warehouseDocument.save();
      }

      res
        .status(201)
        .json({ message: "Booking created successfully", booking });
    } catch (error) {
      res.status(400).json({ message: "Error creating booking", error });
    }
  },

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
      } = req.body;
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Update booking details
      if (deliveryOption) {
        booking.deliveryOption = deliveryOption;
      }
      if (deliveryAddress) {
        booking.deliveryAddress = deliveryAddress;
      }
      if (items) {
        booking.items = items;
      }
      if (virtualInventoryQuantities) {
        booking.virtualInventoryQuantities = virtualInventoryQuantities;
      }
      if (billedInventoryQuantities) {
        booking.billedInventoryQuantities = billedInventoryQuantities;
      }

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
            return res
              .status(400)
              .json({
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
            return res
              .status(400)
              .json({
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
            return res
              .status(400)
              .json({
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
            return res
              .status(400)
              .json({
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
};

export default bookingController;
